package com.ggnetworks.repository;

import com.ggnetworks.entity.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {
    
    List<TransactionLog> findByTransactionId(Long transactionId);
    
    List<TransactionLog> findByLogLevel(TransactionLog.LogLevel logLevel);
    
    List<TransactionLog> findByAction(TransactionLog.LogAction action);
    
    List<TransactionLog> findByUserId(String userId);
    
    List<TransactionLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<TransactionLog> findByTransactionIdOrderByCreatedAtDesc(Long transactionId);
    
    List<TransactionLog> findByLogLevelAndCreatedAtBetween(TransactionLog.LogLevel logLevel, 
                                                           LocalDateTime startDate, 
                                                           LocalDateTime endDate);
    
    List<TransactionLog> findByActionAndCreatedAtBetween(TransactionLog.LogAction action, 
                                                         LocalDateTime startDate, 
                                                         LocalDateTime endDate);
    
    long countByLogLevel(TransactionLog.LogLevel logLevel);
    
    long countByAction(TransactionLog.LogAction action);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
