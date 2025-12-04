package com.ggnetworks.controller;

import com.ggnetworks.entity.UserMFA;
import com.ggnetworks.repository.UserMFARepository;
import com.ggnetworks.service.MFAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * MFA Controller
 * Handles multi-factor authentication setup and verification
 */
@RestController
@RequestMapping("/api/v1/mfa")
@CrossOrigin(origins = "*")
public class MFAController {
    
    @Autowired
    private MFAService mfaService;
    
    @Autowired
    private UserMFARepository userMFARepository;
    
    /**
     * Generate MFA secret and QR code
     */
    @PostMapping("/setup/{userId}")
    public ResponseEntity<Map<String, Object>> setupMFA(@PathVariable Long userId, 
                                                         @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Generate secret
            String secret = mfaService.generateSecret();
            
            // Generate QR code
            String qrCodeDataUri = mfaService.generateQrCodeDataUri(secret, email);
            
            // Generate backup codes
            String[] backupCodes = mfaService.generateBackupCodes(10);
            
            // Save to database (but don't enable yet)
            Optional<UserMFA> existingMFA = userMFARepository.findByUserId(userId);
            UserMFA userMFA;
            if (existingMFA.isPresent()) {
                userMFA = existingMFA.get();
                userMFA.setSecretKey(secret);
            } else {
                userMFA = new UserMFA();
                userMFA.setUserId(userId);
                userMFA.setSecretKey(secret);
            }
            userMFA.setEnabled(false);
            userMFA.setBackupCodes(String.join(",", backupCodes));
            userMFARepository.save(userMFA);
            
            response.put("status", "success");
            response.put("secret", secret);
            response.put("qrCode", qrCodeDataUri);
            response.put("backupCodes", backupCodes);
            response.put("message", "MFA setup initiated. Scan QR code and verify to enable.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to setup MFA: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Verify and enable MFA
     */
    @PostMapping("/verify/{userId}")
    public ResponseEntity<Map<String, Object>> verifyMFA(@PathVariable Long userId,
                                                          @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String code = request.get("code");
            if (code == null || code.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Verification code is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<UserMFA> userMFAOpt = userMFARepository.findByUserId(userId);
            if (userMFAOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "MFA not set up for this user");
                return ResponseEntity.badRequest().body(response);
            }
            
            UserMFA userMFA = userMFAOpt.get();
            boolean isValid = mfaService.verifyCode(userMFA.getSecretKey(), code);
            
            if (isValid) {
                userMFA.setEnabled(true);
                userMFA.setSetupCompletedAt(java.time.LocalDateTime.now());
                userMFARepository.save(userMFA);
                
                response.put("status", "success");
                response.put("message", "MFA enabled successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Invalid verification code");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to verify MFA: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Disable MFA
     */
    @PostMapping("/disable/{userId}")
    public ResponseEntity<Map<String, Object>> disableMFA(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<UserMFA> userMFAOpt = userMFARepository.findByUserId(userId);
            if (userMFAOpt.isPresent()) {
                UserMFA userMFA = userMFAOpt.get();
                userMFA.setEnabled(false);
                userMFARepository.save(userMFA);
                
                response.put("status", "success");
                response.put("message", "MFA disabled successfully");
            } else {
                response.put("status", "error");
                response.put("message", "MFA not set up for this user");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to disable MFA: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

