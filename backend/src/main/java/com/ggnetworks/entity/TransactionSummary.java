package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_summaries")
public class TransactionSummary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "summary_id", unique = true, nullable = false)
    private String summaryId;
    
    @Column(name = "period_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PeriodType periodType;
    
    @Column(name = "period_start", nullable = false)
    private LocalDateTime periodStart;
    
    @Column(name = "period_end", nullable = false)
    private LocalDateTime periodEnd;
    
    @Column(name = "total_transactions")
    private Long totalTransactions = 0L;
    
    @Column(name = "successful_transactions")
    private Long successfulTransactions = 0L;
    
    @Column(name = "failed_transactions")
    private Long failedTransactions = 0L;
    
    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(name = "successful_amount", precision = 15, scale = 2)
    private BigDecimal successfulAmount = BigDecimal.ZERO;
    
    @Column(name = "failed_amount", precision = 15, scale = 2)
    private BigDecimal failedAmount = BigDecimal.ZERO;
    
    @Column(name = "average_transaction", precision = 10, scale = 2)
    private BigDecimal averageTransaction = BigDecimal.ZERO;
    
    @Column(name = "success_rate", precision = 5, scale = 2)
    private BigDecimal successRate = BigDecimal.ZERO;
    
    @Column(name = "payment_method_breakdown", columnDefinition = "TEXT")
    private String paymentMethodBreakdown;
    
    @Column(name = "gateway_breakdown", columnDefinition = "TEXT")
    private String gatewayBreakdown;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Enums
    public enum PeriodType {
        HOURLY, DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
    }
    
    // Constructors
    public TransactionSummary() {}
    
    public TransactionSummary(String summaryId, PeriodType periodType, LocalDateTime periodStart, LocalDateTime periodEnd) {
        this.summaryId = summaryId;
        this.periodType = periodType;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSummaryId() { return summaryId; }
    public void setSummaryId(String summaryId) { this.summaryId = summaryId; }
    
    public PeriodType getPeriodType() { return periodType; }
    public void setPeriodType(PeriodType periodType) { this.periodType = periodType; }
    
    public LocalDateTime getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDateTime periodStart) { this.periodStart = periodStart; }
    
    public LocalDateTime getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDateTime periodEnd) { this.periodEnd = periodEnd; }
    
    public Long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Long totalTransactions) { this.totalTransactions = totalTransactions; }
    
    public Long getSuccessfulTransactions() { return successfulTransactions; }
    public void setSuccessfulTransactions(Long successfulTransactions) { this.successfulTransactions = successfulTransactions; }
    
    public Long getFailedTransactions() { return failedTransactions; }
    public void setFailedTransactions(Long failedTransactions) { this.failedTransactions = failedTransactions; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public BigDecimal getSuccessfulAmount() { return successfulAmount; }
    public void setSuccessfulAmount(BigDecimal successfulAmount) { this.successfulAmount = successfulAmount; }
    
    public BigDecimal getFailedAmount() { return failedAmount; }
    public void setFailedAmount(BigDecimal failedAmount) { this.failedAmount = failedAmount; }
    
    public BigDecimal getAverageTransaction() { return averageTransaction; }
    public void setAverageTransaction(BigDecimal averageTransaction) { this.averageTransaction = averageTransaction; }
    
    public BigDecimal getSuccessRate() { return successRate; }
    public void setSuccessRate(BigDecimal successRate) { this.successRate = successRate; }
    
    public String getPaymentMethodBreakdown() { return paymentMethodBreakdown; }
    public void setPaymentMethodBreakdown(String paymentMethodBreakdown) { this.paymentMethodBreakdown = paymentMethodBreakdown; }
    
    public String getGatewayBreakdown() { return gatewayBreakdown; }
    public void setGatewayBreakdown(String gatewayBreakdown) { this.gatewayBreakdown = gatewayBreakdown; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
