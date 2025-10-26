package com.ggnetworks.repository;

import com.ggnetworks.entity.Profit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfitRepository extends JpaRepository<Profit, Long> {
    
    Optional<Profit> findByProfitId(String profitId);
    
    List<Profit> findByPeriodType(Profit.PeriodType periodType);
    
    List<Profit> findByStatus(Profit.ProfitStatus status);
    
    List<Profit> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Profit> findByEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Profit> findByCreatedBy(String createdBy);
    
    List<Profit> findByPeriodNameContainingIgnoreCase(String periodName);
    
    List<Profit> findByCurrency(String currency);
    
    boolean existsByProfitId(String profitId);
    
    long countByPeriodType(Profit.PeriodType periodType);
    
    long countByStatus(Profit.ProfitStatus status);
    
    long countByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
