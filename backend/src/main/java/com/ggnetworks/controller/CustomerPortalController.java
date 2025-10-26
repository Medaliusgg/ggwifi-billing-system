package com.ggnetworks.controller;

import com.ggnetworks.service.PackageService;
import com.ggnetworks.service.SmsService;
import com.ggnetworks.service.VoucherService;
import com.ggnetworks.service.ZenoPayService;
import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.repository.InternetPackageRepository;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customer-portal")
@CrossOrigin(origins = "*")
public class CustomerPortalController {

    @Autowired
    private ZenoPayService zenoPayService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private InternetPackageRepository packageRepository;
    
    @Autowired
    private PackageService packageService;
    
    @Autowired
    private VoucherService voucherService;

    /**
     * Process customer payment with ZenoPay Mobile Money Tanzania
     */
    @PostMapping("/payment")
    public ResponseEntity<Map<String, Object>> processCustomerPayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🚀 Processing customer payment...");
            
            // Extract payment data
            String customerName = (String) paymentData.get("customerName");
            String phoneNumber = (String) paymentData.get("phoneNumber");
            String packageId = (String) paymentData.get("packageId");
            String amount = (String) paymentData.get("amount");
            
            System.out.println("📋 Payment Details:");
            System.out.println("   Customer: " + customerName);
            System.out.println("   Phone: " + phoneNumber);
            System.out.println("   Package ID: " + packageId);
            System.out.println("   Amount: " + amount);
            
