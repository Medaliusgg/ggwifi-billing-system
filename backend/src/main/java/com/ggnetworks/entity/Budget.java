package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "budget_id", unique = true, nullable = false)
    private String budgetId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "budget_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetAmount;

    @Column(name = "spent_amount", precision = 10, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", precision = 10, scale = 2)
    private BigDecimal remainingAmount;

    @Column(name = "currency", nullable = false)
    private String currency = "TZS";

    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private BudgetCategory category;

    @Column(name = "budget_period", nullable = false)
    @Enumerated(EnumType.STRING)
    private BudgetPeriod budgetPeriod;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BudgetStatus status = BudgetStatus.ACTIVE;

    @Column(name = "alert_threshold")
    private Integer alertThreshold = 80; // Percentage

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum BudgetCategory {
        OPERATIONAL, EQUIPMENT, MAINTENANCE, UTILITIES, RENT, SALARIES, 
        MARKETING, TRANSPORT, COMMUNICATION, INSURANCE, TAXES, LEGAL,
        PROFESSIONAL_SERVICES, TRAINING, SOFTWARE, HARDWARE, CAPITAL_EXPENDITURE,
        EMERGENCY, GENERAL, OTHER
    }

    public enum BudgetPeriod {
        MONTHLY, QUARTERLY, YEARLY, CUSTOM
    }

    public enum BudgetStatus {
        ACTIVE, INACTIVE, COMPLETED, EXCEEDED, CANCELLED
    }

    // Constructors
    public Budget() {}

    public Budget(String budgetId, String name, BigDecimal budgetAmount, BudgetCategory category, 
                  BudgetPeriod budgetPeriod, LocalDateTime startDate, LocalDateTime endDate) {
        this.budgetId = budgetId;
        this.name = name;
        this.budgetAmount = budgetAmount;
        this.category = category;
        this.budgetPeriod = budgetPeriod;
        this.startDate = startDate;
        this.endDate = endDate;
        this.remainingAmount = budgetAmount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBudgetId() { return budgetId; }
    public void setBudgetId(String budgetId) { this.budgetId = budgetId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(BigDecimal budgetAmount) { this.budgetAmount = budgetAmount; }

    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BudgetCategory getCategory() { return category; }
    public void setCategory(BudgetCategory category) { this.category = category; }

    public BudgetPeriod getBudgetPeriod() { return budgetPeriod; }
    public void setBudgetPeriod(BudgetPeriod budgetPeriod) { this.budgetPeriod = budgetPeriod; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public BudgetStatus getStatus() { return status; }
    public void setStatus(BudgetStatus status) { this.status = status; }

    public Integer getAlertThreshold() { return alertThreshold; }
    public void setAlertThreshold(Integer alertThreshold) { this.alertThreshold = alertThreshold; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
