package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "static_ips")
public class StaticIp extends BaseEntity {

    @NotBlank(message = "IP address is required")
    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "router_id")
    private Router router;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StaticIpStatus status = StaticIpStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private StaticIpType type;

    @Column(name = "subnet_mask", nullable = false)
    private String subnetMask;

    @Column(name = "gateway")
    private String gateway;

    @Column(name = "dns_primary")
    private String dnsPrimary;

    @Column(name = "dns_secondary")
    private String dnsSecondary;

    @Column(name = "monthly_fee", precision = 10, scale = 2)
    private BigDecimal monthlyFee;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "mac_address", length = 17)
    private String macAddress;

    public enum StaticIpStatus {
        AVAILABLE, ASSIGNED, RESERVED, EXPIRED, BLOCKED
    }

    public enum StaticIpType {
        PUBLIC, PRIVATE, BUSINESS, PREMIUM
    }

    public boolean isAvailable() {
        return status == StaticIpStatus.AVAILABLE;
    }

    public boolean isAssigned() {
        return status == StaticIpStatus.ASSIGNED;
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public void assignToUser(User user) {
        this.user = user;
        this.status = StaticIpStatus.ASSIGNED;
        this.assignedAt = LocalDateTime.now();
    }

    public void release() {
        this.user = null;
        this.status = StaticIpStatus.AVAILABLE;
        this.assignedAt = null;
        this.expiresAt = null;
    }
} 