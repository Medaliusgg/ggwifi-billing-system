package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "routers")
public class Router {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "router_id", unique = true, nullable = false)
    private String routerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    @Column(name = "mac_address", unique = true)
    private String macAddress;

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;

    @Column(name = "api_port")
    private Integer apiPort = 8728;

    @Column(name = "ssh_port")
    private Integer sshPort = 22;

    @Column(name = "winbox_port")
    private Integer winboxPort = 8291;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "location")
    private String location;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RouterStatus status = RouterStatus.OFFLINE;

    @Column(name = "router_type")
    @Enumerated(EnumType.STRING)
    private RouterType routerType = RouterType.MIKROTIK;

    @Column(name = "firmware_version")
    private String firmwareVersion;

    @Column(name = "board_name")
    private String boardName;

    @Column(name = "architecture_name")
    private String architectureName;

    @Column(name = "version")
    private String version;

    @Column(name = "build_time")
    private String buildTime;

    @Column(name = "free_memory")
    private Long freeMemory;

    @Column(name = "total_memory")
    private Long totalMemory;

    @Column(name = "cpu_count")
    private Integer cpuCount;

    @Column(name = "cpu_frequency")
    private Long cpuFrequency;

    @Column(name = "cpu_load")
    private Double cpuLoad;

    @Column(name = "uptime")
    private Long uptime;

    @Column(name = "voltage")
    private Double voltage;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "last_backup")
    private LocalDateTime lastBackup;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum RouterStatus {
        ONLINE, OFFLINE, MAINTENANCE, ERROR, UNKNOWN
    }

    public enum RouterType {
        MIKROTIK, CISCO, JUNIPER, HUAWEI, OTHER
    }

    // Constructors
    public Router() {}

    public Router(String routerId, String name, String model, String ipAddress, String username, String password) {
        this.routerId = routerId;
        this.name = name;
        this.model = model;
        this.ipAddress = ipAddress;
        this.username = username;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRouterId() { return routerId; }
    public void setRouterId(String routerId) { this.routerId = routerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Integer getApiPort() { return apiPort; }
    public void setApiPort(Integer apiPort) { this.apiPort = apiPort; }

    public Integer getSshPort() { return sshPort; }
    public void setSshPort(Integer sshPort) { this.sshPort = sshPort; }

    public Integer getWinboxPort() { return winboxPort; }
    public void setWinboxPort(Integer winboxPort) { this.winboxPort = winboxPort; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public RouterStatus getStatus() { return status; }
    public void setStatus(RouterStatus status) { this.status = status; }

    public RouterType getRouterType() { return routerType; }
    public void setRouterType(RouterType routerType) { this.routerType = routerType; }

    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }

    public String getBoardName() { return boardName; }
    public void setBoardName(String boardName) { this.boardName = boardName; }

    public String getArchitectureName() { return architectureName; }
    public void setArchitectureName(String architectureName) { this.architectureName = architectureName; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getBuildTime() { return buildTime; }
    public void setBuildTime(String buildTime) { this.buildTime = buildTime; }

    public Long getFreeMemory() { return freeMemory; }
    public void setFreeMemory(Long freeMemory) { this.freeMemory = freeMemory; }

    public Long getTotalMemory() { return totalMemory; }
    public void setTotalMemory(Long totalMemory) { this.totalMemory = totalMemory; }

    public Integer getCpuCount() { return cpuCount; }
    public void setCpuCount(Integer cpuCount) { this.cpuCount = cpuCount; }

    public Long getCpuFrequency() { return cpuFrequency; }
    public void setCpuFrequency(Long cpuFrequency) { this.cpuFrequency = cpuFrequency; }

    public Double getCpuLoad() { return cpuLoad; }
    public void setCpuLoad(Double cpuLoad) { this.cpuLoad = cpuLoad; }

    public Long getUptime() { return uptime; }
    public void setUptime(Long uptime) { this.uptime = uptime; }

    public Double getVoltage() { return voltage; }
    public void setVoltage(Double voltage) { this.voltage = voltage; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }

    public LocalDateTime getLastBackup() { return lastBackup; }
    public void setLastBackup(LocalDateTime lastBackup) { this.lastBackup = lastBackup; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
