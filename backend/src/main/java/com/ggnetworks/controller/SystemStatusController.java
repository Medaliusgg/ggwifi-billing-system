package com.ggnetworks.controller;

import com.ggnetworks.config.BackendConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * System Status Controller
 * Shows current backend configuration and operation mode
 */
@Slf4j
@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
@Tag(name = "System Status", description = "System status and configuration endpoints")
public class SystemStatusController {

    private final BackendConfig backendConfig;

    /**
     * Get system status and configuration
     */
    @GetMapping("/status")
    @Operation(summary = "Get system status", description = "Get current system status and backend configuration")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        try {
            log.info("Fetching system status and configuration");
            
            Map<String, Object> status = new HashMap<>();
            status.put("success", true);
            status.put("timestamp", LocalDateTime.now());
            status.put("systemStatus", "OPERATIONAL");
            status.put("operationMode", backendConfig.getOperationMode());
            status.put("message", "System is operational");
            
            // Backend Configuration
            Map<String, Object> backendConfig = new HashMap<>();
            backendConfig.put("enabled", this.backendConfig.isEnabled());
            backendConfig.put("databaseEnabled", this.backendConfig.isDatabaseEnabled());
            backendConfig.put("radiusEnabled", this.backendConfig.isRadiusEnabled());
            backendConfig.put("mikrotikEnabled", this.backendConfig.isMikrotikEnabled());
            backendConfig.put("paymentEnabled", this.backendConfig.isPaymentEnabled());
            backendConfig.put("smsEnabled", this.backendConfig.isSmsEnabled());
            backendConfig.put("emailEnabled", this.backendConfig.isEmailEnabled());
            backendConfig.put("voucherEnabled", this.backendConfig.isVoucherEnabled());
            backendConfig.put("loyaltyEnabled", this.backendConfig.isLoyaltyEnabled());
            backendConfig.put("marketingEnabled", this.backendConfig.isMarketingEnabled());
            backendConfig.put("analyticsEnabled", this.backendConfig.isAnalyticsEnabled());
            status.put("backendConfig", backendConfig);
            
            // Feature Toggles
            Map<String, Object> features = new HashMap<>();
            features.put("userManagement", this.backendConfig.isFeatureEnabled("user-management"));
            features.put("packageManagement", this.backendConfig.isFeatureEnabled("package-management"));
            features.put("voucherManagement", this.backendConfig.isFeatureEnabled("voucher-management"));
            features.put("paymentManagement", this.backendConfig.isFeatureEnabled("payment-management"));
            features.put("sessionManagement", this.backendConfig.isFeatureEnabled("session-management"));
            features.put("coverageManagement", this.backendConfig.isFeatureEnabled("coverage-management"));
            features.put("campaignManagement", this.backendConfig.isFeatureEnabled("campaign-management"));
            features.put("loyaltyManagement", this.backendConfig.isFeatureEnabled("loyalty-management"));
            features.put("analyticsManagement", this.backendConfig.isFeatureEnabled("analytics-management"));
            features.put("routerManagement", this.backendConfig.isFeatureEnabled("router-management"));
            status.put("features", features);
            
            // Fallback Configuration
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("useMockData", this.backendConfig.isUseMockData());
            fallback.put("useLocalStorage", this.backendConfig.isUseLocalStorage());
            fallback.put("useFileConfig", this.backendConfig.isUseFileConfig());
            status.put("fallbackConfig", fallback);
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get system status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve system status"));
        }
    }

    /**
     * Get backend configuration details
     */
    @GetMapping("/config")
    @Operation(summary = "Get backend configuration", description = "Get detailed backend configuration")
    public ResponseEntity<Map<String, Object>> getBackendConfig() {
        try {
            log.info("Fetching backend configuration details");
            
            Map<String, Object> config = new HashMap<>();
            config.put("success", true);
            config.put("operationMode", backendConfig.getOperationMode());
            config.put("backendEnabled", backendConfig.isEnabled());
            config.put("databaseEnabled", backendConfig.isDatabaseEnabled());
            config.put("backendFullyEnabled", backendConfig.isBackendFullyEnabled());
            
            // Mock Data Configuration
            Map<String, Object> mockData = new HashMap<>();
            mockData.put("enabled", backendConfig.getMockData().isEnabled());
            mockData.put("dataPath", backendConfig.getMockData().getDataPath());
            mockData.put("autoGenerate", backendConfig.getMockData().isAutoGenerate());
            mockData.put("defaultPackageCount", backendConfig.getMockData().getDefaultPackageCount());
            mockData.put("defaultVoucherCount", backendConfig.getMockData().getDefaultVoucherCount());
            mockData.put("defaultUserCount", backendConfig.getMockData().getDefaultUserCount());
            config.put("mockData", mockData);
            
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            log.error("Failed to get backend configuration", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve backend configuration"));
        }
    }

    /**
     * Get feature status
     */
    @GetMapping("/features")
    @Operation(summary = "Get feature status", description = "Get status of all backend features")
    public ResponseEntity<Map<String, Object>> getFeatureStatus() {
        try {
            log.info("Fetching feature status");
            
            Map<String, Object> features = new HashMap<>();
            features.put("success", true);
            features.put("userManagement", backendConfig.isFeatureEnabled("user-management"));
            features.put("packageManagement", backendConfig.isFeatureEnabled("package-management"));
            features.put("voucherManagement", backendConfig.isFeatureEnabled("voucher-management"));
            features.put("paymentManagement", backendConfig.isFeatureEnabled("payment-management"));
            features.put("sessionManagement", backendConfig.isFeatureEnabled("session-management"));
            features.put("coverageManagement", backendConfig.isFeatureEnabled("coverage-management"));
            features.put("campaignManagement", backendConfig.isFeatureEnabled("campaign-management"));
            features.put("loyaltyManagement", backendConfig.isFeatureEnabled("loyalty-management"));
            features.put("analyticsManagement", backendConfig.isFeatureEnabled("analytics-management"));
            features.put("routerManagement", backendConfig.isFeatureEnabled("router-management"));
            
            return ResponseEntity.ok(features);
        } catch (Exception e) {
            log.error("Failed to get feature status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve feature status"));
        }
    }
} 