package com.ggnetworks.repository;

import com.ggnetworks.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    Optional<Expense> findByExpenseId(String expenseId);
    
    List<Expense> findByCategory(Expense.ExpenseCategory category);
    
    List<Expense> findByStatus(Expense.ExpenseStatus status);
    
    List<Expense> findByPaymentMethod(Expense.PaymentMethod paymentMethod);
    
    List<Expense> findByVendor(String vendor);
    
    List<Expense> findByCreatedBy(String createdBy);
    
    List<Expense> findByExpenseDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Expense> findByIsRecurring(Boolean isRecurring);
    
    List<Expense> findByCurrency(String currency);
    
    List<Expense> findByTitleContainingIgnoreCase(String title);
    
    List<Expense> findByDescriptionContainingIgnoreCase(String description);
    
    boolean existsByExpenseId(String expenseId);
    
    long countByCategory(Expense.ExpenseCategory category);
    
    long countByStatus(Expense.ExpenseStatus status);
    
    long countByExpenseDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByIsRecurring(Boolean isRecurring);
    
    List<Expense> findByStatusAndExpenseDateBetween(Expense.ExpenseStatus status, LocalDateTime startDate, LocalDateTime endDate);
}
