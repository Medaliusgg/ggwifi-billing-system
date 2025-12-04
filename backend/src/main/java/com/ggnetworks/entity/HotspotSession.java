package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * HotspotSession Entity
 * Tracks active sessions for hotspot users
 */
@Entity
@Table(name = "hotspot_sessions", indexes = {
    @Index(name = "idx_hotspot_user_id", columnList = "hotspot_user_id"),
    @Index(name = "idx_session_status", columnList = "session_status"),
    @Index(name = "idx_mac_address", columnList = "mac_address")
})
public class HotspotSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotspot_user_id", nullable = false)
    private HotspotUser hotspotUser;

    @Column(name = "mac_address", length = 17)
    private String macAddress;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "radius_username", length = 64)
    private String radiusUsername;

    @Column(name = "session_start_time", nullable = false)
    private LocalDateTime sessionStartTime;

    @Column(name = "session_end_time")
    private LocalDateTime sessionEndTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status", nullable = false)
    private SessionStatus sessionStatus = SessionStatus.ACTIVE;

    @Column(name = "bytes_uploaded")
    private Long bytesUploaded = 0L;

    @Column(name = "bytes_downloaded")
    private Long bytesDownloaded = 0L;

    @Column(name = "duration_seconds")
    private Long durationSeconds = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum SessionStatus {
        ACTIVE, TERMINATED, EXPIRED, SUSPENDED
    }

    // Constructors
    public HotspotSession() {
        this.sessionStartTime = LocalDateTime.now();
    }

    public HotspotSession(HotspotUser hotspotUser, String macAddress, String ipAddress, String radiusUsername) {
        this();
        this.hotspotUser = hotspotUser;
        this.macAddress = macAddress;
        this.ipAddress = ipAddress;
        this.radiusUsername = radiusUsername;
    }

    // Helper methods
    public boolean isActive() {
        return sessionStatus == SessionStatus.ACTIVE;
    }

    public void terminate() {
        this.sessionStatus = SessionStatus.TERMINATED;
        this.sessionEndTime = LocalDateTime.now();
        if (sessionStartTime != null && sessionEndTime != null) {
            this.durationSeconds = java.time.Duration.between(sessionStartTime, sessionEndTime).getSeconds();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public HotspotUser getHotspotUser() { return hotspotUser; }
    public void setHotspotUser(HotspotUser hotspotUser) { this.hotspotUser = hotspotUser; }

    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getRadiusUsername() { return radiusUsername; }
    public void setRadiusUsername(String radiusUsername) { this.radiusUsername = radiusUsername; }

    public LocalDateTime getSessionStartTime() { return sessionStartTime; }
    public void setSessionStartTime(LocalDateTime sessionStartTime) { this.sessionStartTime = sessionStartTime; }

    public LocalDateTime getSessionEndTime() { return sessionEndTime; }
    public void setSessionEndTime(LocalDateTime sessionEndTime) { this.sessionEndTime = sessionEndTime; }

    public SessionStatus getSessionStatus() { return sessionStatus; }
    public void setSessionStatus(SessionStatus sessionStatus) { this.sessionStatus = sessionStatus; }

    public Long getBytesUploaded() { return bytesUploaded; }
    public void setBytesUploaded(Long bytesUploaded) { this.bytesUploaded = bytesUploaded; }

    public Long getBytesDownloaded() { return bytesDownloaded; }
    public void setBytesDownloaded(Long bytesDownloaded) { this.bytesDownloaded = bytesDownloaded; }

    public Long getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Long durationSeconds) { this.durationSeconds = durationSeconds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

