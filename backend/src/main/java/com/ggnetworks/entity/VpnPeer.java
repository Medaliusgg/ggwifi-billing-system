package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vpn_peers", indexes = {
    @Index(name = "idx_router_id", columnList = "router_id"),
    @Index(name = "idx_vpn_server_id", columnList = "vpn_server_id"),
    @Index(name = "idx_status", columnList = "status")
})
public class VpnPeer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "router_id")
    private Long routerId;
    
    @Column(name = "vpn_server_id")
    private Long vpnServerId;
    
    @Column(name = "peer_public_key", nullable = false, length = 64)
    private String peerPublicKey;
    
    @Column(name = "peer_private_key_ref", length = 256)
    private String peerPrivateKeyRef; // KMS/Vault reference
    
    @Column(name = "allowed_ip", nullable = false, length = 45)
    private String allowedIp;
    
    @Column(name = "persistent_keepalive")
    private Integer persistentKeepalive = 25;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PeerStatus status = PeerStatus.PENDING;
    
    @Column(name = "last_handshake")
    private LocalDateTime lastHandshake;
    
    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum PeerStatus {
        PENDING, ACTIVE, SUSPENDED, REVOKED
    }
    
    // Constructors
    public VpnPeer() {}
    
    public VpnPeer(Long routerId, Long vpnServerId, String peerPublicKey, String allowedIp) {
        this.routerId = routerId;
        this.vpnServerId = vpnServerId;
        this.peerPublicKey = peerPublicKey;
        this.allowedIp = allowedIp;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getRouterId() { return routerId; }
    public void setRouterId(Long routerId) { this.routerId = routerId; }
    
    public Long getVpnServerId() { return vpnServerId; }
    public void setVpnServerId(Long vpnServerId) { this.vpnServerId = vpnServerId; }
    
    public String getPeerPublicKey() { return peerPublicKey; }
    public void setPeerPublicKey(String peerPublicKey) { this.peerPublicKey = peerPublicKey; }
    
    public String getPeerPrivateKeyRef() { return peerPrivateKeyRef; }
    public void setPeerPrivateKeyRef(String peerPrivateKeyRef) { this.peerPrivateKeyRef = peerPrivateKeyRef; }
    
    public String getAllowedIp() { return allowedIp; }
    public void setAllowedIp(String allowedIp) { this.allowedIp = allowedIp; }
    
    public Integer getPersistentKeepalive() { return persistentKeepalive; }
    public void setPersistentKeepalive(Integer persistentKeepalive) { this.persistentKeepalive = persistentKeepalive; }
    
    public PeerStatus getStatus() { return status; }
    public void setStatus(PeerStatus status) { this.status = status; }
    
    public LocalDateTime getLastHandshake() { return lastHandshake; }
    public void setLastHandshake(LocalDateTime lastHandshake) { this.lastHandshake = lastHandshake; }
    
    public LocalDateTime getLastSeenAt() { return lastSeenAt; }
    public void setLastSeenAt(LocalDateTime lastSeenAt) { this.lastSeenAt = lastSeenAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
