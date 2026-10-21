package com.smartstock.reorder;

import com.smartstock.product.Product;
import com.smartstock.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "reorder_recommendations",
    indexes = {
        @Index(name = "idx_reorder_product", columnList = "product_id"),
        @Index(name = "idx_reorder_status", columnList = "status")
    }
)
public class ReorderRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer recommendedQuantity;

    @Column(nullable = false, length = 30)
    private String priority; // CRITICAL, HIGH, NORMAL

    @Column(nullable = false, length = 30)
    private String status; // PENDING, APPROVED, REJECTED, ORDERED

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    public ReorderRecommendation() {}

    public ReorderRecommendation(Product product, Integer recommendedQuantity, String priority, String status) {
        this.product = product;
        this.recommendedQuantity = recommendedQuantity;
        this.priority = priority;
        this.status = status != null ? status : "PENDING";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
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

    public Integer getRecommendedQuantity() {
        return recommendedQuantity;
    }

    public void setRecommendedQuantity(Integer recommendedQuantity) {
        this.recommendedQuantity = recommendedQuantity;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
