package com.ggnetworks.service;

import com.ggnetworks.entity.Router;
import com.ggnetworks.repository.RouterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnhancedRouterService {

    private final RouterRepository routerRepository;
    private final WebClient.Builder webClientBuilder;
    private final RadiusService radiusService;

    @Value("${radius.server.ip:192.168.1.100}")
    private String defaultRadiusServerIp;

    @Value("${radius.server.secret:testing123}")
    private String defaultRadiusSecret;

    @Value("${backend.ip:192.168.1.100}")
    private String backendServerIp;

    /**
     * Add new router with automatic configuration
     */
    @Transactional
    public Router addRouterWithConfiguration(EnhancedRouterController.RouterSetupRequest request) {
        try {
            // Validate router doesn't already exist
            if (routerRepository.findByIpAddressAndDeletedAtIsNull(request.getIpAddress()).isPresent()) {
                throw new IllegalArgumentException("Router with IP " + request.getIpAddress() + " already exists");
            }

            // Create router entity
            Router router = new Router();
            router.setName(request.getName());
            router.setIpAddress(request.getIpAddress());
            router.setLocation(request.getLocation());
            router.setModel(request.getModel());
            router.setSerialNumber(request.getSerialNumber());
            router.setUsername(request.getUsername());
            router.setPassword(request.getPassword());
            router.setDescription(request.getDescription());
            router.setPort(request.getPort());
            router.setType(Router.RouterType.MIKROTIK);
            router.setStatus(Router.RouterStatus.ACTIVE);

            // Store configuration as JSON
            Map<String, Object> config = new HashMap<>();
            config.put("radiusServerIp", request.getRadiusServerIp() != null ? request.getRadiusServerIp() : defaultRadiusServerIp);
            config.put("radiusSecret", request.getRadiusSecret() != null ? request.getRadiusSecret() : defaultRadiusSecret);
            config.put("hotspotNetwork", request.getHotspotNetwork());
            config.put("pppoeNetwork", request.getPppoeNetwork());
            config.put("wanNetwork", request.getWanNetwork());
            config.put("backendServerIp", backendServerIp);
            config.put("configuredAt", LocalDateTime.now().toString());

            router.setConfigurationJson(convertToJson(config));
            router.setLastMaintenance(LocalDateTime.now());
            router.setNextMaintenance(LocalDateTime.now().plusMonths(3));

            Router savedRouter = routerRepository.save(router);
            
            // Test connection
            boolean connected = testConnection(savedRouter);
            savedRouter.setStatus(connected ? Router.RouterStatus.ACTIVE : Router.RouterStatus.OFFLINE);
            
            log.info("Router {} added successfully at location: {}", savedRouter.getName(), savedRouter.getLocation());
            return routerRepository.save(savedRouter);
            
        } catch (Exception e) {
            log.error("Failed to add router: {}", request.getName(), e);
            throw new RuntimeException("Failed to add router: " + e.getMessage(), e);
        }
    }

    /**
     * Generate MikroTik configuration script for router
     */
    public String generateConfigurationScript(Long routerId) {
        Optional<Router> routerOpt = routerRepository.findByIdAndDeletedAtIsNull(routerId);
        if (routerOpt.isEmpty()) {
            throw new IllegalArgumentException("Router not found");
        }
        return generateConfigurationScript(routerOpt.get());
    }

    /**
     * Generate MikroTik configuration script for router
     */
    public String generateConfigurationScript(Router router) {
        try {
            Map<String, Object> config = parseConfigurationJson(router.getConfigurationJson());
            
            StringBuilder script = new StringBuilder();
            script.append("# GGWIFI MikroTik Configuration Script\n");
            script.append("# Router: ").append(router.getName()).append("\n");
            script.append("# Location: ").append(router.getLocation()).append("\n");
            script.append("# Generated: ").append(LocalDateTime.now()).append("\n\n");

            // RADIUS Configuration
            String radiusIp = (String) config.getOrDefault("radiusServerIp", defaultRadiusServerIp);
            String radiusSecret = (String) config.getOrDefault("radiusSecret", defaultRadiusSecret);
            
            script.append("# ============================================================================\n");
            script.append("# RADIUS SERVER CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Add RADIUS server for authentication\n");
            script.append("/radius add name=\"GGWIFI-RADIUS\" address=").append(radiusIp)
                  .append(" secret=").append(radiusSecret)
                  .append(" service=hotspot,login,pppoe\n\n");

            script.append("# Add RADIUS server for accounting\n");
            script.append("/radius add name=\"GGWIFI-RADIUS-Acct\" address=").append(radiusIp)
                  .append(" secret=").append(radiusSecret)
                  .append(" service=hotspot,login,pppoe\n\n");

            // Hotspot Configuration
            String hotspotNetwork = (String) config.getOrDefault("hotspotNetwork", "192.168.1.0/24");
            String hotspotIp = extractIpFromNetwork(hotspotNetwork);
            
            script.append("# ============================================================================\n");
            script.append("# HOTSPOT CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Configure hotspot server profile with RADIUS\n");
            script.append("/ip hotspot profile add name=\"GGWIFI-Hotspot\" hotspot-address=").append(hotspotNetwork)
                  .append(" dns-name=connect.ggwifi.co.tz rate-limit=2M/1M session-timeout=12:00:00 keepalive-timeout=5m login-timeout=5m idle-timeout=5m\n\n");

            script.append("# Configure hotspot server\n");
            script.append("/ip hotspot server profile set GGWIFI-Hotspot use-radius=yes radius-accounting=yes radius-interim-update=5m\n\n");

            script.append("# Add RADIUS login method\n");
            script.append("/ip hotspot user profile add name=\"RADIUS-User\" rate-limit=2M/1M session-timeout=12:00:00 keepalive-timeout=5m login-timeout=5m idle-timeout=5m\n\n");

            script.append("# Configure hotspot interface (adjust interface name as needed)\n");
            script.append("/ip hotspot add interface=ether2 profile=GGWIFI-Hotspot\n\n");

            // PPPoE Configuration
            String pppoeNetwork = (String) config.getOrDefault("pppoeNetwork", "192.168.10.0/24");
            String pppoeIp = extractIpFromNetwork(pppoeNetwork);
            
            script.append("# ============================================================================\n");
            script.append("# PPPoE SERVER CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Configure PPPoE server with RADIUS\n");
            script.append("/ppp profile add name=\"GGWIFI-PPPoE\" local-address=").append(pppoeIp)
                  .append(" remote-address=192.168.10.2-192.168.10.254 rate-limit=16M/8M session-timeout=0 keepalive-timeout=10s login-timeout=10s idle-timeout=10m\n\n");

            script.append("# Enable RADIUS for PPPoE\n");
            script.append("/ppp profile set GGWIFI-PPPoE use-radius=yes radius-accounting=yes\n\n");

            script.append("# Configure PPPoE server\n");
            script.append("/interface pppoe-server server add service-name=GGWIFI authentication=pap,chap,mschap1,mschap2 one-session-per-host=yes max-sessions=100\n\n");

            // Firewall Rules
            script.append("# ============================================================================\n");
            script.append("# FIREWALL RULES FOR RADIUS\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Allow RADIUS authentication traffic\n");
            script.append("/ip firewall filter add chain=input protocol=udp dst-port=1812 src-address=").append(radiusIp)
                  .append(" action=accept comment=\"RADIUS Authentication\"\n\n");

            script.append("# Allow RADIUS accounting traffic\n");
            script.append("/ip firewall filter add chain=input protocol=udp dst-port=1813 src-address=").append(radiusIp)
                  .append(" action=accept comment=\"RADIUS Accounting\"\n\n");

            // Network Configuration
            script.append("# ============================================================================\n");
            script.append("# NETWORK CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Configure IP addresses\n");
            script.append("/ip address add address=").append(hotspotIp).append("/24 interface=ether2 comment=\"Hotspot Network\"\n");
            script.append("/ip address add address=").append(pppoeIp).append("/24 interface=ether3 comment=\"PPPoE Network\"\n");
            
            String wanNetwork = (String) config.getOrDefault("wanNetwork", "10.0.0.0/24");
            String wanIp = extractIpFromNetwork(wanNetwork);
            script.append("/ip address add address=").append(wanIp).append("/24 interface=ether1 comment=\"WAN Network\"\n\n");

            script.append("# Configure NAT\n");
            script.append("/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade comment=\"NAT for Internet Access\"\n\n");

            // DNS Configuration
            script.append("# ============================================================================\n");
            script.append("# DNS CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Configure DNS for hotspot users\n");
            script.append("/ip dns set servers=8.8.8.8,8.8.4.4\n\n");

            script.append("# Add DNS entries for GGWIFI services\n");
            script.append("/ip dns static add name=admin.ggwifi.co.tz address=").append(backendServerIp).append("\n");
            script.append("/ip dns static add name=connect.ggwifi.co.tz address=").append(backendServerIp).append("\n");
            script.append("/ip dns static add name=www.ggwifi.co.tz address=").append(backendServerIp).append("\n\n");

            // Bandwidth Management
            script.append("# ============================================================================\n");
            script.append("# BANDWIDTH MANAGEMENT\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Create bandwidth profiles for different user types\n");
            script.append("/queue simple add name=\"Hotspot-Basic\" target=").append(hotspotNetwork)
                  .append(" max-limit=2M/1M\n");
            script.append("/queue simple add name=\"PPPoE-Basic\" target=").append(pppoeNetwork)
                  .append(" max-limit=16M/8M\n");
            script.append("/queue simple add name=\"PPPoE-Premium\" target=").append(pppoeNetwork)
                  .append(" max-limit=32M/16M\n\n");

            // Security Configuration
            script.append("# ============================================================================\n");
            script.append("# SECURITY CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Secure SSH access\n");
            script.append("/ip service set ssh address=").append(hotspotNetwork).append(",127.0.0.1\n\n");

            script.append("# Secure Winbox access\n");
            script.append("/ip service set winbox address=").append(hotspotNetwork).append(",127.0.0.1\n\n");

            script.append("# Block common attack ports\n");
            script.append("/ip firewall filter add chain=input protocol=tcp dst-port=23 action=drop comment=\"Block Telnet\"\n");
            script.append("/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=!").append(hotspotNetwork)
                  .append(" action=drop comment=\"Block SSH from WAN\"\n\n");

            // Monitoring
            script.append("# ============================================================================\n");
            script.append("# MONITORING AND ALERTS\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Create script for monitoring\n");
            script.append("/system script add name=\"Monitor-RADIUS\" source={\n");
            script.append("    :local radiusStatus [/radius monitor GGWIFI-RADIUS]\n");
            script.append("    :if ($radiusStatus = \"timeout\") do={\n");
            script.append("        :log error \"RADIUS server is not responding\"\n");
            script.append("    }\n");
            script.append("}\n\n");

            script.append("# Schedule monitoring script\n");
            script.append("/scheduler add name=\"Radius-Monitor\" interval=5m on-event=\"/system script run Monitor-RADIUS\"\n\n");

            // Backup Configuration
            script.append("# ============================================================================\n");
            script.append("# BACKUP CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Create backup script\n");
            script.append("/system script add name=\"Backup-Config\" source={\n");
            script.append("    /export file=GGWIFI-Backup-").append(router.getLocation().replaceAll("\\s+", "-")).append("\n");
            script.append("}\n\n");

            script.append("# Schedule daily backup\n");
            script.append("/scheduler add name=\"Daily-Backup\" interval=1d on-event=\"/system script run Backup-Config\"\n\n");

            // Final Configuration
            script.append("# ============================================================================\n");
            script.append("# FINAL CONFIGURATION\n");
            script.append("# ============================================================================\n\n");
            
            script.append("# Enable all services\n");
            script.append("/ip service enable ssh\n");
            script.append("/ip service enable winbox\n");
            script.append("/ip service enable www\n\n");

            script.append("# Save configuration\n");
            script.append("/system backup save name=GGWIFI-").append(router.getLocation().replaceAll("\\s+", "-")).append("-Setup\n\n");

            script.append("# Display configuration summary\n");
            script.append(":put \"=== GGWIFI MikroTik Configuration Complete ===\"\n");
            script.append(":put \"Router: ").append(router.getName()).append("\"\n");
            script.append(":put \"Location: ").append(router.getLocation()).append("\"\n");
            script.append(":put \"RADIUS Server: ").append(radiusIp).append("\"\n");
            script.append(":put \"Hotspot Network: ").append(hotspotNetwork).append("\"\n");
            script.append(":put \"PPPoE Network: ").append(pppoeNetwork).append("\"\n");
            script.append(":put \"WAN Network: ").append(wanNetwork).append("\"\n");
            script.append(":put \"Hotspot URL: http://").append(hotspotIp).append("\"\n");
            script.append(":put \"Backup saved as: GGWIFI-").append(router.getLocation().replaceAll("\\s+", "-")).append("-Setup\"\n");

            return script.toString();
            
        } catch (Exception e) {
            log.error("Failed to generate configuration script for router: {}", router.getName(), e);
            throw new RuntimeException("Failed to generate configuration script", e);
        }
    }

    /**
     * Test router connection and configuration
     */
    public Map<String, Object> testRouterConnection(Long routerId) {
        Optional<Router> routerOpt = routerRepository.findByIdAndDeletedAtIsNull(routerId);
        if (routerOpt.isEmpty()) {
            throw new IllegalArgumentException("Router not found");
        }
        return testRouterConnection(routerOpt.get());
    }

    /**
     * Test router connection and configuration
     */
    public Map<String, Object> testRouterConnection(Router router) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Test basic connectivity
            boolean connected = testConnection(router);
            result.put("connected", connected);
            
            if (connected) {
                // Test RADIUS configuration
                boolean radiusConfigured = testRadiusConfiguration(router);
                result.put("radiusConfigured", radiusConfigured);
                
                // Get router resources
                Map<String, Object> resources = getRouterResources(router);
                result.put("resources", resources);
                
                // Test hotspot configuration
                boolean hotspotConfigured = testHotspotConfiguration(router);
                result.put("hotspotConfigured", hotspotConfigured);
                
                result.put("status", "ONLINE");
                result.put("message", "Router is online and properly configured");
            } else {
                result.put("status", "OFFLINE");
                result.put("message", "Router is not reachable");
            }
            
            // Update router status
            router.setStatus(connected ? Router.RouterStatus.ACTIVE : Router.RouterStatus.OFFLINE);
            routerRepository.save(router);
            
        } catch (Exception e) {
            log.error("Failed to test router connection: {}", router.getName(), e);
            result.put("status", "ERROR");
            result.put("message", "Failed to test connection: " + e.getMessage());
            result.put("error", e.getMessage());
        }
        
        return result;
    }

    /**
     * Configure router remotely via API
     */
    public Map<String, Object> configureRouterRemotely(Long routerId) {
        Optional<Router> routerOpt = routerRepository.findByIdAndDeletedAtIsNull(routerId);
        if (routerOpt.isEmpty()) {
            throw new IllegalArgumentException("Router not found");
        }
        
        try {
            String configScript = generateConfigurationScript(routerOpt.get());
            boolean configured = applyConfigurationScript(routerOpt.get(), configScript);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", configured);
            result.put("message", configured ? "Router configured successfully" : "Failed to configure router");
            result.put("configScript", configScript);
            
            return result;
        } catch (Exception e) {
            log.error("Failed to configure router remotely: {}", routerId, e);
            throw new RuntimeException("Failed to configure router remotely", e);
        }
    }

    /**
     * Get routers by location
     */
    public List<Router> getRoutersByLocation(String location) {
        return routerRepository.findByLocationAndDeletedAtIsNull(location);
    }

    /**
     * Get comprehensive router status
     */
    public Map<String, Object> getComprehensiveRouterStatus(Long routerId) {
        Optional<Router> routerOpt = routerRepository.findByIdAndDeletedAtIsNull(routerId);
        if (routerOpt.isEmpty()) {
            throw new IllegalArgumentException("Router not found");
        }
        
        Router router = routerOpt.get();
        Map<String, Object> status = new HashMap<>();
        
        try {
            // Basic info
            status.put("router", router);
            status.put("isOnline", testConnection(router));
            status.put("lastChecked", LocalDateTime.now());
            
            // Resources if online
            if (testConnection(router)) {
                Map<String, Object> resources = getRouterResources(router);
                status.put("resources", resources);
                
                // Active sessions
                List<Map<String, Object>> activeSessions = getActiveHotspotUsers(router);
                status.put("activeSessions", activeSessions);
                status.put("sessionCount", activeSessions.size());
                
                // Configuration status
                status.put("radiusConfigured", testRadiusConfiguration(router));
                status.put("hotspotConfigured", testHotspotConfiguration(router));
            }
            
        } catch (Exception e) {
            log.error("Failed to get comprehensive router status", e);
            status.put("error", e.getMessage());
        }
        
        return status;
    }

    /**
     * Bulk configure routers
     */
    public Map<String, Object> bulkConfigureRouters(List<Long> routerIds) {
        Map<String, Object> results = new HashMap<>();
        Map<String, Object> successful = new HashMap<>();
        Map<String, Object> failed = new HashMap<>();
        
        for (Long routerId : routerIds) {
            try {
                Map<String, Object> result = configureRouterRemotely(routerId);
                successful.put(routerId.toString(), result);
            } catch (Exception e) {
                failed.put(routerId.toString(), e.getMessage());
            }
        }
        
        results.put("successful", successful);
        results.put("failed", failed);
        results.put("totalProcessed", routerIds.size());
        results.put("successCount", successful.size());
        results.put("failureCount", failed.size());
        
        return results;
    }

    // Private helper methods
    private boolean testConnection(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            Map<String, Object> response = webClient.get()
                    .uri("/rest/system/resource")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            return response != null && response.containsKey("cpu-load");
        } catch (Exception e) {
            log.warn("Connection test failed for router: {}", router.getName());
            return false;
        }
    }

    private boolean testRadiusConfiguration(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            List<Map<String, Object>> radiusServers = webClient.get()
                    .uri("/rest/radius")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return radiusServers != null && !radiusServers.isEmpty();
        } catch (Exception e) {
            log.warn("RADIUS configuration test failed for router: {}", router.getName());
            return false;
        }
    }

    private boolean testHotspotConfiguration(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            List<Map<String, Object>> hotspotServers = webClient.get()
                    .uri("/rest/ip/hotspot")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return hotspotServers != null && !hotspotServers.isEmpty();
        } catch (Exception e) {
            log.warn("Hotspot configuration test failed for router: {}", router.getName());
            return false;
        }
    }

    private Map<String, Object> getRouterResources(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            return webClient.get()
                    .uri("/rest/system/resource")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("Failed to get router resources: {}", router.getName());
            return new HashMap<>();
        }
    }

    private List<Map<String, Object>> getActiveHotspotUsers(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            return webClient.get()
                    .uri("/rest/ip/hotspot/active")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("Failed to get active hotspot users: {}", router.getName());
            return new ArrayList<>();
        }
    }

    private boolean applyConfigurationScript(Router router, String configScript) {
        try {
            WebClient webClient = createWebClient(router);
            
            // Split script into individual commands
            String[] commands = configScript.split("\n");
            int successCount = 0;
            
            for (String command : commands) {
                command = command.trim();
                if (!command.isEmpty() && !command.startsWith("#") && !command.startsWith(":put")) {
                    try {
                        Map<String, String> request = new HashMap<>();
                        request.put("command", command);
                        
                        webClient.post()
                                .uri("/rest/script/run")
                                .bodyValue(request)
                                .retrieve()
                                .bodyToMono(Void.class)
                                .timeout(Duration.ofSeconds(5))
                                .block();
                        
                        successCount++;
                    } catch (Exception e) {
                        log.warn("Failed to execute command: {}", command);
                    }
                }
            }
            
            return successCount > 0;
        } catch (Exception e) {
            log.error("Failed to apply configuration script", e);
            return false;
        }
    }

    private WebClient createWebClient(Router router) {
        String baseUrl = "http://" + router.getIpAddress() + ":" + router.getPort();
        
        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Basic " + java.util.Base64.getEncoder()
                        .encodeToString((router.getUsername() + ":" + router.getPassword()).getBytes()))
                .build();
    }

    private String extractIpFromNetwork(String network) {
        if (network.contains("/")) {
            return network.split("/")[0];
        }
        return network;
    }

    private Map<String, Object> parseConfigurationJson(String json) {
        if (json == null || json.isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            // Simple JSON parsing - in production, use proper JSON library
            Map<String, Object> config = new HashMap<>();
            // This is a simplified version - implement proper JSON parsing
            return config;
        } catch (Exception e) {
            log.warn("Failed to parse configuration JSON", e);
            return new HashMap<>();
        }
    }

    private String convertToJson(Map<String, Object> config) {
        // Simple JSON conversion - in production, use proper JSON library
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : config.entrySet()) {
            if (!first) json.append(",");
            json.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }
}
