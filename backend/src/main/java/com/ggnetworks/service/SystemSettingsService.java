package com.ggnetworks.service;

import com.ggnetworks.entity.SystemConfiguration;
import com.ggnetworks.repository.SystemConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SystemSettingsService {

    @Autowired
    private SystemConfigurationRepository systemConfigurationRepository;

    /**
     * Get all system configurations
     */
    public List<SystemConfiguration> getAllConfigurations() {
        return systemConfigurationRepository.findAll();
    }

    /**
     * Get configuration by key
     */
    public Optional<SystemConfiguration> getConfigurationByKey(String key) {
        return systemConfigurationRepository.findByConfigKey(key);
    }

    /**
     * Get configuration value by key
     */
    public String getConfigValue(String key) {
        return systemConfigurationRepository.findByConfigKey(key)
            .map(SystemConfiguration::getValue)
            .orElse(null);
    }

    /**
     * Set configuration value
     */
    @Transactional
    public SystemConfiguration setConfigValue(String key, String value, String description) {
        Optional<SystemConfiguration> configOpt = systemConfigurationRepository.findByConfigKey(key);
        
        if (configOpt.isPresent()) {
            SystemConfiguration config = configOpt.get();
            config.setConfigValue(value);
            if (description != null) {
                config.setDescription(description);
            }
            return systemConfigurationRepository.save(config);
        } else {
            SystemConfiguration newConfig = new SystemConfiguration();
            newConfig.setConfigKey(key);
            newConfig.setConfigValue(value);
            newConfig.setDescription(description != null ? description : "");
            newConfig.setCategory(SystemConfiguration.ConfigCategory.SYSTEM_SETTINGS);
            return systemConfigurationRepository.save(newConfig);
        }
    }

    /**
     * Get hotspot domain settings
     */
    public Map<String, String> getHotspotDomainSettings() {
        Map<String, String> settings = new HashMap<>();
        settings.put("hotspotDomain", getConfigValue("hotspot.domain"));
        settings.put("hotspotUrl", getConfigValue("hotspot.url"));
        settings.put("hotspotPortalUrl", getConfigValue("hotspot.portal.url"));
        return settings;
    }

    /**
     * Set hotspot domain
     */
    @Transactional
    public void setHotspotDomain(String domain) {
        setConfigValue("hotspot.domain", domain, "Hotspot domain name");
    }

    /**
     * Get API keys (masked)
     */
    public Map<String, String> getApiKeys() {
        Map<String, String> keys = new HashMap<>();
        
        String selcomKey = getConfigValue("api.selcom.key");
        String zenopayKey = getConfigValue("api.zenopay.key");
        String smsApiKey = getConfigValue("api.sms.key");
        
        keys.put("selcomKey", maskApiKey(selcomKey));
        keys.put("zenopayKey", maskApiKey(zenopayKey));
        keys.put("smsApiKey", maskApiKey(smsApiKey));
        
        return keys;
    }

    /**
     * Set API key
     */
    @Transactional
    public void setApiKey(String service, String key) {
        setConfigValue("api." + service.toLowerCase() + ".key", key, service + " API Key");
    }

    /**
     * Get notification templates
     */
    public Map<String, String> getNotificationTemplates() {
        Map<String, String> templates = new HashMap<>();
        templates.put("paymentSuccess", getConfigValue("notification.template.payment.success"));
        templates.put("paymentFailed", getConfigValue("notification.template.payment.failed"));
        templates.put("voucherGenerated", getConfigValue("notification.template.voucher.generated"));
        templates.put("sessionExpiring", getConfigValue("notification.template.session.expiring"));
        return templates;
    }

    /**
     * Set notification template
     */
    @Transactional
    public void setNotificationTemplate(String type, String template) {
        setConfigValue("notification.template." + type, template, "Notification template for " + type);
    }

    /**
     * Get voucher settings
     */
    public Map<String, Object> getVoucherSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("prefix", getConfigValue("voucher.prefix"));
        settings.put("length", getConfigValue("voucher.length"));
        settings.put("defaultExpirationDays", getConfigValue("voucher.default.expiration.days"));
        return settings;
    }

    /**
     * Get loyalty program settings
     */
    public Map<String, Object> getLoyaltySettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("pointsPerPackage", getConfigValue("loyalty.points.per.package"));
        settings.put("pointsPerTZS", getConfigValue("loyalty.points.per.tzs"));
        settings.put("rewardTiers", getConfigValue("loyalty.reward.tiers"));
        return settings;
    }

    /**
     * Get branding settings
     */
    public Map<String, String> getBrandingSettings() {
        Map<String, String> settings = new HashMap<>();
        settings.put("companyName", getConfigValue("branding.company.name"));
        settings.put("companyLogo", getConfigValue("branding.company.logo"));
        settings.put("primaryColor", getConfigValue("branding.color.primary"));
        settings.put("secondaryColor", getConfigValue("branding.color.secondary"));
        settings.put("theme", getConfigValue("branding.theme"));
        return settings;
    }

    /**
     * Set branding setting
     */
    @Transactional
    public void setBrandingSetting(String key, String value) {
        setConfigValue("branding." + key, value, "Branding setting: " + key);
    }

    /**
     * Get all system settings grouped by category
     */
    public Map<String, Map<String, Object>> getAllSettingsGrouped() {
        Map<String, Map<String, Object>> grouped = new HashMap<>();
        
        grouped.put("hotspot", new HashMap<>(getHotspotDomainSettings()));
        grouped.put("apiKeys", new HashMap<>(getApiKeys()));
        grouped.put("notifications", new HashMap<>(getNotificationTemplates()));
        grouped.put("voucher", getVoucherSettings());
        grouped.put("loyalty", getLoyaltySettings());
        grouped.put("branding", new HashMap<>(getBrandingSettings()));
        
        return grouped;
    }

    /**
     * Mask API key for display
     */
    private String maskApiKey(String key) {
        if (key == null || key.length() <= 8) {
            return "****";
        }
        return key.substring(0, 4) + "****" + key.substring(key.length() - 4);
    }
}

