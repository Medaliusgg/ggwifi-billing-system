package com.ggnetworks.controller;

import com.ggnetworks.service.ForgotPinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Forgot PIN Controller
 * Handles PIN reset flow: Request OTP → Verify OTP → Reset PIN
 */
@RestController
@RequestMapping("/api/v1/auth/forgot-pin")
@CrossOrigin(origins = "*")
public class ForgotPinController {

    @Autowired
    private ForgotPinService forgotPinService;

    /**
     * Request OTP for PIN reset
     * POST /api/v1/auth/forgot-pin/request-otp
     */
    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestPinResetOTP(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {

        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number is required"));
        }

        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        Map<String, Object> response = forgotPinService.requestPinResetOTP(phoneNumber, ipAddress, userAgent);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify OTP for PIN reset
     * POST /api/v1/auth/forgot-pin/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyPinResetOTP(@RequestBody Map<String, String> request) {

        String phoneNumber = request.get("phoneNumber");
        String otpCode = request.get("otpCode");

        if (phoneNumber == null || otpCode == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number and OTP code are required"));
        }

        Map<String, Object> response = forgotPinService.verifyPinResetOTP(phoneNumber, otpCode);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Reset PIN
     * POST /api/v1/auth/forgot-pin/reset
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetPin(@RequestBody Map<String, String> request) {

        String phoneNumber = request.get("phoneNumber");
        String newPin = request.get("newPin");
        String confirmPin = request.get("confirmPin");
        String resetToken = request.get("resetToken");

        if (phoneNumber == null || newPin == null || confirmPin == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("status", "error", "message", "Phone number, new PIN, and confirm PIN are required"));
        }

        Map<String, Object> response = forgotPinService.resetPin(phoneNumber, newPin, confirmPin, resetToken);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}

