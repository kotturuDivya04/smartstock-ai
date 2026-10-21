package com.smartstock.inventory;

import java.time.LocalDateTime;

public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private Integer currentStock;
    private Integer reservedStock;
    private Integer availableStock;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private String warehouseLocation;
    private LocalDateTime lastRestockedAt;
    private LocalDateTime updatedAt;

    public InventoryResponse() {}

    public static InventoryResponse fromEntity(Inventory inventory) {
        InventoryResponse response = new InventoryResponse();
        response.setId(inventory.getId());
        if (inventory.getProduct() != null) {
            response.setProductId(inventory.getProduct().getId());
            response.setProductSku(inventory.getProduct().getSku());
            response.setProductName(inventory.getProduct().getName());
            response.setMinStockLevel(inventory.getProduct().getMinStockLevel());
            response.setMaxStockLevel(inventory.getProduct().getMaxStockLevel());
        }
        response.setCurrentStock(inventory.getCurrentStock());
        response.setReservedStock(inventory.getReservedStock());
        response.setAvailableStock(inventory.getAvailableStock());
        response.setWarehouseLocation(inventory.getWarehouseLocation());
        response.setLastRestockedAt(inventory.getLastRestockedAt());
        response.setUpdatedAt(inventory.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getReservedStock() {
        return reservedStock;
    }

    public void setReservedStock(Integer reservedStock) {
        this.reservedStock = reservedStock;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public Integer getMaxStockLevel() {
        return maxStockLevel;
    }

    public void setMaxStockLevel(Integer maxStockLevel) {
        this.maxStockLevel = maxStockLevel;
    }

    public String getWarehouseLocation() {
        return warehouseLocation;
    }

    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }

    public LocalDateTime getLastRestockedAt() {
        return lastRestockedAt;
    }

    public void setLastRestockedAt(LocalDateTime lastRestockedAt) {
        this.lastRestockedAt = lastRestockedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
