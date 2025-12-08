package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.entity.CustomerOTP;
import com.ggnetworks.repository.CustomerAccountRepository;
import com.ggnetworks.repository.CustomerOTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Forgot PIN Service
 * Handles PIN reset flow: Request OTP → Verify OTP → Reset PIN
 */
@Service
public class ForgotPinService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private CustomerOTPRepository customerOTPRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SmsService smsService;

    private final SecureRandom random = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 5;

    /**
     * Request OTP for PIN reset
     */
    @Transactional
    public Map<String, Object> requestPinResetOTP(String phoneNumber, String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Check if account exists
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (accountOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Account not found. Please sign up first.");
                response.put("error_code", "ACCOUNT_NOT_FOUND");
                return response;
            }

            CustomerAccount account = accountOpt.get();

            // Check if account has PIN set
            if (account.getPinHash() == null || account.getPinHash().isEmpty()) {
                response.put("status", "error");
                response.put("message", "PIN not set. Please complete signup first.");
                response.put("error_code", "PIN_NOT_SET");
                return response;
            }

            // Check if account is locked
            if (account.getLockedUntil() != null && account.getLockedUntil().isAfter(LocalDateTime.now())) {
                response.put("status", "error");
                response.put("message", "Account is locked. Please try again later.");
                return response;
            }

            // Generate OTP
            String otpCode = generateOTP();
            String otpHash = passwordEncoder.encode(otpCode);

            // Create OTP record
            CustomerOTP otp = new CustomerOTP(phoneNumber, otpHash, CustomerOTP.OTPPurpose.PIN_RESET);
            otp.setOtpCode(otpCode);
            otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            otp.setIpAddress(ipAddress);
            otp.setUserAgent(userAgent);
            customerOTPRepository.save(otp);

            // Send SMS
            String smsMessage = String.format("GGWiFi: Your PIN reset code is %s. Valid for %d minutes.", 
                otpCode, OTP_EXPIRY_MINUTES);
            smsService.sendSms(phoneNumber, smsMessage);

            response.put("status", "success");
            response.put("message", "OTP sent to your phone number");
            response.put("phoneNumber", phoneNumber);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error requesting PIN reset OTP: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return response;
        }
    }

    /**
     * Verify OTP for PIN reset
     */
    @Transactional
    public Map<String, Object> verifyPinResetOTP(String phoneNumber, String otpCode) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Find latest valid OTP for PIN reset
            Optional<CustomerOTP> otpOpt = customerOTPRepository.findTopByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                phoneNumber, CustomerOTP.OTPPurpose.PIN_RESET, LocalDateTime.now());

            if (otpOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "OTP not found or expired. Please request a new OTP.");
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
                response.put("message", "Invalid OTP code");
                return response;
            }

            // OTP is valid - mark as used
            otp.markAsUsed();
            customerOTPRepository.save(otp);

            // Generate temporary reset token (valid for 10 minutes)
            String resetToken = jwtService.generateResetToken(phoneNumber);

            response.put("status", "success");
            response.put("message", "OTP verified successfully");
            response.put("phoneNumber", phoneNumber);
            response.put("resetToken", resetToken);
            response.put("verified", true);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error verifying PIN reset OTP: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to verify OTP: " + e.getMessage());
            return response;
        }
    }

    /**
     * Reset PIN after OTP verification
     */
    @Transactional
    public Map<String, Object> resetPin(String phoneNumber, String newPin, String confirmPin, String resetToken) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Validate reset token (if provided)
            if (resetToken != null && !resetToken.isEmpty()) {
                if (!jwtService.validateResetToken(resetToken, phoneNumber)) {
                    response.put("status", "error");
                    response.put("message", "Invalid or expired reset session. Please start over.");
                    return response;
                }
            }

            // Validate PIN (exactly 4 digits)
            if (newPin == null || !newPin.matches("^\\d{4}$")) {
                response.put("status", "error");
                response.put("message", "PIN must be exactly 4 digits");
                return response;
            }

            if (!newPin.equals(confirmPin)) {
                response.put("status", "error");
                response.put("message", "PINs do not match");
                return response;
            }

            // Find account
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (accountOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Account not found");
                return response;
            }

            CustomerAccount account = accountOpt.get();

            // Check if new PIN is same as old PIN
            if (account.getPinHash() != null && passwordEncoder.matches(newPin, account.getPinHash())) {
                response.put("status", "error");
                response.put("message", "New PIN must be different from current PIN");
                return response;
            }

            // Update PIN
            account.setPinHash(passwordEncoder.encode(newPin));
            account.setFailedLoginAttempts(0);
            account.setLockedUntil(null);
            customerAccountRepository.save(account);

            // Generate JWT token for immediate login
            String token = jwtService.generateTokenWithContext(
                phoneNumber,
                "CUSTOMER",
                account.getId(),
                account.getFullName()
            );

            String refreshToken = jwtService.generateRefreshToken(phoneNumber);

            response.put("status", "success");
            response.put("message", "PIN reset successfully");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("customer", Map.of(
                "id", account.getId(),
                "phoneNumber", account.getPhoneNumber(),
                "fullName", account.getFullName()
            ));

            System.out.println("✅ PIN reset successful for: " + phoneNumber);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error resetting PIN: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to reset PIN: " + e.getMessage());
            return response;
        }
    }

    /**
     * Normalize phone number to international format
     */
    private String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) return null;
        phoneNumber = phoneNumber.trim().replaceAll("[^0-9+]", "");
        
        if (phoneNumber.startsWith("+")) {
            return phoneNumber;
        } else if (phoneNumber.startsWith("255")) {
            return "+" + phoneNumber;
        } else if (phoneNumber.startsWith("0")) {
            return "+255" + phoneNumber.substring(1);
        } else {
            return "+255" + phoneNumber;
        }
    }

    /**
     * Generate OTP code (6 digits)
     */
    private String generateOTP() {
        return String.format("%06d", random.nextInt(1000000));
    }
}

