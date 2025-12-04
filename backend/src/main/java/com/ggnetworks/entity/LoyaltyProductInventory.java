package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * LoyaltyProductInventory
 * Tracks how many reward items are available per location/site/warehouse.
 */
@Entity
@Table(name = "loyalty_product_inventory")
public class LoyaltyProductInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventory_id", unique = true, nullable = false, length = 40)
    private String inventoryId;

    @Column(name = "reward_id", nullable = false)
    private String rewardId;

    @Column(name = "location_code", nullable = false)
    private String locationCode;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "stock_available", nullable = false)
    private Integer stockAvailable = 0;

    @Column(name = "stock_reserved", nullable = false)
    private Integer stockReserved = 0;

    @Column(name = "threshold_alert")
    private Integer thresholdAlert = 5;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public LoyaltyProductInventory() {
        this.inventoryId = "LPI-" + System.currentTimeMillis();
    }

    // Getters / setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(String inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getRewardId() {
        return rewardId;
    }

    public void setRewardId(String rewardId) {
        this.rewardId = rewardId;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getStockAvailable() {
        return stockAvailable;
    }

    public void setStockAvailable(Integer stockAvailable) {
        this.stockAvailable = stockAvailable;
    }

    public Integer getStockReserved() {
        return stockReserved;
    }

    public void setStockReserved(Integer stockReserved) {
        this.stockReserved = stockReserved;
    }

    public Integer getThresholdAlert() {
        return thresholdAlert;
    }

    public void setThresholdAlert(Integer thresholdAlert) {
        this.thresholdAlert = thresholdAlert;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

