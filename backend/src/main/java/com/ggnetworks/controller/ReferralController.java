package com.ggnetworks.controller;

import com.ggnetworks.service.ReferralService;
import com.ggnetworks.repository.CustomerAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Referral Controller
 * Handles referral code retrieval and statistics
 */
@RestController
@RequestMapping("/api/v1/customer-portal/referral")
public class ReferralController {

    @Autowired
    private ReferralService referralService;

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    /**
     * GET /api/v1/customer-portal/referral/code
     * Get user's referral code
     */
    @GetMapping("/code")
    public ResponseEntity<Map<String, Object>> getReferralCode() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get authenticated user's phone number
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                response.put("status", "error");
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            String phoneNumber = auth.getName();
            var accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            
            if (accountOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Account not found");
                return ResponseEntity.status(404).body(response);
            }

            var account = accountOpt.get();
            String referralCode = account.getReferralCode();

            if (referralCode == null || referralCode.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Referral code not generated");
                return ResponseEntity.status(404).body(response);
            }

            response.put("status", "success");
            response.put("referralCode", referralCode);
            response.put("shareUrl", "https://ggwifi.co.tz?ref=" + referralCode);
            response.put("shareMessage", "Join GG WiFi and get free internet! Use my code: " + referralCode);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get referral code: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * GET /api/v1/customer-portal/referral/stats
     * Get referral statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReferralStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get authenticated user's phone number
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                response.put("status", "error");
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }

            String phoneNumber = auth.getName();
            Map<String, Object> stats = referralService.getReferralStats(phoneNumber);

            response.put("status", "success");
            response.put("stats", stats);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get referral stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

