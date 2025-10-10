package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "pppoe_user_profiles")
public class PppoeUserProfile extends BaseEntity {

    @NotNull(message = "User is required")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "username", unique = true, length = 50)
    private String username;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProfileStatus status = ProfileStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private Package packageEntity;

    @Column(name = "installation_address", columnDefinition = "TEXT")
    private String installationAddress;

    @Column(name = "installation_location")
    private String installationLocation;

    public enum ProfileStatus {
        PENDING, ACTIVE, SUSPENDED, CANCELLED
    }

    public boolean isActive() {
        return status == ProfileStatus.ACTIVE;
    }

    public boolean isPending() {
        return status == ProfileStatus.PENDING;
    }

    public void activate() {
        this.status = ProfileStatus.ACTIVE;
    }

    public void suspend() {
        this.status = ProfileStatus.SUSPENDED;
    }

    public void cancel() {
        this.status = ProfileStatus.CANCELLED;
    }
} 