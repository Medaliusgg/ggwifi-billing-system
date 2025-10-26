package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "radcheck")
public class RadiusCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, length = 64)
    private String username;

    @Column(name = "attribute", nullable = false, length = 64)
    private String attribute;

    @Column(name = "op", nullable = false, length = 2)
    private String op = "==";

    @Column(name = "value", nullable = false, length = 253)
    private String value;

    @Column(name = "user_type", length = 50)
    private String userType = "HOTSPOT";

    @Column(name = "nas_identifier", length = 50)
    private String nasIdentifier = "GGNetworks-Hotspot";

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "router_id")
    private Long routerId;

    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RadiusCheck() {}

    public RadiusCheck(String username, String attribute, String value) {
        this.username = username;
        this.attribute = attribute;
        this.value = value;
    }

    public RadiusCheck(String username, String attribute, String op, String value) {
        this.username = username;
        this.attribute = attribute;
        this.op = op;
        this.value = value;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAttribute() { return attribute; }
    public void setAttribute(String attribute) { this.attribute = attribute; }

    public String getOp() { return op; }
    public void setOp(String op) { this.op = op; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public String getNasIdentifier() { return nasIdentifier; }
    public void setNasIdentifier(String nasIdentifier) { this.nasIdentifier = nasIdentifier; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public Long getRouterId() { return routerId; }
    public void setRouterId(Long routerId) { this.routerId = routerId; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
