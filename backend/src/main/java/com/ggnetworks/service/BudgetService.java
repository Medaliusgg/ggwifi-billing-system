package com.ggnetworks.service;

import com.ggnetworks.entity.Budget;
import com.ggnetworks.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

/**
 * Budget Service
 * Manages budget planning and tracking
 */
@Service
@Transactional
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    /**
     * Create a new budget
     */
    public Budget createBudget(Budget budget) {
        if (budget.getBudgetId() == null || budget.getBudgetId().isEmpty()) {
            budget.setBudgetId("BUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        if (budget.getRemainingAmount() == null) {
            budget.setRemainingAmount(budget.getBudgetAmount());
        }
        
        return budgetRepository.save(budget);
    }

    /**
     * Get budget by ID
     */
    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    /**
     * Get budget by budget ID
     */
    public Optional<Budget> getBudgetByBudgetId(String budgetId) {
        return budgetRepository.findAll().stream()
            .filter(b -> b.getBudgetId().equals(budgetId))
            .findFirst();
    }

    /**
     * Get all budgets
     */
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    /**
     * Get budgets by status
     */
    public List<Budget> getBudgetsByStatus(Budget.BudgetStatus status) {
        return budgetRepository.findByStatus(status);
    }

    /**
     * Get active budgets
     */
    public List<Budget> getActiveBudgets() {
        return budgetRepository.findByStatus(Budget.BudgetStatus.ACTIVE);
    }

    /**
     * Update budget
     */
    public Budget updateBudget(Budget budget) {
        // Recalculate remaining amount
        budget.setRemainingAmount(budget.getBudgetAmount().subtract(budget.getSpentAmount()));
        
        // Check if budget is exceeded
        if (budget.getSpentAmount().compareTo(budget.getBudgetAmount()) > 0) {
            budget.setStatus(Budget.BudgetStatus.EXCEEDED);
        }
        
        return budgetRepository.save(budget);
    }

    /**
     * Update spent amount
     */
    public Budget updateSpentAmount(Long budgetId, BigDecimal amount) {
        Optional<Budget> budgetOpt = budgetRepository.findById(budgetId);
        if (budgetOpt.isEmpty()) {
            throw new RuntimeException("Budget not found");
        }
        
        Budget budget = budgetOpt.get();
        budget.setSpentAmount(budget.getSpentAmount().add(amount));
        budget.setRemainingAmount(budget.getBudgetAmount().subtract(budget.getSpentAmount()));
        
        // Check threshold
        double percentage = budget.getSpentAmount().divide(budget.getBudgetAmount(), 4, java.math.RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100)).doubleValue();
        
        if (percentage >= budget.getAlertThreshold()) {
            // Trigger alert (can be implemented with notification service)
            System.out.println("Budget alert: " + budget.getName() + " has reached " + percentage + "%");
        }
        
        // Check if exceeded
        if (budget.getSpentAmount().compareTo(budget.getBudgetAmount()) > 0) {
            budget.setStatus(Budget.BudgetStatus.EXCEEDED);
        }
        
        return budgetRepository.save(budget);
    }

    /**
     * Get budget statistics
     */
    public Map<String, Object> getBudgetStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Budget> allBudgets = budgetRepository.findAll();
        List<Budget> activeBudgets = budgetRepository.findByStatus(Budget.BudgetStatus.ACTIVE);
        
        BigDecimal totalBudget = allBudgets.stream()
            .map(Budget::getBudgetAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalSpent = allBudgets.stream()
            .map(Budget::getSpentAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalRemaining = allBudgets.stream()
            .map(Budget::getRemainingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalBudgets", allBudgets.size());
        stats.put("activeBudgets", activeBudgets.size());
        stats.put("totalBudgetAmount", totalBudget);
        stats.put("totalSpentAmount", totalSpent);
        stats.put("totalRemainingAmount", totalRemaining);
        stats.put("utilizationPercentage", totalBudget.compareTo(BigDecimal.ZERO) > 0 ?
            totalSpent.divide(totalBudget, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100)).doubleValue() : 0);
        
        return stats;
    }

    /**
     * Delete budget
     */
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}

