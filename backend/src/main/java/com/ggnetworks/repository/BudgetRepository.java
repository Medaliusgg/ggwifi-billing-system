package com.ggnetworks.repository;

import com.ggnetworks.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    Optional<Budget> findByBudgetId(String budgetId);
    
    List<Budget> findByCategory(Budget.BudgetCategory category);
    
    List<Budget> findByStatus(Budget.BudgetStatus status);
    
    List<Budget> findByBudgetPeriod(Budget.BudgetPeriod budgetPeriod);
    
    List<Budget> findByIsActive(Boolean isActive);
    
    List<Budget> findByCreatedBy(String createdBy);
    
    List<Budget> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Budget> findByEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Budget> findByNameContainingIgnoreCase(String name);
    
    List<Budget> findByCurrency(String currency);
    
    boolean existsByBudgetId(String budgetId);
    
    long countByCategory(Budget.BudgetCategory category);
    
    long countByStatus(Budget.BudgetStatus status);
    
    long countByIsActive(Boolean isActive);
    
    long countByBudgetPeriod(Budget.BudgetPeriod budgetPeriod);
}
