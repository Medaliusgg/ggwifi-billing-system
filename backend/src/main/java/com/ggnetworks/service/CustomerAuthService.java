package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.entity.CustomerOTP;
import com.ggnetworks.repository.CustomerAccountRepository;
import com.ggnetworks.repository.CustomerOTPRepository;
import com.ggnetworks.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Customer Authentication Service
 * Handles phone-based authentication with OTP
 */
@Service
public class CustomerAuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomerAuthService.class);
    
    private static final int OTP_LENGTH = 6;
    private static final int MAX_OTP_ATTEMPTS = 3;
    private static final int MAX_OTPS_PER_WINDOW = 3;
    private static final int OTP_RATE_LIMIT_WINDOW_MINUTES = 10;
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_HOURS = 6;
    
    @Autowired
    private CustomerAccountRepository customerAccountRepository;
    
    @Autowired
    private CustomerOTPRepository customerOTPRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    private final SecureRandom random = new SecureRandom();
    
    @Value("${app.testing.log-otp:false}")
    private boolean logOtpCodes;
    
    @Value("${app.testing.disable-otp-rate-limit:false}")
    private boolean disableOtpRateLimit;
    
    @Value("${otp.expiry-minutes:5}")
    private int otpExpiryMinutes;
    
    /**
     * Request OTP for login
     * Returns success if OTP sent, error if rate limited
     */
    @Transactional
    public Map<String, Object> requestOTP(String phoneNumber, String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            logger.info("OTP testing log flag state: {}", logOtpCodes);
            
            // Check rate limiting
            LocalDateTime windowStart = LocalDateTime.now().minusMinutes(OTP_RATE_LIMIT_WINDOW_MINUTES);
            Long otpCount = customerOTPRepository.countOTPsInTimeWindow(
                phoneNumber, windowStart, CustomerOTP.OTPPurpose.LOGIN);
            
            if (!disableOtpRateLimit && otpCount >= MAX_OTPS_PER_WINDOW) {
                response.put("status", "error");
                response.put("message", "Too many OTP requests. Please try again in 10 minutes.");
                return response;
            }
            
            // Check if account is locked
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (accountOpt.isPresent()) {
                CustomerAccount account = accountOpt.get();
                if (account.getLockedUntil() != null && account.getLockedUntil().isAfter(LocalDateTime.now())) {
                    response.put("status", "error");
                    response.put("message", "Account is locked. Please try again later.");
                    return response;
                }
            }
            
            // Generate OTP
            String otpCode = generateOTP();
            String otpHash = passwordEncoder.encode(otpCode);
            
            if (logOtpCodes) {
                logger.warn("[TEST ONLY] OTP for {} is {}", phoneNumber, otpCode);
            }
            
            // Create OTP record
            CustomerOTP otp = new CustomerOTP(phoneNumber, otpHash, CustomerOTP.OTPPurpose.LOGIN);
            otp.setOtpCode(otpCode); // Store plain for SMS (will be hashed in DB)
            otp.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
            logger.debug("OTP expiry for {} set to {}", phoneNumber, otp.getExpiresAt());
            otp.setIpAddress(ipAddress);
            otp.setUserAgent(userAgent);
            customerOTPRepository.save(otp);
            
            // Send SMS
            String smsMessage = String.format("GGWiFi: Your login code is %s. Valid for %d minutes.", 
                otpCode, otpExpiryMinutes);
            Map<String, Object> smsResult = smsService.sendSms(phoneNumber, smsMessage);
            boolean smsSent = "success".equals(smsResult.get("status"));
            
            if (!smsSent) {
                logger.warn("Failed to send OTP SMS to: {}", phoneNumber);
                // Continue anyway - OTP is saved
            }
            
            // Auto-create account if doesn't exist
            if (!accountOpt.isPresent()) {
                CustomerAccount newAccount = new CustomerAccount(phoneNumber);
                customerAccountRepository.save(newAccount);
                logger.info("Auto-created customer account for: {}", phoneNumber);
            }
            
            response.put("status", "success");
            response.put("message", "OTP sent successfully");
            // DO NOT expose OTP code in response
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error requesting OTP: {}", e.getMessage(), e);
            response.put("status", "error");
            response.put("message", "Failed to send OTP. Please try again.");
            return response;
        }
    }
    
    /**
     * Verify OTP and login
     * Returns JWT token on success
     */
    @Transactional
    public Map<String, Object> verifyOTPAndLogin(String phoneNumber, String otpCode, 
                                                  String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            final String normalizedPhone = normalizePhoneNumber(phoneNumber);
            
            // Find latest valid OTP
            Optional<CustomerOTP> otpOpt = customerOTPRepository.findTopByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                normalizedPhone, CustomerOTP.OTPPurpose.LOGIN, LocalDateTime.now());
            
            if (otpOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Invalid or expired OTP");
                incrementFailedLoginAttempts(phoneNumber);
                return response;
            }
            
            CustomerOTP otp = otpOpt.get();
            
            // Check if max attempts reached
            if (otp.isMaxAttemptsReached()) {
                response.put("status", "error");
                response.put("message", "Maximum OTP attempts reached. Please request a new OTP.");
                return response;
            }
            
            // Verify OTP
            if (!passwordEncoder.matches(otpCode, otp.getOtpHash())) {
                otp.incrementAttempts();
                customerOTPRepository.save(otp);
                
                response.put("status", "error");
                response.put("message", "Invalid OTP");
                incrementFailedLoginAttempts(normalizedPhone);
                return response;
            }
            
            // OTP is valid - mark as used
            otp.markAsUsed();
            customerOTPRepository.save(otp);
            
            // Get or create account
            CustomerAccount account = customerAccountRepository.findByPhoneNumber(normalizedPhone)
                .orElseGet(() -> {
                    CustomerAccount newAccount = new CustomerAccount(phoneNumber);
                    newAccount.setIsVerified(true);
                    newAccount.setVerificationDate(LocalDateTime.now());
                    return customerAccountRepository.save(newAccount);
                });
            
            // Update account
            account.setLastLoginAt(LocalDateTime.now());
            account.setLastSeenAt(LocalDateTime.now());
            account.setIsVerified(true);
            if (account.getVerificationDate() == null) {
                account.setVerificationDate(LocalDateTime.now());
            }
            account.setFailedLoginAttempts(0);
            account.setLockedUntil(null);
            account.setStatus(CustomerAccount.AccountStatus.ACTIVE);
            customerAccountRepository.save(account);
            
            // Generate JWT token
            String token = jwtService.generateTokenWithContext(normalizedPhone, ipAddress, userAgent);
            String refreshToken = jwtService.generateRefreshToken(normalizedPhone);
            
            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("account", Map.of(
                "id", account.getId(),
                "phoneNumber", account.getPhoneNumber(),
                "fullName", account.getFullName() != null ? account.getFullName() : "",
                "isVerified", account.getIsVerified()
            ));
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error verifying OTP: {}", e.getMessage(), e);
            response.put("status", "error");
            response.put("message", "Login failed. Please try again.");
            return response;
        }
    }
    
    /**
     * Generate 6-digit OTP
     */
    private String generateOTP() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    /**
     * Normalize phone number
     */
    private String normalizePhoneNumber(String phoneNumber) {
        // Remove spaces, dashes, etc.
        phoneNumber = phoneNumber.replaceAll("[^0-9+]", "");
        
        // Add country code if missing (Tanzania: +255)
        if (!phoneNumber.startsWith("+") && !phoneNumber.startsWith("255")) {
            if (phoneNumber.startsWith("0")) {
                phoneNumber = "+255" + phoneNumber.substring(1);
            } else {
                phoneNumber = "+255" + phoneNumber;
            }
        }
        
        return phoneNumber;
    }
    
    /**
     * Increment failed login attempts and lock account if needed
     */
    private void incrementFailedLoginAttempts(String phoneNumber) {
        Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
        if (accountOpt.isPresent()) {
            CustomerAccount account = accountOpt.get();
            account.setFailedLoginAttempts(account.getFailedLoginAttempts() + 1);
            
            if (account.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                account.setLockedUntil(LocalDateTime.now().plusHours(LOCKOUT_HOURS));
                account.setStatus(CustomerAccount.AccountStatus.LOCKED);
                logger.warn("Account locked due to too many failed attempts: {}", phoneNumber);
            }
            
            customerAccountRepository.save(account);
        }
    }
    
    /**
     * Scheduled task: Clean up expired OTPs
     */
    @Scheduled(fixedRate = 3600000) // Every hour
    @Transactional
    public void cleanupExpiredOTPs() {
        try {
            LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
            customerOTPRepository.deleteExpiredOTPs(cutoff);
            logger.info("Cleaned up expired OTPs");
        } catch (Exception e) {
            logger.error("Error cleaning up expired OTPs: {}", e.getMessage());
        }
    }
    
    /**
     * Get customer account by phone
     */
    public Optional<CustomerAccount> getAccountByPhone(String phoneNumber) {
        phoneNumber = normalizePhoneNumber(phoneNumber);
        return customerAccountRepository.findActiveByPhoneNumber(phoneNumber);
    }

    /**
     * Refresh access token using refresh token
     */
    public Map<String, Object> refreshToken(String refreshToken, String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (refreshToken == null || refreshToken.isBlank()) {
                response.put("status", "error");
                response.put("message", "Refresh token is required");
                return response;
            }

            boolean isValid = jwtService.validateToken(refreshToken);
            boolean isRefresh = jwtService.isRefreshToken(refreshToken);
            if (!isValid || !isRefresh) {
                response.put("status", "error");
                response.put("message", "Invalid refresh token");
                return response;
            }

            String username = jwtService.extractUsername(refreshToken);
            String normalizedPhone = normalizePhoneNumber(username);

            CustomerAccount account = customerAccountRepository.findByPhoneNumber(normalizedPhone)
                .orElseThrow(() -> new IllegalStateException("Account not found"));

            if (account.getStatus() == CustomerAccount.AccountStatus.LOCKED) {
                response.put("status", "error");
                response.put("message", "Account is locked. Please contact support.");
                return response;
            }

            String newAccessToken = jwtService.generateTokenWithContext(normalizedPhone, ipAddress, userAgent);
            String newRefreshToken = jwtService.generateRefreshToken(normalizedPhone);

            response.put("status", "success");
            response.put("message", "Token refreshed");
            response.put("token", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            response.put("account", Map.of(
                "id", account.getId(),
                "phoneNumber", account.getPhoneNumber(),
                "fullName", account.getFullName() != null ? account.getFullName() : "",
                "isVerified", account.getIsVerified()
            ));

            return response;
        } catch (Exception e) {
            logger.error("Error refreshing token: {}", e.getMessage(), e);
            response.put("status", "error");
            response.put("message", "Failed to refresh token. Please login again.");
            return response;
        }
    }
}

