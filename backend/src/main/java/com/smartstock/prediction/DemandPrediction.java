package com.smartstock.prediction;

import com.smartstock.product.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "demand_predictions",
    indexes = {
        @Index(name = "idx_prediction_product", columnList = "product_id"),
        @Index(name = "idx_prediction_date", columnList = "predictionDate")
    }
)
public class DemandPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDateTime predictionDate;

    @Column(nullable = false)
    private Integer forecastDays;

    @Column(nullable = false)
    private Double predictedDemand;

    @Column(length = 80)
    private String modelVersion;

    private Double confidenceScore;

    public DemandPrediction() {}

    public DemandPrediction(Product product, LocalDateTime predictionDate, Integer forecastDays, Double predictedDemand, String modelVersion) {
        this.product = product;
        this.predictionDate = predictionDate != null ? predictionDate : LocalDateTime.now();
        this.forecastDays = forecastDays != null ? forecastDays : 30;
        this.predictedDemand = predictedDemand;
        this.modelVersion = modelVersion != null ? modelVersion : "v1.0-baseline";
        this.confidenceScore = 0.85;
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

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public void setPredictionDate(LocalDateTime predictionDate) {
        this.predictionDate = predictionDate;
    }

    public Integer getForecastDays() {
        return forecastDays;
    }

    public void setForecastDays(Integer forecastDays) {
        this.forecastDays = forecastDays;
    }

    public Double getPredictedDemand() {
        return predictedDemand;
    }

    public void setPredictedDemand(Double predictedDemand) {
        this.predictedDemand = predictedDemand;
    }

    public Double getPredictedQuantity() {
        return predictedDemand;
    }

    public void setPredictedQuantity(Double predictedQuantity) {
        this.predictedDemand = predictedQuantity;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public String getModelName() {
        return modelVersion;
    }

    public void setModelName(String modelName) {
        this.modelVersion = modelName;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
