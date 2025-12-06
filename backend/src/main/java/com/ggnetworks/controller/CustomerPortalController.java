package com.ggnetworks.controller;

import com.ggnetworks.service.PackageService;
import com.ggnetworks.service.SmsService;
import com.ggnetworks.service.VoucherService;
import com.ggnetworks.service.ZenoPayService;
import com.ggnetworks.service.PaymentService;
import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.dto.VoucherDTO;
import com.ggnetworks.util.VoucherMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/customer-portal")
@CrossOrigin(origins = "*")
public class CustomerPortalController {

    @Autowired
    private ZenoPayService zenoPayService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private PackageService packageService;
    
    @Autowired
    private VoucherService voucherService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private com.ggnetworks.service.CustomerService customerService;
    
    @Autowired
    private com.ggnetworks.service.EnhancedRadiusService enhancedRadiusService;
    
    @Autowired
    private com.ggnetworks.service.EnhancedLoyaltyService enhancedLoyaltyService;
    
    @Autowired
    private com.ggnetworks.repository.InternetPackageRepository internetPackageRepository;
    
    @Autowired
    private com.ggnetworks.repository.CustomerRepository customerRepository;
    
    @Autowired
    private com.ggnetworks.repository.PaymentRepository paymentRepository;
    
    @Autowired
    private com.ggnetworks.repository.VoucherRepository voucherRepository;
    
    @Autowired
    private com.ggnetworks.service.InvoiceService invoiceService;
    
    @Autowired
    private com.ggnetworks.repository.InvoiceRepository invoiceRepository;
    
    @Autowired
    private com.ggnetworks.service.SessionManagementService sessionManagementService;
    
    @Autowired
    private com.ggnetworks.service.DeviceFingerprintService deviceFingerprintService;
    
    @Autowired
    private com.ggnetworks.service.RedisSessionService redisSessionService;

