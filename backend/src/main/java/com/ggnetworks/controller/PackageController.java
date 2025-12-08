package com.ggnetworks.controller;

import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.service.PackageService;
import com.ggnetworks.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @Autowired
    private PermissionService permissionService;

    @Value("${app.security.enabled:true}")
    private boolean securityEnabled;

    private ResponseEntity<Map<String, Object>> checkPermission(String permission) {
        if (!securityEnabled) return null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || 
            "anonymousUser".equals(authentication.getName()) || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Authentication required");
            return ResponseEntity.status(401).body(response);
        }
        Map<String, Object> response = new HashMap<>();
        if (!permissionService.hasPermission(authentication.getName(), permission)) {
            response.put("status", "error");
            response.put("message", "Access Denied: You do not have permission to " + permission.toLowerCase().replace("_", " "));
            return ResponseEntity.status(403).body(response);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPackages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> paginatedPackages = packageService.getPackagesWithPagination(page, size, sortBy, sortDir);
            response.put("status", "success");
            response.put("message", "Packages retrieved successfully");
            response.put("data", paginatedPackages);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve packages: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPackageById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            InternetPackage packageData = packageService.getPackageById(id);
            response.put("status", "success");
            response.put("message", "Package retrieved successfully");
            response.put("data", packageData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve package: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPackage(@RequestBody InternetPackage packageData) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_WRITE");
        if (permissionCheck != null) return permissionCheck;

        try {
            InternetPackage createdPackage = packageService.createPackage(packageData);
            response.put("status", "success");
            response.put("message", "Package created successfully");
            response.put("data", createdPackage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create package: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePackage(@PathVariable Long id, @RequestBody InternetPackage packageData) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_WRITE");
        if (permissionCheck != null) return permissionCheck;

        try {
            InternetPackage updatedPackage = packageService.updatePackage(id, packageData);
            response.put("status", "success");
            response.put("message", "Package updated successfully");
            response.put("data", updatedPackage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update package: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePackage(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_DELETE");
        if (permissionCheck != null) return permissionCheck;

        try {
            packageService.deletePackage(id);
            response.put("status", "success");
            response.put("message", "Package deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete package: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPackages(@RequestParam String query) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<InternetPackage> packages = packageService.searchPackages(query);
            response.put("status", "success");
            response.put("message", "Packages found successfully");
            response.put("data", packages);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to search packages: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterPackages(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<InternetPackage> packages = packageService.getPackagesByType(InternetPackage.PackageType.valueOf(type.toUpperCase()));
            response.put("status", "success");
            response.put("message", "Packages filtered successfully");
            response.put("data", packages);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to filter packages: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getPackageAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            java.time.LocalDateTime start;
            java.time.LocalDateTime end;
            
            try {
                start = startDate != null && !startDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(startDate) : 
                    java.time.LocalDateTime.now().minusDays(30);
                end = endDate != null && !endDate.isEmpty() ? 
                    java.time.LocalDateTime.parse(endDate) : 
                    java.time.LocalDateTime.now();
            } catch (Exception e) {
                // If date parsing fails, use defaults
                start = java.time.LocalDateTime.now().minusDays(30);
                end = java.time.LocalDateTime.now();
            }
            
            Map<String, Object> analytics = packageService.getPackageAnalytics(start, end);
            response.put("status", "success");
            response.put("message", "Package analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/performance")
    public ResponseEntity<Map<String, Object>> getPackagePerformance(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("PACKAGE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> performance = packageService.getPackagePerformance(id);
            response.put("status", "success");
            response.put("message", "Package performance retrieved successfully");
            response.put("data", performance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve performance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}