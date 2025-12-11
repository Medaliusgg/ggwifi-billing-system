package com.ggnetworks.controller;

import com.ggnetworks.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Signup Controller
 * Handles customer signup flow: OTP verification → Account creation with PIN → Free trial
 */
@RestController
@RequestMapping("/api/v1/auth/signup")
public class SignupController {

    @Autowired
    private SignupService signupService;

    /**
     * Request OTP for signup
     * POST /api/v1/auth/signup/request-otp
     */
    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestSignupOTP(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        try {
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Phone number is required"));
            }

            String ipAddress = httpRequest.getRemoteAddr();
            String userAgent = httpRequest.getHeader("User-Agent");

            Map<String, Object> response = signupService.requestSignupOTP(phoneNumber, ipAddress, userAgent);

            if ("success".equals(response.get("status"))) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("❌ SignupController Error in requestSignupOTP: " + e.getMessage());
            e.printStackTrace();
            
            // Return 500 with error message
            return ResponseEntity.status(500)
                .body(Map.of(
                    "status", "error",
                    "message", "Internal server error. Please try again later or contact support.",
                    "error", e.getMessage()
                ));
        }
    }

    /**
     * Verify OTP for signup
     * POST /api/v1/auth/signup/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifySignupOTP(
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

        Map<String, Object> response = signupService.verifySignupOTP(phoneNumber, otpCode, ipAddress, userAgent);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Create customer account
     * POST /api/v1/auth/signup/create
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody Map<String, String> request) {

        String phoneNumber = request.get("phoneNumber");
        String fullName = request.get("fullName");
        String email = request.get("email");
        String pin = request.get("pin");
        String confirmPin = request.get("confirmPin");
        String referralCode = request.get("referralCode");
        String signupToken = request.get("signupToken");

        if (phoneNumber == null || fullName == null || pin == null || confirmPin == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number, full name, and PIN are required"));
        }

        Map<String, Object> response = signupService.createAccount(
            phoneNumber, fullName, email, pin, confirmPin, referralCode, signupToken
        );

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}

