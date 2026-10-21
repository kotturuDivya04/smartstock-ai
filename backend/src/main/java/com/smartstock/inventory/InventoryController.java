package com.smartstock.inventory;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryResponse> getInventoryByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockInventories() {
        return ResponseEntity.ok(inventoryService.getLowStockInventories());
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<InventoryResponse> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(inventoryService.adjustStock(request));
    }
}
