package com.smartstock.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String sku;
    private String name;
    private String description;
    private String category;
    private BigDecimal sellingPrice;
    private BigDecimal unitPrice;
    private BigDecimal costPrice;
    private Integer minimumStock;
    private Integer minStockLevel;
    private Integer maximumStock;
    private Integer maxStockLevel;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime createdAt;

    public ProductResponse() {}

    public static ProductResponse fromEntity(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCategory(product.getCategory());
        response.setSellingPrice(product.getSellingPrice());
        response.setUnitPrice(product.getSellingPrice());
        response.setCostPrice(product.getCostPrice());
        response.setMinimumStock(product.getMinimumStock());
        response.setMinStockLevel(product.getMinimumStock());
        response.setMaximumStock(product.getMaximumStock());
        response.setMaxStockLevel(product.getMaximumStock());
        if (product.getSupplier() != null) {
            response.setSupplierId(product.getSupplier().getId());
            response.setSupplierName(product.getSupplier().getName());
        }
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(Integer minimumStock) {
        this.minimumStock = minimumStock;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public Integer getMaximumStock() {
        return maximumStock;
    }

    public void setMaximumStock(Integer maximumStock) {
        this.maximumStock = maximumStock;
    }

    public Integer getMaxStockLevel() {
        return maxStockLevel;
    }

    public void setMaxStockLevel(Integer maxStockLevel) {
        this.maxStockLevel = maxStockLevel;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
