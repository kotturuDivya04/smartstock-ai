package com.smartstock.reorder;

import java.math.BigDecimal;

public class ReorderRecommendationResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private Integer currentStock;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private Integer suggestedReorderQuantity;
    private BigDecimal unitCost;
    private BigDecimal estimatedTotalCost;
    private String supplierName;
    private String urgency;
    private String status;
    private String reviewedBy;
    private java.time.LocalDateTime reviewedAt;

    public ReorderRecommendationResponse() {}

    public ReorderRecommendationResponse(Long id, Long productId, String productSku, String productName, Integer currentStock, Integer minStockLevel, Integer maxStockLevel, Integer suggestedReorderQuantity, BigDecimal unitCost, BigDecimal estimatedTotalCost, String supplierName, String urgency, String status, String reviewedBy, java.time.LocalDateTime reviewedAt) {
        this.id = id;
        this.productId = productId;
        this.productSku = productSku;
        this.productName = productName;
        this.currentStock = currentStock;
        this.minStockLevel = minStockLevel;
        this.maxStockLevel = maxStockLevel;
        this.suggestedReorderQuantity = suggestedReorderQuantity;
        this.unitCost = unitCost;
        this.estimatedTotalCost = estimatedTotalCost;
        this.supplierName = supplierName;
        this.urgency = urgency;
        this.status = status;
        this.reviewedBy = reviewedBy;
        this.reviewedAt = reviewedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public java.time.LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(java.time.LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

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

    public Integer getSuggestedReorderQuantity() {
        return suggestedReorderQuantity;
    }

    public void setSuggestedReorderQuantity(Integer suggestedReorderQuantity) {
        this.suggestedReorderQuantity = suggestedReorderQuantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getEstimatedTotalCost() {
        return estimatedTotalCost;
    }

    public void setEstimatedTotalCost(BigDecimal estimatedTotalCost) {
        this.estimatedTotalCost = estimatedTotalCost;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }
}
