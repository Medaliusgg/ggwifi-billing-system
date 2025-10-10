package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final PaymentRepository paymentRepository;
    private final FinanceRepository financeRepository;

    // ==================== BUDGET MANAGEMENT ====================

    /**
     * Create a new budget
     */
    @Transactional
    public Budget createBudget(Budget budget) {
        try {
            // Set initial remaining amount
            if (budget.getBudgetAmount() != null) {
                budget.setRemainingAmount(budget.getBudgetAmount());
            }
            
            Budget savedBudget = budgetRepository.save(budget);
            log.info("Created budget: {} with amount: {}", savedBudget.getBudgetName(), savedBudget.getBudgetAmount());
            return savedBudget;
        } catch (Exception e) {
            log.error("Failed to create budget: {}", budget.getBudgetName(), e);
            throw new RuntimeException("Failed to create budget", e);
        }
    }

    /**
     * Update budget
     */
    @Transactional
    public Budget updateBudget(Long budgetId, Budget updatedBudget) {
        try {
            Budget existingBudget = budgetRepository.findById(budgetId)
                    .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
            
            // Update fields
            existingBudget.setBudgetName(updatedBudget.getBudgetName());
            existingBudget.setDescription(updatedBudget.getDescription());
            existingBudget.setBudgetAmount(updatedBudget.getBudgetAmount());
            existingBudget.setBudgetType(updatedBudget.getBudgetType());
            existingBudget.setBudgetCategory(updatedBudget.getBudgetCategory());
            existingBudget.setStatus(updatedBudget.getStatus());
            existingBudget.setStartDate(updatedBudget.getStartDate());
            existingBudget.setEndDate(updatedBudget.getEndDate());
            existingBudget.setIsRecurring(updatedBudget.getIsRecurring());
            existingBudget.setRecurrenceType(updatedBudget.getRecurrenceType());
            existingBudget.setAlertThresholdPercentage(updatedBudget.getAlertThresholdPercentage());
            existingBudget.setNotes(updatedBudget.getNotes());
            
            Budget savedBudget = budgetRepository.save(existingBudget);
            log.info("Updated budget: {} with amount: {}", savedBudget.getBudgetName(), savedBudget.getBudgetAmount());
            return savedBudget;
        } catch (Exception e) {
            log.error("Failed to update budget: {}", budgetId, e);
            throw new RuntimeException("Failed to update budget", e);
        }
    }

    /**
     * Update budget spent amount
     */
    @Transactional
    public Budget updateBudgetSpentAmount(Long budgetId, BigDecimal spentAmount) {
        try {
            Budget budget = budgetRepository.findById(budgetId)
                    .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
            
            budget.setSpentAmount(spentAmount);
            
            // Update status based on spending
            if (budget.isOverspent()) {
                budget.setStatus(Budget.BudgetStatus.OVERSPENT);
            } else if (budget.isOverThreshold()) {
                // Keep as ACTIVE but log warning
                log.warn("Budget {} is over threshold: {}%", budget.getBudgetName(), budget.getUtilizationPercentage());
            }
            
            Budget savedBudget = budgetRepository.save(budget);
            log.info("Updated budget spent amount: {} - Spent: {}, Remaining: {}", 
                    savedBudget.getBudgetName(), savedBudget.getSpentAmount(), savedBudget.getRemainingAmount());
            return savedBudget;
        } catch (Exception e) {
            log.error("Failed to update budget spent amount: {}", budgetId, e);
            throw new RuntimeException("Failed to update budget spent amount", e);
        }
    }

    /**
     * Get budget by ID
     */
    public Budget getBudgetById(Long budgetId) {
        try {
            return budgetRepository.findById(budgetId)
                    .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        } catch (Exception e) {
            log.error("Failed to get budget: {}", budgetId, e);
            throw new RuntimeException("Failed to get budget", e);
        }
    }

    /**
     * Get all budgets with pagination
     */
    public Page<Budget> getAllBudgets(Pageable pageable) {
        try {
            return budgetRepository.findByDeletedAtIsNull(pageable);
        } catch (Exception e) {
            log.error("Failed to get all budgets", e);
            throw new RuntimeException("Failed to get all budgets", e);
        }
    }

    /**
     * Get budgets by type
     */
    public List<Budget> getBudgetsByType(Budget.BudgetType budgetType) {
        try {
            return budgetRepository.findByBudgetTypeAndDeletedAtIsNull(budgetType);
        } catch (Exception e) {
            log.error("Failed to get budgets by type: {}", budgetType, e);
            throw new RuntimeException("Failed to get budgets by type", e);
        }
    }

    /**
     * Get budgets by category
     */
    public List<Budget> getBudgetsByCategory(Budget.BudgetCategory budgetCategory) {
        try {
            return budgetRepository.findByBudgetCategoryAndDeletedAtIsNull(budgetCategory);
        } catch (Exception e) {
            log.error("Failed to get budgets by category: {}", budgetCategory, e);
            throw new RuntimeException("Failed to get budgets by category", e);
        }
    }

    /**
     * Get active budgets
     */
    public List<Budget> getActiveBudgets() {
        try {
            return budgetRepository.findByStatusAndDeletedAtIsNull(Budget.BudgetStatus.ACTIVE);
        } catch (Exception e) {
            log.error("Failed to get active budgets", e);
            throw new RuntimeException("Failed to get active budgets", e);
        }
    }

    /**
     * Get overspent budgets
     */
    public List<Budget> getOverspentBudgets() {
        try {
            return budgetRepository.findOverspentBudgets();
        } catch (Exception e) {
            log.error("Failed to get overspent budgets", e);
            throw new RuntimeException("Failed to get overspent budgets", e);
        }
    }

    /**
     * Get budgets over threshold
     */
    public List<Budget> getBudgetsOverThreshold() {
        try {
            return budgetRepository.findBudgetsOverThreshold();
        } catch (Exception e) {
            log.error("Failed to get budgets over threshold", e);
            throw new RuntimeException("Failed to get budgets over threshold", e);
        }
    }

    // ==================== BUDGET ANALYTICS ====================

    /**
     * Get budget statistics
     */
    public Map<String, Object> getBudgetStatistics() {
        try {
            Object[] stats = budgetRepository.getBudgetStatistics();
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalBudgets", stats[0]);
            statistics.put("activeBudgets", stats[1]);
            statistics.put("completedBudgets", stats[2]);
            statistics.put("overspentBudgets", stats[3]);
            statistics.put("totalBudgetAmount", stats[4]);
            statistics.put("totalSpentAmount", stats[5]);
            statistics.put("avgBudgetAmount", stats[6]);
            
            // Calculate additional metrics
            BigDecimal totalBudgetAmount = (BigDecimal) stats[4];
            BigDecimal totalSpentAmount = (BigDecimal) stats[5];
            
            if (totalBudgetAmount != null && totalBudgetAmount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal utilizationPercentage = totalSpentAmount.multiply(BigDecimal.valueOf(100))
                        .divide(totalBudgetAmount, 2, BigDecimal.ROUND_HALF_UP);
                statistics.put("overallUtilizationPercentage", utilizationPercentage);
            }
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get budget statistics", e);
            throw new RuntimeException("Failed to get budget statistics", e);
        }
    }

    /**
     * Get budget statistics by type
     */
    public Map<String, Object> getBudgetStatisticsByType(Budget.BudgetType budgetType) {
        try {
            Object[] stats = budgetRepository.getBudgetStatisticsByType(budgetType);
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalBudgets", stats[0]);
            statistics.put("totalBudgetAmount", stats[1]);
            statistics.put("totalSpentAmount", stats[2]);
            statistics.put("avgBudgetAmount", stats[3]);
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get budget statistics by type: {}", budgetType, e);
            throw new RuntimeException("Failed to get budget statistics by type", e);
        }
    }

    /**
     * Get budget statistics by category
     */
    public Map<String, Object> getBudgetStatisticsByCategory(Budget.BudgetCategory budgetCategory) {
        try {
            Object[] stats = budgetRepository.getBudgetStatisticsByCategory(budgetCategory);
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalBudgets", stats[0]);
            statistics.put("totalBudgetAmount", stats[1]);
            statistics.put("totalSpentAmount", stats[2]);
            statistics.put("avgBudgetAmount", stats[3]);
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get budget statistics by category: {}", budgetCategory, e);
            throw new RuntimeException("Failed to get budget statistics by category", e);
        }
    }

    // ==================== PROFIT TRACKING ====================

    /**
     * Calculate profit from budgets
     */
    public Map<String, Object> calculateProfitFromBudgets() {
        try {
            // Get income budgets
            List<Budget> incomeBudgets = budgetRepository.findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory.INCOME);
            BigDecimal totalIncome = incomeBudgets.stream()
                    .map(Budget::getSpentAmount)
                    .filter(amount -> amount != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Get expense budgets
            List<Budget> expenseBudgets = budgetRepository.findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory.EXPENSE);
            BigDecimal totalExpenses = expenseBudgets.stream()
                    .map(Budget::getSpentAmount)
                    .filter(amount -> amount != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate profit
            BigDecimal grossProfit = totalIncome.subtract(totalExpenses);
            
            // Get savings and investment budgets
            List<Budget> savingsBudgets = budgetRepository.findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory.SAVINGS);
            BigDecimal totalSavings = savingsBudgets.stream()
                    .map(Budget::getSpentAmount)
                    .filter(amount -> amount != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            List<Budget> investmentBudgets = budgetRepository.findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory.INVESTMENT);
            BigDecimal totalInvestments = investmentBudgets.stream()
                    .map(Budget::getSpentAmount)
                    .filter(amount -> amount != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Map<String, Object> profitData = new HashMap<>();
            profitData.put("totalIncome", totalIncome);
            profitData.put("totalExpenses", totalExpenses);
            profitData.put("grossProfit", grossProfit);
            profitData.put("totalSavings", totalSavings);
            profitData.put("totalInvestments", totalInvestments);
            profitData.put("netProfit", grossProfit.subtract(totalSavings).subtract(totalInvestments));
            
            // Calculate percentages
            if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal profitMargin = grossProfit.multiply(BigDecimal.valueOf(100))
                        .divide(totalIncome, 2, BigDecimal.ROUND_HALF_UP);
                profitData.put("profitMarginPercentage", profitMargin);
                
                BigDecimal expenseRatio = totalExpenses.multiply(BigDecimal.valueOf(100))
                        .divide(totalIncome, 2, BigDecimal.ROUND_HALF_UP);
                profitData.put("expenseRatioPercentage", expenseRatio);
            }
            
            if (grossProfit.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal savingsRate = totalSavings.multiply(BigDecimal.valueOf(100))
                        .divide(grossProfit, 2, BigDecimal.ROUND_HALF_UP);
                profitData.put("savingsRatePercentage", savingsRate);
                
                BigDecimal investmentRate = totalInvestments.multiply(BigDecimal.valueOf(100))
                        .divide(grossProfit, 2, BigDecimal.ROUND_HALF_UP);
                profitData.put("investmentRatePercentage", investmentRate);
            }
            
            return profitData;
        } catch (Exception e) {
            log.error("Failed to calculate profit from budgets", e);
            throw new RuntimeException("Failed to calculate profit from budgets", e);
        }
    }

    // ==================== BUDGET SEARCH & FILTERING ====================

    /**
     * Search budgets by name
     */
    public List<Budget> searchBudgetsByName(String pattern) {
        try {
            return budgetRepository.findByBudgetNamePattern(pattern);
        } catch (Exception e) {
            log.error("Failed to search budgets by name: {}", pattern, e);
            throw new RuntimeException("Failed to search budgets by name", e);
        }
    }

    /**
     * Get budgets by date range
     */
    public List<Budget> getBudgetsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return budgetRepository.findByStartDateBetweenAndDeletedAtIsNull(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get budgets by date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get budgets by date range", e);
        }
    }

    /**
     * Get budgets by amount range
     */
    public List<Budget> getBudgetsByAmountRange(BigDecimal minAmount, BigDecimal maxAmount) {
        try {
            return budgetRepository.findByBudgetAmountRange(minAmount, maxAmount);
        } catch (Exception e) {
            log.error("Failed to get budgets by amount range: {} to {}", minAmount, maxAmount, e);
            throw new RuntimeException("Failed to get budgets by amount range", e);
        }
    }

    /**
     * Get budgets by utilization percentage range
     */
    public List<Budget> getBudgetsByUtilizationRange(BigDecimal minPercentage, BigDecimal maxPercentage) {
        try {
            return budgetRepository.findByUtilizationPercentageRange(minPercentage, maxPercentage);
        } catch (Exception e) {
            log.error("Failed to get budgets by utilization range: {} to {}", minPercentage, maxPercentage, e);
            throw new RuntimeException("Failed to get budgets by utilization range", e);
        }
    }

    // ==================== BUDGET COUNTING ====================

    /**
     * Count budgets by type
     */
    public long countBudgetsByType(Budget.BudgetType budgetType) {
        try {
            return budgetRepository.countByBudgetTypeAndDeletedAtIsNull(budgetType);
        } catch (Exception e) {
            log.error("Failed to count budgets by type: {}", budgetType, e);
            throw new RuntimeException("Failed to count budgets by type", e);
        }
    }

    /**
     * Count budgets by category
     */
    public long countBudgetsByCategory(Budget.BudgetCategory budgetCategory) {
        try {
            return budgetRepository.countByBudgetCategoryAndDeletedAtIsNull(budgetCategory);
        } catch (Exception e) {
            log.error("Failed to count budgets by category: {}", budgetCategory, e);
            throw new RuntimeException("Failed to count budgets by category", e);
        }
    }

    /**
     * Count budgets by status
     */
    public long countBudgetsByStatus(Budget.BudgetStatus status) {
        try {
            return budgetRepository.countByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("Failed to count budgets by status: {}", status, e);
            throw new RuntimeException("Failed to count budgets by status", e);
        }
    }

    /**
     * Count active budgets
     */
    public long countActiveBudgets() {
        try {
            return budgetRepository.countByStatusAndDeletedAtIsNull(Budget.BudgetStatus.ACTIVE);
        } catch (Exception e) {
            log.error("Failed to count active budgets", e);
            throw new RuntimeException("Failed to count active budgets", e);
        }
    }

    /**
     * Count overspent budgets
     */
    public long countOverspentBudgets() {
        try {
            return budgetRepository.countByStatusAndDeletedAtIsNull(Budget.BudgetStatus.OVERSPENT);
        } catch (Exception e) {
            log.error("Failed to count overspent budgets", e);
            throw new RuntimeException("Failed to count overspent budgets", e);
        }
    }
} 