            // Validate required fields
            if (customerName == null || customerName.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Customer name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (packageId == null || packageId.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Package ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (amount == null || amount.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Amount is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Generate order ID
            String orderId = "PKG_" + System.currentTimeMillis() + "_" + phoneNumber.substring(phoneNumber.length() - 4);
            
            // Create payment request for ZenoPay
            Map<String, Object> zenoPayRequest = new HashMap<>();
            zenoPayRequest.put("order_id", orderId);
            zenoPayRequest.put("amount", amount);
            zenoPayRequest.put("msisdn", phoneNumber);
            zenoPayRequest.put("customer_name", customerName);
            zenoPayRequest.put("package_id", packageId);
            
            System.out.println("💳 Initiating ZenoPay payment...");
            
            // Call ZenoPay service
            Map<String, Object> zenoPayResponse = zenoPayService.initiatePayment(zenoPayRequest);
            
            if ("success".equals(zenoPayResponse.get("status"))) {
                System.out.println("✅ Payment initiated successfully");
                response.put("status", "success");
                response.put("message", "Payment initiated successfully. Please complete the payment on your phone.");
                response.put("order_id", orderId);
                response.put("payment_reference", zenoPayResponse.get("payment_reference"));
            } else {
                System.out.println("❌ Payment initiation failed: " + zenoPayResponse.get("message"));
                response.put("status", "error");
                response.put("message", "Payment initiation failed: " + zenoPayResponse.get("message"));
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error processing payment: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Error processing payment: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Handle ZenoPay webhook notifications
     */
    @PostMapping("/webhook/zenopay")
    public ResponseEntity<Map<String, Object>> handleZenoPayWebhook(@RequestBody Map<String, Object> webhookData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🔔 Received ZenoPay webhook: " + webhookData);
            
            // Validate webhook data
            Map<String, Object> validationResult = validateWebhookData(webhookData);
            String validationStatus = (String) validationResult.get("status");
            
            if ("invalid".equals(validationStatus)) {
                System.out.println("❌ Webhook validation failed: " + validationResult.get("message"));
                response.put("status", "rejected");
                response.put("message", validationResult.get("message"));
                response.put("error_code", validationResult.get("error_code"));
                return ResponseEntity.badRequest().body(response);
            }
            
            if ("ignored".equals(validationStatus)) {
                System.out.println("⏳ Webhook ignored: " + validationResult.get("message"));
                response.put("status", "ignored");
                response.put("message", validationResult.get("message"));
                return ResponseEntity.ok(response);
            }
            
            // Extract validated data
            String orderId = (String) validationResult.get("order_id");
            String paymentStatus = (String) validationResult.get("payment_status");
            String amount = (String) validationResult.get("amount");
            String phoneNumber = (String) validationResult.get("msisdn");
            
            System.out.println("✅ Processing webhook for order: " + orderId + " with status: " + paymentStatus);
            
            // Process based on payment status
            if ("SUCCESS".equals(paymentStatus) || "COMPLETED".equals(paymentStatus)) {
                System.out.println("🎉 Payment successful! Generating voucher and sending SMS...");
                
                // Generate voucher
                String voucherCode = voucherService.generateVoucherCode();
                System.out.println("🎫 Generated voucher code: " + voucherCode);
                
                // Send success SMS with voucher
                Map<String, Object> smsResult = smsService.sendVoucherNotificationSms(
                    phoneNumber, 
                    "Customer", // You might want to extract customer name from order
                    "Internet Package", // Package name
                    voucherCode,
                    amount,
                    "30 Days" // Duration
                );
                
                System.out.println("📱 SMS Result: " + smsResult);
                
                response.put("status", "success");
                response.put("message", "Payment processed successfully. Voucher generated and SMS sent.");
                response.put("voucher_code", voucherCode);
                response.put("sms_status", smsResult.get("status"));
                
            } else if ("FAILED".equals(paymentStatus) || "CANCELLED".equals(paymentStatus)) {
                System.out.println("❌ Payment failed! Sending failure SMS...");
                
                // Send failure SMS
                Map<String, Object> smsResult = smsService.sendPaymentFailureSms(phoneNumber, "Customer");
                
                System.out.println("📱 Failure SMS Result: " + smsResult);
                
                response.put("status", "failed");
                response.put("message", "Payment failed. Customer notified via SMS.");
                response.put("sms_status", smsResult.get("status"));
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error processing webhook: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Error processing webhook: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Validate webhook data for business integrity
     */
    private Map<String, Object> validateWebhookData(Map<String, Object> webhookData) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("🔍 CRITICAL WEBHOOK VALIDATION STARTED");
            
            // 1. REQUIRED FIELDS VALIDATION
            String orderId = (String) webhookData.get("order_id");
            String paymentStatus = (String) webhookData.get("payment_status");
            String amount = (String) webhookData.get("amount");
            String msisdn = (String) webhookData.get("msisdn");
            String transid = (String) webhookData.get("transid");
            
            System.out.println("🔍 Validation - Order ID: '" + orderId + "'");
            System.out.println("🔍 Validation - Payment Status: '" + paymentStatus + "'");
            System.out.println("🔍 Validation - Amount: '" + amount + "'");
            System.out.println("🔍 Validation - MSISDN: '" + msisdn + "'");
            System.out.println("🔍 Validation - Transaction ID: '" + transid + "'");
            
            // Check required fields
            if (orderId == null || orderId.trim().isEmpty()) {
                result.put("status", "invalid");
                result.put("message", "Missing or empty order_id - webhook rejected");
                result.put("error_code", "MISSING_ORDER_ID");
                return result;
            }
            
            if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
                result.put("status", "invalid");
                result.put("message", "Missing or empty payment_status - webhook rejected");
                result.put("error_code", "MISSING_PAYMENT_STATUS");
                return result;
            }
            
            if (amount == null || amount.trim().isEmpty()) {
                result.put("status", "invalid");
                result.put("message", "Missing or empty amount - webhook rejected");
                result.put("error_code", "MISSING_AMOUNT");
                return result;
            }
            
            if (msisdn == null || msisdn.trim().isEmpty()) {
                result.put("status", "invalid");
                result.put("message", "Missing or empty msisdn - webhook rejected");
                result.put("error_code", "MISSING_MSISDN");
                return result;
            }
            
            // 2. ORDER ID FORMAT VALIDATION
            if (!orderId.startsWith("PKG_") || orderId.length() < 20) {
                result.put("status", "invalid");
                result.put("message", "Invalid order_id format - webhook rejected");
                result.put("error_code", "INVALID_ORDER_FORMAT");
                return result;
            }
            
            // 3. PAYMENT STATUS VALIDATION - Only process genuine confirmations
            String upperStatus = paymentStatus.toUpperCase();
            if (!"SUCCESS".equals(upperStatus) && !"COMPLETED".equals(upperStatus) && 
                !"FAILED".equals(upperStatus) && !"CANCELLED".equals(upperStatus)) {
                result.put("status", "invalid");
                result.put("message", "Invalid payment_status '" + paymentStatus + "' - only SUCCESS/COMPLETED/FAILED/CANCELLED allowed");
                result.put("error_code", "INVALID_PAYMENT_STATUS");
                return result;
            }
            
            // 4. AMOUNT VALIDATION - Must be numeric and positive
            try {
                double amountValue = Double.parseDouble(amount);
                if (amountValue <= 0) {
                    result.put("status", "invalid");
                    result.put("message", "Invalid amount '" + amount + "' - must be positive");
                    result.put("error_code", "INVALID_AMOUNT");
                    return result;
                }
            } catch (NumberFormatException e) {
                result.put("status", "invalid");
                result.put("message", "Invalid amount format '" + amount + "' - must be numeric");
                result.put("error_code", "INVALID_AMOUNT_FORMAT");
                return result;
            }
            
            // 5. PHONE NUMBER VALIDATION
            String cleanPhone = msisdn.replaceAll("[^0-9]", "");
            if (cleanPhone.length() < 9 || cleanPhone.length() > 15) {
                result.put("status", "invalid");
                result.put("message", "Invalid phone number format '" + msisdn + "'");
                result.put("error_code", "INVALID_PHONE_FORMAT");
                return result;
            }
            
            // 6. TRANSACTION ID VALIDATION (if provided)
            if (transid != null && !transid.trim().isEmpty()) {
                if (transid.length() < 5) {
                    result.put("status", "invalid");
                    result.put("message", "Invalid transaction ID format '" + transid + "'");
                    result.put("error_code", "INVALID_TRANSACTION_ID");
                    return result;
                }
            }
            
            // 7. BUSINESS LOGIC VALIDATION - Only send SMS for final statuses
            if ("PENDING".equals(upperStatus)) {
                result.put("status", "ignored");
                result.put("message", "Payment still pending - no SMS sent until final confirmation");
                result.put("error_code", "PAYMENT_PENDING");
                return result;
            }
            
            System.out.println("✅ WEBHOOK VALIDATION PASSED - All checks successful");
            result.put("status", "valid");
            result.put("message", "Webhook validation successful");
            result.put("order_id", orderId);
            result.put("payment_status", upperStatus);
            result.put("amount", amount);
            result.put("msisdn", msisdn);
            
            return result;
            
        } catch (Exception e) {
            System.err.println("❌ WEBHOOK VALIDATION ERROR: " + e.getMessage());
            e.printStackTrace();
            result.put("status", "error");
            result.put("message", "Webhook validation error: " + e.getMessage());
            result.put("error_code", "VALIDATION_ERROR");
            return result;
        }
    }

    /**
     * Test endpoint to verify controller is working
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Customer Portal Controller is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all active internet packages for customer portal (with time-based filtering)
     */
    @GetMapping("/packages")
    public ResponseEntity<Map<String, Object>> getActivePackages() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get packages available for customers (with time-based filtering)
            List<InternetPackage> packages = packageService.getAvailablePackagesForCustomers();
            
            // Transform packages for frontend
            List<Map<String, Object>> transformedPackages = packages.stream()
                .map(pkg -> {
                    Map<String, Object> packageData = new HashMap<>();
                    packageData.put("id", pkg.getId());
                    packageData.put("name", pkg.getName());
                    packageData.put("description", pkg.getDescription());
                    packageData.put("price", pkg.getPrice());
                    packageData.put("durationDays", pkg.getDurationDays());
                    packageData.put("duration", pkg.getDurationDays() + " Days"); // Format duration
                    packageData.put("dataLimit", pkg.getDataLimit() != null ? pkg.getDataLimit() + " MB" : "Unlimited"); // Format data limit
                    packageData.put("speed", pkg.getSpeedLimit() != null ? pkg.getSpeedLimit() + " Mbps" : "High Speed"); // Format speed
                    packageData.put("isPopular", pkg.getIsPopular());
                    packageData.put("isFeatured", pkg.getIsFeatured());
                    packageData.put("packageType", pkg.getPackageType());
                    packageData.put("category", pkg.getCategory());
                    
                    // Add time-based offer information (temporarily disabled until migration)
                    packageData.put("isTimeBasedOffer", false); // pkg.getIsTimeBasedOffer());
                    packageData.put("offerType", null); // pkg.getOfferType());
                    packageData.put("offerDescription", null); // pkg.getOfferDescription());
                    packageData.put("originalPrice", null); // pkg.getOriginalPrice());
                    packageData.put("discountPercentage", null); // pkg.getDiscountPercentage());
                    packageData.put("availableDays", null); // pkg.getAvailableDays());
                    packageData.put("offerStartTime", null); // pkg.getOfferStartTime());
                    packageData.put("offerEndTime", null); // pkg.getOfferEndTime());
                    
                    // Calculate savings for offer packages (temporarily disabled)
                    // if (Boolean.TRUE.equals(pkg.getIsTimeBasedOffer()) && 
                    //     pkg.getOriginalPrice() != null && pkg.getPrice() != null) {
                    //     BigDecimal savings = pkg.getOriginalPrice().subtract(pkg.getPrice());
                    //     packageData.put("savings", savings);
                    //     packageData.put("savingsPercentage", pkg.getDiscountPercentage());
                    // }
                    
                    return packageData;
                })
                .collect(Collectors.toList());
            
            response.put("status", "success");
            response.put("packages", transformedPackages);
            response.put("count", transformedPackages.size());
            
            System.out.println("✅ Retrieved " + transformedPackages.size() + " packages available for customers (with time-based filtering)");
            
        } catch (Exception e) {
            System.err.println("❌ Error retrieving packages: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Failed to retrieve packages");
            response.put("packages", new java.util.ArrayList<>());
        }
        
        return ResponseEntity.ok(response);
    }
}