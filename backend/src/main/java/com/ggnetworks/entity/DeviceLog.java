package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_logs")
public class DeviceLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "device_id", nullable = false)
    private Long deviceId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "log_level", nullable = false)
    private LogLevel logLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private LogAction action;
    
    @Column(name = "message", nullable = false, length = 1000)
    private String message;
    
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Enums
    public enum LogLevel {
        INFO, WARN, ERROR, DEBUG, AUDIT, CRITICAL
    }
    
    public enum LogAction {
        CREATED, UPDATED, DELETED, ASSIGNED, UNASSIGNED, CONFIGURED, TESTED, 
        MAINTENANCE_STARTED, MAINTENANCE_COMPLETED, STATUS_CHANGED, ERROR_OCCURRED,
        CONNECTED, DISCONNECTED, RESTARTED, SHUTDOWN, BACKUP_CREATED, BACKUP_RESTORED
    }
    
    // Constructors
    public DeviceLog() {}
    
    public DeviceLog(Long deviceId, LogLevel logLevel, LogAction action, String message, String details, String userId) {
        this.deviceId = deviceId;
        this.logLevel = logLevel;
        this.action = action;
        this.message = message;
        this.details = details;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getDeviceId() { return deviceId; }
    public void setDeviceId(Long deviceId) { this.deviceId = deviceId; }
    
    public LogLevel getLogLevel() { return logLevel; }
    public void setLogLevel(LogLevel logLevel) { this.logLevel = logLevel; }
    
    public LogAction getAction() { return action; }
    public void setAction(LogAction action) { this.action = action; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
