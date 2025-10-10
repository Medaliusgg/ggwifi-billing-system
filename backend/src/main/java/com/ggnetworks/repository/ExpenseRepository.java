package com.ggnetworks.repository;

import com.ggnetworks.entity.Budget;
import com.ggnetworks.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Find by budget
    List<Expense> findByBudgetAndDeletedAtIsNull(Budget budget);
    
    // Find by expense type
    List<Expense> findByExpenseTypeAndDeletedAtIsNull(Expense.ExpenseType expenseType);
    
    // Find by expense category
    List<Expense> findByExpenseCategoryAndDeletedAtIsNull(Expense.ExpenseCategory expenseCategory);
    
    // Find by payment method
    List<Expense> findByPaymentMethodAndDeletedAtIsNull(Expense.PaymentMethod paymentMethod);
    
    // Find by status
    List<Expense> findByStatusAndDeletedAtIsNull(Expense.ExpenseStatus status);
    
    // Find by expense date range
    List<Expense> findByExpenseDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by due date range
    List<Expense> findByDueDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by paid date range
    List<Expense> findByPaidDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find recurring expenses
    List<Expense> findByIsRecurringTrueAndDeletedAtIsNull();
    
    // Find by recurrence type
    List<Expense> findByRecurrenceTypeAndDeletedAtIsNull(Expense.RecurrenceType recurrenceType);
    
    // Find expenses requiring approval
    List<Expense> findByApprovalRequiredTrueAndDeletedAtIsNull();
    
    // Find by vendor name
    List<Expense> findByVendorNameAndDeletedAtIsNull(String vendorName);
    
    // Find by vendor name pattern
    @Query("SELECT e FROM Expense e WHERE e.vendorName LIKE %:pattern% AND e.deletedAt IS NULL")
    List<Expense> findByVendorNamePattern(@Param("pattern") String pattern);
    
    // Find by invoice number
    List<Expense> findByInvoiceNumberAndDeletedAtIsNull(String invoiceNumber);
    
    // Find by receipt number
    List<Expense> findByReceiptNumberAndDeletedAtIsNull(String receiptNumber);
    
    // Find expenses by title pattern
    @Query("SELECT e FROM Expense e WHERE e.expenseTitle LIKE %:pattern% AND e.deletedAt IS NULL")
    List<Expense> findByExpenseTitlePattern(@Param("pattern") String pattern);
    
    // Find expenses by description pattern
    @Query("SELECT e FROM Expense e WHERE e.description LIKE %:pattern% AND e.deletedAt IS NULL")
    List<Expense> findByDescriptionPattern(@Param("pattern") String pattern);
    
    // Find expenses with pagination
    Page<Expense> findByDeletedAtIsNull(Pageable pageable);
    
    // Find expenses by budget with pagination
    Page<Expense> findByBudgetAndDeletedAtIsNull(Budget budget, Pageable pageable);
    
    // Find expenses by type with pagination
    Page<Expense> findByExpenseTypeAndDeletedAtIsNull(Expense.ExpenseType expenseType, Pageable pageable);
    
    // Find expenses by category with pagination
    Page<Expense> findByExpenseCategoryAndDeletedAtIsNull(Expense.ExpenseCategory expenseCategory, Pageable pageable);
    
    // Find expenses by status with pagination
    Page<Expense> findByStatusAndDeletedAtIsNull(Expense.ExpenseStatus status, Pageable pageable);
    
    // Count by expense type
    long countByExpenseTypeAndDeletedAtIsNull(Expense.ExpenseType expenseType);
    
    // Count by expense category
    long countByExpenseCategoryAndDeletedAtIsNull(Expense.ExpenseCategory expenseCategory);
    
    // Count by payment method
    long countByPaymentMethodAndDeletedAtIsNull(Expense.PaymentMethod paymentMethod);
    
    // Count by status
    long countByStatusAndDeletedAtIsNull(Expense.ExpenseStatus status);
    
    // Count recurring expenses
    long countByIsRecurringTrueAndDeletedAtIsNull();
    
    // Count expenses requiring approval
    long countByApprovalRequiredTrueAndDeletedAtIsNull();
    
    // Find expenses by type and category
    List<Expense> findByExpenseTypeAndExpenseCategoryAndDeletedAtIsNull(
            Expense.ExpenseType expenseType, Expense.ExpenseCategory expenseCategory);
    
    // Find expenses by type and status
    List<Expense> findByExpenseTypeAndStatusAndDeletedAtIsNull(
            Expense.ExpenseType expenseType, Expense.ExpenseStatus status);
    
    // Find expenses by category and status
    List<Expense> findByExpenseCategoryAndStatusAndDeletedAtIsNull(
            Expense.ExpenseCategory expenseCategory, Expense.ExpenseStatus status);
    
    // Find expenses by payment method and status
    List<Expense> findByPaymentMethodAndStatusAndDeletedAtIsNull(
            Expense.PaymentMethod paymentMethod, Expense.ExpenseStatus status);
    
    // Find expenses by amount range
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.amount BETWEEN :minAmount AND :maxAmount")
    List<Expense> findByAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                   @Param("maxAmount") BigDecimal maxAmount);
    
    // Find expenses by total amount range
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.totalAmount BETWEEN :minAmount AND :maxAmount")
    List<Expense> findByTotalAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                        @Param("maxAmount") BigDecimal maxAmount);
    
    // Find overdue expenses
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.dueDate < :now AND e.status != 'PAID' AND e.status != 'CANCELLED'")
    List<Expense> findOverdueExpenses(@Param("now") LocalDateTime now);
    
    // Find expenses by approved by
    List<Expense> findByApprovedByAndDeletedAtIsNull(String approvedBy);
    
    // Find expenses by approval date range
    List<Expense> findByApprovedAtBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Get expense statistics
    @Query("SELECT COUNT(e) as totalExpenses, " +
           "COUNT(CASE WHEN e.status = 'PENDING' THEN 1 END) as pendingExpenses, " +
           "COUNT(CASE WHEN e.status = 'APPROVED' THEN 1 END) as approvedExpenses, " +
           "COUNT(CASE WHEN e.status = 'PAID' THEN 1 END) as paidExpenses, " +
           "COUNT(CASE WHEN e.status = 'OVERDUE' THEN 1 END) as overdueExpenses, " +
           "SUM(e.amount) as totalAmount, " +
           "SUM(e.totalAmount) as totalAmountWithTax, " +
           "AVG(e.amount) as avgAmount " +
           "FROM Expense e WHERE e.deletedAt IS NULL")
    Object[] getExpenseStatistics();
    
    // Get expense statistics by budget
    @Query("SELECT COUNT(e) as totalExpenses, " +
           "SUM(e.amount) as totalAmount, " +
           "SUM(e.totalAmount) as totalAmountWithTax, " +
           "AVG(e.amount) as avgAmount " +
           "FROM Expense e WHERE e.budget = :budget AND e.deletedAt IS NULL")
    Object[] getExpenseStatisticsByBudget(@Param("budget") Budget budget);
    
    // Get expense statistics by type
    @Query("SELECT COUNT(e) as totalExpenses, " +
           "SUM(e.amount) as totalAmount, " +
           "SUM(e.totalAmount) as totalAmountWithTax, " +
           "AVG(e.amount) as avgAmount " +
           "FROM Expense e WHERE e.expenseType = :expenseType AND e.deletedAt IS NULL")
    Object[] getExpenseStatisticsByType(@Param("expenseType") Expense.ExpenseType expenseType);
    
    // Get expense statistics by category
    @Query("SELECT COUNT(e) as totalExpenses, " +
           "SUM(e.amount) as totalAmount, " +
           "SUM(e.totalAmount) as totalAmountWithTax, " +
           "AVG(e.amount) as avgAmount " +
           "FROM Expense e WHERE e.expenseCategory = :expenseCategory AND e.deletedAt IS NULL")
    Object[] getExpenseStatisticsByCategory(@Param("expenseCategory") Expense.ExpenseCategory expenseCategory);
    
    // Find expenses by date range with status
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND " +
           "e.expenseDate >= :startDate AND e.expenseDate <= :endDate AND e.status = :status")
    List<Expense> findByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate, 
                                          @Param("status") Expense.ExpenseStatus status);
    
    // Find expenses by vendor and date range
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND " +
           "e.vendorName = :vendorName AND e.expenseDate BETWEEN :startDate AND :endDate")
    List<Expense> findByVendorAndDateRange(@Param("vendorName") String vendorName, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    // Find high-value expenses
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.amount >= :minAmount ORDER BY e.amount DESC")
    List<Expense> findHighValueExpenses(@Param("minAmount") BigDecimal minAmount);
    
    // Find expenses with tax
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.taxAmount > 0")
    List<Expense> findExpensesWithTax();
    
    // Find expenses with discounts
    @Query("SELECT e FROM Expense e WHERE e.deletedAt IS NULL AND e.discountAmount > 0")
    List<Expense> findExpensesWithDiscounts();
} 