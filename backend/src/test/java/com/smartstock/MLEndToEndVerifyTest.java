package com.smartstock;

import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.sales.SaleRequest;
import com.smartstock.sales.SaleRepository;
import com.smartstock.sales.SaleService;
import com.smartstock.prediction.DemandPredictionService;
import com.smartstock.prediction.PredictionResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootTest
public class MLEndToEndVerifyTest {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private SaleService saleService;
    
    @Autowired
    private DemandPredictionService predictionService;

    @Test
    public void testMLEndToEnd() {
        System.out.println("\n========== ML END TO END VERIFICATION START ==========");
        
        // 1. Pick a product
        Product product = productRepository.findAll().get(0);
        System.out.println("Product selected: " + product.getName() + " (ID: " + product.getId() + ")");
        
        // Count current sales records
        int initialSalesCount = saleRepository.findByProductIdAndSaleDateBetween(
            product.getId(), LocalDateTime.now().minusDays(365), LocalDateTime.now().plusDays(1)).size();
        System.out.println("BEFORE - Sales Record Count: " + initialSalesCount);
        
        // 2. Generate fresh prediction BEFORE
        PredictionResponse pred1 = predictionService.generatePrediction(product.getId(), 7);
        System.out.println("BEFORE - Predicted Qty: " + pred1.getPredictedQuantity());
        System.out.println("BEFORE - Forecast Period: " + pred1.getForecastDays() + " days");
        System.out.println("BEFORE - Model: " + pred1.getModelName());
        System.out.println("BEFORE - Timestamp: " + pred1.getPredictionDate());
        
        // 3. Add new sale of quantity 10 (within stock limits)
        System.out.println("Adding new sale via SaleService (Quantity: 10)...");
        SaleRequest request = new SaleRequest();
        request.setProductId(product.getId());
        request.setQuantity(10);
        request.setUnitPrice(new BigDecimal("19.99"));
        request.setCustomerReference("TEST-ML-VERIFY");
        saleService.recordSale(request);
        
        // Count sales after
        int newSalesCount = saleRepository.findByProductIdAndSaleDateBetween(
            product.getId(), LocalDateTime.now().minusDays(365), LocalDateTime.now().plusDays(1)).size();
        System.out.println("AFTER - Sales Record Count: " + newSalesCount);
        
        // 4. Generate prediction AFTER
        PredictionResponse pred2 = predictionService.generatePrediction(product.getId(), 7);
        System.out.println("AFTER - Predicted Qty: " + pred2.getPredictedQuantity());
        System.out.println("AFTER - Forecast Period: " + pred2.getForecastDays() + " days");
        System.out.println("AFTER - Model: " + pred2.getModelName());
        System.out.println("AFTER - Timestamp: " + pred2.getPredictionDate());
        
        System.out.println("========== ML END TO END VERIFICATION END ==========\n");
    }
}
