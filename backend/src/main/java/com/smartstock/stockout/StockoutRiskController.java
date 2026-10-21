package com.smartstock.stockout;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stockout-risks")
public class StockoutRiskController {

    private final StockoutRiskService stockoutRiskService;

    public StockoutRiskController(StockoutRiskService stockoutRiskService) {
        this.stockoutRiskService = stockoutRiskService;
    }

    @GetMapping
    public ResponseEntity<List<StockoutRiskResponse>> getAllRisks() {
        return ResponseEntity.ok(stockoutRiskService.assessAllRisks());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<StockoutRiskResponse> getRiskByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(stockoutRiskService.assessProductRiskById(productId));
    }
}
