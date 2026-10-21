package com.smartstock.supplier;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SupplierRequest {

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactEmail;
    private String contactPhone;

    @Min(value = 0, message = "Lead time days must be positive")
    private Integer leadTimeDays = 7;

    private String address;

    public SupplierRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Integer getLeadTimeDays() {
        return leadTimeDays;
    }

    public void setLeadTimeDays(Integer leadTimeDays) {
        this.leadTimeDays = leadTimeDays;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
