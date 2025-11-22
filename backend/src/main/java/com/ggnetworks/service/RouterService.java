package com.ggnetworks.service;

import com.ggnetworks.entity.Router;
import com.ggnetworks.repository.RouterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RouterService {

    @Autowired
    private RouterRepository routerRepository;

    @Autowired
    private MikroTikApiService mikroTikApiService;

    public List<Router> getRouters(Router.RouterStatus status,
                                   Router.RouterType type,
                                   String location,
                                   Boolean activeOnly) {
        if (status != null) {
            return routerRepository.findByStatus(status);
        }
        if (type != null) {
            return routerRepository.findByRouterType(type);
        }
        if (location != null) {
            return routerRepository.findByLocation(location);
        }
        if (Boolean.TRUE.equals(activeOnly)) {
            return routerRepository.findByIsActive(true);
        }
        return routerRepository.findAll();
    }

    public Router getRouter(Long id) {
        return routerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Router not found"));
    }

    public Router createRouter(Router router) {
        if (routerRepository.existsByRouterId(router.getRouterId())) {
            throw new IllegalArgumentException("Router ID already exists");
        }
        if (routerRepository.existsByIpAddress(router.getIpAddress())) {
            throw new IllegalArgumentException("Router IP already exists");
        }
        if (router.getIsActive() == null) {
            router.setIsActive(true);
        }
        return routerRepository.save(router);
    }

    public Router updateRouter(Long id, Router updatedRouter) {
        Router existing = getRouter(id);
        existing.setName(updatedRouter.getName());
        existing.setModel(updatedRouter.getModel());
        existing.setSerialNumber(updatedRouter.getSerialNumber());
        existing.setMacAddress(updatedRouter.getMacAddress());
        existing.setIpAddress(updatedRouter.getIpAddress());
        existing.setApiPort(updatedRouter.getApiPort());
        existing.setSshPort(updatedRouter.getSshPort());
        existing.setWinboxPort(updatedRouter.getWinboxPort());
        existing.setUsername(updatedRouter.getUsername());
        existing.setPassword(updatedRouter.getPassword());
        existing.setLocation(updatedRouter.getLocation());
        existing.setRouterType(updatedRouter.getRouterType());
        existing.setSupportsHotspot(updatedRouter.getSupportsHotspot());
        existing.setSupportsPppoe(updatedRouter.getSupportsPppoe());
        existing.setSupportsWireguard(updatedRouter.getSupportsWireguard());
        existing.setManagementVlan(updatedRouter.getManagementVlan());
        existing.setMonitoringEnabled(updatedRouter.getMonitoringEnabled());
        existing.setNotes(updatedRouter.getNotes());
        existing.setIsActive(updatedRouter.getIsActive());
        return routerRepository.save(existing);
    }

    public void deleteRouter(Long id) {
        routerRepository.deleteById(id);
    }

    public Map<String, Object> testConnection(Long id) {
        Router router = getRouter(id);
        Map<String, Object> result = new HashMap<>();
        boolean connected = mikroTikApiService.connectToRouter(
                router.getRouterId(),
                router.getIpAddress(),
                router.getUsername(),
                router.getPassword(),
                router.getApiPort() != null ? router.getApiPort() : 8728
        );

        result.put("connected", connected);
        if (connected) {
            router.setStatus(Router.RouterStatus.ONLINE);
            router.setLastSeen(LocalDateTime.now());
            router.setLastSyncStatus("OK");
            router.setLastError(null);
            Map<String, String> resources = mikroTikApiService.getSystemResources(router.getRouterId(), router.getIpAddress());
            result.put("resources", resources);
        } else {
            router.setStatus(Router.RouterStatus.ERROR);
            router.setLastSyncStatus("FAILED");
            router.setLastError("Connection test failed at " + LocalDateTime.now());
        }
        routerRepository.save(router);
        return result;
    }

    public Map<String, Object> syncRouter(Long id) {
        Router router = getRouter(id);
        Map<String, Object> response = new HashMap<>();

        boolean connected = mikroTikApiService.connectToRouter(
                router.getRouterId(),
                router.getIpAddress(),
                router.getUsername(),
                router.getPassword(),
                router.getApiPort() != null ? router.getApiPort() : 8728
        );

        if (!connected) {
            router.setStatus(Router.RouterStatus.ERROR);
            router.setLastSyncStatus("FAILED");
            router.setLastError("Unable to connect for sync");
            routerRepository.save(router);
            response.put("status", "error");
            response.put("message", "Unable to connect to router");
            return response;
        }

        Map<String, String> resources = mikroTikApiService.getSystemResources(router.getRouterId(), router.getIpAddress());
        if (!resources.isEmpty()) {
            router.setBoardName(resources.getOrDefault("board-name", router.getBoardName()));
            router.setArchitectureName(resources.getOrDefault("architecture-name", router.getArchitectureName()));
            router.setVersion(resources.getOrDefault("version", router.getVersion()));
            router.setCpuCount(parseInteger(resources.get("cpu-count")));
            router.setCpuFrequency(parseLong(resources.get("cpu-frequency")));
            router.setCpuLoad(parseDouble(resources.get("cpu-load")));
            router.setFreeMemory(parseLong(resources.get("free-memory")));
            router.setTotalMemory(parseLong(resources.get("total-memory")));
            router.setUptime(parseLong(resources.get("uptime")));
        }

        router.setStatus(Router.RouterStatus.ONLINE);
        router.setLastSeen(LocalDateTime.now());
        router.setLastSyncStatus("OK");
        router.setLastError(null);
        routerRepository.save(router);

        response.put("status", "success");
        response.put("message", "Router synchronized");
        response.put("data", resources);
        return response;
    }

    public boolean rebootRouter(Long id) {
        Router router = getRouter(id);
        return mikroTikApiService.rebootRouter(router.getRouterId(), router.getIpAddress());
    }

    public boolean backupRouter(Long id, String backupName) {
        Router router = getRouter(id);
        boolean result = mikroTikApiService.backupRouter(router.getRouterId(), router.getIpAddress(), backupName);
        if (result) {
            router.setLastBackup(LocalDateTime.now());
            routerRepository.save(router);
        }
        return result;
    }

    public Map<String, Object> getRouterStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRouters", routerRepository.count());
        for (Router.RouterStatus status : Router.RouterStatus.values()) {
            stats.put(status.name().toLowerCase(), routerRepository.countByStatus(status));
        }
        stats.put("activeRouters", routerRepository.countByIsActive(true));
        stats.put("inactiveRouters", routerRepository.countByIsActive(false));
        return stats;
    }

    /**
     * Test connection to ALL active routers (bulk operation)
     */
    public Map<String, Object> testAllConnections() {
        Map<String, Object> results = new HashMap<>();
        List<Router> activeRouters = routerRepository.findByIsActive(true);
        
        int successCount = 0;
        int failCount = 0;
        List<Map<String, Object>> routerResults = new ArrayList<>();
        
        for (Router router : activeRouters) {
            Map<String, Object> routerResult = new HashMap<>();
            routerResult.put("routerId", router.getRouterId());
            routerResult.put("name", router.getName());
            routerResult.put("ipAddress", router.getIpAddress());
            
            try {
                Map<String, Object> testResult = testConnection(router.getId());
                boolean connected = (Boolean) testResult.get("connected");
                routerResult.put("connected", connected);
                routerResult.put("status", connected ? "success" : "failed");
                
                if (connected) {
                    successCount++;
                    routerResult.put("resources", testResult.get("resources"));
                } else {
                    failCount++;
                    routerResult.put("error", "Connection failed");
                }
            } catch (Exception e) {
                failCount++;
                routerResult.put("connected", false);
                routerResult.put("status", "error");
                routerResult.put("error", e.getMessage());
            }
            
            routerResults.add(routerResult);
        }
        
        results.put("totalRouters", activeRouters.size());
        results.put("successCount", successCount);
        results.put("failCount", failCount);
        results.put("routers", routerResults);
        return results;
    }

    /**
     * Sync ALL active routers (bulk operation)
     */
    public Map<String, Object> syncAllRouters() {
        Map<String, Object> results = new HashMap<>();
        List<Router> activeRouters = routerRepository.findByIsActive(true);
        
        int successCount = 0;
        int failCount = 0;
        List<Map<String, Object>> routerResults = new ArrayList<>();
        
        for (Router router : activeRouters) {
            Map<String, Object> routerResult = new HashMap<>();
            routerResult.put("routerId", router.getRouterId());
            routerResult.put("name", router.getName());
            routerResult.put("ipAddress", router.getIpAddress());
            
            try {
                Map<String, Object> syncResult = syncRouter(router.getId());
                String status = (String) syncResult.get("status");
                routerResult.put("status", status);
                
                if ("success".equals(status)) {
                    successCount++;
                    routerResult.put("data", syncResult.get("data"));
                } else {
                    failCount++;
                    routerResult.put("error", syncResult.get("message"));
                }
            } catch (Exception e) {
                failCount++;
                routerResult.put("status", "error");
                routerResult.put("error", e.getMessage());
            }
            
            routerResults.add(routerResult);
        }
        
        results.put("totalRouters", activeRouters.size());
        results.put("successCount", successCount);
        results.put("failCount", failCount);
        results.put("routers", routerResults);
        return results;
    }

    /**
     * Get WireGuard configuration for a router
     */
    public Map<String, Object> getWireGuardConfig(Long id) {
        Router router = getRouter(id);
        Map<String, Object> config = new HashMap<>();
        
        if (router.getSupportsWireguard() == null || !router.getSupportsWireguard()) {
            config.put("status", "error");
            config.put("message", "Router does not support WireGuard");
            return config;
        }
        
        boolean connected = mikroTikApiService.connectToRouter(
            router.getRouterId(),
            router.getIpAddress(),
            router.getUsername(),
            router.getPassword(),
            router.getApiPort() != null ? router.getApiPort() : 8728
        );
        
        if (!connected) {
            config.put("status", "error");
            config.put("message", "Unable to connect to router");
            return config;
        }
        
        // Get WireGuard interfaces
        List<Map<String, String>> wgInterfaces = mikroTikApiService.executeCommand(
            router.getRouterId(),
            router.getIpAddress(),
            "/interface/wireguard/print"
        );
        
        // Get WireGuard peers
        List<Map<String, String>> wgPeers = mikroTikApiService.executeCommand(
            router.getRouterId(),
            router.getIpAddress(),
            "/interface/wireguard/peers/print"
        );
        
        config.put("status", "success");
        config.put("interfaces", wgInterfaces);
        config.put("peers", wgPeers);
        return config;
    }

    /**
     * Configure WireGuard on a router
     */
    public Map<String, Object> configureWireGuard(Long id, Map<String, Object> wireguardConfig) {
        Router router = getRouter(id);
        Map<String, Object> result = new HashMap<>();
        
        if (router.getSupportsWireguard() == null || !router.getSupportsWireguard()) {
            result.put("status", "error");
            result.put("message", "Router does not support WireGuard");
            return result;
        }
        
        boolean connected = mikroTikApiService.connectToRouter(
            router.getRouterId(),
            router.getIpAddress(),
            router.getUsername(),
            router.getPassword(),
            router.getApiPort() != null ? router.getApiPort() : 8728
        );
        
        if (!connected) {
            result.put("status", "error");
            result.put("message", "Unable to connect to router");
            return result;
        }
        
        try {
            String interfaceName = (String) wireguardConfig.getOrDefault("interface", "wg1");
            String listenPort = (String) wireguardConfig.getOrDefault("listenPort", "51820");
            String privateKey = (String) wireguardConfig.get("privateKey");
            
            if (privateKey == null || privateKey.isEmpty()) {
                result.put("status", "error");
                result.put("message", "Private key is required");
                return result;
            }
            
            // Create or update WireGuard interface
            String command = String.format("/interface/wireguard/add name=%s listen-port=%s private-key=%s", 
                interfaceName, listenPort, privateKey);
            mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(), command);
            
            result.put("status", "success");
            result.put("message", "WireGuard configured successfully");
            return result;
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to configure WireGuard: " + e.getMessage());
            return result;
        }
    }

    /**
     * Get hotspot configuration for a router
     */
    public Map<String, Object> getHotspotConfig(Long id) {
        Router router = getRouter(id);
        Map<String, Object> config = new HashMap<>();
        
        if (router.getSupportsHotspot() == null || !router.getSupportsHotspot()) {
            config.put("status", "error");
            config.put("message", "Router does not support Hotspot");
            return config;
        }
        
        boolean connected = mikroTikApiService.connectToRouter(
            router.getRouterId(),
            router.getIpAddress(),
            router.getUsername(),
            router.getPassword(),
            router.getApiPort() != null ? router.getApiPort() : 8728
        );
        
        if (!connected) {
            config.put("status", "error");
            config.put("message", "Unable to connect to router");
            return config;
        }
        
        // Get hotspot servers
        List<Map<String, String>> hotspotServers = mikroTikApiService.executeCommand(
            router.getRouterId(),
            router.getIpAddress(),
            "/ip/hotspot/print"
        );
        
        // Get hotspot profiles
        List<Map<String, String>> hotspotProfiles = mikroTikApiService.executeCommand(
            router.getRouterId(),
            router.getIpAddress(),
            "/ip/hotspot/profile/print"
        );
        
        // Get active hotspot users
        List<Map<String, String>> activeUsers = mikroTikApiService.executeCommand(
            router.getRouterId(),
            router.getIpAddress(),
            "/ip/hotspot/active/print"
        );
        
        config.put("status", "success");
        config.put("servers", hotspotServers);
        config.put("profiles", hotspotProfiles);
        config.put("activeUsers", activeUsers);
        return config;
    }

    /**
     * Configure router to use FreeRADIUS server (professional feature)
     * This configures the router to authenticate users via the central FreeRADIUS server
     */
    public Map<String, Object> configureRouterRadius(Long id, String radiusServerIp, String radiusSecret) {
        Router router = getRouter(id);
        Map<String, Object> result = new HashMap<>();
        
        boolean connected = mikroTikApiService.connectToRouter(
            router.getRouterId(),
            router.getIpAddress(),
            router.getUsername(),
            router.getPassword(),
            router.getApiPort() != null ? router.getApiPort() : 8728
        );
        
        if (!connected) {
            result.put("status", "error");
            result.put("message", "Unable to connect to router");
            return result;
        }
        
        try {
            // Remove existing RADIUS servers
            mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(), 
                "/radius remove [find name~\"GGWIFI\"]");
            
            // Add RADIUS server for authentication
            String authCommand = String.format(
                "/radius add name=\"GGWIFI-Auth\" address=%s secret=%s service=hotspot,login,pppoe",
                radiusServerIp, radiusSecret);
            mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(), authCommand);
            
            // Add RADIUS server for accounting
            String acctCommand = String.format(
                "/radius add name=\"GGWIFI-Acct\" address=%s secret=%s service=hotspot,login,pppoe",
                radiusServerIp, radiusSecret);
            mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(), acctCommand);
            
            // Configure hotspot to use RADIUS
            if (router.getSupportsHotspot() != null && router.getSupportsHotspot()) {
                mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(),
                    "/ip/hotspot/profile/set [find default] use-radius=yes radius-accounting=yes");
            }
            
            // Configure PPPoE to use RADIUS
            if (router.getSupportsPppoe() != null && router.getSupportsPppoe()) {
                mikroTikApiService.executeCommand(router.getRouterId(), router.getIpAddress(),
                    "/ppp/profile/set [find default] use-radius=yes radius-accounting=yes");
            }
            
            result.put("status", "success");
            result.put("message", "Router configured to use FreeRADIUS server");
            result.put("radiusServer", radiusServerIp);
            return result;
            
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Failed to configure RADIUS: " + e.getMessage());
            return result;
        }
    }

    /**
     * Deploy configuration to multiple routers
     */
    public Map<String, Object> deployConfigToRouters(List<Long> routerIds, Map<String, Object> config) {
        Map<String, Object> results = new HashMap<>();
        List<Map<String, Object>> routerResults = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;
        
        for (Long routerId : routerIds) {
            Map<String, Object> routerResult = new HashMap<>();
            try {
                Router router = getRouter(routerId);
                routerResult.put("routerId", router.getRouterId());
                routerResult.put("name", router.getName());
                
                boolean connected = mikroTikApiService.connectToRouter(
                    router.getRouterId(),
                    router.getIpAddress(),
                    router.getUsername(),
                    router.getPassword(),
                    router.getApiPort() != null ? router.getApiPort() : 8728
                );
                
                if (connected) {
                    // Execute configuration commands
                    @SuppressWarnings("unchecked")
                    List<String> commands = (List<String>) config.get("commands");
                    if (commands != null) {
                        for (String command : commands) {
                            mikroTikApiService.executeCommand(
                                router.getRouterId(),
                                router.getIpAddress(),
                                command
                            );
                        }
                    }
                    routerResult.put("status", "success");
                    successCount++;
                } else {
                    routerResult.put("status", "failed");
                    routerResult.put("error", "Connection failed");
                    failCount++;
                }
            } catch (Exception e) {
                routerResult.put("status", "error");
                routerResult.put("error", e.getMessage());
                failCount++;
            }
            routerResults.add(routerResult);
        }
        
        results.put("totalRouters", routerIds.size());
        results.put("successCount", successCount);
        results.put("failCount", failCount);
        results.put("routers", routerResults);
        return results;
    }

    private Long parseLong(String value) {
        try {
            return value != null ? Long.parseLong(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer parseInteger(String value) {
        try {
            return value != null ? Integer.parseInt(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        try {
            return value != null ? Double.parseDouble(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Get network analytics for hotspot billing system
     */
    public Map<String, Object> getNetworkAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Router> routers = routerRepository.findAll();
        
        // Router status breakdown
        long totalRouters = routers.size();
        long onlineRouters = routers.stream()
            .filter(r -> r.getStatus() == Router.RouterStatus.ONLINE)
            .count();
        long offlineRouters = routers.stream()
            .filter(r -> r.getStatus() == Router.RouterStatus.OFFLINE)
            .count();
        long activeRouters = routers.stream()
            .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
            .count();
        
        // Router type breakdown
        Map<String, Long> typeCounts = routers.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                r -> r.getRouterType() != null ? r.getRouterType().name() : "UNKNOWN",
                java.util.stream.Collectors.counting()
            ));
        
        // Location breakdown
        Map<String, Long> locationCounts = routers.stream()
            .filter(r -> r.getLocation() != null)
            .collect(java.util.stream.Collectors.groupingBy(
                Router::getLocation,
                java.util.stream.Collectors.counting()
            ));
        
        // Capabilities
        long hotspotRouters = routers.stream()
            .filter(r -> Boolean.TRUE.equals(r.getSupportsHotspot()))
            .count();
        long wireguardRouters = routers.stream()
            .filter(r -> Boolean.TRUE.equals(r.getSupportsWireguard()))
            .count();
        long pppoeRouters = routers.stream()
            .filter(r -> Boolean.TRUE.equals(r.getSupportsPppoe()))
            .count();
        
        // Monitoring status
        long monitoredRouters = routers.stream()
            .filter(r -> Boolean.TRUE.equals(r.getMonitoringEnabled()))
            .count();
        
        analytics.put("totalRouters", totalRouters);
        analytics.put("onlineRouters", onlineRouters);
        analytics.put("offlineRouters", offlineRouters);
        analytics.put("activeRouters", activeRouters);
        analytics.put("uptimeRate", totalRouters > 0 ? 
            Math.round((double) onlineRouters / totalRouters * 10000.0) / 100.0 : 0.0);
        analytics.put("byType", typeCounts);
        analytics.put("byLocation", locationCounts);
        analytics.put("capabilities", Map.of(
            "hotspot", hotspotRouters,
            "wireguard", wireguardRouters,
            "pppoe", pppoeRouters
        ));
        analytics.put("monitoringEnabled", monitoredRouters);
        analytics.put("generatedAt", LocalDateTime.now().toString());
        
        return analytics;
    }
}

