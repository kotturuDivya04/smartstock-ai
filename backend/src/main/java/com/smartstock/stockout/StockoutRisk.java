package com.smartstock.stockout;

import com.smartstock.product.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "stockout_risks",
    indexes = {
        @Index(name = "idx_stockout_product", columnList = "product_id"),
        @Index(name = "idx_stockout_risk_level", columnList = "riskLevel")
    }
)
public class StockoutRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 30)
    private String riskLevel; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private Double estimatedDaysToStockout;

    @Column(nullable = false)
    private LocalDateTime calculatedAt;

    @Column(length = 255)
    private String recommendation;

    public StockoutRisk() {}

    public StockoutRisk(Product product, String riskLevel, Double estimatedDaysToStockout, String recommendation) {
        this.product = product;
        this.riskLevel = riskLevel;
        this.estimatedDaysToStockout = estimatedDaysToStockout;
        this.recommendation = recommendation;
        this.calculatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.calculatedAt == null) {
            this.calculatedAt = LocalDateTime.now();
        }
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

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getEstimatedDaysToStockout() {
        return estimatedDaysToStockout;
    }

    public void setEstimatedDaysToStockout(Double estimatedDaysToStockout) {
        this.estimatedDaysToStockout = estimatedDaysToStockout;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
