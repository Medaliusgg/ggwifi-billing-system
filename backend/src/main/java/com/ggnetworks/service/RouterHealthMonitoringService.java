package com.ggnetworks.service;

import com.ggnetworks.entity.Router;
import com.ggnetworks.repository.RouterRepository;
import com.ggnetworks.repository.RadiusAcctRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Router Health Monitoring Service
 * Monitors router health, connectivity, and active sessions
 */
@Service
public class RouterHealthMonitoringService {
    
    private static final Logger logger = LoggerFactory.getLogger(RouterHealthMonitoringService.class);
    
    @Autowired
    private RouterRepository routerRepository;
    
    @Autowired
    private RadiusAcctRepository radiusAcctRepository;
    
    @Autowired
    private MikroTikApiService mikrotikApiService;
    
    /**
     * Scheduled task: Check router health every 30 seconds
     */
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    @Transactional
    public void checkRouterHealth() {
        try {
            List<Router> routers = routerRepository.findAll();
            
            for (Router router : routers) {
                boolean isOnline = checkRouterConnectivity(router);
                Router.RouterStatus newStatus = isOnline ? Router.RouterStatus.ONLINE : Router.RouterStatus.OFFLINE;
                
                if (router.getStatus() != newStatus) {
                    router.setStatus(newStatus);
                    router.setLastHealthCheck(LocalDateTime.now());
                    routerRepository.save(router);
                    
                    logger.info("Router {} status changed to: {}", router.getName(), newStatus);
                    
                    // Send alert if router went offline
                    if (newStatus == Router.RouterStatus.OFFLINE) {
                        logger.warn("⚠️ Router {} is now OFFLINE!", router.getName());
                    }
                } else {
                    router.setLastHealthCheck(LocalDateTime.now());
                    routerRepository.save(router);
                }
                
                // Update active session count
                int activeSessions = getActiveSessionsCount(router);
                router.setActiveSessionsCount(activeSessions);
                routerRepository.save(router);
            }
            
        } catch (Exception e) {
            logger.error("Error checking router health: {}", e.getMessage());
        }
    }
    
    /**
     * Check router connectivity
     */
    private boolean checkRouterConnectivity(Router router) {
        try {
            // Method 1: Ping router IP
            if (router.getIpAddress() != null) {
                InetAddress address = InetAddress.getByName(router.getIpAddress());
                boolean reachable = address.isReachable(3000); // 3 second timeout
                if (reachable) {
                    return true;
                }
            }
            
            // Method 2: Check MikroTik API connection
            if (router.getIpAddress() != null && router.getApiPort() != null) {
                try {
                    // Try to connect via MikroTik API
                    // This is a simplified check - actual implementation would use MikroTikApiService
                    return mikrotikApiService.testConnection(router.getId().toString(), router.getIpAddress());
                } catch (Exception e) {
                    logger.debug("MikroTik API check failed for router {}: {}", router.getName(), e.getMessage());
                }
            }
            
            return false;
        } catch (Exception e) {
            logger.debug("Connectivity check failed for router {}: {}", router.getName(), e.getMessage());
            return false;
        }
    }
    
    /**
     * Get active sessions count for router
     */
    private int getActiveSessionsCount(Router router) {
        try {
            if (router.getIpAddress() != null) {
                // Count active sessions from radacct where NAS IP matches router IP
                List<com.ggnetworks.entity.RadiusAcct> activeSessions = 
                    radiusAcctRepository.findByNasIpAddress(router.getIpAddress())
                        .stream()
                        .filter(session -> session.getAcctStopTime() == null)
                        .toList();
                return activeSessions.size();
            }
        } catch (Exception e) {
            logger.error("Failed to get active sessions count for router {}: {}", router.getName(), e.getMessage());
        }
        return 0;
    }
    
    /**
     * Get router health status
     */
    public Map<String, Object> getRouterHealthStatus(Long routerId) {
        Map<String, Object> health = new HashMap<>();
        
        Optional<Router> routerOpt = routerRepository.findById(routerId);
        if (routerOpt.isPresent()) {
            Router router = routerOpt.get();
            
            health.put("routerId", router.getId());
            health.put("routerName", router.getName());
            health.put("status", router.getStatus());
            health.put("lastHealthCheck", router.getLastHealthCheck());
            health.put("activeSessions", router.getActiveSessionsCount());
            health.put("ipAddress", router.getIpAddress());
            health.put("isOnline", router.getStatus() == Router.RouterStatus.ONLINE);
            
            // Calculate uptime if available
            if (router.getLastHealthCheck() != null && router.getStatus() == Router.RouterStatus.ONLINE) {
                long secondsSinceLastCheck = java.time.Duration
                    .between(router.getLastHealthCheck(), LocalDateTime.now()).getSeconds();
                health.put("secondsSinceLastCheck", secondsSinceLastCheck);
            }
        }
        
        return health;
    }
    
    /**
     * Get all routers health summary
     */
    public Map<String, Object> getAllRoutersHealthSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        List<Router> routers = routerRepository.findAll();
        long totalRouters = routers.size();
        long onlineRouters = routers.stream()
            .filter(r -> r.getStatus() == Router.RouterStatus.ONLINE)
            .count();
        long offlineRouters = totalRouters - onlineRouters;
        
        int totalActiveSessions = routers.stream()
            .mapToInt(r -> r.getActiveSessionsCount() != null ? r.getActiveSessionsCount() : 0)
            .sum();
        
        summary.put("totalRouters", totalRouters);
        summary.put("onlineRouters", onlineRouters);
        summary.put("offlineRouters", offlineRouters);
        summary.put("totalActiveSessions", totalActiveSessions);
        summary.put("healthPercentage", totalRouters > 0 ? (onlineRouters * 100.0 / totalRouters) : 0);
        
        List<Map<String, Object>> routerHealthList = new ArrayList<>();
        for (Router router : routers) {
            routerHealthList.add(getRouterHealthStatus(router.getId()));
        }
        summary.put("routers", routerHealthList);
        
        return summary;
    }
}





