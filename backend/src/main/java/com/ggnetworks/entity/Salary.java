package com.ggnetworks.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salaries")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "salary_id", unique = true, nullable = false)
    private String salaryId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "employee_position")
    private String employeePosition;

    @Column(name = "department")
    private String department;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "base_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseSalary;

    @Column(name = "allowances", precision = 10, scale = 2)
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "overtime_pay", precision = 10, scale = 2)
    private BigDecimal overtimePay = BigDecimal.ZERO;

    @Column(name = "bonus", precision = 10, scale = 2)
    private BigDecimal bonus = BigDecimal.ZERO;

    @Column(name = "deductions", precision = 10, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "net_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "currency", nullable = false)
    private String currency = "TZS";

    @Column(name = "pay_period", nullable = false)
    @Enumerated(EnumType.STRING)
    private PayPeriod payPeriod;

    @Column(name = "salary_month", nullable = false)
    private String salaryMonth; // Format: YYYY-MM

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SalaryStatus status = SalaryStatus.PENDING;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "mobile_money_number")
    private String mobileMoneyNumber;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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
    public enum PayPeriod {
        MONTHLY, WEEKLY, BI_WEEKLY, QUARTERLY, ANNUAL
    }

    public enum SalaryStatus {
        PENDING, APPROVED, PROCESSED, PAID, CANCELLED, ON_HOLD
    }

    public enum PaymentMethod {
        BANK_TRANSFER, MPESA, TIGO_PESA, AIRTEL_MONEY, HALOPESA, CASH, CHECK
    }

    // Constructors
    public Salary() {}

    public Salary(String salaryId, Long employeeId, String employeeName, BigDecimal baseSalary, 
                  PayPeriod payPeriod, String salaryMonth) {
        this.salaryId = salaryId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.baseSalary = baseSalary;
        this.payPeriod = payPeriod;
        this.salaryMonth = salaryMonth;
        this.netSalary = baseSalary; // Will be calculated
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSalaryId() { return salaryId; }
    public void setSalaryId(String salaryId) { this.salaryId = salaryId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeePosition() { return employeePosition; }
    public void setEmployeePosition(String employeePosition) { this.employeePosition = employeePosition; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getOvertimePay() { return overtimePay; }
    public void setOvertimePay(BigDecimal overtimePay) { this.overtimePay = overtimePay; }

    public BigDecimal getBonus() { return bonus; }
    public void setBonus(BigDecimal bonus) { this.bonus = bonus; }

    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PayPeriod getPayPeriod() { return payPeriod; }
    public void setPayPeriod(PayPeriod payPeriod) { this.payPeriod = payPeriod; }

    public String getSalaryMonth() { return salaryMonth; }
    public void setSalaryMonth(String salaryMonth) { this.salaryMonth = salaryMonth; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public SalaryStatus getStatus() { return status; }
    public void setStatus(SalaryStatus status) { this.status = status; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public String getMobileMoneyNumber() { return mobileMoneyNumber; }
    public void setMobileMoneyNumber(String mobileMoneyNumber) { this.mobileMoneyNumber = mobileMoneyNumber; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
