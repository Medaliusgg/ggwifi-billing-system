package com.ggnetworks.controller;

import com.ggnetworks.entity.Router;
import com.ggnetworks.service.EnhancedRouterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/routers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Enhanced Router Management", description = "Advanced router management for multi-location hotspot billing")
public class EnhancedRouterController {

    private final EnhancedRouterService routerService;

    /**
     * Add new MikroTik router with location and configuration
     */
    @PostMapping("/add")
    @Operation(summary = "Add new router", description = "Add new MikroTik router with location and auto-configuration")
    public ResponseEntity<Map<String, Object>> addRouter(@RequestBody RouterSetupRequest request) {
        try {
            log.info("Adding new router: {} at location: {}", request.getName(), request.getLocation());
            
            Router router = routerService.addRouterWithConfiguration(request);
            String configScript = routerService.generateConfigurationScript(router);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("router", router);
            response.put("configScript", configScript);
            response.put("message", "Router added successfully. Copy the config script to your MikroTik router.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to add router", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Test router connection and configuration
     */
    @PostMapping("/{routerId}/test")
    @Operation(summary = "Test router connection", description = "Test connection and validate configuration")
    public ResponseEntity<Map<String, Object>> testRouterConnection(@PathVariable Long routerId) {
        try {
            Map<String, Object> testResult = routerService.testRouterConnection(routerId);
            return ResponseEntity.ok(testResult);
        } catch (Exception e) {
            log.error("Failed to test router connection", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Apply configuration to router remotely
     */
    @PostMapping("/{routerId}/configure")
    @Operation(summary = "Configure router remotely", description = "Apply configuration script to router via API")
    public ResponseEntity<Map<String, Object>> configureRouter(@PathVariable Long routerId) {
        try {
            Map<String, Object> configResult = routerService.configureRouterRemotely(routerId);
            return ResponseEntity.ok(configResult);
        } catch (Exception e) {
            log.error("Failed to configure router", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get routers by location
     */
    @GetMapping("/location/{location}")
    @Operation(summary = "Get routers by location", description = "Get all routers for a specific location")
    public ResponseEntity<List<Router>> getRoutersByLocation(@PathVariable String location) {
        try {
            List<Router> routers = routerService.getRoutersByLocation(location);
            return ResponseEntity.ok(routers);
        } catch (Exception e) {
            log.error("Failed to get routers by location", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get router configuration script
     */
    @GetMapping("/{routerId}/config-script")
    @Operation(summary = "Get configuration script", description = "Get MikroTik configuration script for router")
    public ResponseEntity<Map<String, Object>> getConfigurationScript(@PathVariable Long routerId) {
        try {
            String configScript = routerService.generateConfigurationScript(routerId);
            return ResponseEntity.ok(Map.of(
                "routerId", routerId,
                "configScript", configScript,
                "instructions", "Copy and paste this script into your MikroTik router terminal"
            ));
        } catch (Exception e) {
            log.error("Failed to generate configuration script", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get router status and health
     */
    @GetMapping("/{routerId}/status")
    @Operation(summary = "Get router status", description = "Get comprehensive router status and health")
    public ResponseEntity<Map<String, Object>> getRouterStatus(@PathVariable Long routerId) {
        try {
            Map<String, Object> status = routerService.getComprehensiveRouterStatus(routerId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get router status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bulk router operations
     */
    @PostMapping("/bulk/configure")
    @Operation(summary = "Bulk configure routers", description = "Configure multiple routers at once")
    public ResponseEntity<Map<String, Object>> bulkConfigureRouters(@RequestBody BulkRouterRequest request) {
        try {
            Map<String, Object> results = routerService.bulkConfigureRouters(request.getRouterIds());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Failed to bulk configure routers", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // Request DTOs
    public static class RouterSetupRequest {
        private String name;
        private String ipAddress;
        private String location;
        private String model;
        private String serialNumber;
        private String username;
        private String password;
        private String description;
        private String radiusServerIp;
        private String radiusSecret;
        private String hotspotNetwork;
        private String pppoeNetwork;
        private String wanNetwork;
        private Integer port = 443;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public String getSerialNumber() { return serialNumber; }
        public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getRadiusServerIp() { return radiusServerIp; }
        public void setRadiusServerIp(String radiusServerIp) { this.radiusServerIp = radiusServerIp; }
        public String getRadiusSecret() { return radiusSecret; }
        public void setRadiusSecret(String radiusSecret) { this.radiusSecret = radiusSecret; }
        public String getHotspotNetwork() { return hotspotNetwork; }
        public void setHotspotNetwork(String hotspotNetwork) { this.hotspotNetwork = hotspotNetwork; }
        public String getPppoeNetwork() { return pppoeNetwork; }
        public void setPppoeNetwork(String pppoeNetwork) { this.pppoeNetwork = pppoeNetwork; }
        public String getWanNetwork() { return wanNetwork; }
        public void setWanNetwork(String wanNetwork) { this.wanNetwork = wanNetwork; }
        public Integer getPort() { return port; }
        public void setPort(Integer port) { this.port = port; }
    }

    public static class BulkRouterRequest {
        private List<Long> routerIds;

        public List<Long> getRouterIds() { return routerIds; }
        public void setRouterIds(List<Long> routerIds) { this.routerIds = routerIds; }
    }
}
