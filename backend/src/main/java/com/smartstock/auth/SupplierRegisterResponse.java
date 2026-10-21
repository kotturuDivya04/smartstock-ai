package com.smartstock.auth;

public class SupplierRegisterResponse {
    private String message;
    private Long supplierId;
    private String companyName;
    private String status;

    public SupplierRegisterResponse() {}

    public SupplierRegisterResponse(String message, Long supplierId, String companyName, String status) {
        this.message = message;
        this.supplierId = supplierId;
        this.companyName = companyName;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
