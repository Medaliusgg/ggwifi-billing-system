package com.ggnetworks.service;

import com.ggnetworks.entity.Profit;
import com.ggnetworks.repository.ProfitRepository;
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
 * Profit Service
 * Manages profit calculation and reporting
 */
@Service
@Transactional
public class ProfitService {

    @Autowired
    private ProfitRepository profitRepository;

    @Autowired
    private com.ggnetworks.repository.PaymentRepository paymentRepository;

    @Autowired
    private ExpenseService expenseService;

    /**
     * Create a new profit record
     */
    public Profit createProfit(Profit profit) {
        if (profit.getProfitId() == null || profit.getProfitId().isEmpty()) {
            profit.setProfitId("PROF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        // Calculate profit if revenue and expenses are set
        if (profit.getTotalRevenue() != null && profit.getTotalExpenses() != null) {
            profit.setGrossProfit(profit.getTotalRevenue().subtract(profit.getTotalExpenses()));
            profit.setNetProfit(profit.getGrossProfit());
            
            // Calculate profit margin
            if (profit.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal margin = profit.getNetProfit()
                    .divide(profit.getTotalRevenue(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
                profit.setProfitMargin(margin);
            }
        }
        
        return profitRepository.save(profit);
    }

    /**
     * Calculate profit for a period
     */
    public Profit calculateProfitForPeriod(LocalDateTime startDate, LocalDateTime endDate, 
                                           String periodName, Profit.PeriodType periodType) {
        // Get total revenue from payments
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatusAndCreatedAtBetween(
            com.ggnetworks.entity.Payment.PaymentStatus.SUCCESSFUL, startDate, endDate);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        
        // Get total expenses
        BigDecimal totalExpenses = expenseService.getExpensesByDateRange(startDate, endDate).stream()
            .filter(e -> e.getStatus() == com.ggnetworks.entity.Expense.ExpenseStatus.APPROVED)
            .map(com.ggnetworks.entity.Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create profit record
        Profit profit = new Profit();
        profit.setPeriodName(periodName);
        profit.setPeriodType(periodType);
        profit.setStartDate(startDate);
        profit.setEndDate(endDate);
        profit.setTotalRevenue(totalRevenue);
        profit.setTotalExpenses(totalExpenses);
        profit.setGrossProfit(totalRevenue.subtract(totalExpenses));
        profit.setNetProfit(totalRevenue.subtract(totalExpenses));
        
        // Calculate profit margin
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margin = profit.getNetProfit()
                .divide(totalRevenue, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
            profit.setProfitMargin(margin);
        }
        
        profit.setStatus(Profit.ProfitStatus.CALCULATED);
        
        return profitRepository.save(profit);
    }

    /**
     * Get profit by ID
     */
    public Optional<Profit> getProfitById(Long id) {
        return profitRepository.findById(id);
    }

    /**
     * Get all profits
     */
    public List<Profit> getAllProfits() {
        return profitRepository.findAll();
    }

    /**
     * Get profits by status
     */
    public List<Profit> getProfitsByStatus(Profit.ProfitStatus status) {
        return profitRepository.findByStatus(status);
    }

    /**
     * Update profit
     */
    public Profit updateProfit(Profit profit) {
        // Recalculate if revenue or expenses changed
        if (profit.getTotalRevenue() != null && profit.getTotalExpenses() != null) {
            profit.setGrossProfit(profit.getTotalRevenue().subtract(profit.getTotalExpenses()));
            profit.setNetProfit(profit.getGrossProfit());
            
            if (profit.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal margin = profit.getNetProfit()
                    .divide(profit.getTotalRevenue(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
                profit.setProfitMargin(margin);
            }
        }
        
        return profitRepository.save(profit);
    }

    /**
     * Get profit statistics
     */
    public Map<String, Object> getProfitStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Profit> allProfits = profitRepository.findAll();
        List<Profit> approvedProfits = profitRepository.findByStatus(Profit.ProfitStatus.APPROVED);
        
        BigDecimal totalRevenue = allProfits.stream()
            .map(Profit::getTotalRevenue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpenses = allProfits.stream()
            .map(Profit::getTotalExpenses)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalProfit = allProfits.stream()
            .map(Profit::getNetProfit)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalProfits", allProfits.size());
        stats.put("approvedProfits", approvedProfits.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalExpenses", totalExpenses);
        stats.put("totalProfit", totalProfit);
        
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal avgMargin = totalProfit
                .divide(totalRevenue, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
            stats.put("averageProfitMargin", avgMargin);
        }
        
        return stats;
    }

    /**
     * Delete profit
     */
    public void deleteProfit(Long id) {
        profitRepository.deleteById(id);
    }
}