    /**
     * Resolve the currently authenticated customer's phone number from the security context.
     * For customer portal JWTs we treat the token subject/username as the phone number.
     */
    private String getAuthenticatedPhoneNumber() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Unauthenticated: customer login required");
        }
        Object principal = authentication.getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            throw new IllegalStateException("Unauthenticated: customer login required");
        }
        return authentication.getName();
    }

    // =========================
    // Helper methods (no duplication)
    // =========================

    private ResponseEntity<Map<String, Object>> buildCustomerProfileResponse(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<com.ggnetworks.entity.Voucher> vouchers = voucherService.getVouchersByCustomerPhone(phoneNumber);

            List<VoucherDTO> voucherList = vouchers.stream()
                .map(VoucherMapper::toDTO)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

            Map<String, Object> profile = new HashMap<>();
            profile.put("phoneNumber", phoneNumber);
            profile.put("totalVouchers", vouchers.size());
            profile.put("usedVouchers", vouchers.stream().filter(com.ggnetworks.entity.Voucher::isUsed).count());
            profile.put("activeVouchers", vouchers.stream()
                .filter(v -> !v.isUsed() && v.getStatus() == com.ggnetworks.entity.Voucher.VoucherStatus.ACTIVE)
                .count());
            profile.put("vouchers", voucherList);

            response.put("status", "success");
            response.put("message", "Customer profile retrieved successfully");
            response.put("data", profile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customer profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(response);
        }
    }

    private ResponseEntity<Map<String, Object>> buildUsageHistoryResponse(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<com.ggnetworks.entity.Voucher> vouchers = voucherService.getVouchersByCustomerPhone(phoneNumber);

            List<Map<String, Object>> usageHistory = vouchers.stream()
                .filter(v -> v.isUsed() && v.getUsedAt() != null)
                .map(v -> {
                    Map<String, Object> usage = new HashMap<>();
                    usage.put("voucherCode", v.getVoucherCode());
                    usage.put("packageName", v.getPackageName());
                    usage.put("packageId", v.getPackageId());
                    usage.put("amount", v.getAmount());
                    usage.put("usedAt", v.getUsedAt());
                    usage.put("expiresAt", v.getExpiresAt());
                    return usage;
                })
                .collect(java.util.stream.Collectors.toList());

            response.put("status", "success");
            response.put("message", "Usage history retrieved successfully");
            response.put("data", usageHistory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve usage history: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private ResponseEntity<Map<String, Object>> buildPaymentHistoryResponse(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<com.ggnetworks.entity.Payment> payments = paymentService.getPaymentsByPhoneNumber(phoneNumber);

            List<Map<String, Object>> paymentHistory = payments.stream()
                .map(p -> {
                    Map<String, Object> payment = new HashMap<>();
                    payment.put("paymentId", p.getPaymentId());
                    payment.put("amount", p.getAmount());
                    payment.put("currency", p.getCurrency());
                    payment.put("status", p.getStatus());
                    payment.put("paymentMethod", p.getPaymentMethod());
                    payment.put("paymentGateway", p.getPaymentGateway());
                    payment.put("createdAt", p.getCreatedAt());
                    payment.put("processedAt", p.getProcessedAt());
                    payment.put("confirmedAt", p.getConfirmedAt());
                    return payment;
                })
                .collect(java.util.stream.Collectors.toList());

            response.put("status", "success");
            response.put("message", "Payment history retrieved successfully");
            response.put("data", paymentHistory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve payment history: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private ResponseEntity<Map<String, Object>> buildDashboardResponse(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        try {
            com.ggnetworks.entity.Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            List<com.ggnetworks.entity.Voucher> vouchers = voucherService.getVouchersByCustomerPhone(phoneNumber);
            List<com.ggnetworks.entity.Payment> payments = paymentService.getPaymentsByPhoneNumber(phoneNumber);

            Map<String, Object> dashboard = new HashMap<>();
            Map<String, Object> customerInfo = new HashMap<>();
            customerInfo.put("id", customer.getId());
            customerInfo.put("name", customer.getFirstName() + " " +
                (customer.getLastName() != null ? customer.getLastName() : ""));
            customerInfo.put("phone", customer.getPrimaryPhoneNumber());
            customerInfo.put("email", customer.getEmail() != null ? customer.getEmail() : "");
            customerInfo.put("status", customer.getStatus());
            dashboard.put("customer", customerInfo);

            dashboard.put("totalVouchers", vouchers.size());
            dashboard.put("activeVouchers", vouchers.stream()
                .filter(v -> v.getStatus() == com.ggnetworks.entity.Voucher.VoucherStatus.ACTIVE && !v.isUsed())
                .count());
            dashboard.put("usedVouchers", vouchers.stream()
                .filter(com.ggnetworks.entity.Voucher::isUsed)
                .count());
            dashboard.put("totalPayments", payments.size());
            dashboard.put("successfulPayments", payments.stream()
                .filter(p -> p.getStatus() == com.ggnetworks.entity.Payment.PaymentStatus.COMPLETED)
                .count());
            dashboard.put("totalSpent", payments.stream()
                .filter(p -> p.getStatus() == com.ggnetworks.entity.Payment.PaymentStatus.COMPLETED)
                .map(com.ggnetworks.entity.Payment::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));

            dashboard.put("recentVouchers", vouchers.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(v -> {
                    Map<String, Object> vInfo = new HashMap<>();
                    vInfo.put("code", v.getVoucherCode());
                    vInfo.put("status", v.getStatus());
                    vInfo.put("isUsed", v.isUsed());
                    vInfo.put("createdAt", v.getCreatedAt());
                    return vInfo;
                })
                .collect(java.util.stream.Collectors.toList()));

            response.put("status", "success");
            response.put("message", "Dashboard retrieved successfully");
            response.put("data", dashboard);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve dashboard: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

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
            
            // Generate order ID with package_id included: PKG_timestamp_phone_packageId
            String orderId = "PKG_" + System.currentTimeMillis() + "_" + phoneNumber.substring(phoneNumber.length() - 4) + "_" + packageId;
            
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
                
                // Create PENDING payment record immediately so status endpoint can find it
                try {
                    com.ggnetworks.entity.Payment pendingPayment = new com.ggnetworks.entity.Payment();
                    pendingPayment.setPaymentId(orderId);
                    pendingPayment.setAmount(new java.math.BigDecimal(amount));
                    pendingPayment.setCurrency("TZS");
                    pendingPayment.setPaymentMethod(com.ggnetworks.entity.Payment.PaymentMethod.MPESA);
                    pendingPayment.setPaymentGateway("ZENOPAY");
                    pendingPayment.setPhoneNumber(phoneNumber);
                    pendingPayment.setDescription("Payment initiated for package: " + packageId);
                    pendingPayment.setStatus(com.ggnetworks.entity.Payment.PaymentStatus.PENDING);
                    pendingPayment.setGatewayReference((String) zenoPayResponse.get("payment_reference"));
                    pendingPayment = paymentRepository.save(pendingPayment);
                    System.out.println("✅ PENDING payment record created with ID: " + pendingPayment.getId());
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to create PENDING payment record (non-critical): " + e.getMessage());
                    // Continue - payment initiation was successful
                }
                
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
     * Get payment status by order ID
     */
    @GetMapping("/payment/status/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable String orderId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🔍 Checking payment status for order: " + orderId);
            
            // Find payment by order ID (paymentId field)
            Optional<com.ggnetworks.entity.Payment> paymentOpt = paymentRepository.findByPaymentId(orderId);
            
            if (paymentOpt.isEmpty()) {
                // Payment not found - might still be pending
                response.put("status", "success");
                response.put("payment_status", "PENDING");
                response.put("message", "Payment is still being processed. Please wait...");
                response.put("order_id", orderId);
                response.put("voucher_code", null);
                response.put("voucher_generated", false);
                return ResponseEntity.ok(response);
            }
            
            com.ggnetworks.entity.Payment payment = paymentOpt.get();
            com.ggnetworks.entity.Payment.PaymentStatus paymentStatus = payment.getStatus();
            
            // Map PaymentStatus enum to string
            String statusString = paymentStatus.name();
            
            // Check if voucher exists for this payment (findByOrderId returns List)
            List<com.ggnetworks.entity.Voucher> vouchers = voucherRepository.findByOrderId(orderId);
            String voucherCode = null;
            boolean voucherGenerated = false;
            
            if (vouchers != null && !vouchers.isEmpty()) {
                // Get the first voucher (should only be one per order)
                voucherCode = vouchers.get(0).getVoucherCode();
                voucherGenerated = true;
            }
            
            response.put("status", "success");
            response.put("payment_status", statusString);
            response.put("order_id", orderId);
            response.put("voucher_code", voucherCode);
            response.put("voucher_generated", voucherGenerated);
            response.put("payment_id", payment.getId());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("created_at", payment.getCreatedAt());
            response.put("confirmed_at", payment.getConfirmedAt());
            response.put("processed_at", payment.getProcessedAt());
            
            // Add appropriate message based on status
            switch (paymentStatus) {
                case COMPLETED:
                    response.put("message", "Payment completed successfully. Voucher generated.");
                    break;
                case FAILED:
                    String failureReason = payment.getFailureReason();
                    response.put("message", failureReason != null ? failureReason : "Payment failed. Please try again.");
                    break;
                case PENDING:
                    response.put("message", "Payment is still being processed. Please complete the payment on your phone.");
                    break;
                default:
                    response.put("message", "Payment status: " + statusString);
            }
            
            System.out.println("✅ Payment status retrieved: " + statusString + " for order: " + orderId);
            
        } catch (Exception e) {
            System.err.println("❌ Error checking payment status: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Error checking payment status: " + e.getMessage());
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
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("🔔 ZENOPAY WEBHOOK RECEIVED");
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("📥 Timestamp: " + java.time.LocalDateTime.now());
            System.out.println("📦 Webhook Data: " + webhookData);
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
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
            
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("✅ Processing webhook for order: " + orderId + " with status: " + paymentStatus);
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            // Process based on payment status
            if ("SUCCESS".equals(paymentStatus) || "COMPLETED".equals(paymentStatus)) {
                System.out.println("🎉 Payment successful! Processing voucher creation...");
                System.out.println("   Order ID: " + orderId);
                System.out.println("   Amount: " + amount);
                System.out.println("   Phone: " + phoneNumber);
                
            // Extract package ID from order ID (format: PKG_timestamp_phone) or webhook data
            // ZenoPay webhook may include package_id, or we extract from order_id
            String packageIdStr = (String) webhookData.get("package_id");
            if (packageIdStr == null || packageIdStr.isEmpty()) {
                // Try to extract from order ID format: PKG_timestamp_phone
                // Store package_id in order_id format: PKG_timestamp_phone_packageId
                if (orderId.contains("_")) {
                    String[] parts = orderId.split("_");
                    if (parts.length >= 4) {
                        packageIdStr = parts[3]; // Last part is package_id
                    }
                }
                if (packageIdStr == null || packageIdStr.isEmpty()) {
                    packageIdStr = "1"; // Default package
                    System.out.println("⚠️ Package ID not found in webhook or order_id, using default: " + packageIdStr);
                } else {
                    System.out.println("✅ Package ID extracted from order_id: " + packageIdStr);
                }
            } else {
                System.out.println("✅ Package ID found in webhook: " + packageIdStr);
            }
            Long packageId = Long.parseLong(packageIdStr);
                
                // Get or create customer
                com.ggnetworks.entity.Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                    .orElseGet(() -> {
                        System.out.println("📝 Creating new customer for phone: " + phoneNumber);
                        com.ggnetworks.entity.Customer newCustomer = new com.ggnetworks.entity.Customer();
                        newCustomer.setCustomerId("CUST_" + System.currentTimeMillis());
                        newCustomer.setFirstName((String) webhookData.getOrDefault("customer_name", "Customer"));
                        newCustomer.setLastName("");
                        newCustomer.setEmail(phoneNumber + "@ggwifi.co.tz");
                        newCustomer.setPrimaryPhoneNumber(phoneNumber);
                        newCustomer.setStatus(com.ggnetworks.entity.Customer.CustomerStatus.ACTIVE);
                        newCustomer.setAccountType(com.ggnetworks.entity.Customer.AccountType.INDIVIDUAL);
                        newCustomer.setRegistrationDate(java.time.LocalDateTime.now());
                        return customerRepository.save(newCustomer);
                    });
                
                // Get package details
                com.ggnetworks.entity.InternetPackage internetPackage = internetPackageRepository.findById(packageId)
                    .orElseThrow(() -> new RuntimeException("Internet package not found: " + packageId));
                
                // Create invoice first (required for payment)
                com.ggnetworks.entity.Invoice invoice = new com.ggnetworks.entity.Invoice();
                invoice.setInvoiceNumber("INV_" + System.currentTimeMillis());
                invoice.setCustomerId(customer.getId());
                invoice.setPackageId(packageId);
                invoice.setAmount(new java.math.BigDecimal(amount));
                invoice.setTotalAmount(new java.math.BigDecimal(amount));
                invoice.setCurrency("TZS");
                invoice.setStatus(com.ggnetworks.entity.Invoice.InvoiceStatus.PAID);
                invoice.setPaymentMethod(com.ggnetworks.entity.Invoice.PaymentMethod.MOBILE_MONEY);
                invoice.setPaymentGateway("ZENOPAY");
                invoice.setPaymentReference(orderId);
                invoice.setPhoneNumber(phoneNumber);
                invoice.setEmail(customer.getEmail());
                invoice.setPaidDate(java.time.LocalDateTime.now());
                invoice = invoiceService.createInvoice(invoice);
                
                // Create payment record
                com.ggnetworks.entity.Payment payment = new com.ggnetworks.entity.Payment();
                payment.setPaymentId(orderId);
                payment.setInvoiceId(invoice.getId()); // Link to invoice
                payment.setCustomerId(customer.getId());
                payment.setAmount(new java.math.BigDecimal(amount));
                payment.setCurrency("TZS");
                payment.setPaymentMethod(com.ggnetworks.entity.Payment.PaymentMethod.MPESA);
                payment.setPaymentGateway("ZENOPAY");
                payment.setStatus(com.ggnetworks.entity.Payment.PaymentStatus.COMPLETED);
                payment.setPhoneNumber(phoneNumber);
                payment.setDescription("Internet package payment: " + internetPackage.getName());
                payment.setGatewayTransactionId((String) webhookData.get("transid"));
                payment.setGatewayReference((String) webhookData.get("payment_reference"));
                payment.setConfirmedAt(java.time.LocalDateTime.now());
                payment.setProcessedAt(java.time.LocalDateTime.now());
                payment = paymentRepository.save(payment);
                
                // Generate voucher code (6-8 alphanumeric: A-Z, a-z, 0-9)
                String voucherCode = voucherService.generateVoucherCode(packageId);
                System.out.println("🎫 Generated voucher code (" + voucherCode.length() + " chars): " + voucherCode);
                
                // Validate voucher code format (6-8 alphanumeric: A-Z, a-z, 0-9)
                if (!voucherCode.matches("[A-Za-z0-9]{6,8}")) {
                    throw new RuntimeException("Invalid voucher code format generated: " + voucherCode + " (must be 6-8 alphanumeric: A-Z, a-z, 0-9)");
                }
                System.out.println("✅ Voucher code format validated: " + voucherCode);
                
                // Create voucher entity manually to ensure all fields are set
                com.ggnetworks.entity.Voucher voucher = new com.ggnetworks.entity.Voucher();
                voucher.setVoucherCode(voucherCode);
                voucher.setPackageId(packageId);
                voucher.setAmount(new java.math.BigDecimal(amount));
                voucher.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
                voucher.setCustomerPhone(phoneNumber);
                voucher.setCustomerPhoneNumber(phoneNumber);
                voucher.setCustomerEmail(customer.getEmail());
                voucher.setOrderId(orderId); // Set order ID - CRITICAL
                voucher.setPaymentReference(orderId);
                voucher.setPaymentChannel("ZENOPAY");
                voucher.setCurrency("TZS");
                
                // Set voucher expiration based on package duration
                if (internetPackage.getDurationDays() != null) {
                    voucher.setExpiresAt(java.time.LocalDateTime.now().plusDays(internetPackage.getDurationDays()));
                } else {
                    voucher.setExpiresAt(java.time.LocalDateTime.now().plusDays(30)); // Default 30 days
                }
                
                // Set package name if available
                if (internetPackage.getName() != null) {
                    voucher.setPackageName(internetPackage.getName());
                }
                
                voucher.setStatus(com.ggnetworks.entity.Voucher.VoucherStatus.ACTIVE);
                voucher.setUsageStatus(com.ggnetworks.entity.Voucher.UsageStatus.UNUSED);
                voucher.setActivatedAt(java.time.LocalDateTime.now());
                voucher.setGeneratedAt(java.time.LocalDateTime.now());
                voucher.setCreatedBy("system");
                
                // Save voucher
                voucher = voucherRepository.save(voucher);
                System.out.println("✅ Voucher created successfully with order ID: " + orderId);
                
                // Create RADIUS user for internet access
                System.out.println("🔐 Creating RADIUS user for voucher...");
                boolean radiusUserCreated = enhancedRadiusService.createRadiusUserAfterPayment(
                    payment.getId(), phoneNumber, voucherCode);
                
                if (!radiusUserCreated) {
                    System.out.println("⚠️ Warning: RADIUS user creation failed, but voucher is created");
                }
                
                // Award loyalty points after successful payment
                System.out.println("🎁 Awarding loyalty points...");
                try {
                    Map<String, Object> loyaltyResult = enhancedLoyaltyService.awardPointsAfterPayment(
                        payment.getId(), phoneNumber, packageId, voucherCode);
                    System.out.println("✅ Loyalty points awarded: " + loyaltyResult);
                    response.put("loyalty_points_awarded", loyaltyResult.get("pointsAwarded"));
                    response.put("loyalty_balance", loyaltyResult.get("newBalance"));
                    response.put("loyalty_tier", loyaltyResult.get("loyaltyTier"));
                } catch (Exception e) {
                    System.out.println("⚠️ Loyalty points awarding failed (non-critical): " + e.getMessage());
                    // Continue - payment and voucher are already created
                }
                
                // Send success SMS with voucher
                String packageName = internetPackage.getName();
                String duration = internetPackage.getDurationDays() != null ? 
                    internetPackage.getDurationDays() + " Days" : "30 Days";
                
                Map<String, Object> smsResult = new HashMap<>();
                try {
                    smsResult = smsService.sendVoucherNotificationSms(
                        phoneNumber, 
                        customer.getFirstName(),
                        packageName,
                        voucherCode,
                        amount,
                        duration
                    );
                    System.out.println("📱 SMS Result: " + smsResult);
                } catch (Exception e) {
                    System.out.println("⚠️ SMS sending failed (voucher still created): " + e.getMessage());
                    smsResult.put("status", "error");
                    smsResult.put("message", "SMS sending failed but voucher created successfully: " + e.getMessage());
                    // Continue - voucher is already created, SMS failure is non-critical
                }
                
                response.put("status", "success");
                String smsStatus = (String) smsResult.getOrDefault("status", "error");
                response.put("message", "Payment processed successfully. Voucher generated" + 
                    ("success".equals(smsStatus) ? " and SMS sent." : " (SMS service unavailable)."));
                response.put("voucher_code", voucherCode);
                response.put("payment_id", payment.getId());
                response.put("customer_id", customer.getId());
                response.put("sms_status", smsStatus);
                response.put("sms_message", smsResult.getOrDefault("message", "SMS service unavailable"));
                response.put("radius_user_created", radiusUserCreated);
                response.put("customer_created", customer.getId());
                response.put("payment_recorded", payment.getId());
                response.put("voucher_created", voucher.getVoucherCode());
                
            } else if ("FAILED".equals(paymentStatus) || "CANCELLED".equals(paymentStatus) || 
                       "INSUFFICIENT_BALANCE".equals(paymentStatus) || "INVALID_PIN".equals(paymentStatus) ||
                       "USER_CANCELLED".equals(paymentStatus) || "EXPIRED".equals(paymentStatus) ||
                       "TIMEOUT".equals(paymentStatus) || "NETWORK_ERROR".equals(paymentStatus) ||
                       "ERROR".equals(paymentStatus)) {
                System.out.println("❌ Payment failed with status: " + paymentStatus + "! Processing failure notification...");
                
                // Determine failure reason message
                String failureReason = "Payment " + paymentStatus;
                String userMessage = "Payment failed. Please try again.";
                
                if ("INSUFFICIENT_BALANCE".equals(paymentStatus)) {
                    failureReason = "Insufficient balance in mobile money account";
                    userMessage = "Insufficient balance. Please top up your mobile money account and try again.";
                } else if ("INVALID_PIN".equals(paymentStatus)) {
                    failureReason = "Invalid PIN entered";
                    userMessage = "Invalid PIN. Please try again with the correct PIN.";
                } else if ("USER_CANCELLED".equals(paymentStatus) || "CANCELLED".equals(paymentStatus)) {
                    failureReason = "Payment cancelled by user";
                    userMessage = "Payment was cancelled. Please try again.";
                } else if ("EXPIRED".equals(paymentStatus)) {
                    failureReason = "Payment expired";
                    userMessage = "Payment has expired. Please initiate a new payment.";
                } else if ("TIMEOUT".equals(paymentStatus)) {
                    failureReason = "Payment timed out";
                    userMessage = "Payment timed out. Please try again.";
                } else if ("NETWORK_ERROR".equals(paymentStatus)) {
                    failureReason = "Network error occurred";
                    userMessage = "Network error. Please check your connection and try again.";
                }
                
                // IMPORTANT: For failed payments, DO NOT create customer/user
                // Only send SMS if customer already exists
                Optional<com.ggnetworks.entity.Customer> existingCustomerOpt = customerRepository.findByPhoneNumber(phoneNumber);
                
                // Send failure SMS only if customer exists
                Map<String, Object> smsResult = new HashMap<>();
                if (existingCustomerOpt.isPresent()) {
                    com.ggnetworks.entity.Customer existingCustomer = existingCustomerOpt.get();
                    try {
                        smsResult = smsService.sendPaymentFailureSms(phoneNumber, existingCustomer.getFirstName());
                        System.out.println("📱 Failure SMS Result: " + smsResult);
                    } catch (Exception e) {
                        System.err.println("⚠️ Failure SMS sending failed (non-critical): " + e.getMessage());
                        smsResult.put("status", "error");
                        smsResult.put("message", "SMS service unavailable");
                    }
                } else {
                    System.out.println("ℹ️ Customer not found for phone: " + phoneNumber + " - No SMS sent (payment failed, no user created)");
                    smsResult.put("status", "skipped");
                    smsResult.put("message", "No customer record exists - no SMS sent");
                }
                
                String smsStatus = (String) smsResult.getOrDefault("status", "skipped");
                response.put("status", "failed");
                response.put("payment_status", paymentStatus);
                response.put("message", userMessage);
                response.put("failure_reason", failureReason);
                response.put("sms_status", smsStatus);
                response.put("sms_message", smsResult.getOrDefault("message", "No SMS sent"));
                response.put("user_created", false);
                
                // Create or update payment record for failed payment
                try {
                    Optional<com.ggnetworks.entity.Payment> existingPaymentOpt = paymentRepository.findByPaymentId(orderId);
                    com.ggnetworks.entity.Payment failedPayment;
                    
                    if (existingPaymentOpt.isPresent()) {
                        // Update existing payment record
                        failedPayment = existingPaymentOpt.get();
                        System.out.println("📝 Updating existing payment record for order: " + orderId);
                    } else {
                        // Create new payment record
                        failedPayment = new com.ggnetworks.entity.Payment();
                        failedPayment.setPaymentId(orderId);
                        com.ggnetworks.entity.Customer failedCustomer = customerRepository.findByPhoneNumber(phoneNumber)
                            .orElse(null);
                        if (failedCustomer != null) {
                            failedPayment.setCustomerId(failedCustomer.getId());
                        }
                        failedPayment.setAmount(new java.math.BigDecimal(amount));
                        failedPayment.setCurrency("TZS");
                        failedPayment.setPaymentMethod(com.ggnetworks.entity.Payment.PaymentMethod.MPESA);
                        failedPayment.setPaymentGateway("ZENOPAY");
                        failedPayment.setPhoneNumber(phoneNumber);
                        failedPayment.setDescription("Failed payment: " + paymentStatus);
                    }
                    
                    // Update status and failure reason
                    failedPayment.setStatus(com.ggnetworks.entity.Payment.PaymentStatus.FAILED);
                    failedPayment.setFailureReason(failureReason);
                    failedPayment.setGatewayTransactionId((String) webhookData.get("transid"));
                    failedPayment.setGatewayReference((String) webhookData.get("payment_reference"));
                    failedPayment.setProcessedAt(java.time.LocalDateTime.now());
                    paymentRepository.save(failedPayment);
                    System.out.println("✅ Payment record saved with status: FAILED, reason: " + failureReason);
                } catch (Exception e) {
                    System.out.println("⚠️ Failed to create/update payment record: " + e.getMessage());
                    e.printStackTrace();
                }
            } else if ("PENDING".equals(paymentStatus)) {
                // Handle pending status - create payment record but don't process yet
                System.out.println("⏳ Payment pending for order: " + orderId);
                
                try {
                    Optional<com.ggnetworks.entity.Payment> existingPaymentOpt = paymentRepository.findByPaymentId(orderId);
                    com.ggnetworks.entity.Payment pendingPayment;
                    
                    if (existingPaymentOpt.isPresent()) {
                        pendingPayment = existingPaymentOpt.get();
                    } else {
                        pendingPayment = new com.ggnetworks.entity.Payment();
                        pendingPayment.setPaymentId(orderId);
                        pendingPayment.setAmount(new java.math.BigDecimal(amount));
                        pendingPayment.setCurrency("TZS");
                        pendingPayment.setPaymentMethod(com.ggnetworks.entity.Payment.PaymentMethod.MPESA);
                        pendingPayment.setPaymentGateway("ZENOPAY");
                        pendingPayment.setPhoneNumber(phoneNumber);
                        pendingPayment.setDescription("Pending payment");
                    }
                    
                    pendingPayment.setStatus(com.ggnetworks.entity.Payment.PaymentStatus.PENDING);
                    pendingPayment.setGatewayTransactionId((String) webhookData.get("transid"));
                    pendingPayment.setGatewayReference((String) webhookData.get("payment_reference"));
                    paymentRepository.save(pendingPayment);
                } catch (Exception e) {
                    System.out.println("⚠️ Failed to create/update pending payment record: " + e.getMessage());
                }
                
                response.put("status", "pending");
                response.put("payment_status", "PENDING");
                response.put("message", "Payment is still pending. Please complete the payment on your phone.");
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
            
            // 1. REQUIRED FIELDS VALIDATION - Support multiple field name variations (ZenoPay format)
            String orderId = (String) webhookData.get("order_id");
            if (orderId == null) orderId = (String) webhookData.get("orderId");
            if (orderId == null) orderId = (String) webhookData.get("reference");
            
            String paymentStatus = (String) webhookData.get("payment_status");
            if (paymentStatus == null) paymentStatus = (String) webhookData.get("status");
            if (paymentStatus == null) paymentStatus = (String) webhookData.get("result");
            
            Object amountObj = webhookData.get("amount");
            String amount = null;
            if (amountObj != null) {
                amount = amountObj instanceof String ? (String) amountObj : String.valueOf(amountObj);
            }
            
            String msisdn = (String) webhookData.get("msisdn");
            if (msisdn == null) msisdn = (String) webhookData.get("phone");
            if (msisdn == null) msisdn = (String) webhookData.get("buyer_phone");
            if (msisdn == null) msisdn = (String) webhookData.get("phone_number");
            
            String transid = (String) webhookData.get("transid");
            if (transid == null) transid = (String) webhookData.get("transaction_id");
            if (transid == null) transid = (String) webhookData.get("transactionId");
            
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
            
            // 3. PAYMENT STATUS VALIDATION - Support all payment statuses
            String upperStatus = paymentStatus.toUpperCase();
            // Accept all valid payment statuses from ZenoPay
            List<String> validStatuses = java.util.Arrays.asList(
                "SUCCESS", "COMPLETED", "FAILED", "CANCELLED", "PENDING", 
                "INSUFFICIENT_BALANCE", "INVALID_PIN", "USER_CANCELLED", 
                "EXPIRED", "TIMEOUT", "NETWORK_ERROR", "ERROR"
            );
            
            if (!validStatuses.contains(upperStatus)) {
                result.put("status", "invalid");
                result.put("message", "Invalid payment_status '" + paymentStatus + "' - valid statuses: " + validStatuses);
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
     * Test webhook endpoint accessibility
     */
    @GetMapping("/webhook/zenopay/test")
    public ResponseEntity<Map<String, Object>> testWebhookEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Webhook endpoint is accessible");
        response.put("endpoint", "/api/v1/customer-portal/webhook/zenopay");
        response.put("method", "POST");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
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
                    
                    // Add time-based offer information (ENABLED)
                    packageData.put("isTimeBasedOffer", pkg.getIsTimeBasedOffer());
                    packageData.put("offerType", pkg.getOfferType());
                    packageData.put("offerDescription", pkg.getOfferDescription());
                    packageData.put("originalPrice", pkg.getOriginalPrice());
                    packageData.put("discountPercentage", pkg.getDiscountPercentage());
                    packageData.put("availableDays", pkg.getAvailableDays());
                    packageData.put("offerStartTime", pkg.getOfferStartTime());
                    packageData.put("offerEndTime", pkg.getOfferEndTime());
                    
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

    /**
     * Get customer profile and history (self-service)
     */
    @GetMapping("/customer/{phoneNumber}/profile")
    public ResponseEntity<Map<String, Object>> getCustomerProfile(@PathVariable String phoneNumber) {
        return buildCustomerProfileResponse(phoneNumber);
    }

    /**
     * Get current logged-in customer's profile (phone resolved from JWT)
     */
    @GetMapping("/customer/me/profile")
    public ResponseEntity<Map<String, Object>> getMyProfile() {
        try {
            String phoneNumber = getAuthenticatedPhoneNumber();
            return buildCustomerProfileResponse(phoneNumber);
        } catch (IllegalStateException ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Get customer usage history
     */
    @GetMapping("/customer/{phoneNumber}/usage")
    public ResponseEntity<Map<String, Object>> getCustomerUsageHistory(@PathVariable String phoneNumber) {
        return buildUsageHistoryResponse(phoneNumber);
    }

    /**
     * Get current logged-in customer's usage history
     */
    @GetMapping("/customer/me/usage")
    public ResponseEntity<Map<String, Object>> getMyUsageHistory() {
        try {
            String phoneNumber = getAuthenticatedPhoneNumber();
            return buildUsageHistoryResponse(phoneNumber);
        } catch (IllegalStateException ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Get customer payment history
     */
    @GetMapping("/customer/{phoneNumber}/payments")
    public ResponseEntity<Map<String, Object>> getCustomerPaymentHistory(@PathVariable String phoneNumber) {
        return buildPaymentHistoryResponse(phoneNumber);
    }

    /**
     * Get current logged-in customer's payment history
     */
    @GetMapping("/customer/me/payments")
    public ResponseEntity<Map<String, Object>> getMyPaymentHistory() {
        try {
            String phoneNumber = getAuthenticatedPhoneNumber();
            return buildPaymentHistoryResponse(phoneNumber);
        } catch (IllegalStateException ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    /**
     * Get customer dashboard
     */
    @GetMapping("/customer/{phoneNumber}/dashboard")
    public ResponseEntity<Map<String, Object>> getCustomerDashboard(@PathVariable String phoneNumber) {
        return buildDashboardResponse(phoneNumber);
    }

    /**
     * Get current logged-in customer's dashboard
     */
    @GetMapping("/customer/me/dashboard")
    public ResponseEntity<Map<String, Object>> getMyDashboard() {
        try {
            String phoneNumber = getAuthenticatedPhoneNumber();
            return buildDashboardResponse(phoneNumber);
        } catch (IllegalStateException ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    /**
     * Check voucher validity
     */
    @GetMapping("/voucher/{voucherCode}/validate")
    public ResponseEntity<Map<String, Object>> validateVoucher(@PathVariable String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<com.ggnetworks.entity.Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
            
            if (voucherOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Voucher code not found");
                return ResponseEntity.ok(response);
            }
            
            com.ggnetworks.entity.Voucher voucher = voucherOpt.get();
            
            // Check if expired
            if (voucher.getExpiresAt() != null && voucher.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
                response.put("status", "error");
                response.put("message", "Voucher has expired");
                return ResponseEntity.ok(response);
            }
            
            // Check if used
            if (voucher.isUsed()) {
                response.put("status", "error");
                response.put("message", "Voucher has already been used");
                return ResponseEntity.ok(response);
            }
            
            // Get package details
            com.ggnetworks.entity.InternetPackage internetPackage = internetPackageRepository.findById(voucher.getPackageId())
                .orElse(null);
            
            Map<String, Object> packageInfo = new HashMap<>();
            if (internetPackage != null) {
                packageInfo.put("name", internetPackage.getName());
                packageInfo.put("duration", internetPackage.getDurationDays() != null ? internetPackage.getDurationDays() + " Days" : "N/A");
            }
            
            // Build response data
            Map<String, Object> voucherData = new HashMap<>();
            voucherData.put("voucherCode", voucher.getVoucherCode());
            voucherData.put("status", voucher.getStatus());
            voucherData.put("expiresAt", voucher.getExpiresAt() != null ? voucher.getExpiresAt().toString() : "N/A");
            voucherData.put("isUsed", voucher.isUsed());
            voucherData.put("isActive", voucher.getStatus() == com.ggnetworks.entity.Voucher.VoucherStatus.ACTIVE);
            voucherData.put("package", packageInfo);
            if (voucher.getAmount() != null) {
                voucherData.put("amount", voucher.getAmount());
            }
            if (voucher.getCreatedAt() != null) {
                voucherData.put("createdAt", voucher.getCreatedAt().toString());
            }
            
            response.put("status", "success");
            response.put("message", "Voucher is valid and ready to use");
            response.put("data", voucherData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to validate voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Activate voucher and create session
     */
    @PostMapping("/voucher/{voucherCode}/activate")
    public ResponseEntity<Map<String, Object>> activateVoucher(
            @PathVariable String voucherCode,
            @RequestBody Map<String, Object> activationData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phoneNumber = (String) activationData.get("phoneNumber");
            String macAddress = (String) activationData.get("macAddress");
            String ipAddress = (String) activationData.get("ipAddress");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate voucher first
            Optional<com.ggnetworks.entity.Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
            if (voucherOpt.isEmpty() || !voucherOpt.get().isActive()) {
                response.put("status", "error");
                response.put("message", "Invalid or inactive voucher");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Handle device fingerprinting (for MAC randomization immunity)
            String deviceFingerprintHash = (String) activationData.get("deviceFingerprintHash");
            if (deviceFingerprintHash != null && !deviceFingerprintHash.isEmpty()) {
                // Create or update device fingerprint
                deviceFingerprintService.createOrUpdateFingerprint(
                    deviceFingerprintHash, voucherCode, phoneNumber, macAddress, ipAddress);
            }
            
            // Create session (with Redis storage for fast lookups)
            com.ggnetworks.entity.VoucherSession session = sessionManagementService.createSession(
                voucherCode, phoneNumber, macAddress, ipAddress);
            
            // Create RADIUS user
            boolean radiusCreated = enhancedRadiusService.createRadiusUserForVoucherLogin(
                phoneNumber, voucherCode);
            
            if (!radiusCreated) {
                response.put("status", "error");
                response.put("message", "Failed to create internet access");
                return ResponseEntity.status(500).body(response);
            }
            
            // Update voucher status
            com.ggnetworks.entity.Voucher voucher = voucherOpt.get();
            voucher.setStatus(com.ggnetworks.entity.Voucher.VoucherStatus.ACTIVE);
            voucher.setActivatedAt(java.time.LocalDateTime.now());
            voucher.setActivatedBy(phoneNumber);
            voucherRepository.save(voucher);
            
            response.put("status", "success");
            response.put("message", "Voucher activated successfully - seamless session created");
            response.put("sessionId", session.getId());
            response.put("sessionToken", session.getSessionToken());
            response.put("expiresAt", session.getExpiresAt().toString());
            response.put("remainingTimeSeconds", session.getRemainingTimeSeconds());
            response.put("persistentSession", session.getPersistentSession());
            response.put("noReauthenticationRequired", session.getNoReauthenticationRequired());
            response.put("heartbeatIntervalSeconds", session.getHeartbeatIntervalSeconds());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to activate voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get session status
     */
    @GetMapping("/voucher/{voucherCode}/session/status")
    public ResponseEntity<Map<String, Object>> getSessionStatus(@PathVariable String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            com.ggnetworks.service.SessionManagementService.SessionStatusResponse sessionStatus = 
                sessionManagementService.getSessionStatus(voucherCode);
            
            if (sessionStatus == null) {
                response.put("status", "error");
                response.put("message", "No active session found");
                return ResponseEntity.ok(response);
            }
            
            response.put("status", "success");
            response.put("active", sessionStatus.isActive());
            response.put("connected", sessionStatus.isConnected());
            response.put("expired", sessionStatus.isExpired());
            response.put("remainingTimeSeconds", sessionStatus.getRemainingTimeSeconds());
            response.put("elapsedTimeSeconds", sessionStatus.getElapsedTimeSeconds());
            response.put("expiresAt", sessionStatus.getExpiresAt().toString());
            response.put("sessionStatus", sessionStatus.getSessionStatus().toString());
            response.put("macAddress", sessionStatus.getMacAddress());
            response.put("ipAddress", sessionStatus.getIpAddress());
            response.put("macChangesCount", sessionStatus.getMacChangesCount());
            response.put("ipChangesCount", sessionStatus.getIpChangesCount());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get session status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Update session MAC address (handles MAC randomization)
     */
    @PostMapping("/voucher/{voucherCode}/session/update-mac")
    public ResponseEntity<Map<String, Object>> updateMacAddress(
            @PathVariable String voucherCode,
            @RequestBody Map<String, Object> updateData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newMacAddress = (String) updateData.get("macAddress");
            
            if (newMacAddress == null || newMacAddress.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "MAC address is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = sessionManagementService.updateMacAddress(voucherCode, newMacAddress);
            
            if (updated) {
                response.put("status", "success");
                response.put("message", "MAC address updated successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Failed to update MAC address");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update MAC address: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Update session IP address (handles IP changes)
     */
    @PostMapping("/voucher/{voucherCode}/session/update-ip")
    public ResponseEntity<Map<String, Object>> updateIpAddress(
            @PathVariable String voucherCode,
            @RequestBody Map<String, Object> updateData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newIpAddress = (String) updateData.get("ipAddress");
            
            if (newIpAddress == null || newIpAddress.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "IP address is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = sessionManagementService.updateIpAddress(voucherCode, newIpAddress);
            
            if (updated) {
                response.put("status", "success");
                response.put("message", "IP address updated successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Failed to update IP address");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update IP address: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Reconnect session after disconnection (seamless, no re-authentication)
     */
    @PostMapping("/voucher/{voucherCode}/session/reconnect")
    public ResponseEntity<Map<String, Object>> reconnectSession(
            @PathVariable String voucherCode,
            @RequestBody Map<String, Object> reconnectData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String macAddress = (String) reconnectData.get("macAddress");
            String ipAddress = (String) reconnectData.get("ipAddress");
            
            boolean reconnected = sessionManagementService.reconnectSession(
                voucherCode, macAddress, ipAddress);
            
            if (reconnected) {
                // Get session to return token
                Optional<com.ggnetworks.entity.VoucherSession> sessionOpt = 
                    sessionManagementService.getActiveSession(voucherCode);
                
                response.put("status", "success");
                response.put("message", "Session reconnected successfully (no re-authentication required)");
                if (sessionOpt.isPresent()) {
                    response.put("sessionToken", sessionOpt.get().getSessionToken());
                    response.put("persistentSession", sessionOpt.get().getPersistentSession());
                }
            } else {
                response.put("status", "error");
                response.put("message", "Failed to reconnect session");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reconnect session: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Record session heartbeat (keeps session alive, prevents disconnection)
     */
    @PostMapping("/voucher/{voucherCode}/session/heartbeat")
    public ResponseEntity<Map<String, Object>> recordHeartbeat(
            @PathVariable String voucherCode,
            @RequestBody Map<String, Object> heartbeatData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String macAddress = (String) heartbeatData.get("macAddress");
            String ipAddress = (String) heartbeatData.get("ipAddress");
            String deviceFingerprintHash = (String) heartbeatData.get("deviceFingerprintHash");
            
            // Update device fingerprint if provided (for MAC randomization immunity)
            if (deviceFingerprintHash != null && !deviceFingerprintHash.isEmpty()) {
                Optional<com.ggnetworks.entity.Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
                if (voucherOpt.isPresent()) {
                    String phoneNumber = voucherOpt.get().getCustomerPhoneNumber();
                    // Update fingerprint last seen (creates if doesn't exist)
                    deviceFingerprintService.createOrUpdateFingerprint(
                        deviceFingerprintHash, voucherCode, phoneNumber, macAddress, ipAddress);
                }
            }
            
            boolean heartbeatRecorded = sessionManagementService.recordHeartbeat(
                voucherCode, macAddress, ipAddress);
            
            if (heartbeatRecorded) {
                response.put("status", "success");
                response.put("message", "Heartbeat recorded - session remains active");
            } else {
                response.put("status", "error");
                response.put("message", "Failed to record heartbeat");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to record heartbeat: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Reconnect using session token (seamless reconnection, no re-authentication)
     */
    @PostMapping("/session/reconnect-token")
    public ResponseEntity<Map<String, Object>> reconnectWithToken(
            @RequestBody Map<String, Object> reconnectData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String sessionToken = (String) reconnectData.get("sessionToken");
            String macAddress = (String) reconnectData.get("macAddress");
            String ipAddress = (String) reconnectData.get("ipAddress");
            
            if (sessionToken == null || sessionToken.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Session token is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean reconnected = sessionManagementService.reconnectWithToken(
                sessionToken, macAddress, ipAddress);
            
            if (reconnected) {
                response.put("status", "success");
                response.put("message", "Session reconnected seamlessly using token (no re-authentication)");
            } else {
                response.put("status", "error");
                response.put("message", "Invalid or expired session token");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reconnect with token: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}