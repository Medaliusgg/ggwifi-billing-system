package com.ggnetworks.controller;

import com.ggnetworks.service.CustomerAuthService;
import com.ggnetworks.service.PinLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Customer Authentication Controller
 * Handles phone-based authentication with OTP
 */
@RestController
@RequestMapping("/api/v1/customer-auth")
public class CustomerAuthController {

    @Autowired
    private CustomerAuthService customerAuthService;

    @Autowired
    private PinLoginService pinLoginService;

    /**
     * Request OTP for login
     * POST /api/v1/customer-auth/request-otp
     */
    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestOTP(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number is required"));
        }
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        Map<String, Object> response = customerAuthService.requestOTP(phoneNumber, ipAddress, userAgent);
        
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify OTP and login
     * POST /api/v1/customer-auth/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOTP(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        
        String phoneNumber = request.get("phoneNumber");
        String otpCode = request.get("otpCode");
        
        if (phoneNumber == null || otpCode == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number and OTP code are required"));
        }
        
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        
        Map<String, Object> response = customerAuthService.verifyOTPAndLogin(phoneNumber, otpCode, ipAddress, userAgent);
        
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Login with PIN (for registered customers)
     * POST /api/v1/customer-auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginWithPin(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String pin = request.get("pin");

        if (phoneNumber == null || pin == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number and PIN are required"));
        }

        Map<String, Object> response = pinLoginService.loginWithPin(phoneNumber, pin);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Refresh token
     * POST /api/v1/customer-auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Refresh token is required"));
        }

        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        Map<String, Object> response = customerAuthService.refreshToken(refreshToken, ipAddress, userAgent);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}



