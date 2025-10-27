package com.ggnetworks.controller;

import com.ggnetworks.entity.User;
import com.ggnetworks.entity.User.UserRole;
import com.ggnetworks.repository.UserRepository;
import com.ggnetworks.service.JwtService;
import com.ggnetworks.service.AuditLogService;
import com.ggnetworks.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private SmsService smsService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Pre-check: user exists and not locked
            Optional<User> userOptPre = userRepository.findByUsername(username);
            if (userOptPre.isPresent()) {
                User u = userOptPre.get();
                if (u.getLockedUntil() != null && java.time.LocalDateTime.now().isBefore(u.getLockedUntil())) {
                    response.put("status", "error");
                    response.put("message", "Account locked. Try again after: " + u.getLockedUntil().toString());
                    return ResponseEntity.status(423).body(response);
                }
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // Generate JWT token (bind to IP/UA)
            String ip = getClientIp(loginRequest, null);
            String ua = loginRequest.getOrDefault("userAgent", "");
            String token = jwtService.generateTokenWithContext(username, ip, ua);
            String refreshToken = jwtService.generateRefreshToken(username);

            // Reset failed attempts on success
            if (userOptPre.isPresent()) {
                User u = userOptPre.get();
                u.setFailedLoginAttempts(0);
                u.setLastFailedLoginAt(null);
                u.setLockedUntil(null);
                userRepository.save(u);
            }

            // Log successful authentication
            auditLogService.logAuthentication(username, "LOGIN_SUCCESS", ip, ua, true);

            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("username", username);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Increment failed attempts and enforce lockout
            String username = loginRequest.get("username");
            String ip = getClientIp(loginRequest, null);
            String ua = loginRequest.getOrDefault("userAgent", "");
            
            try {
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    User u = userOpt.get();
                    int attempts = (u.getFailedLoginAttempts() == null ? 0 : u.getFailedLoginAttempts()) + 1;
                    u.setFailedLoginAttempts(attempts);
                    u.setLastFailedLoginAt(java.time.LocalDateTime.now());
                    
                    // Lock after 5 failed attempts for 6 hours
                    if (attempts >= 5) {
                        u.setLockedUntil(java.time.LocalDateTime.now().plusHours(6));
                        auditLogService.logAccountLockout(username, ip, "5 failed login attempts");
                    }
                    
                    userRepository.save(u);
                    
                    // Log failed login attempt
                    auditLogService.logFailedLoginAttempt(username, ip, ua, "Invalid credentials");
                } else {
                    // Log failed login attempt for non-existent user
                    auditLogService.logFailedLoginAttempt(username, ip, ua, "User not found");
                }
            } catch (Exception ignored) {}

            response.put("status", "error");
            response.put("message", "Invalid credentials");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Helper: best-effort client IP from request map (fallback when not available here)
    private String getClientIp(Map<String, String> body, HttpServletRequest request) {
        try {
            String fromBody = body != null ? body.get("ip") : null;
            if (fromBody != null && !fromBody.isBlank()) return fromBody;
            if (request == null) return "unknown";
            String xf = request.getHeader("X-Forwarded-For");
            if (xf != null && !xf.isBlank()) return xf.split(",")[0].trim();
            return request.getRemoteAddr();
        } catch (Exception ignored) {
            return "unknown";
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String refreshToken = body.get("refreshToken");
            if (refreshToken == null || refreshToken.isBlank()) {
                response.put("status", "error");
                response.put("message", "Missing refresh token");
                return ResponseEntity.badRequest().body(response);
            }

            // Extract username from our simple refresh token format: refresh_{username}_{timestamp}
            String username = null;
            if (refreshToken.startsWith("refresh_")) {
                String[] parts = refreshToken.split("_");
                if (parts.length >= 2) {
                    username = parts[1];
                }
            }

            if (username == null) {
                response.put("status", "error");
                response.put("message", "Invalid refresh token");
                return ResponseEntity.badRequest().body(response);
            }

            // Ensure user still exists and is active
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "User no longer exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Issue new access and refresh tokens
            String newToken = jwtService.generateToken(username);
            String newRefreshToken = jwtService.generateRefreshToken(username);

            response.put("status", "success");
            response.put("message", "Token refreshed");
            response.put("data", Map.of(
                "token", newToken,
                "refreshToken", newRefreshToken,
                "expiresIn", 28800 // 8 hours
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to refresh token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String phoneNumber = loginRequest.get("phoneNumber");
            String password = loginRequest.get("password");

            if (phoneNumber == null || phoneNumber.isBlank()) {
                response.put("status", "error");
                response.put("message", "Phone number is required for admin login");
                return ResponseEntity.badRequest().body(response);
            }

            // Strict: Find user by username and phone number
            Optional<User> userOpt = userRepository.findByUsernameAndPhoneNumber(username, phoneNumber);

            if (userOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Invalid admin credentials");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            
            // Check if user is admin or super admin
            if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SUPER_ADMIN) {
                response.put("status", "error");
                response.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.badRequest().body(response);
            }

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("status", "error");
                response.put("message", "Invalid password");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate JWT token with context
            String ip = getClientIp(loginRequest, request);
            String ua = request.getHeader("User-Agent");
            String token = jwtService.generateTokenWithContext(username, ip, ua);
            String refreshToken = jwtService.generateRefreshToken(username);

            // Prepare user data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("fullName", user.getFullName());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("role", user.getRole().toString());
            userData.put("status", user.getStatus().toString());
            userData.put("permissions", getPermissionsForRole(user.getRole()));

            response.put("status", "success");
            response.put("message", "Admin login successful");
            response.put("data", Map.of(
                "user", userData,
                "token", token,
                "refreshToken", refreshToken,
                "expiresIn", 28800 // 8 hours in seconds
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Admin login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/simple-login")
    public ResponseEntity<Map<String, Object>> simpleLogin(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Find user by username only
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Invalid credentials");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            
            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("status", "error");
                response.put("message", "Invalid password");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate JWT token
            String token = jwtService.generateToken(username);
            String refreshToken = jwtService.generateRefreshToken(username);

            // Prepare user data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("fullName", user.getFullName());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("staffId", user.getStaffId());
            userData.put("role", user.getRole().toString());
            userData.put("status", user.getStatus().toString());
            userData.put("permissions", getPermissionsForRole(user.getRole()));

            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("data", Map.of(
                "user", userData,
                "token", token,
                "refreshToken", refreshToken,
                "expiresIn", 28800 // 8 hours in seconds
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/staff-login")
    public ResponseEntity<Map<String, Object>> staffLogin(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String staffId = loginRequest.get("staffId");
            String password = loginRequest.get("password");

            if (staffId == null || staffId.isBlank()) {
                response.put("status", "error");
                response.put("message", "Staff ID is required for staff login");
                return ResponseEntity.badRequest().body(response);
            }

            // Strict: Find user by username and staff ID
            Optional<User> userOpt = userRepository.findByUsernameAndStaffId(username, staffId);

            if (userOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Invalid staff credentials");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            
            // Check if user is staff (not admin)
            if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.SUPER_ADMIN) {
                response.put("status", "error");
                response.put("message", "Admin users should use admin login");
                return ResponseEntity.badRequest().body(response);
            }

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("status", "error");
                response.put("message", "Invalid password");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate JWT token
            String token = jwtService.generateToken(username);
            String refreshToken = jwtService.generateRefreshToken(username);

            // Prepare user data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("fullName", user.getFullName());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("staffId", user.getStaffId());
            userData.put("role", user.getRole().toString());
            userData.put("status", user.getStatus().toString());
            userData.put("permissions", getPermissionsForRole(user.getRole()));

            response.put("status", "success");
            response.put("message", "Staff login successful");
            response.put("data", Map.of(
                "user", userData,
                "token", token,
                "refreshToken", refreshToken,
                "expiresIn", 28800 // 8 hours in seconds
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Staff login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    private java.util.List<String> getPermissionsForRole(UserRole role) {
        return switch (role) {
            case SUPER_ADMIN -> java.util.List.of("all");
            case ADMIN -> java.util.List.of("dashboard", "users", "routers", "customers", "packages", "finance", "settings", "reports");
            case TECHNICIAN -> java.util.List.of("dashboard", "routers", "customers", "maintenance", "tickets");
            case FINANCE -> java.util.List.of("dashboard", "finance", "payments", "reports", "billing");
            case MARKETING -> java.util.List.of("dashboard", "marketing", "campaigns", "customers", "analytics");
            case SALES -> java.util.List.of("dashboard", "sales", "customers", "packages", "leads");
            default -> java.util.List.of("dashboard");
        };
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = registerRequest.get("username");
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String roleStr = registerRequest.getOrDefault("role", "ADMIN");

            // Check if user already exists
            if (userRepository.findByUsername(username).isPresent()) {
                response.put("status", "error");
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Parse role
            UserRole role;
            try {
                role = UserRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                role = UserRole.ADMIN; // Default role
            }

            // Create new user
            User user = new User();
            user.setUsername(username);
            user.setEmail(email != null ? email : username + "@ggwifi.co.tz");
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            
            userRepository.save(user);

            response.put("status", "success");
            response.put("message", "User registered successfully");
            response.put("username", username);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            var users = userRepository.findAll();
            response.put("status", "success");
            response.put("users", users);
            response.put("count", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch users: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Auth controller is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/sms-test")
    public ResponseEntity<Map<String, Object>> smsTest() {
        Map<String, Object> response = smsService.testSmsService();
        return ResponseEntity.ok(response);
    }
}
