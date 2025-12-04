package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Password Reset Service
 * Handles password reset functionality
 */
@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RedisSessionService redisSessionService;

    private static final int RESET_TOKEN_EXPIRY_MINUTES = 15;

    /**
     * Request password reset
     */
    public Map<String, Object> requestPasswordReset(String email) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                result.put("status", "error");
                result.put("message", "User with this email not found");
                return result;
            }
            
            User user = userOpt.get();
            
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            
            // Store token in Redis with expiry
            String tokenKey = "password_reset:" + user.getId();
            redisSessionService.setValue(tokenKey, resetToken, RESET_TOKEN_EXPIRY_MINUTES * 60);
            
            // Send email
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());
            
            result.put("status", "success");
            result.put("message", "Password reset email sent successfully");
            
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to process password reset request: " + e.getMessage());
            return result;
        }
    }

    /**
     * Reset password with token
     */
    public Map<String, Object> resetPassword(String email, String token, String newPassword) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                result.put("status", "error");
                result.put("message", "User not found");
                return result;
            }
            
            User user = userOpt.get();
            
            // Verify token
            String tokenKey = "password_reset:" + user.getId();
            String storedToken = redisSessionService.getValue(tokenKey);
            
            if (storedToken == null || !storedToken.equals(token)) {
                result.put("status", "error");
                result.put("message", "Invalid or expired reset token");
                return result;
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            // Delete token
            redisSessionService.deleteValue(tokenKey);
            
            result.put("status", "success");
            result.put("message", "Password reset successfully");
            
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to reset password: " + e.getMessage());
            return result;
        }
    }

    /**
     * Verify reset token
     */
    public Map<String, Object> verifyResetToken(String email, String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                result.put("status", "error");
                result.put("message", "User not found");
                return result;
            }
            
            User user = userOpt.get();
            
            // Verify token
            String tokenKey = "password_reset:" + user.getId();
            String storedToken = redisSessionService.getValue(tokenKey);
            
            if (storedToken == null || !storedToken.equals(token)) {
                result.put("status", "error");
                result.put("message", "Invalid or expired reset token");
                result.put("valid", false);
            } else {
                result.put("status", "success");
                result.put("message", "Token is valid");
                result.put("valid", true);
            }
            
            return result;
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to verify token: " + e.getMessage());
            result.put("valid", false);
            return result;
        }
    }
}

