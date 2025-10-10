package com.ggnetworks.repository;

import com.ggnetworks.entity.Budget;
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
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Find by budget type
    List<Budget> findByBudgetTypeAndDeletedAtIsNull(Budget.BudgetType budgetType);
    
    // Find by budget category
    List<Budget> findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory budgetCategory);
    
    // Find by status
    List<Budget> findByStatusAndDeletedAtIsNull(Budget.BudgetStatus status);
    
    // Find by date range
    List<Budget> findByStartDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find by end date range
    List<Budget> findByEndDateBetweenAndDeletedAtIsNull(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find recurring budgets
    List<Budget> findByIsRecurringTrueAndDeletedAtIsNull();
    
    // Find by recurrence type
    List<Budget> findByRecurrenceTypeAndDeletedAtIsNull(Budget.RecurrenceType recurrenceType);
    
    // Find budgets by name pattern
    @Query("SELECT b FROM Budget b WHERE b.budgetName LIKE %:pattern% AND b.deletedAt IS NULL")
    List<Budget> findByBudgetNamePattern(@Param("pattern") String pattern);
    
    // Find budgets by description pattern
    @Query("SELECT b FROM Budget b WHERE b.description LIKE %:pattern% AND b.deletedAt IS NULL")
    List<Budget> findByDescriptionPattern(@Param("pattern") String pattern);
    
    // Find budgets with pagination
    Page<Budget> findByDeletedAtIsNull(Pageable pageable);
    
    // Find budgets by type with pagination
    Page<Budget> findByBudgetTypeAndDeletedAtIsNull(Budget.BudgetType budgetType, Pageable pageable);
    
    // Find budgets by category with pagination
    Page<Budget> findByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory budgetCategory, Pageable pageable);
    
    // Find budgets by status with pagination
    Page<Budget> findByStatusAndDeletedAtIsNull(Budget.BudgetStatus status, Pageable pageable);
    
    // Count by budget type
    long countByBudgetTypeAndDeletedAtIsNull(Budget.BudgetType budgetType);
    
    // Count by budget category
    long countByBudgetCategoryAndDeletedAtIsNull(Budget.BudgetCategory budgetCategory);
    
    // Count by status
    long countByStatusAndDeletedAtIsNull(Budget.BudgetStatus status);
    
    // Count recurring budgets
    long countByIsRecurringTrueAndDeletedAtIsNull();
    
    // Find budgets by type and category
    List<Budget> findByBudgetTypeAndBudgetCategoryAndDeletedAtIsNull(
            Budget.BudgetType budgetType, Budget.BudgetCategory budgetCategory);
    
    // Find budgets by type and status
    List<Budget> findByBudgetTypeAndStatusAndDeletedAtIsNull(
            Budget.BudgetType budgetType, Budget.BudgetStatus status);
    
    // Find budgets by category and status
    List<Budget> findByBudgetCategoryAndStatusAndDeletedAtIsNull(
            Budget.BudgetCategory budgetCategory, Budget.BudgetStatus status);
    
    // Find budgets with high utilization
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND " +
           "(b.spentAmount / b.budgetAmount * 100) >= :threshold")
    List<Budget> findByUtilizationThreshold(@Param("threshold") BigDecimal threshold);
    
    // Find overspent budgets
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND b.remainingAmount < 0")
    List<Budget> findOverspentBudgets();
    
    // Find budgets expiring soon
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND b.endDate BETWEEN :startDate AND :endDate")
    List<Budget> findBudgetsExpiringBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    // Find budgets by amount range
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND b.budgetAmount BETWEEN :minAmount AND :maxAmount")
    List<Budget> findByBudgetAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                        @Param("maxAmount") BigDecimal maxAmount);
    
    // Find budgets by spent amount range
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND b.spentAmount BETWEEN :minAmount AND :maxAmount")
    List<Budget> findBySpentAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                       @Param("maxAmount") BigDecimal maxAmount);
    
    // Get budget statistics
    @Query("SELECT COUNT(b) as totalBudgets, " +
           "COUNT(CASE WHEN b.status = 'ACTIVE' THEN 1 END) as activeBudgets, " +
           "COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completedBudgets, " +
           "COUNT(CASE WHEN b.status = 'OVERSPENT' THEN 1 END) as overspentBudgets, " +
           "SUM(b.budgetAmount) as totalBudgetAmount, " +
           "SUM(b.spentAmount) as totalSpentAmount, " +
           "AVG(b.budgetAmount) as avgBudgetAmount " +
           "FROM Budget b WHERE b.deletedAt IS NULL")
    Object[] getBudgetStatistics();
    
    // Get budget statistics by type
    @Query("SELECT COUNT(b) as totalBudgets, " +
           "SUM(b.budgetAmount) as totalBudgetAmount, " +
           "SUM(b.spentAmount) as totalSpentAmount, " +
           "AVG(b.budgetAmount) as avgBudgetAmount " +
           "FROM Budget b WHERE b.budgetType = :budgetType AND b.deletedAt IS NULL")
    Object[] getBudgetStatisticsByType(@Param("budgetType") Budget.BudgetType budgetType);
    
    // Get budget statistics by category
    @Query("SELECT COUNT(b) as totalBudgets, " +
           "SUM(b.budgetAmount) as totalBudgetAmount, " +
           "SUM(b.spentAmount) as totalSpentAmount, " +
           "AVG(b.budgetAmount) as avgBudgetAmount " +
           "FROM Budget b WHERE b.budgetCategory = :budgetCategory AND b.deletedAt IS NULL")
    Object[] getBudgetStatisticsByCategory(@Param("budgetCategory") Budget.BudgetCategory budgetCategory);
    
    // Find budgets by utilization percentage
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND " +
           "(b.spentAmount / b.budgetAmount * 100) >= :minPercentage AND " +
           "(b.spentAmount / b.budgetAmount * 100) <= :maxPercentage")
    List<Budget> findByUtilizationPercentageRange(@Param("minPercentage") BigDecimal minPercentage, 
                                                 @Param("maxPercentage") BigDecimal maxPercentage);
    
    // Find budgets by alert threshold
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND " +
           "(b.spentAmount / b.budgetAmount * 100) >= b.alertThresholdPercentage")
    List<Budget> findBudgetsOverThreshold();
    
    // Find budgets by date range with status
    @Query("SELECT b FROM Budget b WHERE b.deletedAt IS NULL AND " +
           "b.startDate >= :startDate AND b.endDate <= :endDate AND b.status = :status")
    List<Budget> findByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate, 
                                         @Param("status") Budget.BudgetStatus status);
} 