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
     * Get transactions by customer ID
     */
    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
    
    /**
     * Get successful transactions by customer ID
     */
    public List<Transaction> getSuccessfulTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByCustomerIdAndStatusOrderByCreatedAtDesc(customerId, Transaction.TransactionStatus.COMPLETED);
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
    
    /**
     * Process refund for a transaction
     */
    public Transaction processRefund(Long transactionId, BigDecimal refundAmount, String reason) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        
        if (transaction.getStatus() != Transaction.TransactionStatus.COMPLETED) {
            throw new IllegalStateException("Only completed transactions can be refunded");
        }
        
        if (refundAmount.compareTo(transaction.getAmount()) > 0) {
            throw new IllegalArgumentException("Refund amount cannot exceed transaction amount");
        }
        
        // Create refund transaction
        Transaction refund = new Transaction();
        refund.setTransactionId(generateTransactionId());
        refund.setCustomerId(transaction.getCustomerId());
        refund.setAmount(refundAmount);
        refund.setCurrency(transaction.getCurrency());
        refund.setTransactionType(Transaction.TransactionType.REFUND);
        refund.setPaymentMethod(transaction.getPaymentMethod());
        refund.setPaymentGateway(transaction.getPaymentGateway());
        refund.setDescription("Refund for transaction " + transaction.getTransactionId() + ": " + reason);
        refund.setStatus(Transaction.TransactionStatus.PENDING);
        refund.setMetadata("{\"originalTransactionId\":\"" + transaction.getTransactionId() + "\",\"reason\":\"" + reason + "\"}");
        
        return transactionRepository.save(refund);
    }
    
    /**
     * Reconcile transactions with payment gateway
     */
    public Map<String, Object> reconcileTransactions(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> result = new HashMap<>();
        
        List<Transaction> transactions = transactionRepository.findByCreatedAtBetween(startDate, endDate);
        
        long totalTransactions = transactions.size();
        long reconciled = 0;
        long discrepancies = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal reconciledAmount = BigDecimal.ZERO;
        
        for (Transaction txn : transactions) {
            totalAmount = totalAmount.add(txn.getAmount() != null ? txn.getAmount() : BigDecimal.ZERO);
            
            // Check if transaction has gateway confirmation
            if (txn.getGatewayTransactionId() != null && !txn.getGatewayTransactionId().isEmpty() 
                && txn.getConfirmedAt() != null) {
                reconciled++;
                reconciledAmount = reconciledAmount.add(txn.getAmount() != null ? txn.getAmount() : BigDecimal.ZERO);
            } else if (txn.getStatus() == Transaction.TransactionStatus.COMPLETED 
                && (txn.getGatewayTransactionId() == null || txn.getGatewayTransactionId().isEmpty())) {
                discrepancies++;
            }
        }
        
        result.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        result.put("totalTransactions", totalTransactions);
        result.put("reconciled", reconciled);
        result.put("discrepancies", discrepancies);
        result.put("unreconciled", totalTransactions - reconciled);
        result.put("totalAmount", totalAmount);
        result.put("reconciledAmount", reconciledAmount);
        result.put("reconciliationRate", totalTransactions > 0 ? 
            Math.round((double) reconciled / totalTransactions * 10000.0) / 100.0 : 0);
        result.put("generatedAt", LocalDateTime.now().toString());
        
        return result;
    }
    
    /**
     * Get transactions requiring reconciliation
     */
    public List<Transaction> getTransactionsRequiringReconciliation() {
        return transactionRepository.findAll().stream()
            .filter(txn -> txn.getStatus() == Transaction.TransactionStatus.COMPLETED 
                && (txn.getGatewayTransactionId() == null || txn.getGatewayTransactionId().isEmpty()))
            .toList();
    }
}