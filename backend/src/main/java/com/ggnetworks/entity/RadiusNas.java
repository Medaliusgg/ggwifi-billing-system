package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "nas")
public class RadiusNas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nasname", nullable = false, length = 128)
    private String nasName;

    @Column(name = "shortname", length = 32)
    private String shortName;

    @Column(name = "type", length = 30)
    private String type = "mikrotik";

    @Column(name = "ports")
    private Integer ports;

    @Column(name = "secret", nullable = false, length = 60)
    private String secret = "testing123";

    @Column(name = "server", length = 64)
    private String server;

    @Column(name = "community", length = 50)
    private String community;

    @Column(name = "description", length = 200)
    private String description = "RADIUS Client";

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "router_id")
    private Long routerId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RadiusNas() {}

    public RadiusNas(String nasName, String shortName, String type, String secret, String description) {
        this.nasName = nasName;
        this.shortName = shortName;
        this.type = type;
        this.secret = secret;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNasName() { return nasName; }
    public void setNasName(String nasName) { this.nasName = nasName; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPorts() { return ports; }
    public void setPorts(Integer ports) { this.ports = ports; }

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public String getServer() { return server; }
    public void setServer(String server) { this.server = server; }

    public String getCommunity() { return community; }
    public void setCommunity(String community) { this.community = community; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getRouterId() { return routerId; }
    public void setRouterId(Long routerId) { this.routerId = routerId; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
