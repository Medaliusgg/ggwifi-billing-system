package com.ggnetworks.controller;

import com.ggnetworks.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user-management")
@CrossOrigin(origins = "*")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    /**
     * Search users
     * GET /api/v1/user-management/search?query=0742844024
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userManagementService.searchUsers(query));
    }

    /**
     * Get user profile
     * GET /api/v1/user-management/profile/{customerId}
     */
    @GetMapping("/profile/{customerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long customerId) {
        return ResponseEntity.ok(userManagementService.getUserProfile(customerId));
    }

    /**
     * Get user profile by phone
     * GET /api/v1/user-management/profile/phone/{phoneNumber}
     */
    @GetMapping("/profile/phone/{phoneNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserProfileByPhone(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(userManagementService.getUserProfileByPhone(phoneNumber));
    }

    /**
     * Blacklist user
     * POST /api/v1/user-management/{customerId}/blacklist
     */
    @PostMapping("/{customerId}/blacklist")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> blacklistUser(
            @PathVariable Long customerId,
            @RequestParam String reason) {
        userManagementService.blacklistUser(customerId, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * Blacklist user by phone
     * POST /api/v1/user-management/phone/{phoneNumber}/blacklist
     */
    @PostMapping("/phone/{phoneNumber}/blacklist")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> blacklistUserByPhone(
            @PathVariable String phoneNumber,
            @RequestParam String reason) {
        userManagementService.blacklistUserByPhone(phoneNumber, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * Unblacklist user
     * DELETE /api/v1/user-management/{customerId}/blacklist
     */
    @DeleteMapping("/{customerId}/blacklist")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> unblacklistUser(@PathVariable Long customerId) {
        userManagementService.unblacklistUser(customerId);
        return ResponseEntity.ok().build();
    }

    /**
     * Disable user
     * POST /api/v1/user-management/{customerId}/disable
     */
    @PostMapping("/{customerId}/disable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> disableUser(@PathVariable Long customerId) {
        userManagementService.disableUser(customerId);
        return ResponseEntity.ok().build();
    }

    /**
     * Enable user
     * POST /api/v1/user-management/{customerId}/enable
     */
    @PostMapping("/{customerId}/enable")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> enableUser(@PathVariable Long customerId) {
        userManagementService.enableUser(customerId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get MAC randomization analysis
     * GET /api/v1/user-management/phone/{phoneNumber}/mac-analysis
     */
    @GetMapping("/phone/{phoneNumber}/mac-analysis")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getMacRandomizationAnalysis(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(userManagementService.getMacRandomizationAnalysis(phoneNumber));
    }

    /**
     * Get user statistics
     * GET /api/v1/user-management/statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        return ResponseEntity.ok(userManagementService.getUserStatistics());
    }
}





