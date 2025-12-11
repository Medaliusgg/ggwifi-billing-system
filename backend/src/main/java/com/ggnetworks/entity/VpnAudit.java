package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * VPN Audit Entity
 * Tracks administrative actions and audit logs for VPN operations
 */
@Entity
@Table(name = "vpn_audit", indexes = {
    @Index(name = "idx_actor_id", columnList = "actor_id"),
    @Index(name = "idx_action", columnList = "action"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class VpnAudit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "actor_id")
    private Long actorId; // Admin user or system
    
    @Column(name = "action", nullable = false, length = 100)
    private String action;
    
    @Column(name = "target_table", length = 100)
    private String targetTable;
    
    @Column(name = "target_id")
    private Long targetId;
    
    @Column(name = "details", columnDefinition = "JSON")
    private String details; // JSON details
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public VpnAudit() {}
    
    public VpnAudit(Long actorId, String action, String targetTable, Long targetId) {
        this.actorId = actorId;
        this.action = action;
        this.targetTable = targetTable;
        this.targetId = targetId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getTargetTable() { return targetTable; }
    public void setTargetTable(String targetTable) { this.targetTable = targetTable; }
    
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
