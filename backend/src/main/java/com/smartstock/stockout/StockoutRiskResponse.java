package com.smartstock.stockout;

public class StockoutRiskResponse {

    private Long productId;
    private String productSku;
    private String productName;
    private Integer currentStock;
    private Double dailyBurnRate;
    private Double daysUntilStockout;
    private String riskLevel; // CRITICAL, HIGH, MEDIUM, LOW
    private String recommendation;

    public StockoutRiskResponse() {}

    public StockoutRiskResponse(Long productId, String productSku, String productName, Integer currentStock, Double dailyBurnRate, Double daysUntilStockout, String riskLevel, String recommendation) {
        this.productId = productId;
        this.productSku = productSku;
        this.productName = productName;
        this.currentStock = currentStock;
        this.dailyBurnRate = dailyBurnRate;
        this.daysUntilStockout = daysUntilStockout;
        this.riskLevel = riskLevel;
        this.recommendation = recommendation;
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

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Double getDailyBurnRate() {
        return dailyBurnRate;
    }

    public void setDailyBurnRate(Double dailyBurnRate) {
        this.dailyBurnRate = dailyBurnRate;
    }

    public Double getDaysUntilStockout() {
        return daysUntilStockout;
    }

    public void setDaysUntilStockout(Double daysUntilStockout) {
        this.daysUntilStockout = daysUntilStockout;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
