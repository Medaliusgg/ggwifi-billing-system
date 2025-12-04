package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Email Verification Service
 * Handles email verification functionality
 */
@Service
@Transactional
public class EmailVerificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RedisSessionService redisSessionService;

    private static final int VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

    /**
     * Send verification email
     */
    public Map<String, Object> sendVerificationEmail(String email) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                result.put("status", "error");
                result.put("message", "User not found");
                return result;
            }
            
            User user = userOpt.get();
            
            if (user.getIsEmailVerified() != null && user.getIsEmailVerified()) {
                result.put("status", "error");
                result.put("message", "Email already verified");
                return result;
            }
            
            // Generate verification token
            String verificationToken = UUID.randomUUID().toString();
            
            // Store token in Redis with expiry
            String tokenKey = "email_verification:" + user.getId();
            redisSessionService.setValue(tokenKey, verificationToken, VERIFICATION_TOKEN_EXPIRY_HOURS * 3600);
            
            // Send email
            emailService.sendEmailVerificationEmail(user.getEmail(), verificationToken, user.getUsername());
            
            result.put("status", "success");
            result.put("message", "Verification email sent successfully");
            
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to send verification email: " + e.getMessage());
            return result;
        }
    }

    /**
     * Verify email with token
     */
    public Map<String, Object> verifyEmail(String email, String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                result.put("status", "error");
                result.put("message", "User not found");
                return result;
            }
            
            User user = userOpt.get();
            
            if (user.getIsEmailVerified() != null && user.getIsEmailVerified()) {
                result.put("status", "success");
                result.put("message", "Email already verified");
                result.put("verified", true);
                return result;
            }
            
            // Verify token
            String tokenKey = "email_verification:" + user.getId();
            String storedToken = redisSessionService.getValue(tokenKey);
            
            if (storedToken == null || !storedToken.equals(token)) {
                result.put("status", "error");
                result.put("message", "Invalid or expired verification token");
                result.put("verified", false);
                return result;
            }
            
            // Mark email as verified
            user.setIsEmailVerified(true);
            userRepository.save(user);
            
            // Delete token
            redisSessionService.deleteValue(tokenKey);
            
            result.put("status", "success");
            result.put("message", "Email verified successfully");
            result.put("verified", true);
            
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to verify email: " + e.getMessage());
            result.put("verified", false);
            return result;
        }
    }

    /**
     * Resend verification email
     */
    public Map<String, Object> resendVerificationEmail(String email) {
        return sendVerificationEmail(email);
    }
}

