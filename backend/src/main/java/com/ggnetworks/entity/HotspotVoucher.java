package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "hotspot_vouchers")
public class HotspotVoucher extends BaseEntity {

    @NotBlank(message = "Voucher code is required")
    @Column(name = "voucher_code", unique = true, nullable = false, length = 20)
    private String voucherCode;

    @NotNull(message = "Package is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VoucherStatus status = VoucherStatus.GENERATED;

    @Column(name = "assigned_to", length = 15)
    private String assignedTo;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public enum VoucherStatus {
        GENERATED, ASSIGNED, USED, EXPIRED
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isAvailable() {
        return status == VoucherStatus.GENERATED && !isExpired();
    }

    public void markAsUsed(String phoneNumber) {
        this.status = VoucherStatus.USED;
        this.assignedTo = phoneNumber;
        this.usedAt = LocalDateTime.now();
    }

    public void markAsExpired() {
        this.status = VoucherStatus.EXPIRED;
    }
} 