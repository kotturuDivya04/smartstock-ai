package com.smartstock.supplier;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "suppliers",
    indexes = {
        @Index(name = "idx_supplier_name", columnList = "name")
    }
)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 120)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(nullable = false, length = 20)
    private String associationStatus = "ASSOCIATED";

    @Min(value = 0, message = "Lead time days must be positive")
    @Column(nullable = false)
    private Integer leadTimeDays = 7;

    @Column(length = 255)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private com.smartstock.user.User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Supplier() {}

    public Supplier(String name, String email, String phone, Integer leadTimeDays, String address) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.leadTimeDays = leadTimeDays != null ? leadTimeDays : 7;
        this.address = address;
        this.associationStatus = "ASSOCIATED";
    }

    public Supplier(String name, String contactPerson, String email, String phone, String address, String associationStatus, com.smartstock.user.User user) {
        this.name = name;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.leadTimeDays = 7;
        this.address = address;
        this.associationStatus = associationStatus != null ? associationStatus : "REGISTERED";
        this.user = user;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactEmail() {
        return email;
    }

    public void setContactEmail(String contactEmail) {
        this.email = contactEmail;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getContactPhone() {
        return phone;
    }

    public void setContactPhone(String contactPhone) {
        this.phone = contactPhone;
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

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getAssociationStatus() {
        return associationStatus;
    }

    public void setAssociationStatus(String associationStatus) {
        this.associationStatus = associationStatus;
    }

    public com.smartstock.user.User getUser() {
        return user;
    }

    public void setUser(com.smartstock.user.User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
