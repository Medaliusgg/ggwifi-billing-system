package com.ggnetworks.controller;

import com.ggnetworks.entity.Transaction;
import com.ggnetworks.entity.Customer;
import com.ggnetworks.service.TransactionService;
import com.ggnetworks.service.PermissionService;
import com.ggnetworks.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private CustomerRepository customerRepository;

    private ResponseEntity<Map<String, Object>> checkPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        if (!permissionService.hasPermission(authentication.getName(), permission)) {
            response.put("status", "error");
            response.put("message", "Access Denied: You do not have permission to " + permission.toLowerCase().replace("_", " "));
            return ResponseEntity.status(403).body(response);
        }
        return null; // Permission granted
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Transaction> transactions = transactionService.getAllTransactions();
            response.put("status", "success");
            response.put("message", "Transactions retrieved successfully");
            response.put("data", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transactions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTransactionById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Transaction> transaction = transactionService.getTransactionById(id);
            if (transaction.isPresent()) {
                response.put("status", "success");
                response.put("message", "Transaction retrieved successfully");
                response.put("data", transaction.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Transaction not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transaction: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Map<String, Object>> getTransactionsByPhoneNumber(@PathVariable String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            // Find customer by phone number
            Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
            if (!customerOpt.isPresent()) {
                response.put("status", "error");
                response.put("message", "Customer not found with phone number: " + phoneNumber);
                return ResponseEntity.status(404).body(response);
            }

            Customer customer = customerOpt.get();
            List<Transaction> transactions = transactionService.getTransactionsByCustomerId(customer.getId());
            response.put("status", "success");
            response.put("message", "Transactions retrieved successfully");
            response.put("data", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transactions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getTransactionsByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Transaction.TransactionStatus transactionStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
            List<Transaction> transactions = transactionService.getTransactionsByStatus(transactionStatus);
            response.put("status", "success");
            response.put("message", "Transactions retrieved successfully");
            response.put("data", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transactions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getTransactionStatistics() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> statistics = transactionService.getTransactionStatistics();
            response.put("status", "success");
            response.put("message", "Transaction statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transaction statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<Map<String, Object>> processRefund(
            @PathVariable Long id,
            @RequestParam java.math.BigDecimal refundAmount,
            @RequestParam String reason
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_REFUND");
        if (permissionCheck != null) return permissionCheck;

        try {
            Transaction refund = transactionService.processRefund(id, refundAmount, reason);
            response.put("status", "success");
            response.put("message", "Refund processed successfully");
            response.put("data", refund);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to process refund: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reconcile")
    public ResponseEntity<Map<String, Object>> reconcileTransactions(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_RECONCILE");
        if (permissionCheck != null) return permissionCheck;

        try {
            java.time.LocalDateTime start;
            java.time.LocalDateTime end;
            
            try {
                start = startDate != null && !startDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(startDate) : 
                    java.time.LocalDateTime.now().minusDays(30);
                end = endDate != null && !endDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(endDate) : 
                    java.time.LocalDateTime.now();
            } catch (Exception e) {
                // If date parsing fails, use defaults
                start = java.time.LocalDateTime.now().minusDays(30);
                end = java.time.LocalDateTime.now();
            }
            
            Map<String, Object> reconciliation = transactionService.reconcileTransactions(start, end);
            response.put("status", "success");
            response.put("message", "Reconciliation completed successfully");
            response.put("data", reconciliation);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reconcile transactions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reconcile/pending")
    public ResponseEntity<Map<String, Object>> getTransactionsRequiringReconciliation() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("TRANSACTION_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Transaction> transactions = transactionService.getTransactionsRequiringReconciliation();
            response.put("status", "success");
            response.put("message", "Transactions requiring reconciliation retrieved");
            response.put("data", transactions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve transactions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


