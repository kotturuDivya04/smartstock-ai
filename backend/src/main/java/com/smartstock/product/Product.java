package com.smartstock.product;

import com.smartstock.supplier.Supplier;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_product_sku", columnList = "sku"),
        @Index(name = "idx_product_category", columnList = "category")
    }
)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false, length = 150)
    private String name;

    @NotBlank(message = "SKU is required")
    @Column(nullable = false, unique = true, length = 60)
    private String sku;

    @Column(length = 80)
    private String category;

    @Column(length = 500)
    private String description;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be greater than 0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Min(value = 0, message = "Minimum stock level must be non-negative")
    @Column(nullable = false)
    private Integer minimumStock = 10;

    @Column(nullable = false)
    private Integer maximumStock = 500;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Product() {}

    public Product(String name, String sku, String category, String description, BigDecimal sellingPrice, BigDecimal costPrice, Integer minimumStock, Integer maximumStock, Supplier supplier) {
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.description = description;
        this.sellingPrice = sellingPrice;
        this.costPrice = costPrice;
        this.minimumStock = minimumStock != null ? minimumStock : 10;
        this.maximumStock = maximumStock != null ? maximumStock : 500;
        this.supplier = supplier;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public BigDecimal getUnitPrice() {
        return sellingPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.sellingPrice = unitPrice;
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
        return minimumStock;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minimumStock = minStockLevel;
    }

    public Integer getMaximumStock() {
        return maximumStock;
    }

    public void setMaximumStock(Integer maximumStock) {
        this.maximumStock = maximumStock;
    }

    public Integer getMaxStockLevel() {
        return maximumStock;
    }

    public void setMaxStockLevel(Integer maxStockLevel) {
        this.maximumStock = maxStockLevel;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
