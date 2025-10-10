package com.ggnetworks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "financial_reports")
public class FinancialReport extends BaseEntity {

    @Column(name = "report_name", nullable = false)
    private String reportName;

    @Column(name = "report_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    @Column(name = "period_start", nullable = false)
    private LocalDateTime periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDateTime periodEnd;

    @Column(name = "total_revenue", precision = 15, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_expenses", precision = 15, scale = 2)
    private BigDecimal totalExpenses = BigDecimal.ZERO;

    @Column(name = "gross_profit", precision = 15, scale = 2)
    private BigDecimal grossProfit = BigDecimal.ZERO;

    @Column(name = "net_profit", precision = 15, scale = 2)
    private BigDecimal netProfit = BigDecimal.ZERO;

    @Column(name = "total_savings", precision = 15, scale = 2)
    private BigDecimal totalSavings = BigDecimal.ZERO;

    @Column(name = "total_investments", precision = 15, scale = 2)
    private BigDecimal totalInvestments = BigDecimal.ZERO;

    @Column(name = "operating_expenses", precision = 15, scale = 2)
    private BigDecimal operatingExpenses = BigDecimal.ZERO;

    @Column(name = "capital_expenses", precision = 15, scale = 2)
    private BigDecimal capitalExpenses = BigDecimal.ZERO;

    @Column(name = "marketing_expenses", precision = 15, scale = 2)
    private BigDecimal marketingExpenses = BigDecimal.ZERO;

    @Column(name = "maintenance_expenses", precision = 15, scale = 2)
    private BigDecimal maintenanceExpenses = BigDecimal.ZERO;

    @Column(name = "salary_expenses", precision = 15, scale = 2)
    private BigDecimal salaryExpenses = BigDecimal.ZERO;

    @Column(name = "utility_expenses", precision = 15, scale = 2)
    private BigDecimal utilityExpenses = BigDecimal.ZERO;

    @Column(name = "rent_expenses", precision = 15, scale = 2)
    private BigDecimal rentExpenses = BigDecimal.ZERO;

    @Column(name = "insurance_expenses", precision = 15, scale = 2)
    private BigDecimal insuranceExpenses = BigDecimal.ZERO;

    @Column(name = "tax_expenses", precision = 15, scale = 2)
    private BigDecimal taxExpenses = BigDecimal.ZERO;

    @Column(name = "profit_margin_percentage", precision = 5, scale = 2)
    private BigDecimal profitMarginPercentage = BigDecimal.ZERO;

    @Column(name = "expense_ratio_percentage", precision = 5, scale = 2)
    private BigDecimal expenseRatioPercentage = BigDecimal.ZERO;

    @Column(name = "savings_rate_percentage", precision = 5, scale = 2)
    private BigDecimal savingsRatePercentage = BigDecimal.ZERO;

    @Column(name = "investment_rate_percentage", precision = 5, scale = 2)
    private BigDecimal investmentRatePercentage = BigDecimal.ZERO;

    @Column(name = "cash_flow", precision = 15, scale = 2)
    private BigDecimal cashFlow = BigDecimal.ZERO;

    @Column(name = "budget_variance", precision = 15, scale = 2)
    private BigDecimal budgetVariance = BigDecimal.ZERO;

    @Column(name = "budget_utilization_percentage", precision = 5, scale = 2)
    private BigDecimal budgetUtilizationPercentage = BigDecimal.ZERO;

    @Column(name = "is_generated", nullable = false)
    private Boolean isGenerated = false;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "generated_by")
    private String generatedBy;

    @Column(name = "notes")
    private String notes;

    // Report Type Enum
    public enum ReportType {
        DAILY,           // Daily financial summary
        WEEKLY,          // Weekly financial summary
        MONTHLY,         // Monthly financial summary
        QUARTERLY,       // Quarterly financial summary
        YEARLY,          // Annual financial summary
        CUSTOM           // Custom period report
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        super.onUpdate();
        calculateFinancialMetrics();
    }

    /**
     * Calculate all financial metrics
     */
    public void calculateFinancialMetrics() {
        // Calculate gross profit
        if (totalRevenue != null && totalExpenses != null) {
            grossProfit = totalRevenue.subtract(totalExpenses);
        }

        // Calculate net profit (gross profit - taxes)
        if (grossProfit != null && taxExpenses != null) {
            netProfit = grossProfit.subtract(taxExpenses);
        }

        // Calculate profit margin percentage
        if (totalRevenue != null && netProfit != null && totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            profitMarginPercentage = netProfit.multiply(BigDecimal.valueOf(100))
                    .divide(totalRevenue, 2, BigDecimal.ROUND_HALF_UP);
        }

        // Calculate expense ratio percentage
        if (totalRevenue != null && totalExpenses != null && totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            expenseRatioPercentage = totalExpenses.multiply(BigDecimal.valueOf(100))
                    .divide(totalRevenue, 2, BigDecimal.ROUND_HALF_UP);
        }

        // Calculate savings rate percentage
        if (netProfit != null && totalSavings != null && netProfit.compareTo(BigDecimal.ZERO) > 0) {
            savingsRatePercentage = totalSavings.multiply(BigDecimal.valueOf(100))
                    .divide(netProfit, 2, BigDecimal.ROUND_HALF_UP);
        }

        // Calculate investment rate percentage
        if (netProfit != null && totalInvestments != null && netProfit.compareTo(BigDecimal.ZERO) > 0) {
            investmentRatePercentage = totalInvestments.multiply(BigDecimal.valueOf(100))
                    .divide(netProfit, 2, BigDecimal.ROUND_HALF_UP);
        }

        // Calculate cash flow
        if (netProfit != null && totalSavings != null && totalInvestments != null) {
            cashFlow = netProfit.subtract(totalSavings).subtract(totalInvestments);
        }
    }

    /**
     * Check if report is for current period
     */
    public boolean isCurrentPeriod() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(periodStart) && now.isBefore(periodEnd);
    }

    /**
     * Check if report is overdue
     */
    public boolean isOverdue() {
        return periodEnd != null && LocalDateTime.now().isAfter(periodEnd) && !isGenerated;
    }

    /**
     * Get report duration in days
     */
    public long getDurationInDays() {
        if (periodStart != null && periodEnd != null) {
            return java.time.Duration.between(periodStart, periodEnd).toDays();
        }
        return 0;
    }

    /**
     * Calculate budget variance percentage
     */
    public BigDecimal getBudgetVariancePercentage() {
        if (totalExpenses != null && budgetVariance != null && totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
            return budgetVariance.multiply(BigDecimal.valueOf(100))
                    .divide(totalExpenses, 2, BigDecimal.ROUND_HALF_UP);
        }
        return BigDecimal.ZERO;
    }
} 