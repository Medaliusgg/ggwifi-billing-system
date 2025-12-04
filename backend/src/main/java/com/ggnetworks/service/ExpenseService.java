package com.ggnetworks.service;

import com.ggnetworks.entity.Expense;
import com.ggnetworks.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

/**
 * Expense Service
 * Manages expense tracking and reporting
 */
@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    /**
     * Create a new expense
     */
    public Expense createExpense(Expense expense) {
        if (expense.getExpenseId() == null || expense.getExpenseId().isEmpty()) {
            expense.setExpenseId("EXP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(LocalDateTime.now());
        }
        
        Expense savedExpense = expenseRepository.save(expense);
        
        // Update related budget if budgetId is provided
        // This can be enhanced to link expenses to budgets
        
        return savedExpense;
    }

    /**
     * Get expense by ID
     */
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    /**
     * Get expense by expense ID
     */
    public Optional<Expense> getExpenseByExpenseId(String expenseId) {
        return expenseRepository.findAll().stream()
            .filter(e -> e.getExpenseId().equals(expenseId))
            .findFirst();
    }

    /**
     * Get all expenses
     */
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    /**
     * Get expenses by status
     */
    public List<Expense> getExpensesByStatus(Expense.ExpenseStatus status) {
        return expenseRepository.findByStatus(status);
    }

    /**
     * Get expenses by category
     */
    public List<Expense> getExpensesByCategory(Expense.ExpenseCategory category) {
        return expenseRepository.findAll().stream()
            .filter(e -> e.getCategory() == category)
            .toList();
    }

    /**
     * Get expenses by date range
     */
    public List<Expense> getExpensesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findByStatusAndExpenseDateBetween(
            Expense.ExpenseStatus.APPROVED, startDate, endDate);
    }

    /**
     * Update expense
     */
    public Expense updateExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    /**
     * Approve expense
     */
    public Expense approveExpense(Long expenseId, String approvedBy) {
        Optional<Expense> expenseOpt = expenseRepository.findById(expenseId);
        if (expenseOpt.isEmpty()) {
            throw new RuntimeException("Expense not found");
        }
        
        Expense expense = expenseOpt.get();
        expense.setStatus(Expense.ExpenseStatus.APPROVED);
        expense.setApprovedBy(approvedBy);
        expense.setApprovedAt(LocalDateTime.now());
        
        return expenseRepository.save(expense);
    }

    /**
     * Reject expense
     */
    public Expense rejectExpense(Long expenseId, String rejectedBy, String reason) {
        Optional<Expense> expenseOpt = expenseRepository.findById(expenseId);
        if (expenseOpt.isEmpty()) {
            throw new RuntimeException("Expense not found");
        }
        
        Expense expense = expenseOpt.get();
        expense.setStatus(Expense.ExpenseStatus.REJECTED);
        expense.setRejectedBy(rejectedBy);
        expense.setRejectedAt(LocalDateTime.now());
        expense.setRejectionReason(reason);
        
        return expenseRepository.save(expense);
    }

    /**
     * Get expense statistics
     */
    public Map<String, Object> getExpenseStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Expense> allExpenses = expenseRepository.findAll();
        List<Expense> approvedExpenses = expenseRepository.findByStatus(Expense.ExpenseStatus.APPROVED);
        
        BigDecimal totalExpenses = approvedExpenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal pendingExpenses = expenseRepository.findByStatus(Expense.ExpenseStatus.PENDING).stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalExpenses", allExpenses.size());
        stats.put("approvedExpenses", approvedExpenses.size());
        stats.put("pendingExpenses", expenseRepository.findByStatus(Expense.ExpenseStatus.PENDING).size());
        stats.put("rejectedExpenses", expenseRepository.findByStatus(Expense.ExpenseStatus.REJECTED).size());
        stats.put("totalAmount", totalExpenses);
        stats.put("pendingAmount", pendingExpenses);
        
        return stats;
    }

    /**
     * Delete expense
     */
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}

