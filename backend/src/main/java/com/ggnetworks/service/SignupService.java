package com.ggnetworks.service;

import com.ggnetworks.entity.CustomerAccount;
import com.ggnetworks.entity.Customer;
import com.ggnetworks.entity.CustomerOTP;
import com.ggnetworks.repository.CustomerAccountRepository;
import com.ggnetworks.repository.CustomerRepository;
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
 * Signup Service
 * Handles customer signup flow: OTP verification → Account creation with PIN → Free trial activation
 */
@Service
public class SignupService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerOTPRepository customerOTPRepository;

    @Autowired
    private CustomerAuthService customerAuthService;

    @Autowired
    private FreeTrialService freeTrialService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private ReferralService referralService;

    private final SecureRandom random = new SecureRandom();

    private static final int PIN_LENGTH = 4; // Fixed 4-digit PIN

    /**
     * Request OTP for signup
     * Checks if phone number already exists
     */
    @Transactional(noRollbackFor = {org.springframework.dao.DataIntegrityViolationException.class})
    public Map<String, Object> requestSignupOTP(String phoneNumber, String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Check if account already exists
            Optional<CustomerAccount> existingAccount = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (existingAccount.isPresent()) {
                CustomerAccount account = existingAccount.get();
                if (account.getPinHash() != null && !account.getPinHash().isEmpty()) {
                    // Account exists with PIN - redirect to login
                    response.put("status", "error");
                    response.put("message", "Account already exists. Please login instead.");
                    response.put("error_code", "ACCOUNT_EXISTS");
                    response.put("redirect_to", "login");
                    return response;
                }
                // Account exists but no PIN - allow signup completion
            }

            // Create OTP with SIGNUP purpose
            String otpCode = generateOTP();
            String otpHash = passwordEncoder.encode(otpCode);
            
            CustomerOTP otp = new CustomerOTP(phoneNumber, otpHash, CustomerOTP.OTPPurpose.SIGNUP);
            otp.setOtpCode(otpCode);
            otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
            otp.setIpAddress(ipAddress);
            otp.setUserAgent(userAgent);
            
            // Save OTP - retry if there's a constraint violation (e.g., duplicate OTP code)
            try {
                customerOTPRepository.save(otp);
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // Handle database constraint violations - retry with new OTP
                System.err.println("⚠️ Database constraint violation while saving OTP, retrying with new code: " + e.getMessage());
                otpCode = generateOTP();
                otpHash = passwordEncoder.encode(otpCode);
                otp.setOtpCode(otpCode);
                otp.setOtpHash(otpHash);
                customerOTPRepository.save(otp);
            }

            // Send SMS (handle failures gracefully - don't rollback transaction)
            try {
                String smsMessage = String.format("GGWiFi: Your signup code is %s. Valid for 5 minutes.", otpCode);
                smsService.sendSms(phoneNumber, smsMessage);
            } catch (Exception smsException) {
                // Log SMS failure but don't fail the OTP request
                System.err.println("⚠️ Warning: Failed to send SMS for signup OTP: " + smsException.getMessage());
                System.err.println("⚠️ OTP Code for " + phoneNumber + ": " + otpCode);
            }

            response.put("status", "success");
            response.put("message", "OTP sent to your phone number");
            response.put("phoneNumber", phoneNumber);

            return response;

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Handle database constraint violations gracefully
            System.err.println("❌ Database constraint violation in requestSignupOTP: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Unable to process request. Please try again.");
            return response;
        } catch (Exception e) {
            System.err.println("❌ Error requesting signup OTP: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to send OTP. Please try again.");
            return response;
        }
    }

    /**
     * Verify OTP for signup
     * Returns session token for account creation step
     */
    @Transactional
    public Map<String, Object> verifySignupOTP(String phoneNumber, String otpCode, String ipAddress, String userAgent) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            phoneNumber = normalizePhoneNumber(phoneNumber);

            // Find latest valid OTP for signup
            Optional<CustomerOTP> otpOpt = customerOTPRepository.findTopByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                phoneNumber, CustomerOTP.OTPPurpose.SIGNUP, LocalDateTime.now());

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

            // Generate temporary session token for signup (valid for 10 minutes)
            String signupToken = jwtService.generateSignupToken(phoneNumber);

            response.put("status", "success");
            response.put("message", "OTP verified successfully");
            response.put("phoneNumber", phoneNumber);
            response.put("signupToken", signupToken);
            response.put("verified", true);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error verifying signup OTP: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to verify OTP: " + e.getMessage());
            return response;
        }
    }

    /**
     * Create customer account after OTP verification
     * Includes PIN setup and free trial activation
     */
    @Transactional
    public Map<String, Object> createAccount(
            String phoneNumber,
            String fullName,
            String email,
            String pin,
            String confirmPin,
            String referralCode,
            String signupToken) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Normalize phone number
            final String normalizedPhone = normalizePhoneNumber(phoneNumber);

            // Validate signup token (if provided)
            if (signupToken != null && !signupToken.isEmpty()) {
                if (!jwtService.validateSignupToken(signupToken, normalizedPhone)) {
                    response.put("status", "error");
                    response.put("message", "Invalid or expired signup session. Please start over.");
                    return response;
                }
            }

            // Validate PIN (exactly 4 digits)
            if (pin == null || !pin.matches("^\\d{4}$")) {
                response.put("status", "error");
                response.put("message", "PIN must be exactly 4 digits");
                return response;
            }

            if (!pin.equals(confirmPin)) {
                response.put("status", "error");
                response.put("message", "PINs do not match");
                return response;
            }

            // Check if account already exists
            Optional<CustomerAccount> existingAccountOpt = customerAccountRepository.findByPhoneNumber(normalizedPhone);
            CustomerAccount account;

            if (existingAccountOpt.isPresent()) {
                account = existingAccountOpt.get();
                if (account.getPinHash() != null && !account.getPinHash().isEmpty()) {
                    response.put("status", "error");
                    response.put("message", "Account already exists. Please login instead.");
                    return response;
                }
                // Update existing account with PIN
                account.setFullName(fullName);
                account.setEmail(email != null && !email.isEmpty() ? email : normalizedPhone + "@ggwifi.co.tz");
                account.setPinHash(passwordEncoder.encode(pin));
                account.setIsVerified(true);
                account.setVerificationDate(LocalDateTime.now());
                account.setStatus(CustomerAccount.AccountStatus.ACTIVE);
            } else {
                // Create new account
                account = new CustomerAccount(normalizedPhone);
                account.setFullName(fullName);
                account.setEmail(email != null && !email.isEmpty() ? email : normalizedPhone + "@ggwifi.co.tz");
                account.setPinHash(passwordEncoder.encode(pin));
                account.setIsVerified(true);
                account.setVerificationDate(LocalDateTime.now());
                account.setStatus(CustomerAccount.AccountStatus.ACTIVE);
                account.setLastLoginAt(LocalDateTime.now());
                account.setLastSeenAt(LocalDateTime.now());

                // Generate referral code
                account.setReferralCode(generateReferralCode(normalizedPhone));
            }

            // Save account first
            final CustomerAccount savedAccount = customerAccountRepository.save(account);

            // Handle referral code (if provided)
            if (referralCode != null && !referralCode.isEmpty()) {
                Optional<CustomerAccount> referrerOpt = customerAccountRepository.findByReferralCode(referralCode);
                if (referrerOpt.isPresent()) {
                    savedAccount.setReferredBy(referralCode);
                    customerAccountRepository.save(savedAccount);
                    // Record referral (rewards will be processed on first purchase)
                    try {
                        referralService.recordReferral(referralCode, normalizedPhone, savedAccount.getId());
                        System.out.println("✅ Referral recorded: " + referralCode + " -> " + normalizedPhone);
                    } catch (Exception e) {
                        System.err.println("⚠️ Failed to record referral: " + e.getMessage());
                        // Continue with account creation even if referral fails
                    }
                }
            }
            System.out.println("✅ Customer account created: " + normalizedPhone);

            // Create or link Customer entity
            Customer customer = customerRepository.findByPhoneNumber(normalizedPhone)
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setCustomerId("CUST_" + System.currentTimeMillis());
                    newCustomer.setFirstName(fullName != null && fullName.split(" ").length > 0 
                        ? fullName.split(" ")[0] : "Customer");
                    newCustomer.setLastName(fullName != null && fullName.split(" ").length > 1 
                        ? fullName.substring(fullName.indexOf(" ") + 1) : "");
                    newCustomer.setEmail(savedAccount.getEmail());
                    newCustomer.setPrimaryPhoneNumber(normalizedPhone);
                    newCustomer.setStatus(Customer.CustomerStatus.ACTIVE);
                    newCustomer.setAccountType(Customer.AccountType.INDIVIDUAL);
                    newCustomer.setRegistrationDate(LocalDateTime.now());
                    newCustomer.setPhoneVerified(true);
                    newCustomer.setLoyaltyPoints(0);
                    newCustomer.setLoyaltyStatus(Customer.LoyaltyStatus.NEW_CUSTOMER);
                    newCustomer.setLoyaltyTier(Customer.LoyaltyTier.BRONZE);
                    return customerRepository.save(newCustomer);
                });

            // Link account to customer
            if (savedAccount.getCustomerId() == null) {
                savedAccount.setCustomerId(customer.getId());
                customerAccountRepository.save(savedAccount);
            }

            // Generate and activate free trial
            Map<String, Object> trialResult = freeTrialService.generateAndActivateTrial(savedAccount);
            String trialVoucherCode = (String) trialResult.get("voucherCode");

            // Generate JWT token for immediate login
            String token = jwtService.generateTokenWithContext(
                normalizedPhone,
                "CUSTOMER",
                savedAccount.getId(),
                savedAccount.getFullName()
            );

            String refreshToken = jwtService.generateRefreshToken(normalizedPhone);

            response.put("status", "success");
            response.put("message", "Account created successfully! Your free 20-minute trial is now active.");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("customer", Map.of(
                "id", savedAccount.getId(),
                "phoneNumber", savedAccount.getPhoneNumber(),
                "fullName", savedAccount.getFullName(),
                "email", savedAccount.getEmail(),
                "referralCode", savedAccount.getReferralCode()
            ));
            response.put("trialVoucher", Map.of(
                "code", trialVoucherCode,
                "duration", "20 minutes",
                "expiresAt", trialResult.get("expiresAt")
            ));
            response.put("trialActivated", true);

            System.out.println("✅ Account creation complete for: " + normalizedPhone);

            return response;

        } catch (Exception e) {
            System.err.println("❌ Error creating account: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to create account: " + e.getMessage());
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

    /**
     * Generate unique referral code
     */
    private String generateReferralCode(String phoneNumber) {
        String base = phoneNumber.substring(phoneNumber.length() - 4).toUpperCase();
        String randomSuffix = String.valueOf(random.nextInt(1000));
        String referralCode = base + randomSuffix;
        
        // Ensure uniqueness
        int attempts = 0;
        while (customerAccountRepository.findByReferralCode(referralCode).isPresent() && attempts < 10) {
            randomSuffix = String.valueOf(random.nextInt(10000));
            referralCode = base + randomSuffix;
            attempts++;
        }
        
        return referralCode;
    }
}
