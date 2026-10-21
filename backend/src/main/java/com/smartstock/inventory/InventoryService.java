package com.smartstock.inventory;

import com.smartstock.product.Product;
import com.smartstock.product.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductService productService;

    public InventoryService(InventoryRepository inventoryRepository, ProductService productService) {
        this.inventoryRepository = inventoryRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(InventoryResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found for product id: " + productId));
        return InventoryResponse.fromEntity(inventory);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockInventories() {
        return inventoryRepository.findLowStockInventories().stream()
                .map(InventoryResponse::fromEntity)
                .toList();
    }

    @Transactional
    public InventoryResponse adjustStock(StockAdjustmentRequest request) {
        Product product = productService.getProductEntityById(request.getProductId());

        Inventory inventory = inventoryRepository.findByProductId(request.getProductId())
                .orElseGet(() -> new Inventory(product, 0, 0, request.getWarehouseLocation()));

        int newStock = inventory.getCurrentStock() + request.getQuantityDelta();
        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient stock. Cannot reduce stock below 0.");
        }

        inventory.setCurrentStock(newStock);
        if (request.getQuantityDelta() > 0) {
            inventory.setLastRestockedAt(LocalDateTime.now());
        }
        if (request.getWarehouseLocation() != null) {
            inventory.setWarehouseLocation(request.getWarehouseLocation());
        }

        return InventoryResponse.fromEntity(inventoryRepository.save(inventory));
    }
}
