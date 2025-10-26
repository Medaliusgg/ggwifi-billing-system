package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_assignments")
public class DeviceAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "device_id", nullable = false)
    private Long deviceId;
    
    @Column(name = "assigned_to", nullable = false)
    private String assignedTo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", nullable = false)
    private AssignmentType assignmentType;
    
    @Column(name = "assignment_reason")
    private String assignmentReason;
    
    @Column(name = "assigned_by", nullable = false)
    private String assignedBy;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt = LocalDateTime.now();
    
    @Column(name = "unassigned_at")
    private LocalDateTime unassignedAt;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AssignmentStatus status = AssignmentStatus.ACTIVE;
    
    // Enums
    public enum AssignmentType {
        TECHNICAL_SUPPORT, MAINTENANCE, MONITORING, CONFIGURATION, TESTING, DEVELOPMENT, PRODUCTION, BACKUP, EMERGENCY
    }
    
    public enum AssignmentStatus {
        ACTIVE, COMPLETED, CANCELLED, EXPIRED, TRANSFERRED
    }
    
    // Helper methods
    public boolean isActive() {
        return status == AssignmentStatus.ACTIVE;
    }
    
    public void complete() {
        this.status = AssignmentStatus.COMPLETED;
        this.unassignedAt = LocalDateTime.now();
    }
    
    public void cancel() {
        this.status = AssignmentStatus.CANCELLED;
        this.unassignedAt = LocalDateTime.now();
    }
    
    // Constructors
    public DeviceAssignment() {}
    
    public DeviceAssignment(Long deviceId, String assignedTo, AssignmentType assignmentType, 
                           String assignmentReason, String assignedBy) {
        this.deviceId = deviceId;
        this.assignedTo = assignedTo;
        this.assignmentType = assignmentType;
        this.assignmentReason = assignmentReason;
        this.assignedBy = assignedBy;
        this.status = AssignmentStatus.ACTIVE;
        this.assignedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getDeviceId() { return deviceId; }
    public void setDeviceId(Long deviceId) { this.deviceId = deviceId; }
    
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    
    public AssignmentType getAssignmentType() { return assignmentType; }
    public void setAssignmentType(AssignmentType assignmentType) { this.assignmentType = assignmentType; }
    
    public String getAssignmentReason() { return assignmentReason; }
    public void setAssignmentReason(String assignmentReason) { this.assignmentReason = assignmentReason; }
    
    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public LocalDateTime getUnassignedAt() { return unassignedAt; }
    public void setUnassignedAt(LocalDateTime unassignedAt) { this.unassignedAt = unassignedAt; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }
}
