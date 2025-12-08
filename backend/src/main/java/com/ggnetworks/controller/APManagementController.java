package com.ggnetworks.controller;

import com.ggnetworks.entity.AccessPoint;
import com.ggnetworks.service.APManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ap-management")
public class APManagementController {

    @Autowired
    private APManagementService apManagementService;

    /**
     * Get all access points
     * GET /api/v1/ap-management
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getAllAccessPoints() {
        return ResponseEntity.ok(apManagementService.getAllAccessPoints());
    }

    /**
     * Get access point by ID
     * GET /api/v1/ap-management/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<AccessPoint> getAccessPointById(@PathVariable Long id) {
        return apManagementService.getAccessPointById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get access point by AP ID
     * GET /api/v1/ap-management/ap/{apId}
     */
    @GetMapping("/ap/{apId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<AccessPoint> getAccessPointByApId(@PathVariable String apId) {
        return apManagementService.getAccessPointByApId(apId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get access points by router
     * GET /api/v1/ap-management/router/{routerId}
     */
    @GetMapping("/router/{routerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getAccessPointsByRouter(@PathVariable Long routerId) {
        return ResponseEntity.ok(apManagementService.getAccessPointsByRouter(routerId));
    }

    /**
     * Get online access points
     * GET /api/v1/ap-management/online
     */
    @GetMapping("/online")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getOnlineAccessPoints() {
        return ResponseEntity.ok(apManagementService.getOnlineAccessPoints());
    }

    /**
     * Get offline access points
     * GET /api/v1/ap-management/offline
     */
    @GetMapping("/offline")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getOfflineAccessPoints() {
        return ResponseEntity.ok(apManagementService.getOfflineAccessPoints());
    }

    /**
     * Create new access point
     * POST /api/v1/ap-management
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<AccessPoint> createAccessPoint(@RequestBody AccessPoint accessPoint) {
        return ResponseEntity.ok(apManagementService.createAccessPoint(accessPoint));
    }

    /**
     * Update access point
     * PUT /api/v1/ap-management/{apId}
     */
    @PutMapping("/{apId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<AccessPoint> updateAccessPoint(
            @PathVariable String apId,
            @RequestBody AccessPoint accessPoint) {
        AccessPoint updated = apManagementService.updateAccessPoint(apId, accessPoint);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Update AP status
     * PATCH /api/v1/ap-management/{apId}/status
     */
    @PatchMapping("/{apId}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> updateAPStatus(
            @PathVariable String apId,
            @RequestParam String status) {
        try {
            AccessPoint.APStatus apStatus = AccessPoint.APStatus.valueOf(status.toUpperCase());
            apManagementService.updateAPStatus(apId, apStatus);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update AP health metrics
     * POST /api/v1/ap-management/{apId}/health
     */
    @PostMapping("/{apId}/health")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> updateAPHealth(
            @PathVariable String apId,
            @RequestBody Map<String, Object> healthData) {
        Integer signalStrength = healthData.get("signalStrength") != null ? 
            Integer.parseInt(healthData.get("signalStrength").toString()) : null;
        Integer connectedDevices = healthData.get("connectedDevices") != null ? 
            Integer.parseInt(healthData.get("connectedDevices").toString()) : null;
        Integer channel = healthData.get("channel") != null ? 
            Integer.parseInt(healthData.get("channel").toString()) : null;
        Integer channelInterference = healthData.get("channelInterference") != null ? 
            Integer.parseInt(healthData.get("channelInterference").toString()) : null;
        Long trafficIn = healthData.get("trafficIn") != null ? 
            Long.parseLong(healthData.get("trafficIn").toString()) : null;
        Long trafficOut = healthData.get("trafficOut") != null ? 
            Long.parseLong(healthData.get("trafficOut").toString()) : null;

        apManagementService.updateAPHealth(apId, signalStrength, connectedDevices, 
                                         channel, channelInterference, trafficIn, trafficOut);
        return ResponseEntity.ok().build();
    }

    /**
     * Get AP statistics
     * GET /api/v1/ap-management/statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getAPStatistics() {
        return ResponseEntity.ok(apManagementService.getAPStatistics());
    }

    /**
     * Get AP health summary
     * GET /api/v1/ap-management/health-summary
     */
    @GetMapping("/health-summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getAPHealthSummary() {
        return ResponseEntity.ok(apManagementService.getAPHealthSummary());
    }

    /**
     * Get APs by location
     * GET /api/v1/ap-management/location/{location}
     */
    @GetMapping("/location/{location}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getAPsByLocation(@PathVariable String location) {
        return ResponseEntity.ok(apManagementService.getAPsByLocation(location));
    }

    /**
     * Get APs with low signal
     * GET /api/v1/ap-management/low-signal?threshold=-80
     */
    @GetMapping("/low-signal")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<AccessPoint>> getAPsWithLowSignal(
            @RequestParam(defaultValue = "-80") int threshold) {
        return ResponseEntity.ok(apManagementService.getAPsWithLowSignal(threshold));
    }

    /**
     * Delete access point
     * DELETE /api/v1/ap-management/{apId}
     */
    @DeleteMapping("/{apId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteAccessPoint(@PathVariable String apId) {
        if (apManagementService.deleteAccessPoint(apId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}





