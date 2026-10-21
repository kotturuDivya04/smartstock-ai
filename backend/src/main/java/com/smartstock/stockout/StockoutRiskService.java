package com.smartstock.stockout;

import com.smartstock.inventory.Inventory;
import com.smartstock.inventory.InventoryRepository;
import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.sales.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockoutRiskService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final SaleRepository saleRepository;
    private final com.smartstock.prediction.DemandPredictionService predictionService;

    public StockoutRiskService(
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            SaleRepository saleRepository,
            com.smartstock.prediction.DemandPredictionService predictionService
    ) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.saleRepository = saleRepository;
        this.predictionService = predictionService;
    }

    @Transactional
    public List<StockoutRiskResponse> assessAllRisks() {
        List<Product> products = productRepository.findAll();
        List<StockoutRiskResponse> results = new ArrayList<>();

        for (Product product : products) {
            results.add(assessProductRisk(product));
        }

        return results;
    }

    @Transactional
    public StockoutRiskResponse assessProductRiskById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
        return assessProductRisk(product);
    }

    private StockoutRiskResponse assessProductRisk(Product product) {
        Inventory inventory = inventoryRepository.findByProductId(product.getId())
                .orElse(null);

        int currentStock = inventory != null ? inventory.getAvailableStock() : 0;

        // Use ML prediction for daily demand
        com.smartstock.prediction.PredictionResponse mlPrediction = predictionService.getLatestPrediction(product.getId())
                .orElse(null);
                
        if (mlPrediction == null) {
            mlPrediction = predictionService.generatePrediction(product.getId(), 7);
        }

        double predictedDailyDemand = 0;
        if (mlPrediction != null && mlPrediction.getForecastDays() != null && mlPrediction.getForecastDays() > 0) {
            predictedDailyDemand = mlPrediction.getPredictedQuantity() / mlPrediction.getForecastDays();
        }

        double dailyBurnRate = predictedDailyDemand;
        double daysUntilStockout = (dailyBurnRate > 0) ? Math.round((currentStock / dailyBurnRate) * 10.0) / 10.0 : 999.0;

        int supplierLeadTime = (product.getSupplier() != null && product.getSupplier().getLeadTimeDays() != null)
                ? product.getSupplier().getLeadTimeDays()
                : 7;

        String riskLevel;
        String recommendation;

        if (currentStock <= 0) {
            riskLevel = "CRITICAL";
            recommendation = "Out of stock! Place emergency supplier order immediately.";
        } else if (daysUntilStockout <= supplierLeadTime) {
            riskLevel = "CRITICAL";
            recommendation = "High stockout danger! Order now: lead time is " + supplierLeadTime + " days, inventory lasts " + daysUntilStockout + " days.";
        } else if (daysUntilStockout <= (supplierLeadTime * 2)) {
            riskLevel = "HIGH";
            recommendation = "Stock approaching reorder threshold. Prepare replenishment.";
        } else if (currentStock <= product.getMinStockLevel()) {
            riskLevel = "MEDIUM";
            recommendation = "Stock is below minimum configured safety buffer.";
        } else {
            riskLevel = "LOW";
            recommendation = "Stock levels are healthy.";
        }

        return new StockoutRiskResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                currentStock,
                Math.round(dailyBurnRate * 100.0) / 100.0,
                daysUntilStockout,
                riskLevel,
                recommendation
        );
    }
}
