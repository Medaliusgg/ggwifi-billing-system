package com.ggnetworks.controller;

import com.ggnetworks.entity.DeviceHistory;
import com.ggnetworks.service.DeviceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/device-management")
public class DeviceManagementController {

    @Autowired
    private DeviceManagementService deviceManagementService;

    /**
     * Record device usage
     * POST /api/v1/device-management/record
     */
    @PostMapping("/record")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<DeviceHistory> recordDeviceUsage(@RequestBody Map<String, Object> deviceData) {
        Long customerId = deviceData.get("customerId") != null ? 
            Long.parseLong(deviceData.get("customerId").toString()) : null;
        String phoneNumber = (String) deviceData.get("phoneNumber");
        String macAddress = (String) deviceData.get("macAddress");
        String deviceFingerprint = (String) deviceData.get("deviceFingerprint");
        String deviceType = (String) deviceData.get("deviceType");
        String deviceName = (String) deviceData.get("deviceName");

        DeviceHistory device = deviceManagementService.recordDeviceUsage(
            customerId, phoneNumber, macAddress, deviceFingerprint, deviceType, deviceName);
        return ResponseEntity.ok(device);
    }

    /**
     * Get device history by customer ID
     * GET /api/v1/device-management/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<DeviceHistory>> getDeviceHistoryByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(deviceManagementService.getDeviceHistoryByCustomer(customerId));
    }

    /**
     * Get device history by phone number
     * GET /api/v1/device-management/phone/{phoneNumber}
     */
    @GetMapping("/phone/{phoneNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<DeviceHistory>> getDeviceHistoryByPhone(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(deviceManagementService.getDeviceHistoryByPhone(phoneNumber));
    }

    /**
     * Get all MAC addresses for phone number
     * GET /api/v1/device-management/phone/{phoneNumber}/macs
     */
    @GetMapping("/phone/{phoneNumber}/macs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<String>> getAllMacAddressesForPhone(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(deviceManagementService.getAllMacAddressesForPhone(phoneNumber));
    }

    /**
     * Count distinct MAC addresses
     * GET /api/v1/device-management/phone/{phoneNumber}/mac-count
     */
    @GetMapping("/phone/{phoneNumber}/mac-count")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> countDistinctMacAddresses(@PathVariable String phoneNumber) {
        long count = deviceManagementService.countDistinctMacAddresses(phoneNumber);
        return ResponseEntity.ok(Map.of("phoneNumber", phoneNumber, "distinctMacCount", count));
    }

    /**
     * Get device by MAC address
     * GET /api/v1/device-management/mac/{macAddress}
     */
    @GetMapping("/mac/{macAddress}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<DeviceHistory> getDeviceByMacAddress(@PathVariable String macAddress) {
        return deviceManagementService.getDeviceByMacAddress(macAddress)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Merge MAC addresses
     * POST /api/v1/device-management/merge
     */
    @PostMapping("/merge")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> mergeMacAddresses(
            @RequestParam String phoneNumber,
            @RequestBody List<String> macAddresses) {
        deviceManagementService.mergeMacAddresses(phoneNumber, macAddresses);
        return ResponseEntity.ok().build();
    }

    /**
     * Blacklist device
     * POST /api/v1/device-management/{macAddress}/blacklist
     */
    @PostMapping("/{macAddress}/blacklist")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> blacklistDevice(
            @PathVariable String macAddress,
            @RequestParam String reason) {
        deviceManagementService.blacklistDevice(macAddress, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * Unblacklist device
     * DELETE /api/v1/device-management/{macAddress}/blacklist
     */
    @DeleteMapping("/{macAddress}/blacklist")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> unblacklistDevice(@PathVariable String macAddress) {
        deviceManagementService.unblacklistDevice(macAddress);
        return ResponseEntity.ok().build();
    }

    /**
     * Get blacklisted devices
     * GET /api/v1/device-management/blacklisted
     */
    @GetMapping("/blacklisted")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<DeviceHistory>> getBlacklistedDevices() {
        return ResponseEntity.ok(deviceManagementService.getBlacklistedDevices());
    }

    /**
     * Detect fraud
     * GET /api/v1/device-management/fraud/{phoneNumber}
     */
    @GetMapping("/fraud/{phoneNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> detectFraud(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(deviceManagementService.detectFraud(phoneNumber));
    }

    /**
     * Get device statistics
     * GET /api/v1/device-management/statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getDeviceStatistics() {
        return ResponseEntity.ok(deviceManagementService.getDeviceStatistics());
    }

    /**
     * Set primary device
     * POST /api/v1/device-management/primary
     */
    @PostMapping("/primary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setPrimaryDevice(
            @RequestParam String phoneNumber,
            @RequestParam String macAddress) {
        deviceManagementService.setPrimaryDevice(phoneNumber, macAddress);
        return ResponseEntity.ok().build();
    }

    /**
     * Get primary device
     * GET /api/v1/device-management/primary/{phoneNumber}
     */
    @GetMapping("/primary/{phoneNumber}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<DeviceHistory> getPrimaryDevice(@PathVariable String phoneNumber) {
        return deviceManagementService.getPrimaryDevice(phoneNumber)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}





