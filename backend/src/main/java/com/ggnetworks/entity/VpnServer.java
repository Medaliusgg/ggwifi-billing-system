package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * VPN Server Entity
 * Represents a WireGuard VPN server node
 */
@Entity
@Table(name = "vpn_servers", indexes = {
    @Index(name = "idx_name", columnList = "name"),
    @Index(name = "idx_status", columnList = "status")
})
public class VpnServer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "public_endpoint", nullable = false, length = 255)
    private String publicEndpoint; // Public IP or DNS
    
    @Column(name = "listen_port", nullable = false)
    private Integer listenPort = 51820;
    
    @Column(name = "server_public_key", nullable = false, length = 64)
    private String serverPublicKey;
    
    @Column(name = "server_private_key_ref", nullable = false, length = 256)
    private String serverPrivateKeyRef; // KMS/Vault reference
    
    @Column(name = "network_cidr", nullable = false, length = 50)
    private String networkCidr; // e.g., 10.77.0.0/16
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServerStatus status = ServerStatus.ACTIVE;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enums
    public enum ServerStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }
    
    // Constructors
    public VpnServer() {}
    
    public VpnServer(String name, String publicEndpoint, String serverPublicKey, String networkCidr) {
        this.name = name;
        this.publicEndpoint = publicEndpoint;
        this.serverPublicKey = serverPublicKey;
        this.networkCidr = networkCidr;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPublicEndpoint() { return publicEndpoint; }
    public void setPublicEndpoint(String publicEndpoint) { this.publicEndpoint = publicEndpoint; }
    
    public Integer getListenPort() { return listenPort; }
    public void setListenPort(Integer listenPort) { this.listenPort = listenPort; }
    
    public String getServerPublicKey() { return serverPublicKey; }
    public void setServerPublicKey(String serverPublicKey) { this.serverPublicKey = serverPublicKey; }
    
    public String getServerPrivateKeyRef() { return serverPrivateKeyRef; }
    public void setServerPrivateKeyRef(String serverPrivateKeyRef) { this.serverPrivateKeyRef = serverPrivateKeyRef; }
    
    public String getNetworkCidr() { return networkCidr; }
    public void setNetworkCidr(String networkCidr) { this.networkCidr = networkCidr; }
    
    public ServerStatus getStatus() { return status; }
    public void setStatus(ServerStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
