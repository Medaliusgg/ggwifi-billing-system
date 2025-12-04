package com.ggnetworks.controller;

import com.ggnetworks.service.CustomerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Customer Dashboard Controller
 * Provides dashboard data for authenticated customers
 */
@RestController
@RequestMapping("/api/v1/customer-dashboard")
@CrossOrigin(origins = "*")
public class CustomerDashboardController {

    @Autowired
    private CustomerDashboardService customerDashboardService;

    /**
     * Get complete dashboard data
     * GET /api/v1/customer-dashboard
     * Requires: JWT token with phoneNumber claim
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER') or @customerAuthService.getAccountByPhone(authentication.name) != null")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(required = false) String phoneNumber) {
        
        // Extract phone number from token or use parameter
        // In production, extract from JWT token claims
        if (phoneNumber == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number is required"));
        }
        
        Map<String, Object> dashboard = customerDashboardService.getDashboardData(phoneNumber);
        
        if (dashboard.containsKey("error")) {
            return ResponseEntity.badRequest().body(dashboard);
        }
        
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get customer profile
     * GET /api/v1/customer-dashboard/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestParam String phoneNumber) {
        Map<String, Object> dashboard = customerDashboardService.getDashboardData(phoneNumber);
        return ResponseEntity.ok((Map<String, Object>) dashboard.get("profile"));
    }

    /**
     * Get loyalty data
     * GET /api/v1/customer-dashboard/loyalty
     */
    @GetMapping("/loyalty")
    public ResponseEntity<Map<String, Object>> getLoyalty(@RequestParam String phoneNumber) {
        Map<String, Object> dashboard = customerDashboardService.getDashboardData(phoneNumber);
        return ResponseEntity.ok((Map<String, Object>) dashboard.get("loyalty"));
    }

    /**
     * Get transaction history
     * GET /api/v1/customer-dashboard/transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getTransactions(@RequestParam String phoneNumber) {
        Map<String, Object> dashboard = customerDashboardService.getDashboardData(phoneNumber);
        return ResponseEntity.ok((Map<String, Object>) dashboard.get("transactions"));
    }

    /**
     * Get active sessions
     * GET /api/v1/customer-dashboard/sessions
     */
    @GetMapping("/sessions")
    public ResponseEntity<Map<String, Object>> getActiveSessions(@RequestParam String phoneNumber) {
        Map<String, Object> dashboard = customerDashboardService.getDashboardData(phoneNumber);
        return ResponseEntity.ok(Map.of("sessions", dashboard.get("activeSessions")));
    }
}



