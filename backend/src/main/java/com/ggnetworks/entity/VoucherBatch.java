package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Voucher Batch Entity
 * Tracks voucher generation batches for analytics and management
 */
@Entity
@Table(name = "voucher_batches", indexes = {
    @Index(name = "idx_batch_id", columnList = "batch_id", unique = true),
    @Index(name = "idx_created_by", columnList = "created_by")
})
public class VoucherBatch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "batch_id", nullable = false, unique = true, length = 50)
    private String batchId;
    
    @Column(name = "package_id")
    private Long packageId;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "generated", nullable = false)
    private Integer generated = 0;
    
    @Column(name = "sold", nullable = false)
    private Integer sold = 0;
    
    @Column(name = "redeemed", nullable = false)
    private Integer redeemed = 0;
    
    @Column(name = "expired", nullable = false)
    private Integer expired = 0;
    
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "total_value", precision = 10, scale = 2)
    private BigDecimal totalValue;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BatchStatus status = BatchStatus.PENDING;
    
    @Column(name = "created_by", length = 100)
    private String createdBy;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public enum BatchStatus {
        PENDING, GENERATING, COMPLETED, CANCELLED
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }
    
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getGenerated() { return generated; }
    public void setGenerated(Integer generated) { this.generated = generated; }
    
    public Integer getSold() { return sold; }
    public void setSold(Integer sold) { this.sold = sold; }
    
    public Integer getRedeemed() { return redeemed; }
    public void setRedeemed(Integer redeemed) { this.redeemed = redeemed; }
    
    public Integer getExpired() { return expired; }
    public void setExpired(Integer expired) { this.expired = expired; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    
    public BatchStatus getStatus() { return status; }
    public void setStatus(BatchStatus status) { this.status = status; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

