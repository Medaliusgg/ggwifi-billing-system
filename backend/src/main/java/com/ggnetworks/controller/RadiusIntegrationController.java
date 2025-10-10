package com.ggnetworks.controller;

import com.ggnetworks.entity.RadiusAccounting;
import com.ggnetworks.entity.RadiusReply;
import com.ggnetworks.entity.RadiusUser;
import com.ggnetworks.entity.User;
import com.ggnetworks.service.PhoneNumberService;
import com.ggnetworks.service.RadiusService;
import com.ggnetworks.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Optional;

/**
 * Controller for managing FreeRADIUS integration
 * Provides endpoints for monitoring and managing FreeRADIUS data
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/radius")
@RequiredArgsConstructor
@Tag(name = "FreeRADIUS Integration", description = "Endpoints for managing FreeRADIUS integration")
public class RadiusIntegrationController {

    private final RadiusService radiusService;
    private final VoucherService voucherService;
    private final PhoneNumberService phoneNumberService;

    /**
     * Get FreeRADIUS integration status
     */
    @GetMapping("/status")
    @Operation(summary = "Get FreeRADIUS integration status", description = "Check if FreeRADIUS integration is working properly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getIntegrationStatus() {
        try {
            Map<String, Object> status = new HashMap<>();
            
            // Check if we can read from FreeRADIUS tables
            long totalUsers = radiusService.countAllRadiusUsers();
            long totalSessions = radiusService.countAllRadiusAccounting();
            long totalReplies = radiusService.countAllRadiusReplies();
            
            status.put("status", "ACTIVE");
            status.put("message", "FreeRADIUS integration is working properly");
            status.put("totalUsers", totalUsers);
            status.put("totalSessions", totalSessions);
            status.put("totalReplies", totalReplies);
            status.put("lastChecked", LocalDateTime.now());
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get FreeRADIUS integration status", e);
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", "FreeRADIUS integration error: " + e.getMessage());
            error.put("lastChecked", LocalDateTime.now());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Get all FreeRADIUS users with pagination
     */
    @GetMapping("/users")
    @Operation(summary = "Get all FreeRADIUS users", description = "Retrieve all users from radcheck table with pagination")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<RadiusUser>> getAllRadiusUsers(Pageable pageable) {
        try {
            Page<RadiusUser> users = radiusService.getAllRadiusUsers(pageable);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to get FreeRADIUS users", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get FreeRADIUS user by username
     */
    @GetMapping("/users/{username}")
    @Operation(summary = "Get FreeRADIUS user by username", description = "Retrieve a specific user from radcheck table")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RadiusUser> getRadiusUserByUsername(@PathVariable String username) {
        try {
            Optional<RadiusUser> userOpt = radiusService.findRadiusUserByUsername(username);
            return userOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Failed to get FreeRADIUS user: {}", username, e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get active FreeRADIUS sessions
     */
    @GetMapping("/sessions/active")
    @Operation(summary = "Get active FreeRADIUS sessions", description = "Retrieve all active sessions from radacct table")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RadiusAccounting>> getActiveSessions() {
        try {
            List<RadiusAccounting> sessions = radiusService.getActiveSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Failed to get active FreeRADIUS sessions", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get session history for a user
     */
    @GetMapping("/sessions/user/{username}")
    @Operation(summary = "Get session history for user", description = "Retrieve session history for a specific user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RadiusAccounting>> getUserSessionHistory(@PathVariable String username) {
        try {
            List<RadiusAccounting> sessions = radiusService.getSessionsByUsername(username);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Failed to get session history for user: {}", username, e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get FreeRADIUS statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get FreeRADIUS statistics", description = "Retrieve comprehensive statistics about FreeRADIUS usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRadiusStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // User statistics
            long totalUsers = radiusService.countAllRadiusUsers();
            long activeUsers = radiusService.countActiveRadiusUsers();
            long hotspotUsers = radiusService.countUsersByType(RadiusUser.UserType.HOTSPOT_USER);
            long pppoeUsers = radiusService.countUsersByType(RadiusUser.UserType.PPPOE_USER);
            
            // Session statistics
            long totalSessions = radiusService.countAllRadiusAccounting();
            long activeSessions = radiusService.countActiveSessions();
            long todaySessions = radiusService.countSessionsByDateRange(LocalDateTime.now().withHour(0).withMinute(0), LocalDateTime.now());
            
            // Usage statistics
            long totalDataUsage = radiusService.getTotalDataUsage();
            long totalTimeUsage = radiusService.getTotalTimeUsage();
            
            stats.put("users", Map.of(
                "total", totalUsers,
                "active", activeUsers,
                "hotspot", hotspotUsers,
                "pppoe", pppoeUsers
            ));
            
            stats.put("sessions", Map.of(
                "total", totalSessions,
                "active", activeSessions,
                "today", todaySessions
            ));
            
            stats.put("usage", Map.of(
                "totalDataMb", totalDataUsage,
                "totalTimeMinutes", totalTimeUsage
            ));
            
            stats.put("lastUpdated", LocalDateTime.now());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get FreeRADIUS statistics", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Disconnect a user from FreeRADIUS
     */
    @PostMapping("/users/{username}/disconnect")
    @Operation(summary = "Disconnect user", description = "Disconnect a user from FreeRADIUS")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> disconnectUser(@PathVariable String username, 
                                                             @RequestParam(required = false) String macAddress) {
        try {
            boolean disconnected = radiusService.disconnectUser(username, macAddress);
            Map<String, Object> response = new HashMap<>();
            
            if (disconnected) {
                response.put("success", true);
                response.put("message", "User disconnected successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to disconnect user");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Failed to disconnect user: {}", username, e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error disconnecting user: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Get phone number statistics for SMS marketing
     */
    @GetMapping("/marketing/phone-numbers")
    @Operation(summary = "Get phone number statistics", description = "Get phone number statistics for SMS marketing campaigns")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhoneNumberService.PhoneNumberStats> getPhoneNumberStats() {
        try {
            PhoneNumberService.PhoneNumberStats stats = phoneNumberService.getPhoneNumberStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get phone number statistics", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get phone numbers by user type for targeted marketing
     */
    @GetMapping("/marketing/phone-numbers/{userType}")
    @Operation(summary = "Get phone numbers by user type", description = "Get phone numbers for specific user type for targeted marketing")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPhoneNumbersByUserType(@PathVariable String userType) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            switch (userType.toUpperCase()) {
                case "HOTSPOT":
                    response.put("phoneNumbers", phoneNumberService.getPhoneNumbersByUserType(User.UserRole.HOTSPOT_USER));
                    break;
                case "PPPOE":
                    response.put("phoneNumbers", phoneNumberService.getPhoneNumbersByUserType(User.UserRole.PPPOE_USER));
                    break;
                case "ACTIVE":
                    response.put("phoneNumbers", phoneNumberService.getActiveUsersPhoneNumbers());
                    break;
                case "ALL":
                    response.put("phoneNumbers", phoneNumberService.getAllUniquePhoneNumbers());
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid user type"));
            }
            
            response.put("count", ((Set<?>) response.get("phoneNumbers")).size());
            response.put("userType", userType);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get phone numbers for user type: {}", userType, e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Test FreeRADIUS authentication
     */
    @PostMapping("/test-auth")
    @Operation(summary = "Test FreeRADIUS authentication", description = "Test authentication for a user in FreeRADIUS")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> testAuthentication(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String macAddress = request.get("macAddress");
            String ipAddress = request.get("ipAddress");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
            }
            
            RadiusService.RadiusAuthResult result = radiusService.authenticateUser(username, password, macAddress, ipAddress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", result.isSuccess());
            response.put("message", result.getMessage());
            response.put("username", username);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to test authentication", e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Authentication test failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Get FreeRADIUS configuration info
     */
    @GetMapping("/config")
    @Operation(summary = "Get FreeRADIUS configuration", description = "Get current FreeRADIUS configuration information")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRadiusConfig() {
        try {
            Map<String, Object> config = new HashMap<>();
            config.put("database", "MySQL");
            config.put("databaseName", "ggnetworks");
            config.put("sharedTables", List.of("radcheck", "radreply", "radacct"));
            config.put("integrationStatus", "ACTIVE");
            config.put("lastSync", LocalDateTime.now());
            config.put("features", List.of(
                "Voucher Authentication",
                "PPPoE User Management", 
                "Session Accounting",
                "Rate Limiting",
                "Phone Number Integration"
            ));
            
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            log.error("Failed to get FreeRADIUS configuration", e);
            return ResponseEntity.status(500).build();
        }
    }
}
