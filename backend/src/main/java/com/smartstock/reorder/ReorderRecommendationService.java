package com.smartstock.reorder;

import com.smartstock.inventory.Inventory;
import com.smartstock.inventory.InventoryRepository;
import com.smartstock.prediction.DemandPredictionService;
import com.smartstock.prediction.PredictionResponse;
import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.supplier.SupplierOrderService;
import com.smartstock.user.User;
import com.smartstock.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReorderRecommendationService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final DemandPredictionService predictionService;
    private final ReorderRecommendationRepository reorderRepository;
    private final UserRepository userRepository;
    private final SupplierOrderService supplierOrderService;

    public ReorderRecommendationService(
            ProductRepository productRepository, 
            InventoryRepository inventoryRepository,
            DemandPredictionService predictionService,
            ReorderRecommendationRepository reorderRepository,
            UserRepository userRepository,
            SupplierOrderService supplierOrderService) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.predictionService = predictionService;
        this.reorderRepository = reorderRepository;
        this.userRepository = userRepository;
        this.supplierOrderService = supplierOrderService;
    }

    @Transactional
    public void generateAllRecommendations() {
        // Clear pending old recommendations before generating new ones
        List<ReorderRecommendation> pendings = reorderRepository.findByStatus("PENDING");
        reorderRepository.deleteAll(pendings);

        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            evaluateAndSaveReorder(product);
        }
    }

    @Transactional(readOnly = true)
    public List<ReorderRecommendationResponse> getAllRecommendations() {
        return reorderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReorderRecommendationResponse getRecommendationByProductId(Long productId) {
        List<ReorderRecommendation> recs = reorderRepository.findByProductId(productId);
        if (recs.isEmpty()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            Inventory inv = inventoryRepository.findByProductId(productId).orElse(null);
            int stock = inv != null ? inv.getAvailableStock() : 0;
            return new ReorderRecommendationResponse(null, productId, product.getSku(), product.getName(),
                    stock, product.getMinStockLevel(), product.getMaxStockLevel(),
                    0, product.getCostPrice(), java.math.BigDecimal.ZERO,
                    product.getSupplier() != null ? product.getSupplier().getName() : "None",
                    "NONE", "NONE", null, null);
        }
        return mapToResponse(recs.get(0));
    }

    private void evaluateAndSaveReorder(Product product) {
        if (supplierOrderService.hasActiveOrder(product.getId())) {
            return; // Order already incoming, don't generate duplicate recommendation
        }
        
        Inventory inventory = inventoryRepository.findByProductId(product.getId()).orElse(null);
        int currentStock = inventory != null ? inventory.getAvailableStock() : 0;
        int minStock = product.getMinStockLevel();
        int maxStock = product.getMaxStockLevel();

        int supplierLeadTime = (product.getSupplier() != null && product.getSupplier().getLeadTimeDays() != null)
                ? product.getSupplier().getLeadTimeDays() : 7;

        PredictionResponse mlPrediction = predictionService.getLatestPrediction(product.getId()).orElse(null);
        if (mlPrediction == null) {
            mlPrediction = predictionService.generatePrediction(product.getId(), 7);
        }
        
        double predictedDailyDemand = 0.0;
        if (mlPrediction != null && mlPrediction.getForecastDays() != null && mlPrediction.getForecastDays() > 0) {
            predictedDailyDemand = mlPrediction.getPredictedQuantity() / mlPrediction.getForecastDays();
        }

        double leadTimeDemand = predictedDailyDemand * supplierLeadTime;

        if (currentStock - leadTimeDemand <= minStock) {
            int suggestedQuantity = (int) Math.round(maxStock - (currentStock - leadTimeDemand));
            
            // Constrain by max capacity
            if (currentStock + suggestedQuantity > maxStock) {
                suggestedQuantity = Math.max(0, maxStock - currentStock);
            }

            if (suggestedQuantity > 0) {
                String urgency = (currentStock <= 0) ? "CRITICAL" : 
                                 (currentStock <= minStock) ? "HIGH" : "NORMAL";

                ReorderRecommendation rec = new ReorderRecommendation(product, suggestedQuantity, urgency, "PENDING");
                reorderRepository.save(rec);
            }
        }
    }

    @Transactional
    public ReorderRecommendationResponse acceptRecommendation(Long id, String userEmail) {
        return updateRecommendationStatus(id, "APPROVED", null, userEmail);
    }

    @Transactional
    public ReorderRecommendationResponse modifyRecommendation(Long id, Integer newQuantity, String userEmail) {
        return updateRecommendationStatus(id, "APPROVED", newQuantity, userEmail);
    }

    @Transactional
    public ReorderRecommendationResponse rejectRecommendation(Long id, String userEmail) {
        return updateRecommendationStatus(id, "REJECTED", null, userEmail);
    }

    private ReorderRecommendationResponse updateRecommendationStatus(Long id, String status, Integer newQuantity, String userEmail) {
        ReorderRecommendation rec = reorderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found"));
        
        if (!"PENDING".equals(rec.getStatus())) {
            throw new IllegalStateException("Recommendation has already been reviewed.");
        }

        User reviewer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        rec.setStatus(status);
        rec.setReviewedBy(reviewer);
        rec.setReviewedAt(LocalDateTime.now());
        if (newQuantity != null && newQuantity > 0) {
            rec.setRecommendedQuantity(newQuantity);
        }
        
        if ("APPROVED".equals(status)) {
            supplierOrderService.createOrder(rec.getProduct().getId(), rec.getRecommendedQuantity());
        }
        
        return mapToResponse(reorderRepository.save(rec));
    }

    @Transactional
    public void deleteStaleRecommendations() {
        // Only delete PENDING records older than 1 day — safe because APPROVED/REJECTED are never touched
        java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().minusDays(1);
        List<ReorderRecommendation> stale = reorderRepository.findByStatusAndCreatedAtBefore("PENDING", cutoff);
        reorderRepository.deleteAll(stale);
    }

    private ReorderRecommendationResponse mapToResponse(ReorderRecommendation rec) {
        Product p = rec.getProduct();
        Inventory inventory = inventoryRepository.findByProductId(p.getId()).orElse(null);
        int currentStock = inventory != null ? inventory.getAvailableStock() : 0;
        BigDecimal cost = p.getCostPrice();
        BigDecimal totalCost = cost.multiply(BigDecimal.valueOf(rec.getRecommendedQuantity()));
        String supplier = p.getSupplier() != null ? p.getSupplier().getName() : "Unassigned";

        String reviewedByName = rec.getReviewedBy() != null ? rec.getReviewedBy().getName() : null;
        
        return new ReorderRecommendationResponse(
                rec.getId(), p.getId(), p.getSku(), p.getName(),
                currentStock, p.getMinStockLevel(), p.getMaxStockLevel(),
                rec.getRecommendedQuantity(), cost, totalCost, supplier, rec.getPriority(),
                rec.getStatus(), reviewedByName, rec.getReviewedAt()
        );
    }
}
