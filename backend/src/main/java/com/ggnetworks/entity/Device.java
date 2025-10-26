package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "devices")
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "device_id", unique = true, nullable = false)
    private String deviceId;
    
    @Column(name = "device_name", nullable = false)
    private String deviceName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false)
    private DeviceType deviceType;
    
    @Column(name = "manufacturer")
    private String manufacturer;
    
    @Column(name = "model")
    private String model;
    
    @Column(name = "serial_number")
    private String serialNumber;
    
    @Column(name = "mac_address")
    private String macAddress;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "location")
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeviceStatus status = DeviceStatus.ACTIVE;
    
    @Column(name = "assigned_to")
    private String assignedTo;
    
    @Column(name = "firmware_version")
    private String firmwareVersion;
    
    @Column(name = "hardware_version")
    private String hardwareVersion;
    
    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;
    
    @Column(name = "warranty_expiry")
    private LocalDateTime warrantyExpiry;
    
    @Column(name = "last_maintenance")
    private LocalDateTime lastMaintenance;
    
    @Column(name = "next_maintenance")
    private LocalDateTime nextMaintenance;
    
    @Column(name = "configuration", columnDefinition = "TEXT")
    private String configuration;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Enums
    public enum DeviceType {
        ROUTER, ACCESS_POINT, SWITCH, MODEM, CUSTOMER_DEVICE, SERVER, FIREWALL, LOAD_BALANCER, STORAGE, PRINTER, SCANNER, CAMERA, SENSOR, GATEWAY, BRIDGE, REPEATER, EXTENDER, CONTROLLER, MANAGER, MONITOR
    }
    
    public enum DeviceStatus {
        ACTIVE, INACTIVE, MAINTENANCE, OFFLINE, ERROR, PENDING, CONFIGURING, TESTING, DECOMMISSIONED
    }
    
    // Helper methods
    public boolean isOnline() {
        return status == DeviceStatus.ACTIVE;
    }
    
    public boolean needsMaintenance() {
        return nextMaintenance != null && nextMaintenance.isBefore(LocalDateTime.now());
    }
    
    public boolean isUnderWarranty() {
        return warrantyExpiry != null && warrantyExpiry.isAfter(LocalDateTime.now());
    }
    
    public void markAsMaintained() {
        this.lastMaintenance = LocalDateTime.now();
        this.nextMaintenance = LocalDateTime.now().plusMonths(3); // Next maintenance in 3 months
    }
    
    // Constructors
    public Device() {}
    
    public Device(String deviceId, String deviceName, DeviceType deviceType, String manufacturer, 
                  String model, String serialNumber, String macAddress, String ipAddress, 
                  String location, String assignedTo, String createdBy) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.manufacturer = manufacturer;
        this.model = model;
        this.serialNumber = serialNumber;
        this.macAddress = macAddress;
        this.ipAddress = ipAddress;
        this.location = location;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.status = DeviceStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    
    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }
    
    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    
    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public DeviceStatus getStatus() { return status; }
    public void setStatus(DeviceStatus status) { this.status = status; }
    
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    
    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    
    public String getHardwareVersion() { return hardwareVersion; }
    public void setHardwareVersion(String hardwareVersion) { this.hardwareVersion = hardwareVersion; }
    
    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }
    
    public LocalDateTime getWarrantyExpiry() { return warrantyExpiry; }
    public void setWarrantyExpiry(LocalDateTime warrantyExpiry) { this.warrantyExpiry = warrantyExpiry; }
    
    public LocalDateTime getLastMaintenance() { return lastMaintenance; }
    public void setLastMaintenance(LocalDateTime lastMaintenance) { this.lastMaintenance = lastMaintenance; }
    
    public LocalDateTime getNextMaintenance() { return nextMaintenance; }
    public void setNextMaintenance(LocalDateTime nextMaintenance) { this.nextMaintenance = nextMaintenance; }
    
    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
