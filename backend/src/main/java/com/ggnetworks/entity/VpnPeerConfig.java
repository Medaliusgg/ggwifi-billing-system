package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * VPN Peer Config Entity
 * Module J: VPN Module - WireGuard Peer Config Versioned Storage
 * 
 * Stores versioned WireGuard peer configuration
 */
@Entity
@Table(name = "vpn_peer_config", indexes = {
    @Index(name = "idx_vpn_peer_config_peer", columnList = "peer_id"),
    @Index(name = "idx_vpn_peer_config_version", columnList = "peer_id, config_version")
})
public class VpnPeerConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peer_id", nullable = false)
    private VpnPeer peer;
    
    @Column(name = "config_text", columnDefinition = "TEXT", nullable = false)
    private String configText;
    
    @Column(name = "config_version", nullable = false)
    private Integer configVersion = 1;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public VpnPeerConfig() {}
    
    public VpnPeerConfig(VpnPeer peer, String configText, Integer configVersion) {
        this.peer = peer;
        this.configText = configText;
        this.configVersion = configVersion;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public VpnPeer getPeer() { return peer; }
    public void setPeer(VpnPeer peer) { this.peer = peer; }
    
    public String getConfigText() { return configText; }
    public void setConfigText(String configText) { this.configText = configText; }
    
    public Integer getConfigVersion() { return configVersion; }
    public void setConfigVersion(Integer configVersion) { this.configVersion = configVersion; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
