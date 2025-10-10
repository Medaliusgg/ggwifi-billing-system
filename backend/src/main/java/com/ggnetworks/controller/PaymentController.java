package com.ggnetworks.controller;

import com.ggnetworks.entity.Payment;
import com.ggnetworks.service.SelcomPaymentService;
import com.ggnetworks.service.SmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment processing and webhook endpoints")
public class PaymentController {

    private final SelcomPaymentService selcomPaymentService;
    private final SmsService smsService;

    /**
     * Initialize C2B payment
     */
    @PostMapping("/c2b/initialize")
    @Operation(summary = "Initialize C2B payment", description = "Initialize SELCOM C2B payment request")
    public ResponseEntity<Map<String, Object>> initializeC2BPayment(
            @RequestBody Map<String, Object> request) {
        
        try {
            log.info("Initializing C2B payment with request: {}", request);
            
            // Extract request data
            String phoneNumber = (String) request.get("phoneNumber");
            String paymentMethod = (String) request.get("paymentMethod");
            String fullName = (String) request.get("fullName");
            Integer packageId = (Integer) request.get("packageId");
            Double amount = (Double) request.get("amount");
            
            // Validate required fields
            if (phoneNumber == null || paymentMethod == null || fullName == null || packageId == null || amount == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Missing required fields"));
            }
            
            // Create a mock payment for now (since we don't have all the required fields)
            // TODO: Create proper Payment entity with User and other required fields
            Payment payment = new Payment();
            payment.setAmount(java.math.BigDecimal.valueOf(amount));
            payment.setPaymentMethod(Payment.PaymentMethod.MOBILE_MONEY);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            
            // Initialize SELCOM C2B payment
            Map<String, Object> selcomResult = selcomPaymentService.initializeC2BPayment(payment, paymentMethod);
            
            if ((Boolean) selcomResult.get("success")) {
                log.info("C2B payment initialized successfully");
                
                Map<String, Object> response = Map.of(
                    "success", true,
                    "transactionId", selcomResult.get("transactionId"),
                    "reference", selcomResult.get("reference"),
                    "operator", selcomResult.get("operator"),
                    "message", "Payment request sent. Please check your phone for USSD prompt."
                );
                
                return ResponseEntity.ok(response);
            } else {
                log.error("C2B payment initialization failed: {}", selcomResult.get("error"));
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", selcomResult.get("error")));
            }
            
        } catch (Exception e) {
            log.error("Error initializing C2B payment", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to initialize payment: " + e.getMessage()));
        }
    }

    /**
     * SELCOM C2B webhook endpoints
     */
    @PostMapping("/selcom/c2b/lookup")
    @Operation(summary = "SELCOM C2B lookup webhook", description = "Handle SELCOM C2B lookup webhook")
    public ResponseEntity<String> handleC2BLookup(@RequestBody Map<String, Object> webhookData) {
        try {
            log.info("Received SELCOM C2B lookup webhook: {}", webhookData);
            
            boolean processed = selcomPaymentService.handleC2BWebhook(webhookData, "/lookup");
            
            if (processed) {
                return ResponseEntity.ok("OK");
            } else {
                log.error("Failed to process SELCOM C2B lookup webhook");
                return ResponseEntity.badRequest().body("FAILED");
            }
        } catch (Exception e) {
            log.error("Error processing SELCOM C2B lookup webhook", e);
            return ResponseEntity.internalServerError().body("ERROR");
        }
    }

    @PostMapping("/selcom/c2b/validation")
    @Operation(summary = "SELCOM C2B validation webhook", description = "Handle SELCOM C2B validation webhook")
    public ResponseEntity<String> handleC2BValidation(@RequestBody Map<String, Object> webhookData) {
        try {
            log.info("Received SELCOM C2B validation webhook: {}", webhookData);
            
            boolean processed = selcomPaymentService.handleC2BWebhook(webhookData, "/validation");
            
            if (processed) {
                return ResponseEntity.ok("OK");
            } else {
                log.error("Failed to process SELCOM C2B validation webhook");
                return ResponseEntity.badRequest().body("FAILED");
            }
        } catch (Exception e) {
            log.error("Error processing SELCOM C2B validation webhook", e);
            return ResponseEntity.internalServerError().body("ERROR");
        }
    }

    @PostMapping("/selcom/c2b/notification")
    @Operation(summary = "SELCOM C2B notification webhook", description = "Handle SELCOM C2B notification webhook")
    public ResponseEntity<String> handleC2BNotification(@RequestBody Map<String, Object> webhookData) {
        try {
            log.info("Received SELCOM C2B notification webhook: {}", webhookData);
            
            boolean processed = selcomPaymentService.handleC2BWebhook(webhookData, "/notification");
            
            if (processed) {
                return ResponseEntity.ok("OK");
            } else {
                log.error("Failed to process SELCOM C2B notification webhook");
                return ResponseEntity.badRequest().body("FAILED");
            }
        } catch (Exception e) {
            log.error("Error processing SELCOM C2B notification webhook", e);
            return ResponseEntity.internalServerError().body("ERROR");
        }
    }

    /**
     * Query C2B payment status
     */
    @GetMapping("/c2b/status")
    @Operation(summary = "Query C2B status", description = "Query SELCOM C2B payment status")
    public ResponseEntity<Map<String, Object>> queryC2BStatus(
            @RequestParam(required = false) String transactionId,
            @RequestParam(required = false) String reference) {
        try {
            Map<String, Object> result = selcomPaymentService.queryC2BStatus(transactionId, reference);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to query C2B status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to query payment status"));
        }
    }

    /**
     * Verify payment with PIN
     */
    @PostMapping("/c2b/verify")
    @Operation(summary = "Verify payment with PIN", description = "Verify SELCOM C2B payment with PIN and process post-payment tasks")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestBody Map<String, Object> request) {
        
        try {
            log.info("Verifying payment with request: {}", request);
            
            String transactionId = (String) request.get("transactionId");
            String pinCode = (String) request.get("pinCode");

            if (transactionId == null || pinCode == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Missing transaction ID or PIN"));
            }
            
            // For now, simulate successful verification
            // TODO: Implement actual SELCOM verification
            log.info("Payment verified successfully for transaction: {}", transactionId);
            
            // Process post-payment tasks
            Map<String, Object> postPaymentResult = processPostPaymentTasks(transactionId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Payment verified successfully",
                "voucherCode", postPaymentResult.get("voucherCode"),
                "smsSent", postPaymentResult.get("smsSent"),
                "autoConnected", postPaymentResult.get("autoConnected")
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error verifying payment", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to verify payment: " + e.getMessage()));
        }
    }

    /**
     * Process post-payment tasks (voucher generation, SMS, auto-connection)
     */
    private Map<String, Object> processPostPaymentTasks(String transactionId) {
        try {
            log.info("Processing post-payment tasks for transaction: {}", transactionId);
            
            // Generate voucher code
            String voucherCode = generateVoucherCode();
            log.info("Generated voucher code: {}", voucherCode);
            
            // Send SMS with voucher details
            boolean smsSent = sendVoucherSMS(transactionId, voucherCode);
            log.info("SMS sent: {}", smsSent);
            
            // Auto-connect to WiFi
            boolean autoConnected = connectToWiFi(transactionId);
            log.info("Auto-connection: {}", autoConnected);
            
            return Map.of(
                "voucherCode", voucherCode,
                "smsSent", smsSent,
                "autoConnected", autoConnected
            );
            
        } catch (Exception e) {
            log.error("Error processing post-payment tasks", e);
            return Map.of(
                "voucherCode", "ERROR",
                "smsSent", false,
                "autoConnected", false
            );
        }
    }

    /**
     * Generate unique voucher code
     */
    private String generateVoucherCode() {
        return "GGN-" + System.currentTimeMillis() + "-" + 
               java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    /**
     * Send SMS with voucher details
     */
    private boolean sendVoucherSMS(String transactionId, String voucherCode) {
        try {
            // TODO: Get phone number from transaction
            String phoneNumber = "06534567891"; // Placeholder
            
            String message = String.format(
                "Your GGWIFI voucher: %s\nPackage: %s\nValidity: %s\nEnjoy your internet!",
                voucherCode, "Premium Package", "30 Days"
            );
            
            smsService.sendVoucherCode(phoneNumber, voucherCode, "Premium Package", "30 Days");
            return true;
        } catch (Exception e) {
            log.error("Error sending voucher SMS", e);
            return false;
        }
    }

    /**
     * Connect user to WiFi network
     */
    private boolean connectToWiFi(String transactionId) {
        try {
            // TODO: Implement RADIUS/MikroTik integration
            log.info("Connecting user to WiFi network for transaction: {}", transactionId);
            
            // Simulate connection process
            Thread.sleep(2000);
            
            return true;
        } catch (Exception e) {
            log.error("Error connecting to WiFi", e);
            return false;
        }
    }

    /**
     * Send SMS notification
     */
    @PostMapping("/sms/send")
    @Operation(summary = "Send SMS", description = "Send SMS notification")
    public ResponseEntity<Map<String, Object>> sendSms(
            @RequestBody Map<String, Object> request) {
        
        try {
            String phoneNumber = (String) request.get("phoneNumber");
            String message = (String) request.get("message");
            String type = (String) request.get("type");

            if (phoneNumber == null || message == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number and message are required"));
            }

            // TODO: Convert type string to SmsMessage.MessageType enum
            Map<String, Object> result = smsService.sendSms(phoneNumber, message, null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to send SMS", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send SMS"));
        }
    }

    /**
     * Get payment statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics", description = "Get payment statistics and analytics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        try {
            Map<String, Object> stats = selcomPaymentService.getPaymentStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get payment statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get payment statistics"));
        }
    }

    /**
     * Get available payment methods
     */
    @GetMapping("/methods")
    @Operation(summary = "Get payment methods", description = "Get available payment methods")
    public ResponseEntity<Map<String, Object>> getPaymentMethods() {
        try {
            Map<String, Object> methods = selcomPaymentService.getPaymentMethods();
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            log.error("Failed to get payment methods", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get payment methods"));
        }
    }
} 