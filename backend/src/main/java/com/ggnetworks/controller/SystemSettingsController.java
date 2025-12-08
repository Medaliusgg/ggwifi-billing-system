package com.ggnetworks.controller;

import com.ggnetworks.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/system-settings")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    /**
     * Get all settings grouped by category
     * GET /api/v1/system-settings
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Map<String, Object>>> getAllSettings() {
        return ResponseEntity.ok(systemSettingsService.getAllSettingsGrouped());
    }

    /**
     * Get hotspot domain settings
     * GET /api/v1/system-settings/hotspot
     */
    @GetMapping("/hotspot")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getHotspotDomainSettings() {
        return ResponseEntity.ok(systemSettingsService.getHotspotDomainSettings());
    }

    /**
     * Set hotspot domain
     * POST /api/v1/system-settings/hotspot/domain
     */
    @PostMapping("/hotspot/domain")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setHotspotDomain(@RequestParam String domain) {
        systemSettingsService.setHotspotDomain(domain);
        return ResponseEntity.ok().build();
    }

    /**
     * Get API keys (masked)
     * GET /api/v1/system-settings/api-keys
     */
    @GetMapping("/api-keys")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getApiKeys() {
        return ResponseEntity.ok(systemSettingsService.getApiKeys());
    }

    /**
     * Set API key
     * POST /api/v1/system-settings/api-keys/{service}
     */
    @PostMapping("/api-keys/{service}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setApiKey(
            @PathVariable String service,
            @RequestParam String key) {
        systemSettingsService.setApiKey(service, key);
        return ResponseEntity.ok().build();
    }

    /**
     * Get notification templates
     * GET /api/v1/system-settings/notifications
     */
    @GetMapping("/notifications")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getNotificationTemplates() {
        return ResponseEntity.ok(systemSettingsService.getNotificationTemplates());
    }

    /**
     * Set notification template
     * POST /api/v1/system-settings/notifications/{type}
     */
    @PostMapping("/notifications/{type}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setNotificationTemplate(
            @PathVariable String type,
            @RequestParam String template) {
        systemSettingsService.setNotificationTemplate(type, template);
        return ResponseEntity.ok().build();
    }

    /**
     * Get voucher settings
     * GET /api/v1/system-settings/voucher
     */
    @GetMapping("/voucher")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getVoucherSettings() {
        return ResponseEntity.ok(systemSettingsService.getVoucherSettings());
    }

    /**
     * Get loyalty program settings
     * GET /api/v1/system-settings/loyalty
     */
    @GetMapping("/loyalty")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getLoyaltySettings() {
        return ResponseEntity.ok(systemSettingsService.getLoyaltySettings());
    }

    /**
     * Get branding settings
     * GET /api/v1/system-settings/branding
     */
    @GetMapping("/branding")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getBrandingSettings() {
        return ResponseEntity.ok(systemSettingsService.getBrandingSettings());
    }

    /**
     * Set branding setting
     * POST /api/v1/system-settings/branding/{key}
     */
    @PostMapping("/branding/{key}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setBrandingSetting(
            @PathVariable String key,
            @RequestParam String value) {
        systemSettingsService.setBrandingSetting(key, value);
        return ResponseEntity.ok().build();
    }

    /**
     * Get configuration value by key
     * GET /api/v1/system-settings/config/{key}
     */
    @GetMapping("/config/{key}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> getConfigValue(@PathVariable String key) {
        String value = systemSettingsService.getConfigValue(key);
        return ResponseEntity.ok(Map.of("key", key, "value", value != null ? value : ""));
    }

    /**
     * Set configuration value
     * POST /api/v1/system-settings/config
     */
    @PostMapping("/config")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> setConfigValue(
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(required = false) String description) {
        systemSettingsService.setConfigValue(key, value, description);
        return ResponseEntity.ok().build();
    }
}





