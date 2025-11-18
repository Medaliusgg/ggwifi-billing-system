package com.ggnetworks.controller;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.service.PaymentService;
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
@RequestMapping("/api/v1/admin/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

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
    public ResponseEntity<Map<String, Object>> getAllPayments() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Payment> payments = paymentService.getAllPayments();
            response.put("status", "success");
            response.put("message", "Payments retrieved successfully");
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Payment> payment = paymentService.getPaymentById(id);
            if (payment.isPresent()) {
                response.put("status", "success");
                response.put("message", "Payment retrieved successfully");
                response.put("data", payment.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Payment not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Map<String, Object>> getPaymentsByPhoneNumber(@PathVariable String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Payment> payments = paymentService.getPaymentsByPhoneNumber(phoneNumber);
            response.put("status", "success");
            response.put("message", "Payments retrieved successfully");
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getPaymentsByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            List<Payment> payments = paymentService.getPaymentsByStatus(paymentStatus);
            response.put("status", "success");
            response.put("message", "Payments retrieved successfully");
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> statistics = paymentService.getPaymentStatistics();
            response.put("status", "success");
            response.put("message", "Payment statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payment statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


