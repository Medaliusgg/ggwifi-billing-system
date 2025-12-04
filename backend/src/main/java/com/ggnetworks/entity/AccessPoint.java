package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_points")
public class AccessPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ap_id", unique = true, nullable = false)
    private String apId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "router_id")
    private Long routerId; // Associated router

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;

    @Column(name = "mac_address", unique = true)
    private String macAddress;

    @Column(name = "model")
    private String model;

    @Column(name = "manufacturer")
    private String manufacturer = "Reyee";

    @Column(name = "firmware_version")
    private String firmwareVersion;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private APStatus status = APStatus.OFFLINE;

    @Column(name = "signal_strength_dbm")
    private Integer signalStrengthDbm;

    @Column(name = "connected_devices_count")
    private Integer connectedDevicesCount = 0;

    @Column(name = "ssid")
    private String ssid;

    @Column(name = "channel")
    private Integer channel;

    @Column(name = "channel_interference")
    private Integer channelInterference;

    @Column(name = "traffic_bytes_in")
    private Long trafficBytesIn = 0L;

    @Column(name = "traffic_bytes_out")
    private Long trafficBytesOut = 0L;

    @Column(name = "location")
    private String location;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "uptime_seconds")
    private Long uptimeSeconds = 0L;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum APStatus {
        ONLINE, OFFLINE, MAINTENANCE, ERROR, UNKNOWN
    }

    // Constructors
    public AccessPoint() {}

    public AccessPoint(String apId, String name, String ipAddress, Long routerId) {
        this.apId = apId;
        this.name = name;
        this.ipAddress = ipAddress;
        this.routerId = routerId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApId() { return apId; }
    public void setApId(String apId) { this.apId = apId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRouterId() { return routerId; }
    public void setRouterId(Long routerId) { this.routerId = routerId; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }

    public APStatus getStatus() { return status; }
    public void setStatus(APStatus status) { this.status = status; }

    public Integer getSignalStrengthDbm() { return signalStrengthDbm; }
    public void setSignalStrengthDbm(Integer signalStrengthDbm) { this.signalStrengthDbm = signalStrengthDbm; }

    public Integer getConnectedDevicesCount() { return connectedDevicesCount; }
    public void setConnectedDevicesCount(Integer connectedDevicesCount) { this.connectedDevicesCount = connectedDevicesCount; }

    public String getSsid() { return ssid; }
    public void setSsid(String ssid) { this.ssid = ssid; }

    public Integer getChannel() { return channel; }
    public void setChannel(Integer channel) { this.channel = channel; }

    public Integer getChannelInterference() { return channelInterference; }
    public void setChannelInterference(Integer channelInterference) { this.channelInterference = channelInterference; }

    public Long getTrafficBytesIn() { return trafficBytesIn; }
    public void setTrafficBytesIn(Long trafficBytesIn) { this.trafficBytesIn = trafficBytesIn; }

    public Long getTrafficBytesOut() { return trafficBytesOut; }
    public void setTrafficBytesOut(Long trafficBytesOut) { this.trafficBytesOut = trafficBytesOut; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }

    public Long getUptimeSeconds() { return uptimeSeconds; }
    public void setUptimeSeconds(Long uptimeSeconds) { this.uptimeSeconds = uptimeSeconds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    public boolean isOnline() {
        return status == APStatus.ONLINE;
    }

    public long getTotalTrafficBytes() {
        return (trafficBytesIn != null ? trafficBytesIn : 0L) + (trafficBytesOut != null ? trafficBytesOut : 0L);
    }
}





