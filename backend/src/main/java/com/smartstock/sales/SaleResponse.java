package com.smartstock.sales;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SaleResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private LocalDateTime saleDate;
    private String customerReference;
    private LocalDateTime createdAt;

    public SaleResponse() {}

    public static SaleResponse fromEntity(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setId(sale.getId());
        if (sale.getProduct() != null) {
            response.setProductId(sale.getProduct().getId());
            response.setProductSku(sale.getProduct().getSku());
            response.setProductName(sale.getProduct().getName());
        }
        response.setQuantity(sale.getQuantity());
        response.setUnitPrice(sale.getUnitPrice());
        response.setTotalAmount(sale.getTotalAmount());
        response.setSaleDate(sale.getSaleDate());
        response.setCustomerReference(sale.getCustomerReference());
        response.setCreatedAt(sale.getCreatedAt());
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getCustomerReference() {
        return customerReference;
    }

    public void setCustomerReference(String customerReference) {
        this.customerReference = customerReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
