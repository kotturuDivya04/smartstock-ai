package com.smartstock.supplier;

import java.time.LocalDateTime;

public class SupplierResponse {

    private Long id;
    private String name;
    private String contactPerson;
    private String contactEmail;
    private String contactPhone;
    private Integer leadTimeDays;
    private String address;
    private String associationStatus;
    private LocalDateTime createdAt;

    public SupplierResponse() {}

    public SupplierResponse(Long id, String name, String contactPerson, String contactEmail,
                            String contactPhone, Integer leadTimeDays, String address,
                            String associationStatus, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.leadTimeDays = leadTimeDays;
        this.address = address;
        this.associationStatus = associationStatus;
        this.createdAt = createdAt;
    }

    public static SupplierResponse fromEntity(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getContactEmail(),
                supplier.getContactPhone(),
                supplier.getLeadTimeDays(),
                supplier.getAddress(),
                supplier.getAssociationStatus(),
                supplier.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getAssociationStatus() { return associationStatus; }
    public void setAssociationStatus(String associationStatus) { this.associationStatus = associationStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
