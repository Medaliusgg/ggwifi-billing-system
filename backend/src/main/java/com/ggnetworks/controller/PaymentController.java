package com.ggnetworks.controller;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.service.PaymentService;
import com.ggnetworks.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PermissionService permissionService;

    @Value("${app.security.enabled:true}")
    private boolean securityEnabled;

    private ResponseEntity<Map<String, Object>> checkPermission(String permission) {
        // Bypass permission check if security is disabled (testing scenario)
        if (!securityEnabled) {
            return null; // Allow access when security is disabled
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || 
            "anonymousUser".equals(authentication.getName()) || 
            !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Authentication required");
            return ResponseEntity.status(401).body(response);
        }
        
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

    @GetMapping("/reconcile")
    public ResponseEntity<Map<String, Object>> reconcilePayments(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
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
            
            Map<String, Object> reconciliation = paymentService.reconcilePayments(start, end);
            response.put("status", "success");
            response.put("message", "Payment reconciliation completed successfully");
            response.put("data", reconciliation);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reconcile payments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reconcile/pending")
    public ResponseEntity<Map<String, Object>> getPaymentsRequiringReconciliation() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Payment> payments = paymentService.getPaymentsRequiringReconciliation();
            response.put("status", "success");
            response.put("message", "Payments requiring reconciliation retrieved");
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getPaymentAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_READ");
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
            
            Map<String, Object> analytics = paymentService.getPaymentAnalytics(start, end);
            response.put("status", "success");
            response.put("message", "Payment analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            Payment payment = new Payment();
            applyPaymentFields(payment, request);
            Payment created = paymentService.createPayment(payment);

            response.put("status", "success");
            response.put("message", "Payment created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePayment(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_UPDATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Payment> paymentOpt = paymentService.getPaymentById(id);
            if (paymentOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Payment not found");
                return ResponseEntity.status(404).body(response);
            }

            Payment payment = paymentOpt.get();
            applyPaymentFields(payment, request);

            Payment updated = paymentService.updatePayment(payment);
            response.put("status", "success");
            response.put("message", "Payment updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePayment(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PAYMENT_DELETE");
        if (permissionCheck != null) return permissionCheck;

        try {
            paymentService.deletePayment(id);
            response.put("status", "success");
            response.put("message", "Payment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private void applyPaymentFields(Payment payment, Map<String, Object> payload) {
        if (payload.containsKey("paymentId")) {
            payment.setPaymentId(String.valueOf(payload.get("paymentId")));
        }
        if (payload.containsKey("customerId")) {
            payment.setCustomerId(parseLong(payload.get("customerId")));
        }
        if (payload.containsKey("invoiceId")) {
            payment.setInvoiceId(parseLong(payload.get("invoiceId")));
        }
        if (payload.containsKey("amount")) {
            payment.setAmount(parseBigDecimal(payload.get("amount")));
        }
        if (payload.containsKey("currency")) {
            payment.setCurrency(String.valueOf(payload.get("currency")));
        }
        if (payload.containsKey("description")) {
            payment.setDescription(String.valueOf(payload.get("description")));
        }
        if (payload.containsKey("paymentMethod")) {
            String method = String.valueOf(payload.get("paymentMethod"));
            payment.setPaymentMethod(Payment.PaymentMethod.valueOf(method.toUpperCase()));
        }
        if (payload.containsKey("paymentGateway")) {
            payment.setPaymentGateway(String.valueOf(payload.get("paymentGateway")));
        }
        if (payload.containsKey("gatewayTransactionId")) {
            payment.setGatewayTransactionId(String.valueOf(payload.get("gatewayTransactionId")));
        }
        if (payload.containsKey("gatewayReference")) {
            payment.setGatewayReference(String.valueOf(payload.get("gatewayReference")));
        }
        if (payload.containsKey("status")) {
            String status = String.valueOf(payload.get("status"));
            payment.setStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()));
        }
        if (payload.containsKey("phoneNumber")) {
            payment.setPhoneNumber(String.valueOf(payload.get("phoneNumber")));
        }
        if (payload.containsKey("processedAt")) {
            payment.setProcessedAt(parseDate(payload.get("processedAt")));
        }
        if (payload.containsKey("confirmedAt")) {
            payment.setConfirmedAt(parseDate(payload.get("confirmedAt")));
        }
        if (payload.containsKey("notes")) {
            payment.setNotes(String.valueOf(payload.get("notes")));
        }
    }

    private Long parseLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(value.toString());
    }

    private BigDecimal parseBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return new BigDecimal(value.toString());
    }

    private LocalDateTime parseDate(Object value) {
        if (value == null || value.toString().isEmpty()) return null;
        return LocalDateTime.parse(value.toString());
    }
}


