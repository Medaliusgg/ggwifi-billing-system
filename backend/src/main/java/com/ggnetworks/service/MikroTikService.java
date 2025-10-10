package com.ggnetworks.service;

import com.ggnetworks.entity.Router;
import com.ggnetworks.repository.RouterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MikroTikService {

    private final RouterRepository routerRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${mikrotik.api.timeout:10000}")
    private int apiTimeout;

    @Value("${mikrotik.api.retries:3}")
    private int apiRetries;

    @Value("${mikrotik.session.timeout:300}")
    private int sessionTimeout;

    /**
     * Get all active routers
     */
    public List<Router> getActiveRouters() {
        return routerRepository.findByStatus(Router.RouterStatus.ACTIVE);
    }

    /**
     * Get router by ID
     */
    public Optional<Router> getRouterById(Long routerId) {
        return routerRepository.findByIdAndDeletedAtIsNull(routerId);
    }

    /**
     * Get router by IP address
     */
    public Optional<Router> getRouterByIp(String ipAddress) {
        return routerRepository.findByIpAddressAndDeletedAtIsNull(ipAddress);
    }

    /**
     * Test connection to a MikroTik router
     */
    public boolean testRouterConnection(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            // Test connection by getting system resources
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/rest/system/resource")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (response != null && response.containsKey("cpu-load")) {
                log.info("Router connection test successful for: {}", router.getIpAddress());
                return true;
            }
            
            return false;
        } catch (Exception e) {
            log.error("Router connection test failed for: {}", router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Get router system resources
     */
    public Map<String, Object> getRouterResources(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/rest/system/resource")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (response != null) {
                // Update router performance metrics
                updateRouterMetrics(router, response);
            }

            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Failed to get router resources for: {}", router.getIpAddress(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get active hotspot users
     */
    public List<Map<String, Object>> getActiveHotspotUsers(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> response = webClient.get()
                    .uri("/rest/ip/hotspot/active")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            return response != null ? response : List.of();
        } catch (Exception e) {
            log.error("Failed to get active hotspot users for router: {}", router.getIpAddress(), e);
            return List.of();
        }
    }

    /**
     * Get hotspot user by MAC address
     */
    public Optional<Map<String, Object>> getHotspotUserByMac(Router router, String macAddress) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> response = webClient.get()
                    .uri("/rest/ip/hotspot/active")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (response != null) {
                return response.stream()
                        .filter(user -> macAddress.equalsIgnoreCase((String) user.get("mac-address")))
                        .findFirst();
            }
            
            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed to get hotspot user by MAC: {} for router: {}", macAddress, router.getIpAddress(), e);
            return Optional.empty();
        }
    }

    /**
     * Disconnect hotspot user by MAC address
     */
    public boolean disconnectHotspotUser(String macAddress) {
        List<Router> activeRouters = getActiveRouters();
        
        for (Router router : activeRouters) {
            try {
                if (disconnectHotspotUserFromRouter(router, macAddress)) {
                    log.info("Successfully disconnected user with MAC: {} from router: {}", macAddress, router.getIpAddress());
                    return true;
                }
            } catch (Exception e) {
                log.error("Failed to disconnect user from router: {}", router.getIpAddress(), e);
            }
        }
        
        log.warn("Failed to disconnect user with MAC: {} from any router", macAddress);
        return false;
    }

    /**
     * Disconnect PPPoE user by username across all active routers
     */
    public boolean disconnectPppoeUser(String username) {
        List<Router> activeRouters = getActiveRouters();

        for (Router router : activeRouters) {
            try {
                if (disconnectPppoeUserFromRouter(router, username)) {
                    log.info("Successfully disconnected PPPoE user: {} from router: {}", username, router.getIpAddress());
                    return true;
                }
            } catch (Exception e) {
                log.error("Failed to disconnect PPPoE user from router: {}", router.getIpAddress(), e);
            }
        }

        log.warn("Failed to disconnect PPPoE user: {} from any router", username);
        return false;
    }

    /**
     * Disconnect PPPoE user from a specific router
     */
    public boolean disconnectPppoeUserFromRouter(Router router, String username) {
        try {
            WebClient webClient = createWebClient(router);

            // List active PPP sessions
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> sessions = webClient.get()
                    .uri("/rest/ppp/active")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (sessions != null) {
                Optional<Map<String, Object>> sessionOpt = sessions.stream()
                        .filter(s -> username.equals(s.get("name")))
                        .findFirst();

                if (sessionOpt.isPresent()) {
                    String sessionId = (String) sessionOpt.get().get(".id");

                    // Remove the active session
                    Map<String, Object> disconnectRequest = new HashMap<>();
                    disconnectRequest.put("remove", "");

                    webClient.post()
                            .uri("/rest/ppp/active/" + sessionId)
                            .bodyValue(disconnectRequest)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .timeout(Duration.ofMillis(apiTimeout))
                            .block();

                    log.info("Disconnected PPPoE user: {} from router: {}", username, router.getIpAddress());
                    return true;
                }
            }

            log.warn("PPPoE user session not found: {} on router: {}", username, router.getIpAddress());
            return false;

        } catch (Exception e) {
            log.error("Failed to disconnect PPPoE user: {} from router: {}", username, router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Disconnect hotspot user from specific router
     */
    public boolean disconnectHotspotUserFromRouter(Router router, String macAddress) {
        try {
            WebClient webClient = createWebClient(router);
            
            // First, find the user session
            Optional<Map<String, Object>> userOpt = getHotspotUserByMac(router, macAddress);
            if (userOpt.isEmpty()) {
                log.warn("Hotspot user not found with MAC: {} on router: {}", macAddress, router.getIpAddress());
                return false;
            }

            Map<String, Object> user = userOpt.get();
            String sessionId = (String) user.get(".id");

            // Disconnect the user
            Map<String, Object> disconnectRequest = new HashMap<>();
            disconnectRequest.put("remove", "");

            webClient.post()
                    .uri("/rest/ip/hotspot/active/" + sessionId)
                    .bodyValue(disconnectRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            log.info("Successfully disconnected hotspot user with MAC: {} from router: {}", macAddress, router.getIpAddress());
            return true;
            
        } catch (Exception e) {
            log.error("Failed to disconnect hotspot user with MAC: {} from router: {}", macAddress, router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Add hotspot user
     */
    public boolean addHotspotUser(Router router, String username, String password, String profile, int timeLimit) {
        try {
            WebClient webClient = createWebClient(router);
            
            Map<String, Object> userRequest = new HashMap<>();
            userRequest.put("name", username);
            userRequest.put("password", password);
            userRequest.put("profile", profile);
            userRequest.put("time-limit", timeLimit + "m"); // Convert to minutes

            webClient.put()
                    .uri("/rest/ip/hotspot/user")
                    .bodyValue(userRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            log.info("Successfully added hotspot user: {} to router: {}", username, router.getIpAddress());
            return true;
            
        } catch (Exception e) {
            log.error("Failed to add hotspot user: {} to router: {}", username, router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Remove hotspot user
     */
    public boolean removeHotspotUser(Router router, String username) {
        try {
            WebClient webClient = createWebClient(router);
            
            // First, find the user
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = webClient.get()
                    .uri("/rest/ip/hotspot/user")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (users != null) {
                Optional<Map<String, Object>> userOpt = users.stream()
                        .filter(user -> username.equals(user.get("name")))
                        .findFirst();

                if (userOpt.isPresent()) {
                    String userId = (String) userOpt.get().get(".id");
                    
                    webClient.delete()
                            .uri("/rest/ip/hotspot/user/" + userId)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .timeout(Duration.ofMillis(apiTimeout))
                            .block();

                    log.info("Successfully removed hotspot user: {} from router: {}", username, router.getIpAddress());
                    return true;
                }
            }
            
            log.warn("Hotspot user not found: {} on router: {}", username, router.getIpAddress());
            return false;
            
        } catch (Exception e) {
            log.error("Failed to remove hotspot user: {} from router: {}", username, router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Get router interface statistics
     */
    public Map<String, Object> getInterfaceStatistics(Router router, String interfaceName) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri("/rest/interface/" + interfaceName)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            log.error("Failed to get interface statistics for: {} on router: {}", interfaceName, router.getIpAddress(), e);
            return new HashMap<>();
        }
    }

    /**
     * Get router firewall rules
     */
    public List<Map<String, Object>> getFirewallRules(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> response = webClient.get()
                    .uri("/rest/ip/firewall/filter")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            return response != null ? response : List.of();
        } catch (Exception e) {
            log.error("Failed to get firewall rules for router: {}", router.getIpAddress(), e);
            return List.of();
        }
    }

    /**
     * Add firewall rule
     */
    public boolean addFirewallRule(Router router, String chain, String action, String srcAddress, String dstAddress, String protocol) {
        try {
            WebClient webClient = createWebClient(router);
            
            Map<String, Object> ruleRequest = new HashMap<>();
            ruleRequest.put("chain", chain);
            ruleRequest.put("action", action);
            ruleRequest.put("src-address", srcAddress);
            ruleRequest.put("dst-address", dstAddress);
            ruleRequest.put("protocol", protocol);

            webClient.put()
                    .uri("/rest/ip/firewall/filter")
                    .bodyValue(ruleRequest)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            log.info("Successfully added firewall rule to router: {}", router.getIpAddress());
            return true;
            
        } catch (Exception e) {
            log.error("Failed to add firewall rule to router: {}", router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Get router DHCP leases
     */
    public List<Map<String, Object>> getDhcpLeases(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> response = webClient.get()
                    .uri("/rest/ip/dhcp-server/lease")
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            return response != null ? response : List.of();
        } catch (Exception e) {
            log.error("Failed to get DHCP leases for router: {}", router.getIpAddress(), e);
            return List.of();
        }
    }

    /**
     * Reboot router
     */
    public boolean rebootRouter(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            webClient.post()
                    .uri("/rest/system/reboot")
                    .retrieve()
                    .bodyToMono(Void.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            log.info("Successfully initiated reboot for router: {}", router.getIpAddress());
            return true;
            
        } catch (Exception e) {
            log.error("Failed to reboot router: {}", router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Update router firmware
     */
    public boolean updateRouterFirmware(Router router) {
        try {
            WebClient webClient = createWebClient(router);
            
            // Check for updates
            @SuppressWarnings("unchecked")
            Map<String, Object> checkResponse = webClient.get()
                    .uri("/rest/system/package/update/check-for-updates")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(apiTimeout))
                    .block();

            if (checkResponse != null && Boolean.TRUE.equals(checkResponse.get("installed-version"))) {
                // Download and install updates
                webClient.post()
                        .uri("/rest/system/package/update/download")
                        .retrieve()
                        .bodyToMono(Void.class)
                        .timeout(Duration.ofMillis(apiTimeout))
                        .block();

                log.info("Successfully initiated firmware update for router: {}", router.getIpAddress());
                return true;
            } else {
                log.info("No firmware updates available for router: {}", router.getIpAddress());
                return true;
            }
            
        } catch (Exception e) {
            log.error("Failed to update firmware for router: {}", router.getIpAddress(), e);
            return false;
        }
    }

    /**
     * Create WebClient for router
     */
    private WebClient createWebClient(Router router) {
        String baseUrl = "http://" + router.getIpAddress() + ":" + router.getPort();
        
        return webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Basic " + java.util.Base64.getEncoder()
                        .encodeToString((router.getUsername() + ":" + router.getPassword()).getBytes()))
                .build();
    }

    /**
     * Update router performance metrics
     */
    private void updateRouterMetrics(Router router, Map<String, Object> resources) {
        try {
            if (resources.containsKey("cpu-load")) {
                router.setCpuUsagePercent(Double.parseDouble(resources.get("cpu-load").toString()));
            }
            
            if (resources.containsKey("free-memory") && resources.containsKey("total-memory")) {
                long freeMemory = Long.parseLong(resources.get("free-memory").toString());
                long totalMemory = Long.parseLong(resources.get("total-memory").toString());
                long usedMemory = totalMemory - freeMemory;
                double memoryUsagePercent = (double) usedMemory / totalMemory * 100;
                router.setMemoryUsagePercent(memoryUsagePercent);
            }
            
            if (resources.containsKey("uptime")) {
                router.setUptimeSeconds(Long.parseLong(resources.get("uptime").toString()));
            }
            
            routerRepository.save(router);
            
        } catch (Exception e) {
            log.error("Failed to update router metrics for: {}", router.getIpAddress(), e);
        }
    }

    /**
     * Get router health status
     */
    public Map<String, Object> getRouterHealthStatus(Router router) {
        Map<String, Object> healthStatus = new HashMap<>();
        
        try {
            // Test basic connectivity
            boolean isReachable = testRouterConnection(router);
            healthStatus.put("reachable", isReachable);
            
            if (isReachable) {
                // Get system resources
            Map<String, Object> resources = getRouterResources(router);
                healthStatus.put("resources", resources);
                
                // Get active sessions count
                List<Map<String, Object>> activeUsers = getActiveHotspotUsers(router);
                healthStatus.put("activeSessions", activeUsers.size());
                
                // Determine overall health
                double cpuUsage = router.getCpuUsagePercent() != null ? router.getCpuUsagePercent() : 0;
                double memoryUsage = router.getMemoryUsagePercent() != null ? router.getMemoryUsagePercent() : 0;
                
                String status = "HEALTHY";
                if (cpuUsage > 80 || memoryUsage > 80) {
                    status = "WARNING";
                } else if (cpuUsage > 95 || memoryUsage > 95) {
                    status = "CRITICAL";
                }
                
                healthStatus.put("status", status);
                healthStatus.put("cpuUsage", cpuUsage);
                healthStatus.put("memoryUsage", memoryUsage);
                
            } else {
                healthStatus.put("status", "OFFLINE");
            }
            
        } catch (Exception e) {
            log.error("Failed to get health status for router: {}", router.getIpAddress(), e);
            healthStatus.put("status", "ERROR");
            healthStatus.put("error", e.getMessage());
        }
        
        return healthStatus;
    }
} 