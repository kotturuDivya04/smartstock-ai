package com.smartstock.supplier;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SupplierOrderResponse {
    private Long id;
    private Long supplierId;
    private String supplierName;
    private Long productId;
    private String productName;
    private Integer quantity;
    private String status;
    private LocalDate expectedDeliveryDate;
    private LocalDateTime orderDate;
    private LocalDateTime updateDate;
    private Integer leadTimeDays;

    public SupplierOrderResponse() {}

    public SupplierOrderResponse(Long id, Long supplierId, String supplierName, Long productId, String productName, Integer quantity, String status, LocalDate expectedDeliveryDate, LocalDateTime orderDate, LocalDateTime updateDate, Integer leadTimeDays) {
        this.id = id;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.status = status;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.orderDate = orderDate;
        this.updateDate = updateDate;
        this.leadTimeDays = leadTimeDays;
    }

    public Long getId() { return id; }
    public Long getSupplierId() { return supplierId; }
    public String getSupplierName() { return supplierName; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Integer getQuantity() { return quantity; }
    public String getStatus() { return status; }
    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public LocalDateTime getUpdateDate() { return updateDate; }
    public Integer getLeadTimeDays() { return leadTimeDays; }

    public static SupplierOrderResponse fromEntity(SupplierOrder order) {
        return new SupplierOrderResponse(
                order.getId(),
                order.getSupplier().getId(),
                order.getSupplier().getName(),
                order.getProduct().getId(),
                order.getProduct().getName(),
                order.getQuantity(),
                order.getStatus().name(),
                order.getExpectedDeliveryDate(),
                order.getOrderDate(),
                order.getUpdateDate(),
                order.getSupplier().getLeadTimeDays()
        );
    }
}
