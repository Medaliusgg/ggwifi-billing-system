package com.ggnetworks.controller;

import com.ggnetworks.entity.Otp;
import com.ggnetworks.entity.User;
import com.ggnetworks.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import com.ggnetworks.repository.UserRepository;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints for GGNetworks system")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    private static final Logger debugLogger = LoggerFactory.getLogger("AuthDebugLogger");

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Authenticate admin user and return JWT token")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        debugLogger.info("[DEBUG] AuthController.login() called with request: {}", request);
        try {
            String phoneNumber = request.get("phoneNumber");
            String password = request.get("password");

            if (phoneNumber == null || password == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Phone number and password are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            log.info("Attempting login with phone: {}", phoneNumber);

            // Authenticate user with phone number and password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(phoneNumber, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get the authenticated user details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Find the actual User entity from the database
            User user = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            
            String jwt = jwtService.generateToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", jwt);
            response.put("user", Map.of(
                "id", user.getId(),
                "phoneNumber", user.getPhoneNumber(),
                "fullName", user.getFullName(),
                "role", user.getRole(),
                "status", user.getStatus()
            ));

            log.info("Login successful for user: {}", user.getPhoneNumber());
            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            log.error("Authentication failed: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/otp/generate")
    @Operation(summary = "Generate OTP", description = "Generate OTP for phone verification")
    public ResponseEntity<Map<String, Object>> generateOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String type = request.get("type");

            if (phoneNumber == null || type == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number and type are required"));
            }

            Otp.OtpType otpType;
            try {
                otpType = Otp.OtpType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP type"));
            }

            Otp otp = otpService.generateOtp(phoneNumber, otpType);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP generated successfully");
            response.put("phoneNumber", phoneNumber);
            response.put("type", type);
            // Don't return the actual OTP code in production - it should be sent via SMS

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to generate OTP", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate OTP"));
        }
    }

    @PostMapping("/otp/validate")
    @Operation(summary = "Validate OTP", description = "Validate OTP code")
    public ResponseEntity<Map<String, Object>> validateOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String otpCode = request.get("otpCode");
            String type = request.get("type");

            if (phoneNumber == null || otpCode == null || type == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number, OTP code, and type are required"));
            }

            Otp.OtpType otpType;
            try {
                otpType = Otp.OtpType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP type"));
            }

            boolean isValid = otpService.validateOtp(phoneNumber, otpCode, otpType);

            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "OTP validated successfully");
                response.put("phoneNumber", phoneNumber);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP code"));
            }

        } catch (Exception e) {
            log.error("Failed to validate OTP", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to validate OTP"));
        }
    }

    @PostMapping("/otp/resend")
    @Operation(summary = "Resend OTP", description = "Resend OTP for phone verification")
    public ResponseEntity<Map<String, Object>> resendOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String type = request.get("type");

            if (phoneNumber == null || type == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number and type are required"));
            }

            Otp.OtpType otpType;
            try {
                otpType = Otp.OtpType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP type"));
            }

            Otp otp = otpService.resendOtp(phoneNumber, otpType);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP resent successfully");
            response.put("phoneNumber", phoneNumber);
            response.put("type", type);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to resend OTP", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Register a new user with OTP verification")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String fullName = request.get("fullName");
            String password = request.get("password");
            String otpCode = request.get("otpCode");

            if (phoneNumber == null || fullName == null || password == null || otpCode == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number, full name, password, and OTP are required"));
            }

            // Validate OTP first
            boolean otpValid = otpService.validateOtp(phoneNumber, otpCode, Otp.OtpType.REGISTRATION);
            if (!otpValid) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP code"));
            }

            // Create user
            User user = new User();
            user.setPhoneNumber(phoneNumber);
            user.setFullName(fullName);
            user.setPassword(password);
            user.setRole(User.UserRole.PPPOE_USER); // Default role for registration
            user.setStatus(User.UserStatus.ACTIVE);

            User savedUser = userService.createUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", savedUser);

            log.info("User registered successfully: {}", phoneNumber);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to register user", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to register user"));
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh JWT token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");

            if (refreshToken == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Refresh token is required"));
            }

            // Extract phone number from refresh token
            String phoneNumber = jwtService.extractPhoneNumber(refreshToken);
            if (phoneNumber == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid refresh token"));
            }

            // Load user details
            UserDetails userDetails = userService.loadUserByUsername(phoneNumber);
            if (userDetails == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "User not found"));
            }

            // Validate refresh token
            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid refresh token"));
            }

            // Generate new tokens
            String newToken = jwtService.generateToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token refreshed successfully");
            response.put("token", newToken);
            response.put("refreshToken", newRefreshToken);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to refresh token", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to refresh token"));
        }
    }
} 