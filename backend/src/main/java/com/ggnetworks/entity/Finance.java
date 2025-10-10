package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "finances")
public class Finance extends BaseEntity {

    @NotNull(message = "Amount is required")
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private FinanceType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private FinanceCategory category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "reference_number", unique = true)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FinanceStatus status = FinanceStatus.COMPLETED;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "net_amount", precision = 15, scale = 2)
    private BigDecimal netAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum FinanceType {
        INCOME, EXPENSE, REFUND, ADJUSTMENT, TRANSFER
    }

    public enum FinanceCategory {
        // Income Categories
        HOTSPOT_SALES, PPPOE_SUBSCRIPTIONS, INSTALLATION_FEES, STATIC_IP_FEES,
        EQUIPMENT_SALES, CONSULTATION_FEES, MAINTENANCE_FEES,
        
        // Expense Categories
        EQUIPMENT_PURCHASE, INFRASTRUCTURE_MAINTENANCE, STAFF_SALARIES,
        UTILITIES, RENT, INSURANCE, MARKETING, SOFTWARE_LICENSES,
        INTERNET_BANDWIDTH, TECHNICAL_SUPPORT, ADMINISTRATIVE
    }

    public enum FinanceStatus {
        PENDING, COMPLETED, CANCELLED, REFUNDED, DISPUTED
    }

    public boolean isIncome() {
        return type == FinanceType.INCOME;
    }

    public boolean isExpense() {
        return type == FinanceType.EXPENSE;
    }

    public boolean isCompleted() {
        return status == FinanceStatus.COMPLETED;
    }

    public BigDecimal getNetAmount() {
        if (netAmount != null) {
            return netAmount;
        }
        
        BigDecimal total = amount;
        if (taxAmount != null) {
            total = total.add(taxAmount);
        }
        if (discountAmount != null) {
            total = total.subtract(discountAmount);
        }
        return total;
    }
} 