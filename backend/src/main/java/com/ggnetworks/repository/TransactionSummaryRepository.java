package com.ggnetworks.repository;

import com.ggnetworks.entity.TransactionSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionSummaryRepository extends JpaRepository<TransactionSummary, Long> {
    
    Optional<TransactionSummary> findBySummaryId(String summaryId);
    
    List<TransactionSummary> findByPeriodType(TransactionSummary.PeriodType periodType);
    
    List<TransactionSummary> findByPeriodStartBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<TransactionSummary> findByPeriodTypeAndPeriodStartBetween(TransactionSummary.PeriodType periodType, 
                                                                   LocalDateTime startDate, 
                                                                   LocalDateTime endDate);
    
    Optional<TransactionSummary> findTopByPeriodTypeOrderByPeriodStartDesc(TransactionSummary.PeriodType periodType);
    
    List<TransactionSummary> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    boolean existsBySummaryId(String summaryId);
    
    boolean existsByPeriodTypeAndPeriodStartAndPeriodEnd(TransactionSummary.PeriodType periodType, 
                                                         LocalDateTime periodStart, 
                                                         LocalDateTime periodEnd);
}
