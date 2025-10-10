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
@Table(name = "routers")
public class Router extends BaseEntity {

    @NotBlank(message = "Router name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "IP address is required")
    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    @Column(name = "mac_address", length = 17)
    private String macAddress;

    @NotBlank(message = "Router model is required")
    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RouterStatus status = RouterStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RouterType type;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "firmware_version")
    private String firmwareVersion;

    @Column(name = "last_maintenance")
    private LocalDateTime lastMaintenance;

    @Column(name = "next_maintenance")
    private LocalDateTime nextMaintenance;

    @Column(name = "uptime_seconds")
    private Long uptimeSeconds;

    @Column(name = "cpu_usage_percent")
    private Double cpuUsagePercent;

    @Column(name = "memory_usage_percent")
    private Double memoryUsagePercent;

    @Column(name = "temperature_celsius")
    private Double temperatureCelsius;

    @Column(name = "bandwidth_usage_mbps")
    private Double bandwidthUsageMbps;

    @Column(name = "active_connections")
    private Integer activeConnections;

    @Column(name = "configuration_json", columnDefinition = "JSON")
    private String configurationJson;

    @Column(name = "port")
    private Integer port = 443;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    public enum RouterStatus {
        ACTIVE, INACTIVE, MAINTENANCE, OFFLINE, ERROR
    }

    public enum RouterType {
        MIKROTIK, CISCO, TP_LINK, D_LINK, OTHER
    }

    public boolean isOnline() {
        return status == RouterStatus.ACTIVE;
    }

    public boolean needsMaintenance() {
        return nextMaintenance != null && LocalDateTime.now().isAfter(nextMaintenance);
    }

    public boolean isOverloaded() {
        return cpuUsagePercent != null && cpuUsagePercent > 80.0;
    }
} 