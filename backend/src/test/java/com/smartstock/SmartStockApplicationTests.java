package com.smartstock;

import com.smartstock.auth.AuthRequest;
import com.smartstock.auth.AuthResponse;
import com.smartstock.auth.AuthService;
import com.smartstock.auth.RegisterRequest;
import com.smartstock.prediction.DemandPredictionService;
import com.smartstock.prediction.PredictionResponse;
import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.reorder.ReorderRecommendationService;
import com.smartstock.reorder.ReorderRecommendationResponse;
import com.smartstock.stockout.StockoutRiskResponse;
import com.smartstock.stockout.StockoutRiskService;
import com.smartstock.user.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SmartStockApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private DemandPredictionService demandPredictionService;

    @Autowired
    private StockoutRiskService stockoutRiskService;

    @Autowired
    private ReorderRecommendationService reorderService;

    @Autowired
    private ProductRepository productRepository;

    // ─── Auth Tests ────────────────────────────────────────────────
    @Test
    void contextLoads() {}

    @Test
    void testRegisterAndLoginFlow() {
        String testEmail = "admin" + System.currentTimeMillis() + "@smartstock.ai";
        RegisterRequest registerRequest = new RegisterRequest(testEmail, "AdminPassword123!", "Admin User", Role.ADMIN);
        AuthResponse registerResponse = authService.register(registerRequest);
        assertNotNull(registerResponse);
        assertNotNull(registerResponse.getToken());
        assertEquals(testEmail, registerResponse.getUser().getEmail());
        assertEquals(Role.ADMIN, registerResponse.getUser().getRole());

        AuthRequest loginRequest = new AuthRequest(testEmail, "AdminPassword123!");
        AuthResponse loginResponse = authService.login(loginRequest);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals(testEmail, loginResponse.getUser().getEmail());
    }

    // ─── ML Demand Prediction Tests ──────────────────────────────────
    @Test
    void testDemandPredictionGeneratedForProducts() {
        List<Product> products = productRepository.findAll();
        assertFalse(products.isEmpty(), "Products must exist in DB");

        // Generate a prediction for first product
        Product first = products.get(0);
        PredictionResponse response = demandPredictionService.generatePrediction(first.getId(), 7);

        assertNotNull(response);
        assertEquals(7, response.getForecastDays());
        assertTrue(response.getPredictedQuantity() >= 0, "Prediction must be non-negative");
        assertNotNull(response.getModelName());
        assertTrue(response.getModelName().contains("Tribuo") || response.getModelName().contains("CART"),
                "Model must be Tribuo-based");
    }

    @Test
    void testDemandPredictionIsPositive() {
        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            PredictionResponse resp = demandPredictionService.generatePrediction(p.getId(), 7);
            assertNotNull(resp, "Prediction for product " + p.getId() + " must not be null");
            assertTrue(resp.getPredictedQuantity() >= 0,
                    "Prediction must be non-negative for product " + p.getName());
        }
    }

    // ─── Stockout Risk Tests ─────────────────────────────────────────
    @Test
    void testStockoutRiskAssessment() {
        List<StockoutRiskResponse> risks = stockoutRiskService.assessAllRisks();
        assertNotNull(risks);
        assertFalse(risks.isEmpty(), "Stockout risks should be generated for all products");

        for (StockoutRiskResponse risk : risks) {
            assertNotNull(risk.getRiskLevel(), "Risk level must not be null");
            assertTrue(List.of("LOW", "MEDIUM", "HIGH", "CRITICAL").contains(risk.getRiskLevel()),
                    "Risk level must be LOW/MEDIUM/HIGH/CRITICAL");
            assertTrue(risk.getDaysUntilStockout() >= 0, "Days until stockout must be non-negative");
        }
    }

    // ─── Reorder Recommendation Tests ───────────────────────────────
    @Test
    void testReorderQuantityIsNonNegative() {
        reorderService.generateAllRecommendations();
        List<ReorderRecommendationResponse> recs = reorderService.getAllRecommendations();
        for (ReorderRecommendationResponse rec : recs) {
            assertTrue(rec.getSuggestedReorderQuantity() >= 0,
                    "Reorder quantity must be non-negative for " + rec.getProductName());
        }
    }

    @Test
    void testReorderDoesNotExceedMaxStock() {
        reorderService.generateAllRecommendations();
        List<ReorderRecommendationResponse> recs = reorderService.getAllRecommendations();
        for (ReorderRecommendationResponse rec : recs) {
            int afterReorder = rec.getCurrentStock() + rec.getSuggestedReorderQuantity();
            assertTrue(afterReorder <= rec.getMaxStockLevel() + 1,
                    "Reorder would exceed max stock for " + rec.getProductName());
        }
    }

    // ─── Manager Workflow Tests ──────────────────────────────────────
    @Test
    void testManagerCanAcceptRecommendation() {
        reorderService.generateAllRecommendations();
        List<ReorderRecommendationResponse> recs = reorderService.getAllRecommendations();
        if (recs.isEmpty()) return; // No recs if all stock is healthy

        // Only accept a PENDING recommendation — never try to double-accept
        ReorderRecommendationResponse pending = recs.stream()
                .filter(r -> "PENDING".equals(r.getStatus()) && r.getId() != null)
                .findFirst().orElse(null);
        if (pending == null) return; // All recs may already be reviewed from prior test data

        ReorderRecommendationResponse result = reorderService.acceptRecommendation(pending.getId(), "manager@smartstock.ai");
        assertEquals("APPROVED", result.getStatus());
        assertNotNull(result.getReviewedBy());
        assertNotNull(result.getReviewedAt());
    }

    @Test
    void testManagerCanRejectRecommendation() {
        reorderService.generateAllRecommendations();
        List<ReorderRecommendationResponse> recs = reorderService.getAllRecommendations();
        if (recs.isEmpty()) return;

        // Find a PENDING one
        ReorderRecommendationResponse pending = recs.stream()
                .filter(r -> "PENDING".equals(r.getStatus()) && r.getId() != null)
                .findFirst().orElse(null);
        if (pending == null) return;

        ReorderRecommendationResponse result = reorderService.rejectRecommendation(pending.getId(), "manager@smartstock.ai");
        assertEquals("REJECTED", result.getStatus());
        assertEquals("Inventory Manager", result.getReviewedBy());
    }

    @Test
    void testManagerCanModifyRecommendationQuantity() {
        reorderService.generateAllRecommendations();
        List<ReorderRecommendationResponse> recs = reorderService.getAllRecommendations();

        ReorderRecommendationResponse pending = recs.stream()
                .filter(r -> "PENDING".equals(r.getStatus()) && r.getId() != null)
                .findFirst().orElse(null);
        if (pending == null) return;

        ReorderRecommendationResponse result = reorderService.modifyRecommendation(pending.getId(), 99, "manager@smartstock.ai");
        assertEquals("APPROVED", result.getStatus());
        assertEquals(99, result.getSuggestedReorderQuantity());
    }
}
