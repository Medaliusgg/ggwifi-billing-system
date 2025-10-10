package com.ggnetworks.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to make backend features optional
 * This allows the system to work with or without backend integration
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "backend")
public class BackendConfig {

    // ==================== BACKEND ENABLED/DISABLED ====================
    
    /**
     * Master switch to enable/disable backend completely
     */
    private boolean enabled = true;
    
    /**
     * Enable/disable database operations
     */
    private boolean databaseEnabled = true;
    
    /**
     * Enable/disable RADIUS integration
     */
    private boolean radiusEnabled = true;
    
    /**
     * Enable/disable MikroTik router integration
     */
    private boolean mikrotikEnabled = true;
    
    /**
     * Enable/disable payment gateway integration
     */
    private boolean paymentEnabled = true;
    
    /**
     * Enable/disable SMS integration
     */
    private boolean smsEnabled = true;
    
    /**
     * Enable/disable email integration
     */
    private boolean emailEnabled = true;
    
    /**
     * Enable/disable voucher system
     */
    private boolean voucherEnabled = true;
    
    /**
     * Enable/disable loyalty system
     */
    private boolean loyaltyEnabled = true;
    
    /**
     * Enable/disable marketing campaigns
     */
    private boolean marketingEnabled = true;
    
    /**
     * Enable/disable analytics and reporting
     */
    private boolean analyticsEnabled = true;
    
    // ==================== FALLBACK MODES ====================
    
    /**
     * Use mock data when backend is disabled
     */
    private boolean useMockData = true;
    
    /**
     * Use local storage when database is disabled
     */
    private boolean useLocalStorage = true;
    
    /**
     * Use file-based configuration when database is disabled
     */
    private boolean useFileConfig = true;
    
    // ==================== MOCK DATA CONFIGURATION ====================
    
    /**
     * Mock data configuration
     */
    private MockDataConfig mockData = new MockDataConfig();
    
    @Data
    public static class MockDataConfig {
        private boolean enabled = true;
        private String dataPath = "mock-data/";
        private boolean autoGenerate = true;
        private int defaultPackageCount = 10;
        private int defaultVoucherCount = 50;
        private int defaultUserCount = 100;
    }
    
    // ==================== FEATURE TOGGLES ====================
    
    /**
     * Enable/disable specific features
     */
    private FeatureToggles features = new FeatureToggles();
    
    @Data
    public static class FeatureToggles {
        private boolean userManagement = true;
        private boolean packageManagement = true;
        private boolean voucherManagement = true;
        private boolean paymentManagement = true;
        private boolean sessionManagement = true;
        private boolean coverageManagement = true;
        private boolean campaignManagement = true;
        private boolean loyaltyManagement = true;
        private boolean analyticsManagement = true;
        private boolean routerManagement = true;
    }
    
    // ==================== UTILITY METHODS ====================
    
    /**
     * Check if backend is fully enabled
     */
    public boolean isBackendFullyEnabled() {
        return enabled && databaseEnabled;
    }
    
    /**
     * Check if specific feature is enabled
     */
    public boolean isFeatureEnabled(String feature) {
        if (!enabled) return false;
        
        switch (feature.toLowerCase()) {
            case "user-management":
                return features.isUserManagement();
            case "package-management":
                return features.isPackageManagement();
            case "voucher-management":
                return features.isVoucherManagement();
            case "payment-management":
                return features.isPaymentManagement();
            case "session-management":
                return features.isSessionManagement();
            case "coverage-management":
                return features.isCoverageManagement();
            case "campaign-management":
                return features.isCampaignManagement();
            case "loyalty-management":
                return features.isLoyaltyManagement();
            case "analytics-management":
                return features.isAnalyticsManagement();
            case "router-management":
                return features.isRouterManagement();
            default:
                return true;
        }
    }
    
    /**
     * Get operation mode description
     */
    public String getOperationMode() {
        if (!enabled) {
            return "BACKEND_DISABLED";
        } else if (!databaseEnabled) {
            return "MOCK_MODE";
        } else {
            return "FULL_BACKEND";
        }
    }
} 