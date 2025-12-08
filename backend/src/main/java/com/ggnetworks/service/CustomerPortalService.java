package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CustomerPortalService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomerPortalService.class);
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private CustomerAccountRepository customerAccountRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private InternetPackageRepository internetPackageRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private EnhancedRadiusService enhancedRadiusService;
    
    /**
     * Customer login with voucher code and phone number
     */
    @Transactional
    public Map<String, Object> customerVoucherLogin(String phoneNumber, String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate voucher login
            if (!enhancedRadiusService.validateVoucherLogin(phoneNumber, voucherCode)) {
                response.put("status", "error");
                response.put("message", "Invalid voucher code or phone number");
                return response;
            }
            
            // Get customer details
            Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Get voucher details
            Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
            
            // Get internet package details
            InternetPackage internetPackage = internetPackageRepository.findById(voucher.getPackageId())
                .orElseThrow(() -> new RuntimeException("Internet package not found"));
            
            // Create RADIUS user for internet access
            boolean radiusUserCreated = enhancedRadiusService.createRadiusUserForVoucherLogin(phoneNumber, voucherCode);
            
            if (!radiusUserCreated) {
                response.put("status", "error");
                response.put("message", "Failed to create internet access credentials");
                return response;
            }
            
            // Generate session token (simplified)
            String sessionToken = generateSessionToken(phoneNumber, voucherCode);
            
            // Prepare response
            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("sessionToken", sessionToken);
            
            Map<String, Object> customerInfo = new HashMap<>();
            customerInfo.put("phoneNumber", customer.getPhoneNumber());
            customerInfo.put("firstName", customer.getFirstName());
            customerInfo.put("lastName", customer.getLastName());
            customerInfo.put("email", customer.getEmail());
            customerInfo.put("status", customer.getStatus());
            response.put("customer", customerInfo);
            
            Map<String, Object> packageInfo = new HashMap<>();
            packageInfo.put("packageName", internetPackage.getName());
            packageInfo.put("dataLimit", internetPackage.getDataLimit());
            packageInfo.put("speedLimit", internetPackage.getSpeedLimit());
            packageInfo.put("duration", internetPackage.getDuration());
            packageInfo.put("durationValue", internetPackage.getDurationDays());
            response.put("package", packageInfo);
            
            Map<String, Object> voucherInfo = new HashMap<>();
            voucherInfo.put("voucherCode", voucher.getVoucherCode());
            voucherInfo.put("status", voucher.getStatus());
            voucherInfo.put("activatedAt", voucher.getActivatedAt());
            voucherInfo.put("expiresAt", voucher.getExpiresAt());
            response.put("voucher", voucherInfo);
            
            // Update customer last login
            customer.setLastLoginAt(LocalDateTime.now());
            customer.setLastActivityAt(LocalDateTime.now());
            customerRepository.save(customer);
            
            logger.info("Customer {} successfully logged in with voucher {}", phoneNumber, voucherCode);
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to process customer voucher login for {}: {}", phoneNumber, e.getMessage());
            response.put("status", "error");
            response.put("message", "Login failed: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Customer payment and automatic voucher activation
     */
    @Transactional
    public Map<String, Object> processCustomerPayment(Long customerId, String packageId, String paymentMethod, 
                                                     String paymentGateway, String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get customer details
            Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Get internet package
            InternetPackage internetPackage = internetPackageRepository.findById(Long.parseLong(packageId))
                .orElseThrow(() -> new RuntimeException("Internet package not found"));
            
            // Create voucher for the package
            Voucher voucher = createVoucherForPackage(internetPackage, customer.getPhoneNumber());
            
            // Create payment record
            Payment payment = createPaymentRecord(customer, internetPackage, paymentMethod, paymentGateway);
            
            // Create transaction record
            Transaction transaction = createTransactionRecord(customer, payment, internetPackage);
            
            // Simulate payment processing (in real implementation, this would call payment gateway)
            boolean paymentSuccessful = processPaymentWithGateway(payment, paymentGateway);
            
            if (paymentSuccessful) {
                // Update payment status
                payment.setStatus(Payment.PaymentStatus.SUCCESSFUL);
                payment.setConfirmedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                
                // Update transaction status
                transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
                transaction.setConfirmedAt(LocalDateTime.now());
                transactionRepository.save(transaction);
                
                // Create RADIUS user for internet access
                boolean radiusUserCreated = enhancedRadiusService.createRadiusUserAfterPayment(
                    payment.getId(), customer.getPhoneNumber(), voucher.getVoucherCode());
                
                if (radiusUserCreated) {
                    response.put("status", "success");
                    response.put("message", "Payment successful and internet access activated");
                    response.put("paymentId", payment.getId());
                    response.put("transactionId", transaction.getId());
                    response.put("voucherCode", voucher.getVoucherCode());
                    
                    Map<String, Object> packageInfo = new HashMap<>();
                    packageInfo.put("packageName", internetPackage.getName());
                    packageInfo.put("dataLimit", internetPackage.getDataLimit());
                    packageInfo.put("speedLimit", internetPackage.getSpeedLimit());
                    packageInfo.put("duration", internetPackage.getDuration());
                    response.put("package", packageInfo);
                    
                    logger.info("Customer {} payment successful, internet access activated", customer.getPhoneNumber());
                } else {
                    response.put("status", "error");
                    response.put("message", "Payment successful but failed to activate internet access");
                }
            } else {
                // Payment failed
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Payment gateway processing failed");
                paymentRepository.save(payment);
                
                transaction.setStatus(Transaction.TransactionStatus.FAILED);
                transaction.setFailureReason("Payment gateway processing failed");
                transactionRepository.save(transaction);
                
                response.put("status", "error");
                response.put("message", "Payment processing failed");
            }
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to process customer payment for customer {}: {}", customerId, e.getMessage());
            response.put("status", "error");
            response.put("message", "Payment processing failed: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Get available packages for customer portal
     */
    public Map<String, Object> getAvailablePackages() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            logger.info("Retrieving available packages for customer portal...");
            
            // Get all active hotspot packages
            List<InternetPackage> packages = internetPackageRepository.findByPackageTypeAndIsActiveTrue(
                InternetPackage.PackageType.HOTSPOT);
            
            if (packages.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No packages available");
                return response;
            }
            
            // Convert packages to response format
            List<Map<String, Object>> packageList = new ArrayList<>();
            
            for (InternetPackage pkg : packages) {
                Map<String, Object> packageInfo = new HashMap<>();
                packageInfo.put("id", pkg.getId());
                packageInfo.put("name", pkg.getName());
                packageInfo.put("type", pkg.getPackageType());
                packageInfo.put("price", pkg.getPrice());
                packageInfo.put("durationDays", pkg.getDurationDays());
                packageInfo.put("duration", pkg.getDuration());
                packageInfo.put("dataLimitMb", pkg.getDataLimitMb());
                packageInfo.put("dataLimit", pkg.getDataLimit());
                packageInfo.put("speedLimit", pkg.getSpeedLimit());
                packageInfo.put("description", pkg.getDescription());
                packageInfo.put("isPopular", pkg.getIsPopular());
                packageInfo.put("isFeatured", pkg.getIsFeatured());
                packageInfo.put("isActive", pkg.getIsActive());
                packageInfo.put("originalPrice", pkg.getOriginalPrice());
                packageInfo.put("discountPercentage", pkg.getDiscountPercentage());
                packageInfo.put("isTimeBasedOffer", pkg.getIsTimeBasedOffer());
                packageInfo.put("offerType", pkg.getOfferType());
                packageInfo.put("offerDescription", pkg.getOfferDescription());
                
                // Calculate GG Points if not set
                Integer points = pkg.getLoyaltyPointsAwarded();
                if (points == null || points == 0) {
                    // Calculate based on package type and duration
                    if (pkg.getDurationDays() != null) {
                        if (pkg.getDurationDays() <= 1) {
                            points = 2; // Daily
                        } else if (pkg.getDurationDays() <= 7) {
                            points = 6; // Weekly
                        } else if (pkg.getDurationDays() <= 30) {
                            points = 10; // Monthly
                        } else if (pkg.getDurationDays() >= 150) {
                            points = 40; // Semester
                        } else {
                            points = Math.max(1, pkg.getDurationDays() / 3);
                        }
                    } else {
                        points = 1; // Default
                    }
                }
                packageInfo.put("loyaltyPointsAwarded", points);
                packageInfo.put("ggPoints", points); // Alias for frontend
                
                packageInfo.put("createdAt", pkg.getCreatedAt());
                
                packageList.add(packageInfo);
            }
            
            response.put("status", "success");
            response.put("packages", packageList);
            response.put("message", "Packages retrieved successfully");
            response.put("count", packageList.size());
            
            logger.info("Successfully retrieved {} packages for customer portal", packageList.size());
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to retrieve available packages: {}", e.getMessage());
            response.put("status", "error");
            response.put("message", "Failed to retrieve packages: " + e.getMessage());
            return response;
        }
    }

    /**
     * Get customer dashboard information
     */
    public Map<String, Object> getCustomerDashboard(String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get customer account (for trial info)
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            
            // Get customer details
            Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Get customer's vouchers
            List<Voucher> vouchers = voucherRepository.findByCustomerPhoneNumber(phoneNumber);
            
            // Get customer's payments
            List<Payment> payments = paymentRepository.findByPhoneNumber(phoneNumber);
            
            // Get customer's transactions
            List<Transaction> transactions = transactionRepository.findByCustomerId(customer.getId());
            
            // Get active RADIUS sessions
            List<Map<String, Object>> activeSessions = enhancedRadiusService.getActiveRadiusSessions();
            List<Map<String, Object>> customerActiveSessions = new ArrayList<>();
            
            for (Map<String, Object> session : activeSessions) {
                String username = (String) session.get("username");
                if (username != null && username.startsWith(phoneNumber + "_")) {
                    customerActiveSessions.add(session);
                }
            }
            
            // Prepare response
            response.put("status", "success");
            
            Map<String, Object> customerInfo = new HashMap<>();
            customerInfo.put("phoneNumber", customer.getPhoneNumber());
            customerInfo.put("firstName", customer.getFirstName());
            customerInfo.put("lastName", customer.getLastName());
            customerInfo.put("email", customer.getEmail());
            customerInfo.put("status", customer.getStatus());
            customerInfo.put("lastLoginAt", customer.getLastLoginAt());
            customerInfo.put("lastActivityAt", customer.getLastActivityAt());
            
            // Add trial information from CustomerAccount
            if (accountOpt.isPresent()) {
                CustomerAccount account = accountOpt.get();
                customerInfo.put("isTrialUsed", account.getIsTrialUsed() != null ? account.getIsTrialUsed() : false);
                customerInfo.put("trialVoucherCode", account.getTrialVoucherCode());
                customerInfo.put("referralCode", account.getReferralCode());
            } else {
                customerInfo.put("isTrialUsed", false);
                customerInfo.put("trialVoucherCode", null);
                customerInfo.put("referralCode", null);
            }
            
            response.put("customer", customerInfo);
            
            response.put("vouchers", vouchers);
            response.put("payments", payments);
            response.put("transactions", transactions);
            response.put("activeSessions", customerActiveSessions);
            
            // Statistics
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalVouchers", vouchers.size());
            stats.put("activeVouchers", vouchers.stream().mapToLong(v -> 
                v.getStatus() == Voucher.VoucherStatus.ACTIVE ? 1 : 0).sum());
            stats.put("totalPayments", payments.size());
            stats.put("successfulPayments", payments.stream().mapToLong(p -> 
                p.getStatus() == Payment.PaymentStatus.SUCCESSFUL ? 1 : 0).sum());
            stats.put("activeSessionsCount", customerActiveSessions.size());
            response.put("statistics", stats);
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to get customer dashboard for {}: {}", phoneNumber, e.getMessage());
            response.put("status", "error");
            response.put("message", "Failed to load dashboard: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * Check voucher code validity
     */
    public Map<String, Object> checkVoucherValidity(String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Voucher> voucher = voucherRepository.findByVoucherCode(voucherCode);
            
            if (voucher.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Voucher code not found");
                return response;
            }
            
            Voucher v = voucher.get();
            
            // Check if voucher is expired
            if (v.getExpiresAt() != null && v.getExpiresAt().isBefore(LocalDateTime.now())) {
                response.put("status", "error");
                response.put("message", "Voucher code has expired");
                return response;
            }
            
            // Check if voucher is already used
            if (v.getStatus() == Voucher.VoucherStatus.USED) {
                response.put("status", "error");
                response.put("message", "Voucher code has already been used");
                return response;
            }
            
            // Get package details
            InternetPackage internetPackage = internetPackageRepository.findById(v.getPackageId())
                .orElseThrow(() -> new RuntimeException("Internet package not found"));
            
            response.put("status", "success");
            response.put("message", "Voucher code is valid");
            response.put("voucherCode", v.getVoucherCode());
            response.put("status", v.getStatus());
            response.put("expiresAt", v.getExpiresAt());
            
            Map<String, Object> packageInfo = new HashMap<>();
            packageInfo.put("packageName", internetPackage.getName());
            packageInfo.put("dataLimit", internetPackage.getDataLimit());
            packageInfo.put("speedLimit", internetPackage.getSpeedLimit());
            packageInfo.put("duration", internetPackage.getDuration());
            packageInfo.put("durationValue", internetPackage.getDurationDays());
            packageInfo.put("price", internetPackage.getPrice());
            response.put("package", packageInfo);
            
            return response;
            
        } catch (Exception e) {
            logger.error("Failed to check voucher validity for {}: {}", voucherCode, e.getMessage());
            response.put("status", "error");
            response.put("message", "Failed to validate voucher: " + e.getMessage());
            return response;
        }
    }
    
    // Helper methods
    
    private String generateSessionToken(String phoneNumber, String voucherCode) {
        // Generate a simple session token (in production, use JWT)
        return "SESSION_" + phoneNumber + "_" + voucherCode + "_" + System.currentTimeMillis();
    }
    
    private Voucher createVoucherForPackage(InternetPackage internetPackage, String customerPhone) {
        Voucher voucher = new Voucher();
        voucher.setVoucherCode(generateVoucherCode());
        voucher.setPackageId(internetPackage.getId());
        voucher.setCustomerPhoneNumber(customerPhone);
        voucher.setStatus(Voucher.VoucherStatus.GENERATED);
        voucher.setGeneratedAt(LocalDateTime.now());
        voucher.setExpiresAt(LocalDateTime.now().plusDays(30)); // 30 days expiry
        voucher.setCreatedBy("system");
        
        return voucherRepository.save(voucher);
    }
    
    private String generateVoucherCode() {
        // Generate unique voucher code
        return "VCH" + System.currentTimeMillis();
    }
    
    private Payment createPaymentRecord(Customer customer, InternetPackage internetPackage, 
                                      String paymentMethod, String paymentGateway) {
        Payment payment = new Payment();
        payment.setPaymentId("PAY_" + System.currentTimeMillis());
        payment.setCustomerId(customer.getId());
        payment.setAmount(internetPackage.getPrice());
        payment.setCurrency("TZS");
        payment.setPaymentMethod(Payment.PaymentMethod.valueOf(paymentMethod));
        payment.setPaymentGateway(paymentGateway);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPhoneNumber(customer.getPhoneNumber());
        payment.setDescription("Internet package payment: " + internetPackage.getName());
        payment.setCreatedBy(customer.getPhoneNumber());
        
        return paymentRepository.save(payment);
    }
    
    private Transaction createTransactionRecord(Customer customer, Payment payment, InternetPackage internetPackage) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId("TXN_" + System.currentTimeMillis());
        transaction.setCustomerId(customer.getId());
        transaction.setAmount(internetPackage.getPrice());
        transaction.setCurrency("TZS");
        transaction.setTransactionType(Transaction.TransactionType.PAYMENT);
        transaction.setPaymentMethod(Transaction.PaymentMethod.valueOf(payment.getPaymentMethod().toString()));
        transaction.setPaymentGateway(payment.getPaymentGateway());
        transaction.setDescription("Internet package purchase: " + internetPackage.getName());
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        transaction.setCreatedBy(customer.getPhoneNumber());
        
        return transactionRepository.save(transaction);
    }
    
    private boolean processPaymentWithGateway(Payment payment, String paymentGateway) {
        // Simulate payment processing
        // In real implementation, this would call the actual payment gateway API
        try {
            Thread.sleep(1000); // Simulate API call delay
            return true; // Simulate successful payment
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}

