package com.ggnetworks.controller;

import com.ggnetworks.entity.Transaction;
import com.ggnetworks.service.TransactionService;
import com.ggnetworks.service.PermissionService;
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
@RequestMapping("/admin/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PermissionService permissionService;

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
            List<Transaction> transactions = transactionService.getTransactionsByCustomerPhone(phoneNumber);
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
}


