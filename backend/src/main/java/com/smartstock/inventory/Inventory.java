package com.smartstock.inventory;

import com.smartstock.product.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "inventories",
    indexes = {
        @Index(name = "idx_inventory_product", columnList = "product_id")
    }
)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer currentStock = 0;

    @Column(nullable = false)
    private Integer reservedStock = 0;

    @Column(length = 100)
    private String warehouseLocation;

    private LocalDateTime lastRestockedAt;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    public Inventory() {}

    public Inventory(Product product, Integer currentStock, Integer reservedStock, String warehouseLocation) {
        this.product = product;
        this.currentStock = currentStock != null ? currentStock : 0;
        this.reservedStock = reservedStock != null ? reservedStock : 0;
        this.warehouseLocation = warehouseLocation;
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Integer getAvailableStock() {
        return Math.max(0, currentStock - reservedStock);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getUpdatedAt() {
        return lastUpdated;
    }
}
