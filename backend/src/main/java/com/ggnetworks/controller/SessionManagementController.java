package com.ggnetworks.controller;

import com.ggnetworks.service.SessionManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Session Management Controller
 * Provides endpoints for managing active sessions
 */
@RestController
@RequestMapping("/api/v1/sessions")
@CrossOrigin(origins = "*")
public class SessionManagementController {

    @Autowired
    private SessionManagementService sessionManagementService;

    /**
     * Get real-time active sessions
     * GET /api/v1/sessions/active
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Map<String, Object>> getActiveSessions() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> sessions = sessionManagementService.getRealTimeActiveSessions();
            response.put("status", "success");
            response.put("sessions", sessions);
            response.put("count", sessions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Terminate session with CoA
     * POST /api/v1/sessions/{sessionId}/terminate
     */
    @PostMapping("/{sessionId}/terminate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> terminateSession(
            @PathVariable String sessionId,
            @RequestParam(required = false) String reason) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = sessionManagementService.terminateSessionWithCoA(
                sessionId, reason != null ? reason : "Admin-Terminated");
            
            if (success) {
                response.put("status", "success");
                response.put("message", "Session terminated successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Failed to terminate session");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Terminate multiple sessions
     * POST /api/v1/sessions/terminate-bulk
     */
    @PostMapping("/terminate-bulk")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> terminateBulkSessions(
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<String> sessionIds = (List<String>) request.get("sessionIds");
            String reason = (String) request.getOrDefault("reason", "Bulk-Terminated");
            
            if (sessionIds == null || sessionIds.isEmpty()) {
                response.put("status", "error");
                response.put("message", "No session IDs provided");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = sessionManagementService.terminateBulkSessions(sessionIds, reason);
            response.put("status", "success");
            response.put("result", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}





