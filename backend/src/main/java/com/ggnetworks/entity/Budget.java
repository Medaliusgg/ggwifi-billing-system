package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "budgets")
public class Budget extends BaseEntity {

    @NotBlank(message = "Budget name is required")
    @Column(name = "budget_name", nullable = false)
    private String budgetName;

    @Column(name = "description")
    private String description;

    @NotNull(message = "Budget amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget amount must be greater than 0")
    @Column(name = "budget_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal budgetAmount;

    @Column(name = "spent_amount", precision = 15, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", precision = 15, scale = 2)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_type", nullable = false)
    private BudgetType budgetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_category", nullable = false)
    private BudgetCategory budgetCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BudgetStatus status = BudgetStatus.ACTIVE;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type")
    private RecurrenceType recurrenceType;

    @Column(name = "alert_threshold_percentage")
    private Integer alertThresholdPercentage = 80;

    @Column(name = "notes")
    private String notes;

    // Budget Type Enum
    public enum BudgetType {
        OPERATIONAL,      // Day-to-day operations
        CAPITAL,          // Long-term investments
        MARKETING,        // Advertising and promotions
        MAINTENANCE,      // Equipment and infrastructure
        SALARY,           // Employee compensation
        UTILITIES,        // Electricity, water, internet
        RENT,             // Office/equipment rental
        INSURANCE,        // Business insurance
        TAXES,            // Tax payments
        EMERGENCY,        // Emergency funds
        PROFIT_SHARING,   // Profit distribution
        INVESTMENT,       // Business investments
        SAVINGS,          // Business savings
        OTHER             // Miscellaneous
    }

    // Budget Category Enum
    public enum BudgetCategory {
        INCOME,           // Revenue streams
        EXPENSE,          // Cost categories
        PROFIT,           // Profit allocation
        SAVINGS,          // Savings allocation
        INVESTMENT        // Investment allocation
    }

    // Budget Status Enum
    public enum BudgetStatus {
        ACTIVE,           // Currently active
        COMPLETED,        // Budget period completed
        OVERSPENT,        // Exceeded budget limit
        SUSPENDED,        // Temporarily suspended
        CANCELLED         // Cancelled budget
    }

    // Recurrence Type Enum
    public enum RecurrenceType {
        DAILY,
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY,
        NONE
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        if (budgetAmount != null && spentAmount != null) {
            remainingAmount = budgetAmount.subtract(spentAmount);
        }
    }

    /**
     * Calculate budget utilization percentage
     */
    public BigDecimal getUtilizationPercentage() {
        if (budgetAmount == null || budgetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return spentAmount.multiply(BigDecimal.valueOf(100)).divide(budgetAmount, 2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Check if budget is over threshold
     */
    public boolean isOverThreshold() {
        return getUtilizationPercentage().compareTo(BigDecimal.valueOf(alertThresholdPercentage)) >= 0;
    }

    /**
     * Check if budget is overspent
     */
    public boolean isOverspent() {
        return remainingAmount != null && remainingAmount.compareTo(BigDecimal.ZERO) < 0;
    }

    /**
     * Check if budget is active
     */
    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return status == BudgetStatus.ACTIVE && 
               startDate != null && endDate != null &&
               now.isAfter(startDate) && now.isBefore(endDate);
    }
} 