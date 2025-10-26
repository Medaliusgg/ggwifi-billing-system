package com.ggnetworks.service;

import me.legrange.mikrotik.ApiConnection;
import me.legrange.mikrotik.MikrotikApiException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MikroTikApiService {
    
    private static final Logger logger = LoggerFactory.getLogger(MikroTikApiService.class);
    
    // Connection pool for multiple routers
    private final Map<String, ApiConnection> connections = new ConcurrentHashMap<>();
    
    /**
     * Connect to MikroTik router
     */
    public boolean connectToRouter(String routerId, String ipAddress, String username, String password, int port) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            
            // Close existing connection if any
            if (connections.containsKey(connectionKey)) {
                connections.get(connectionKey).close();
            }
            
            // Create new connection
            ApiConnection connection = ApiConnection.connect(ipAddress);
            connection.login(username, password);
            
            connections.put(connectionKey, connection);
            logger.info("Successfully connected to MikroTik router: {} at {}", routerId, ipAddress);
            return true;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to connect to MikroTik router {} at {}: {}", routerId, ipAddress, e.getMessage());
            return false;
        }
    }
    
    /**
     * Execute command on MikroTik router
     */
    public List<Map<String, String>> executeCommand(String routerId, String ipAddress, String command) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return Collections.emptyList();
            }
            
            List<Map<String, String>> results = connection.execute(command);
            logger.info("Executed command '{}' on router {}: {} results", command, routerId, results.size());
            return results;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to execute command '{}' on router {}: {}", command, routerId, e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Create RADIUS user on MikroTik router
     */
    public boolean createRadiusUser(String routerId, String ipAddress, String username, String password, 
                                   String profile, int timeLimit) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return false;
            }
            
            // Create user with time limit - using command string approach
            String command = String.format("/ppp secret add name=%s password=%s profile=%s limit-uptime=%d", 
                username, password, profile, timeLimit);
            connection.execute(command);
            logger.info("Created RADIUS user '{}' on router {} with {} seconds limit", username, routerId, timeLimit);
            return true;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to create RADIUS user '{}' on router {}: {}", username, routerId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Remove RADIUS user from MikroTik router
     */
    public boolean removeRadiusUser(String routerId, String ipAddress, String username) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return false;
            }
            
            // Find user ID first
            List<Map<String, String>> users = connection.execute("/ppp secret print where name=" + username);
            if (users.isEmpty()) {
                logger.warn("User '{}' not found on router {}", username, routerId);
                return false;
            }
            
            String userId = users.get(0).get(".id");
            connection.execute("/ppp secret remove .id=" + userId);
            logger.info("Removed RADIUS user '{}' from router {}", username, routerId);
            return true;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to remove RADIUS user '{}' from router {}: {}", username, routerId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get active PPP sessions
     */
    public List<Map<String, String>> getActiveSessions(String routerId, String ipAddress) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return Collections.emptyList();
            }
            
            List<Map<String, String>> sessions = connection.execute("/ppp active print");
            logger.info("Retrieved {} active sessions from router {}", sessions.size(), routerId);
            return sessions;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to get active sessions from router {}: {}", routerId, e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Disconnect user session
     */
    public boolean disconnectUser(String routerId, String ipAddress, String username) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return false;
            }
            
            // Find active session
            List<Map<String, String>> sessions = connection.execute("/ppp active print where name=" + username);
            if (sessions.isEmpty()) {
                logger.warn("No active session found for user '{}' on router {}", username, routerId);
                return false;
            }
            
            String sessionId = sessions.get(0).get(".id");
            connection.execute("/ppp active remove .id=" + sessionId);
            logger.info("Disconnected user '{}' from router {}", username, routerId);
            return true;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to disconnect user '{}' from router {}: {}", username, routerId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get system resource information
     */
    public Map<String, String> getSystemResources(String routerId, String ipAddress) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return Collections.emptyMap();
            }
            
            List<Map<String, String>> resources = connection.execute("/system resource print");
            if (!resources.isEmpty()) {
                return resources.get(0);
            }
            return Collections.emptyMap();
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to get system resources from router {}: {}", routerId, e.getMessage());
            return Collections.emptyMap();
        }
    }
    
    /**
     * Configure RADIUS client on MikroTik router
     */
    public boolean configureRadiusClient(String routerId, String ipAddress, String radiusServerIp, 
                                        String radiusSecret, int radiusPort) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection == null || !connection.isConnected()) {
                logger.warn("No active connection to router: {}", routerId);
                return false;
            }
            
            // Configure RADIUS client - using command string approach
            String command = String.format("/radius add address=%s secret=%s authentication-port=%d accounting-port=%d service=ppp", 
                radiusServerIp, radiusSecret, radiusPort, radiusPort + 1);
            connection.execute(command);
            logger.info("Configured RADIUS client on router {} for server {}", routerId, radiusServerIp);
            return true;
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to configure RADIUS client on router {}: {}", routerId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Close connection to router
     */
    public void closeConnection(String routerId, String ipAddress) {
        try {
            String connectionKey = routerId + "_" + ipAddress;
            ApiConnection connection = connections.get(connectionKey);
            
            if (connection != null) {
                connection.close();
                connections.remove(connectionKey);
                logger.info("Closed connection to router: {}", routerId);
            }
            
        } catch (MikrotikApiException e) {
            logger.error("Failed to close connection to router {}: {}", routerId, e.getMessage());
        }
    }
    
    /**
     * Close all connections
     */
    public void closeAllConnections() {
        for (Map.Entry<String, ApiConnection> entry : connections.entrySet()) {
            try {
                entry.getValue().close();
            } catch (MikrotikApiException e) {
                logger.error("Failed to close connection {}: {}", entry.getKey(), e.getMessage());
            }
        }
        connections.clear();
        logger.info("Closed all MikroTik connections");
    }
    
    /**
     * Check if router is connected
     */
    public boolean isConnected(String routerId, String ipAddress) {
        String connectionKey = routerId + "_" + ipAddress;
        ApiConnection connection = connections.get(connectionKey);
        return connection != null && connection.isConnected();
    }
}
