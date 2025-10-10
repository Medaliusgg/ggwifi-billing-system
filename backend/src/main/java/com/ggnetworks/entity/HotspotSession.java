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
@Table(name = "hotspot_sessions")
public class HotspotSession extends BaseEntity {

    @NotNull(message = "Voucher is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private HotspotVoucher voucher;

    @NotBlank(message = "MAC address is required")
    @Column(name = "mac_address", nullable = false, length = 17)
    private String macAddress;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status = SessionStatus.ONLINE;

    @Column(name = "data_usage_mb", nullable = false)
    private Long dataUsageMb = 0L;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime = LocalDateTime.now();

    @Column(name = "end_time")
    private LocalDateTime endTime;

    public enum SessionStatus {
        ONLINE, OFFLINE
    }

    public void endSession() {
        this.status = SessionStatus.OFFLINE;
        this.endTime = LocalDateTime.now();
    }

    public void updateDataUsage(Long additionalMb) {
        this.dataUsageMb += additionalMb;
    }

    public boolean isActive() {
        return status == SessionStatus.ONLINE && endTime == null;
    }
} 