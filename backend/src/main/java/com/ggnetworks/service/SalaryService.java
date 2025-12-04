package com.ggnetworks.service;

import com.ggnetworks.entity.Salary;
import com.ggnetworks.repository.SalaryRepository;
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
 * Salary Service
 * Manages employee salary processing and tracking
 */
@Service
@Transactional
public class SalaryService {

    @Autowired
    private SalaryRepository salaryRepository;

    /**
     * Create a new salary record
     */
    public Salary createSalary(Salary salary) {
        if (salary.getSalaryId() == null || salary.getSalaryId().isEmpty()) {
            salary.setSalaryId("SAL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        // Calculate net salary if not set
        if (salary.getNetSalary() == null) {
            BigDecimal netSalary = salary.getBaseSalary()
                .add(salary.getAllowances() != null ? salary.getAllowances() : BigDecimal.ZERO)
                .add(salary.getOvertimePay() != null ? salary.getOvertimePay() : BigDecimal.ZERO)
                .add(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO)
                .subtract(salary.getDeductions() != null ? salary.getDeductions() : BigDecimal.ZERO)
                .subtract(salary.getTaxAmount() != null ? salary.getTaxAmount() : BigDecimal.ZERO);
            salary.setNetSalary(netSalary);
        }
        
        return salaryRepository.save(salary);
    }

    /**
     * Get salary by ID
     */
    public Optional<Salary> getSalaryById(Long id) {
        return salaryRepository.findById(id);
    }

    /**
     * Get salary by salary ID
     */
    public Optional<Salary> getSalaryBySalaryId(String salaryId) {
        return salaryRepository.findAll().stream()
            .filter(s -> s.getSalaryId().equals(salaryId))
            .findFirst();
    }

    /**
     * Get all salaries
     */
    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    /**
     * Get salaries by employee ID
     */
    public List<Salary> getSalariesByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId);
    }

    /**
     * Get salaries by status
     */
    public List<Salary> getSalariesByStatus(Salary.SalaryStatus status) {
        return salaryRepository.findByStatus(status);
    }

    /**
     * Get salaries by month
     */
    public List<Salary> getSalariesByMonth(String salaryMonth) {
        return salaryRepository.findAll().stream()
            .filter(s -> s.getSalaryMonth().equals(salaryMonth))
            .toList();
    }

    /**
     * Update salary
     */
    public Salary updateSalary(Salary salary) {
        // Recalculate net salary
        BigDecimal netSalary = salary.getBaseSalary()
            .add(salary.getAllowances() != null ? salary.getAllowances() : BigDecimal.ZERO)
            .add(salary.getOvertimePay() != null ? salary.getOvertimePay() : BigDecimal.ZERO)
            .add(salary.getBonus() != null ? salary.getBonus() : BigDecimal.ZERO)
            .subtract(salary.getDeductions() != null ? salary.getDeductions() : BigDecimal.ZERO)
            .subtract(salary.getTaxAmount() != null ? salary.getTaxAmount() : BigDecimal.ZERO);
        salary.setNetSalary(netSalary);
        
        return salaryRepository.save(salary);
    }

    /**
     * Mark salary as paid
     */
    public Salary markSalaryAsPaid(Long salaryId, LocalDateTime paymentDate, 
                                   Salary.PaymentMethod paymentMethod, String paymentReference) {
        Optional<Salary> salaryOpt = salaryRepository.findById(salaryId);
        if (salaryOpt.isEmpty()) {
            throw new RuntimeException("Salary not found");
        }
        
        Salary salary = salaryOpt.get();
        salary.setStatus(Salary.SalaryStatus.PAID);
        salary.setPaymentDate(paymentDate != null ? paymentDate : LocalDateTime.now());
        salary.setPaymentMethod(paymentMethod);
        // Note: Salary entity doesn't have paymentReference field, storing in notes if needed
        if (paymentReference != null && !paymentReference.isEmpty()) {
            String existingNotes = salary.getNotes() != null ? salary.getNotes() : "";
            salary.setNotes(existingNotes + (existingNotes.isEmpty() ? "" : "\n") + 
                           "Payment Reference: " + paymentReference);
        }
        
        return salaryRepository.save(salary);
    }

    /**
     * Get salary statistics
     */
    public Map<String, Object> getSalaryStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Salary> allSalaries = salaryRepository.findAll();
        List<Salary> paidSalaries = salaryRepository.findByStatus(Salary.SalaryStatus.PAID);
        List<Salary> pendingSalaries = salaryRepository.findByStatus(Salary.SalaryStatus.PENDING);
        
        BigDecimal totalBaseSalary = allSalaries.stream()
            .map(Salary::getBaseSalary)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalNetSalary = allSalaries.stream()
            .map(Salary::getNetSalary)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPaid = paidSalaries.stream()
            .map(Salary::getNetSalary)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalPending = pendingSalaries.stream()
            .map(Salary::getNetSalary)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalSalaries", allSalaries.size());
        stats.put("paidSalaries", paidSalaries.size());
        stats.put("pendingSalaries", pendingSalaries.size());
        stats.put("totalBaseSalary", totalBaseSalary);
        stats.put("totalNetSalary", totalNetSalary);
        stats.put("totalPaid", totalPaid);
        stats.put("totalPending", totalPending);
        
        return stats;
    }

    /**
     * Delete salary
     */
    public void deleteSalary(Long id) {
        salaryRepository.deleteById(id);
    }
}

