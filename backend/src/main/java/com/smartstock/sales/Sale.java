package com.smartstock.sales;

import com.smartstock.product.Product;
import com.smartstock.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "sales",
    indexes = {
        @Index(name = "idx_sale_date", columnList = "saleDate"),
        @Index(name = "idx_sale_recorded_by", columnList = "recorded_by_id")
    }
)
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime saleDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_id")
    private User recordedBy;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> items = new ArrayList<>();

    // Legacy direct reference for single-item queries if product is set directly
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private BigDecimal unitPrice;

    @Column(length = 100)
    private String customerReference;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Sale() {}

    public Sale(User recordedBy, BigDecimal totalAmount, LocalDateTime saleDate, String customerReference) {
        this.recordedBy = recordedBy;
        this.totalAmount = totalAmount;
        this.saleDate = saleDate != null ? saleDate : LocalDateTime.now();
        this.customerReference = customerReference;
    }

    public Sale(Product product, Integer quantity, BigDecimal unitPrice, BigDecimal totalAmount, LocalDateTime saleDate, String customerReference) {
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.saleDate = saleDate != null ? saleDate : LocalDateTime.now();
        this.customerReference = customerReference;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.saleDate == null) {
            this.saleDate = LocalDateTime.now();
        }
    }

    public void addItem(SaleItem item) {
        items.add(item);
        item.setSale(this);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public User getRecordedBy() {
        return recordedBy;
    }

    public void setRecordedBy(User recordedBy) {
        this.recordedBy = recordedBy;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<SaleItem> getItems() {
        return items;
    }

    public void setItems(List<SaleItem> items) {
        this.items = items;
    }

    public Product getProduct() {
        if (product != null) return product;
        if (!items.isEmpty()) return items.get(0).getProduct();
        return null;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        if (quantity != null) return quantity;
        if (!items.isEmpty()) return items.stream().mapToInt(SaleItem::getQuantity).sum();
        return 0;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        if (unitPrice != null) return unitPrice;
        if (!items.isEmpty()) return items.get(0).getUnitPrice();
        return BigDecimal.ZERO;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
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
}
