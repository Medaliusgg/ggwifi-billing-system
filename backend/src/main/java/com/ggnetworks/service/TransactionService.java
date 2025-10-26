package com.ggnetworks.service;

import com.ggnetworks.entity.Transaction;
import com.ggnetworks.repository.TransactionRepository;
import com.ggnetworks.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Get all transactions
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    /**
     * Get transaction by ID
     */
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }
    
    /**
     * Get transaction by transaction ID
     */
    public Optional<Transaction> getTransactionByTransactionId(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId);
    }
    
    /**
     * Create new transaction
     */
    public Transaction createTransaction(Transaction transaction) {
        // Generate unique transaction ID if not provided
        if (transaction.getTransactionId() == null || transaction.getTransactionId().isEmpty()) {
            transaction.setTransactionId(generateTransactionId());
        }
        
        // Set timestamps
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        return transactionRepository.save(transaction);
    }
    
    /**
     * Update transaction
     */
    public Transaction updateTransaction(Transaction transaction) {
        transaction.setUpdatedAt(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }
    
    /**
     * Delete transaction
     */
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
    
    /**
     * Get transactions by customer ID
     */
    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get transactions by status
     */
    public List<Transaction> getTransactionsByStatus(Transaction.TransactionStatus status) {
        return transactionRepository.findByStatus(status);
    }
    
    /**
     * Get transactions by payment gateway
     */
    public List<Transaction> getTransactionsByPaymentGateway(String paymentGateway) {
        return transactionRepository.findByPaymentGateway(paymentGateway);
    }
    
    /**
     * Get transactions by date range
     */
    public List<Transaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Get transactions by customer phone
     */
    public List<Transaction> getTransactionsByCustomerPhone(String phoneNumber) {
        return transactionRepository.findByCustomerPhoneOrderByCreatedAtDesc(phoneNumber);
    }
    
    /**
     * Get successful transactions by customer phone
     */
    public List<Transaction> getSuccessfulTransactionsByCustomerPhone(String phoneNumber) {
        return transactionRepository.findByCustomerPhoneAndStatusOrderByCreatedAtDesc(phoneNumber, Transaction.TransactionStatus.COMPLETED);
    }
    
    /**
     * Generate unique transaction ID
     */
    private String generateTransactionId() {
        return "TXN_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
    
    /**
     * Get transaction statistics
     */
    public Map<String, Object> getTransactionStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total transactions
        long totalTransactions = transactionRepository.count();
        stats.put("totalTransactions", totalTransactions);
        
        // Successful transactions
        long successfulTransactions = transactionRepository.countByStatus(Transaction.TransactionStatus.COMPLETED);
        stats.put("successfulTransactions", successfulTransactions);
        
        // Failed transactions
        long failedTransactions = transactionRepository.countByStatus(Transaction.TransactionStatus.FAILED);
        stats.put("failedTransactions", failedTransactions);
        
        // Pending transactions
        long pendingTransactions = transactionRepository.countByStatus(Transaction.TransactionStatus.PENDING);
        stats.put("pendingTransactions", pendingTransactions);
        
        // Success rate
        double successRate = totalTransactions > 0 ? (double) successfulTransactions / totalTransactions * 100 : 0;
        stats.put("successRate", Math.round(successRate * 100.0) / 100.0);
        
        return stats;
    }
}