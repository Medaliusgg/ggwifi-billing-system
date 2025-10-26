package com.ggnetworks.repository;

import com.ggnetworks.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    
    Optional<Salary> findBySalaryId(String salaryId);
    
    List<Salary> findByEmployeeId(Long employeeId);
    
    List<Salary> findByEmployeeName(String employeeName);
    
    List<Salary> findByDepartment(String department);
    
    List<Salary> findByLocationId(Long locationId);
    
    List<Salary> findByLocationName(String locationName);
    
    List<Salary> findByStatus(Salary.SalaryStatus status);
    
    List<Salary> findByPayPeriod(Salary.PayPeriod payPeriod);
    
    List<Salary> findBySalaryMonth(String salaryMonth);
    
    List<Salary> findByPaymentMethod(Salary.PaymentMethod paymentMethod);
    
    List<Salary> findByCreatedBy(String createdBy);
    
    List<Salary> findBySalaryMonthBetween(String startMonth, String endMonth);
    
    List<Salary> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Salary> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    boolean existsBySalaryId(String salaryId);
    
    boolean existsByEmployeeIdAndSalaryMonth(Long employeeId, String salaryMonth);
    
    long countByStatus(Salary.SalaryStatus status);
    
    long countByDepartment(String department);
    
    long countByLocationId(Long locationId);
    
    long countBySalaryMonth(String salaryMonth);
    
    long countByPayPeriod(Salary.PayPeriod payPeriod);
}
