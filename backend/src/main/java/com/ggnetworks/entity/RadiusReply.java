package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entity representing FreeRADIUS reply attributes in radreply table
 * This entity manages authorization attributes and rate limits for users
 */
@Entity
@Table(name = "radreply", catalog = "radius")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RadiusReply extends BaseEntity {
    
    @Column(name = "username", nullable = false, length = 64)
    private String username;
    
    @Column(name = "attribute", nullable = false, length = 64)
    private String attribute;
    
    @Column(name = "op", nullable = false, length = 2)
    private String op;
    
    @Column(name = "value", nullable = false, length = 253)
    private String value;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;
    
    @Column(name = "nas_identifier")
    private String nasIdentifier;
    
    @Column(name = "location_id")
    private Long locationId;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "package_id")
    private Long packageId;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "priority")
    private Integer priority;
    
    @Column(name = "notes")
    private String notes;
    
    public enum UserType {
        PPPOE_USER,
        HOTSPOT_USER,
        ADMIN_USER,
        GUEST_USER
    }
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (isActive == null) {
            isActive = true;
        }
        if (priority == null) {
            priority = 0;
        }
    }
} 