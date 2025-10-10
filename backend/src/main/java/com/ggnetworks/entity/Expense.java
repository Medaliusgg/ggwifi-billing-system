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
@Table(name = "expenses")
public class Expense extends BaseEntity {

    @NotBlank(message = "Expense title is required")
    @Column(name = "expense_title", nullable = false)
    private String expenseTitle;

    @Column(name = "description")
    private String description;

    @NotNull(message = "Expense amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Expense amount must be greater than 0")
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id")
    private Budget budget;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    private ExpenseType expenseType;

    @Enumerated(EnumType.STRING)
    @Column(name = "expense_category", nullable = false)
    private ExpenseCategory expenseCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ExpenseStatus status = ExpenseStatus.PENDING;

    @Column(name = "expense_date", nullable = false)
    private LocalDateTime expenseDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "paid_date")
    private LocalDateTime paidDate;

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(name = "vendor_contact")
    private String vendorContact;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type")
    private RecurrenceType recurrenceType;

    @Column(name = "approval_required")
    private Boolean approvalRequired = false;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "notes")
    private String notes;

    // Expense Type Enum
    public enum ExpenseType {
        OPERATIONAL,      // Day-to-day operations
        CAPITAL,          // Long-term investments
        MARKETING,        // Advertising and promotions
        MAINTENANCE,      // Equipment and infrastructure
        SALARY,           // Employee compensation
        UTILITIES,        // Electricity, water, internet
        RENT,             // Office/equipment rental
        INSURANCE,        // Business insurance
        TAXES,            // Tax payments
        TRAVEL,           // Business travel
        OFFICE_SUPPLIES,  // Office supplies
        SOFTWARE,         // Software licenses
        HARDWARE,         // Computer equipment
        TRAINING,         // Employee training
        LEGAL,            // Legal services
        CONSULTING,       // Consulting services
        OTHER             // Miscellaneous
    }

    // Expense Category Enum
    public enum ExpenseCategory {
        FIXED,            // Fixed monthly expenses
        VARIABLE,         // Variable expenses
        ONE_TIME,         // One-time expenses
        EMERGENCY,        // Emergency expenses
        INVESTMENT,       // Investment expenses
        MAINTENANCE,      // Maintenance expenses
        UPGRADE,          // Upgrade expenses
        REPAIR,           // Repair expenses
        REPLACEMENT       // Replacement expenses
    }

    // Payment Method Enum
    public enum PaymentMethod {
        CASH,
        BANK_TRANSFER,
        CHECK,
        CREDIT_CARD,
        DEBIT_CARD,
        MOBILE_MONEY,
        PAYPAL,
        WIRE_TRANSFER,
        OTHER
    }

    // Expense Status Enum
    public enum ExpenseStatus {
        PENDING,          // Awaiting approval
        APPROVED,         // Approved for payment
        PAID,             // Payment completed
        REJECTED,         // Rejected
        CANCELLED,        // Cancelled
        OVERDUE           // Past due date
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
        if (amount != null && taxAmount != null && discountAmount != null) {
            totalAmount = amount.add(taxAmount).subtract(discountAmount);
        }
    }

    /**
     * Calculate total amount including tax and discounts
     */
    public BigDecimal getTotalAmount() {
        if (totalAmount != null) {
            return totalAmount;
        }
        if (amount != null) {
            BigDecimal total = amount;
            if (taxAmount != null) {
                total = total.add(taxAmount);
            }
            if (discountAmount != null) {
                total = total.subtract(discountAmount);
            }
            return total;
        }
        return BigDecimal.ZERO;
    }

    /**
     * Check if expense is overdue
     */
    public boolean isOverdue() {
        return dueDate != null && LocalDateTime.now().isAfter(dueDate) && 
               status != ExpenseStatus.PAID && status != ExpenseStatus.CANCELLED;
    }

    /**
     * Check if expense is paid
     */
    public boolean isPaid() {
        return status == ExpenseStatus.PAID;
    }

    /**
     * Check if expense requires approval
     */
    public boolean requiresApproval() {
        return approvalRequired && status == ExpenseStatus.PENDING;
    }

    /**
     * Check if expense is approved
     */
    public boolean isApproved() {
        return status == ExpenseStatus.APPROVED || status == ExpenseStatus.PAID;
    }
} 