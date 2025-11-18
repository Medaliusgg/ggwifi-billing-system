package com.ggnetworks.controller;

import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.service.PackageService;
import com.ggnetworks.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/packages")
@CrossOrigin(origins = "*")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @Autowired
    private PermissionService permissionService;

    private ResponseEntity<Map<String, Object>> checkPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        if (!permissionService.hasPermission(authentication.getName(), permission)) {
            response.put("status", "error");
            response.put("message", "Access Denied: You do not have permission to " + permission.toLowerCase().replace("_", " "));
            return ResponseEntity.status(403).body(response);
        }
        return null; // Permission granted
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
}