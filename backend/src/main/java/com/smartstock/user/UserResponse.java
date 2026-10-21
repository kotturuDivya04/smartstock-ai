package com.smartstock.user;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean enabled;
    private String status;
    private java.time.LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, Role role, boolean enabled, java.time.LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.status = enabled ? "ACTIVE" : "DISABLED";
        this.createdAt = createdAt;
    }

    public static UserResponse fromEntity(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isEnabled(), user.getCreatedAt());
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

    public String getFullName() {
        return name;
    }

    public void setFullName(String fullName) {
        this.name = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
        this.status = enabled ? "ACTIVE" : "DISABLED";
    }

    public String getStatus() {
        return status;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
