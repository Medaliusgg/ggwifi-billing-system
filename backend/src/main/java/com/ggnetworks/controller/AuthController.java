package com.ggnetworks.controller;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import com.ggnetworks.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                response.put("status", "error");
                response.put("message", "Username and password are required");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                response.put("status", "error");
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(401).body(response);
            }

            User user = userOpt.get();

            // Check if user is active
            if (user.getIsActive() == null || !user.getIsActive()) {
                response.put("status", "error");
                response.put("message", "Account is inactive");
                return ResponseEntity.status(403).body(response);
            }

            // Require SUPER_ADMIN strictly
            if (user.getRole() != User.UserRole.SUPER_ADMIN) {
                response.put("status", "error");
                response.put("message", "Access denied. SUPER_ADMIN required.");
                return ResponseEntity.status(403).body(response);
            }

            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Generate token
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtService.generateToken(userDetails);

            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("data", Map.of(
                "token", token,
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
                )
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                response.put("status", "error");
                response.put("message", "Username and password are required");
                return ResponseEntity.badRequest().body(response);
            }

            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Get user
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            
            if (!userOpt.isPresent()) {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            User user = userOpt.get();

            // Check if user is active
            if (user.getIsActive() == null || !user.getIsActive()) {
                response.put("status", "error");
                response.put("message", "Account is inactive");
                return ResponseEntity.status(403).body(response);
            }

            // Generate token
            String token = jwtService.generateToken(userDetails);

            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("data", Map.of(
                "token", token,
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : ""
                )
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    @Autowired
    private com.ggnetworks.service.PasswordResetService passwordResetService;

    @Autowired
    private com.ggnetworks.service.EmailVerificationService emailVerificationService;

    /**
     * Request password reset
     */
    @PostMapping("/password-reset/request")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = passwordResetService.requestPasswordReset(email);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to process password reset request: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Reset password with token
     */
    @PostMapping("/password-reset/confirm")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            if (email == null || token == null || newPassword == null) {
                response.put("status", "error");
                response.put("message", "Email, token, and new password are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = passwordResetService.resetPassword(email, token, newPassword);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reset password: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Verify email
     */
    @PostMapping("/email-verification/verify")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String token = request.get("token");
            
            if (email == null || token == null) {
                response.put("status", "error");
                response.put("message", "Email and token are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = emailVerificationService.verifyEmail(email, token);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to verify email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Resend verification email
     */
    @PostMapping("/email-verification/resend")
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = emailVerificationService.resendVerificationEmail(email);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to resend verification email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
