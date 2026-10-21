package com.smartstock.prediction;

import java.time.LocalDateTime;

public class PredictionResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private Double predictedQuantity;
    private Integer forecastDays;
    private Double confidenceScore;
    private String modelName;
    private LocalDateTime predictionDate;

    public PredictionResponse() {}

    public static PredictionResponse fromEntity(DemandPrediction prediction) {
        PredictionResponse response = new PredictionResponse();
        response.setId(prediction.getId());
        if (prediction.getProduct() != null) {
            response.setProductId(prediction.getProduct().getId());
            response.setProductSku(prediction.getProduct().getSku());
            response.setProductName(prediction.getProduct().getName());
        }
        response.setPredictedQuantity(prediction.getPredictedQuantity());
        response.setForecastDays(prediction.getForecastDays());
        response.setConfidenceScore(prediction.getConfidenceScore());
        response.setModelName(prediction.getModelName());
        response.setPredictionDate(prediction.getPredictionDate());
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

    public Double getPredictedQuantity() {
        return predictedQuantity;
    }

    public void setPredictedQuantity(Double predictedQuantity) {
        this.predictedQuantity = predictedQuantity;
    }

    public Integer getForecastDays() {
        return forecastDays;
    }

    public void setForecastDays(Integer forecastDays) {
        this.forecastDays = forecastDays;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public LocalDateTime getPredictionDate() {
        return predictionDate;
    }

    public void setPredictionDate(LocalDateTime predictionDate) {
        this.predictionDate = predictionDate;
    }
}
