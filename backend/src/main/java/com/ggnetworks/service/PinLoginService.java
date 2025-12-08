package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.repository.CustomerAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * PIN Login Service
 * Handles PIN-based authentication for registered customers
 */
@Service
public class PinLoginService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_HOURS = 6;

    /**
     * Authenticate customer with phone number and PIN
     */
    @Transactional
    public Map<String, Object> loginWithPin(String phoneNumber, String pin) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Validate PIN format (exactly 4 digits)
            if (pin == null || !pin.matches("^\\d{4}$")) {
                response.put("status", "error");
                response.put("message", "PIN must be exactly 4 digits");
                return response;
            }

            // Find account
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (accountOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Account not found. Please sign up first.");
                response.put("error_code", "ACCOUNT_NOT_FOUND");
                return response;
            }

            CustomerAccount account = accountOpt.get();

            // Check if account is locked
            if (account.getLockedUntil() != null && account.getLockedUntil().isAfter(LocalDateTime.now())) {
                response.put("status", "error");
                response.put("message", "Account is locked due to too many failed login attempts. Please try again later.");
                return response;
            }

            // Check if account has PIN set
            if (account.getPinHash() == null || account.getPinHash().isEmpty()) {
                response.put("status", "error");
                response.put("message", "PIN not set. Please complete signup first.");
                response.put("error_code", "PIN_NOT_SET");
                return response;
            }

            // Check if account is active
            if (account.getStatus() != CustomerAccount.AccountStatus.ACTIVE) {
                response.put("status", "error");
                response.put("message", "Account is not active. Please contact support.");
                return response;
            }

            // Verify PIN
            if (!passwordEncoder.matches(pin, account.getPinHash())) {
                // Increment failed login attempts
                account.setFailedLoginAttempts(account.getFailedLoginAttempts() + 1);

                // Lock account if max attempts reached
                if (account.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                    account.setLockedUntil(LocalDateTime.now().plusHours(LOCKOUT_HOURS));
                    response.put("status", "error");
                    response.put("message", "Too many failed login attempts. Account locked for " + LOCKOUT_HOURS + " hours.");
                } else {
                    int remainingAttempts = MAX_LOGIN_ATTEMPTS - account.getFailedLoginAttempts();
                    response.put("status", "error");
                    response.put("message", "Invalid PIN. " + remainingAttempts + " attempts remaining.");
                }

                customerAccountRepository.save(account);
                return response;
            }

            // PIN is correct - reset failed attempts and update login info
            account.setFailedLoginAttempts(0);
            account.setLockedUntil(null);
            account.setLastLoginAt(LocalDateTime.now());
            account.setLastSeenAt(LocalDateTime.now());
            customerAccountRepository.save(account);

            // Generate JWT token
            String token = jwtService.generateTokenWithContext(
                phoneNumber,
                "CUSTOMER",
                account.getId(),
                account.getFullName()
            );

            String refreshToken = jwtService.generateRefreshToken(phoneNumber);

            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("customer", Map.of(
                "id", account.getId(),
                "phoneNumber", account.getPhoneNumber(),
                "fullName", account.getFullName(),
                "email", account.getEmail(),
                "isTrialUsed", account.getIsTrialUsed() != null ? account.getIsTrialUsed() : false
            ));

            System.out.println("✅ PIN login successful for: " + phoneNumber);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error in PIN login: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Login failed: " + e.getMessage());
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
}

