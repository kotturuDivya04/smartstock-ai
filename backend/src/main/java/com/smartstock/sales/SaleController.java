package com.smartstock.sales;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public ResponseEntity<List<SaleResponse>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SaleResponse>> getSalesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(saleService.getSalesByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<SaleResponse> recordSale(@Valid @RequestBody SaleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(saleService.recordSale(request));
    }
}
