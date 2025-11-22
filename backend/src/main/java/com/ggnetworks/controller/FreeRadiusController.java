package com.ggnetworks.controller;

import com.ggnetworks.entity.RadiusCheck;
import com.ggnetworks.entity.RadiusReply;
import com.ggnetworks.entity.RadiusAcct;
import com.ggnetworks.entity.RadiusNas;
import com.ggnetworks.repository.RadiusCheckRepository;
import com.ggnetworks.repository.RadiusReplyRepository;
import com.ggnetworks.repository.RadiusAcctRepository;
import com.ggnetworks.repository.RadiusNasRepository;
import com.ggnetworks.service.FreeRadiusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/radius")
@CrossOrigin(origins = "*")
public class FreeRadiusController {

    @Autowired
    private FreeRadiusService freeRadiusService;

    @Autowired
    private RadiusCheckRepository radiusCheckRepository;

    @Autowired
    private RadiusReplyRepository radiusReplyRepository;

    @Autowired
    private RadiusAcctRepository radiusAcctRepository;

    @Autowired
    private RadiusNasRepository radiusNasRepository;

    /**
     * Test RADIUS connection and tables
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean tablesExist = freeRadiusService.checkRadiusTables();
            Map<String, Object> stats = freeRadiusService.getRadiusStatistics();
            
            response.put("status", "success");
            response.put("message", "FreeRADIUS integration is working");
            response.put("tablesExist", tablesExist);
            response.put("statistics", stats);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "FreeRADIUS health check failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all RADIUS users
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<RadiusCheck> users = radiusCheckRepository.findByIsActiveTrue();
            response.put("status", "success");
            response.put("users", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get RADIUS users: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Add new RADIUS user
     */
    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody Map<String, String> userRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = userRequest.get("username");
            String password = userRequest.get("password");
            String userType = userRequest.getOrDefault("userType", "HOTSPOT");
            
            if (username == null || password == null) {
                response.put("status", "error");
                response.put("message", "Username and password are required");
                return ResponseEntity.badRequest().body(response);
            }

            boolean success = freeRadiusService.addRadiusUser(username, password, userType, null, null, null);
            
            if (success) {
                response.put("status", "success");
                response.put("message", "RADIUS user added successfully");
                response.put("username", username);
                response.put("userType", userType);
            } else {
                response.put("status", "error");
                response.put("message", "Failed to add RADIUS user");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to add RADIUS user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Authenticate RADIUS user
     */
    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, Object>> authenticateUser(@RequestBody Map<String, String> authRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = authRequest.get("username");
            String password = authRequest.get("password");
            
            if (username == null || password == null) {
                response.put("status", "error");
                response.put("message", "Username and password are required");
                return ResponseEntity.badRequest().body(response);
            }

            // For testing, we'll use a simple password check against our database
            Optional<RadiusCheck> userCheck = radiusCheckRepository.findByUsernameAndAttribute(username, "Cleartext-Password");
            
            if (userCheck.isPresent() && userCheck.get().getIsActive()) {
                boolean isAuthenticated = userCheck.get().getValue().equals(password);
                
                response.put("status", "success");
                response.put("authenticated", isAuthenticated);
                response.put("username", username);
                response.put("message", isAuthenticated ? "Authentication successful" : "Authentication failed");
            } else {
                response.put("status", "success");
                response.put("authenticated", false);
                response.put("username", username);
                response.put("message", "User not found or inactive");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get active RADIUS sessions
     */
    @GetMapping("/sessions")
    public ResponseEntity<Map<String, Object>> getActiveSessions() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Map<String, Object>> sessions = freeRadiusService.getActiveRadiusSessions();
            response.put("status", "success");
            response.put("sessions", sessions);
            response.put("count", sessions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get active sessions: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get RADIUS statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> stats = freeRadiusService.getRadiusStatistics();
            response.put("status", "success");
            response.put("statistics", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get RADIUS analytics for hotspot billing
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getRadiusAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            java.time.LocalDateTime start;
            java.time.LocalDateTime end;
            
            try {
                start = startDate != null && !startDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(startDate) : 
                    java.time.LocalDateTime.now().minusDays(30);
                end = endDate != null && !endDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(endDate) : 
                    java.time.LocalDateTime.now();
            } catch (Exception e) {
                // If date parsing fails, use defaults
                start = java.time.LocalDateTime.now().minusDays(30);
                end = java.time.LocalDateTime.now();
            }
            
            Map<String, Object> analytics = freeRadiusService.getRadiusAnalytics(start, end);
            response.put("status", "success");
            response.put("message", "RADIUS analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get analytics: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Configure NAS (Network Access Server)
     */
    @PostMapping("/nas")
    public ResponseEntity<Map<String, Object>> configureNas(@RequestBody Map<String, String> nasRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String nasIp = nasRequest.get("nasIp");
            String sharedSecret = nasRequest.getOrDefault("sharedSecret", "testing123");
            
            if (nasIp == null) {
                response.put("status", "error");
                response.put("message", "NAS IP address is required");
                return ResponseEntity.badRequest().body(response);
            }

            freeRadiusService.configureRadiusClient(nasIp, sharedSecret);
            
            response.put("status", "success");
            response.put("message", "NAS configured successfully");
            response.put("nasIp", nasIp);
            response.put("sharedSecret", sharedSecret);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to configure NAS: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get all NAS entries
     */
    @GetMapping("/nas")
    public ResponseEntity<Map<String, Object>> getAllNas() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<RadiusNas> nasList = radiusNasRepository.findByIsActiveTrue();
            response.put("status", "success");
            response.put("nasList", nasList);
            response.put("count", nasList.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get NAS list: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Start accounting session
     */
    @PostMapping("/accounting/start")
    public ResponseEntity<Map<String, Object>> startAccounting(@RequestBody Map<String, String> sessionRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = sessionRequest.get("username");
            String nasIpAddress = sessionRequest.getOrDefault("nasIpAddress", "192.168.1.1");
            String framedIpAddress = sessionRequest.getOrDefault("framedIpAddress", "192.168.1.100");
            String callingStationId = sessionRequest.getOrDefault("callingStationId", "00:11:22:33:44:55");
            
            if (username == null) {
                response.put("status", "error");
                response.put("message", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }

            freeRadiusService.startAccountingSession(username, nasIpAddress, framedIpAddress, callingStationId);
            
            response.put("status", "success");
            response.put("message", "Accounting session started");
            response.put("username", username);
            response.put("nasIpAddress", nasIpAddress);
            response.put("framedIpAddress", framedIpAddress);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to start accounting session: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Stop accounting session
     */
    @PostMapping("/accounting/stop")
    public ResponseEntity<Map<String, Object>> stopAccounting(@RequestBody Map<String, String> sessionRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = sessionRequest.get("username");
            String terminateCause = sessionRequest.getOrDefault("terminateCause", "User-Request");
            
            if (username == null) {
                response.put("status", "error");
                response.put("message", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }

            freeRadiusService.stopAccountingSession(username, terminateCause);
            
            response.put("status", "success");
            response.put("message", "Accounting session stopped");
            response.put("username", username);
            response.put("terminateCause", terminateCause);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to stop accounting session: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Remove RADIUS user
     */
    @DeleteMapping("/users/{username}")
    public ResponseEntity<Map<String, Object>> removeUser(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = freeRadiusService.removeRadiusUser(username);
            
            if (success) {
                response.put("status", "success");
                response.put("message", "RADIUS user removed successfully");
                response.put("username", username);
            } else {
                response.put("status", "error");
                response.put("message", "Failed to remove RADIUS user");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to remove RADIUS user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
