package com.ggnetworks.controller;

import com.ggnetworks.entity.Router;
import com.ggnetworks.service.RouterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/routers")
@CrossOrigin(origins = "*")
public class RouterController {

    @Autowired
    private RouterService routerService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRouters(
            @RequestParam(required = false) Router.RouterStatus status,
            @RequestParam(required = false) Router.RouterType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean activeOnly
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Router> routers = routerService.getRouters(status, type, location, activeOnly);
            response.put("status", "success");
            response.put("message", "Routers retrieved successfully");
            response.put("data", routers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve routers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRouterById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Router router = routerService.getRouter(id);
            response.put("status", "success");
            response.put("message", "Router retrieved successfully");
            response.put("data", router);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRouter(@RequestBody Router router) {
        Map<String, Object> response = new HashMap<>();
        try {
            Router created = routerService.createRouter(router);
            response.put("status", "success");
            response.put("message", "Router created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRouter(@PathVariable Long id, @RequestBody Router router) {
        Map<String, Object> response = new HashMap<>();
        try {
            Router updated = routerService.updateRouter(id, router);
            response.put("status", "success");
            response.put("message", "Router updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRouter(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            routerService.deleteRouter(id);
            response.put("status", "success");
            response.put("message", "Router deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/test-connection")
    public ResponseEntity<Map<String, Object>> testRouterConnection(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = routerService.testConnection(id);
            response.put("status", "success");
            response.put("message", "Connection test completed");
            response.put("data", result);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to test connection: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<Map<String, Object>> syncRouter(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> data = routerService.syncRouter(id);
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to sync router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/reboot")
    public ResponseEntity<Map<String, Object>> rebootRouter(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = routerService.rebootRouter(id);
            response.put("status", success ? "success" : "error");
            response.put("message", success ? "Router reboot command sent" : "Failed to reboot router");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reboot router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/backup")
    public ResponseEntity<Map<String, Object>> backupRouter(@PathVariable Long id,
                                                            @RequestParam(required = false) String backupName) {
        Map<String, Object> response = new HashMap<>();
        try {
            String backupFile = backupName != null ? backupName : "backup-" + LocalDateTime.now();
            boolean success = routerService.backupRouter(id, backupFile);
            response.put("status", success ? "success" : "error");
            response.put("message", success ? "Backup command sent" : "Failed to backup router");
            response.put("backupName", backupFile);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to backup router: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getRouterStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = routerService.getRouterStatistics();
            response.put("status", "success");
            response.put("message", "Router statistics retrieved successfully");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve router statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/test-all")
    public ResponseEntity<Map<String, Object>> testAllConnections() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> results = routerService.testAllConnections();
            response.put("status", "success");
            response.put("message", "Connection tests completed");
            response.put("data", results);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to test connections: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/sync-all")
    public ResponseEntity<Map<String, Object>> syncAllRouters() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> results = routerService.syncAllRouters();
            response.put("status", "success");
            response.put("message", "Router synchronization completed");
            response.put("data", results);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to sync routers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/wireguard")
    public ResponseEntity<Map<String, Object>> getWireGuardConfig(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> config = routerService.getWireGuardConfig(id);
            return ResponseEntity.ok(config);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get WireGuard config: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/wireguard")
    public ResponseEntity<Map<String, Object>> configureWireGuard(@PathVariable Long id, 
                                                                  @RequestBody Map<String, Object> wireguardConfig) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> result = routerService.configureWireGuard(id, wireguardConfig);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to configure WireGuard: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/hotspot")
    public ResponseEntity<Map<String, Object>> getHotspotConfig(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> config = routerService.getHotspotConfig(id);
            return ResponseEntity.ok(config);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get hotspot config: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/configure-radius")
    public ResponseEntity<Map<String, Object>> configureRouterRadius(@PathVariable Long id,
                                                                     @RequestBody Map<String, Object> config) {
        Map<String, Object> response = new HashMap<>();
        try {
            String radiusServerIp = (String) config.get("radiusServerIp");
            String radiusSecret = (String) config.get("radiusSecret");
            
            if (radiusServerIp == null || radiusSecret == null) {
                response.put("status", "error");
                response.put("message", "radiusServerIp and radiusSecret are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> result = routerService.configureRouterRadius(id, radiusServerIp, radiusSecret);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to configure RADIUS: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/deploy-config")
    public ResponseEntity<Map<String, Object>> deployConfigToRouters(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<Long> routerIds = (List<Long>) request.get("routerIds");
            @SuppressWarnings("unchecked")
            Map<String, Object> config = (Map<String, Object>) request.get("config");
            
            if (routerIds == null || routerIds.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Router IDs are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> results = routerService.deployConfigToRouters(routerIds, config);
            response.put("status", "success");
            response.put("message", "Configuration deployment completed");
            response.put("data", results);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to deploy configuration: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getNetworkAnalytics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> analytics = routerService.getNetworkAnalytics();
            response.put("status", "success");
            response.put("message", "Network analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve network analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

