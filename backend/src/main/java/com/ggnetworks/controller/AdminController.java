package com.ggnetworks.controller;

import com.ggnetworks.entity.HotspotVoucher;
import com.ggnetworks.entity.Package;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.entity.Router;
import com.ggnetworks.entity.User;
import com.ggnetworks.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Admin management endpoints for GGNetworks system")
public class AdminController {

    private final UserService userService;
    private final PackageService packageService;
    private final VoucherService voucherService;
    private final PaymentService paymentService;
    private final SelcomPaymentService selcomPaymentService;
    private final RadiusService radiusService;
    private final MikroTikService mikrotikService;
    // TODO: Add these services when implemented
    // private final RouterService routerService;
    // private final StaticIpService staticIpService;
    // private final LocationService locationService;
    // private final FinanceService financeService;
    // private final SmsCampaignService smsCampaignService;
    // private final LoyaltyService loyaltyService;
    // private final ConfigurationScriptService configScriptService;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieve all users with pagination")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users = userService.getAllUsers(pageable, role, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", users.getContent());
            response.put("totalElements", users.getTotalElements());
            response.put("totalPages", users.getTotalPages());
            response.put("currentPage", users.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get users", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve users"));
        }
    }

    @PutMapping("/users/{userId}/status")
    @Operation(summary = "Update user status", description = "Activate or deactivate a user")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        
        try {
            String status = request.get("status");
            User updatedUser = userService.updateUserStatus(userId, status);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User status updated successfully",
                    "user", updatedUser
            ));
        } catch (Exception e) {
            log.error("Failed to update user status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update user status"));
        }
    }

    // ==================== PACKAGE MANAGEMENT ====================

    @PostMapping("/packages")
    @Operation(summary = "Create package", description = "Create a new package")
    public ResponseEntity<com.ggnetworks.entity.Package> createPackage(@RequestBody com.ggnetworks.entity.Package packageRequest) {
        try {
            Package createdPackage = packageService.createPackage(packageRequest);
            return ResponseEntity.ok(createdPackage);
        } catch (Exception e) {
            log.error("Failed to create package", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/packages/{packageId}")
    @Operation(summary = "Update package", description = "Update an existing package")
    public ResponseEntity<com.ggnetworks.entity.Package> updatePackage(
            @PathVariable Long packageId,
            @RequestBody com.ggnetworks.entity.Package packageRequest) {
        
        try {
            Package updatedPackage = packageService.updatePackage(packageId, packageRequest);
            return ResponseEntity.ok(updatedPackage);
        } catch (Exception e) {
            log.error("Failed to update package", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/packages/{packageId}")
    @Operation(summary = "Delete package", description = "Delete a package")
    public ResponseEntity<Map<String, Object>> deletePackage(@PathVariable Long packageId) {
        try {
            packageService.deletePackage(packageId);
            return ResponseEntity.ok(Map.of("message", "Package deleted successfully"));
        } catch (Exception e) {
            log.error("Failed to delete package", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete package"));
        }
    }

    // ==================== VOUCHER MANAGEMENT ====================

    @PostMapping("/vouchers/generate")
    @Operation(summary = "Generate voucher", description = "Generate a single voucher")
    public ResponseEntity<HotspotVoucher> generateVoucher(@RequestBody Map<String, Object> request) {
        try {
            Long packageId = Long.valueOf(request.get("packageId").toString());
            String assignedTo = (String) request.get("assignedTo");
            LocalDateTime expiresAt = request.get("expiresAt") != null ? 
                    LocalDateTime.parse(request.get("expiresAt").toString()) : null;

            HotspotVoucher voucher = voucherService.generateVoucher(packageId, assignedTo, expiresAt);
            return ResponseEntity.ok(voucher);
        } catch (Exception e) {
            log.error("Failed to generate voucher", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/vouchers/generate-bulk")
    @Operation(summary = "Generate bulk vouchers", description = "Generate multiple vouchers")
    public ResponseEntity<List<HotspotVoucher>> generateBulkVouchers(@RequestBody Map<String, Object> request) {
        try {
            Long packageId = Long.valueOf(request.get("packageId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            String assignedTo = (String) request.get("assignedTo");
            LocalDateTime expiresAt = request.get("expiresAt") != null ? 
                    LocalDateTime.parse(request.get("expiresAt").toString()) : null;

            List<HotspotVoucher> vouchers = voucherService.generateBulkVouchers(packageId, quantity, assignedTo, expiresAt);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            log.error("Failed to generate bulk vouchers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/vouchers/statistics")
    @Operation(summary = "Get voucher statistics", description = "Get voucher usage statistics")
    public ResponseEntity<Map<String, Object>> getVoucherStatistics() {
        try {
            Map<String, Object> stats = voucherService.getVoucherStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get voucher statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get voucher statistics"));
        }
    }

    @PostMapping("/vouchers/cleanup")
    @Operation(summary = "Cleanup expired vouchers", description = "Mark expired vouchers as expired")
    public ResponseEntity<Map<String, Object>> cleanupExpiredVouchers() {
        try {
            int cleanedCount = voucherService.cleanupExpiredVouchers();
            return ResponseEntity.ok(Map.of(
                    "message", "Expired vouchers cleaned up successfully",
                    "cleanedCount", cleanedCount
            ));
        } catch (Exception e) {
            log.error("Failed to cleanup expired vouchers", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to cleanup expired vouchers"));
        }
    }

    // ==================== RADIUS MANAGEMENT ====================

    @GetMapping("/radius/sessions")
    @Operation(summary = "Get active sessions", description = "Get all active RADIUS sessions")
    public ResponseEntity<Map<String, Object>> getActiveSessions() {
        try {
            // This would integrate with RADIUS service to get active sessions
            Map<String, Object> sessions = new HashMap<>();
            sessions.put("activeSessions", 0);
            sessions.put("totalDataUsage", 0);
            sessions.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Failed to get active sessions", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get active sessions"));
        }
    }

    @PostMapping("/radius/disconnect")
    @Operation(summary = "Disconnect user", description = "Disconnect a user from RADIUS")
    public ResponseEntity<Map<String, Object>> disconnectUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String macAddress = request.get("macAddress");
            
            boolean disconnected = radiusService.disconnectUser(username, macAddress);
            
            if (disconnected) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "User disconnected successfully"
                ));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Failed to disconnect user"));
            }
        } catch (Exception e) {
            log.error("Failed to disconnect user", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to disconnect user"));
        }
    }

    // ==================== MIKROTIK MANAGEMENT ====================

    @GetMapping("/mikrotik/routers")
    @Operation(summary = "Get all routers", description = "Get all MikroTik routers")
    public ResponseEntity<List<Router>> getAllRouters() {
        try {
            List<Router> routers = mikrotikService.getActiveRouters();
            return ResponseEntity.ok(routers);
        } catch (Exception e) {
            log.error("Failed to get routers", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/mikrotik/routers/{routerId}/status")
    @Operation(summary = "Get router status", description = "Get router health status")
    public ResponseEntity<Map<String, Object>> getRouterStatus(@PathVariable Long routerId) {
        try {
            Optional<Router> routerOpt = mikrotikService.getRouterById(routerId);
            if (routerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> status = mikrotikService.getRouterHealthStatus(routerOpt.get());
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get router status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get router status"));
        }
    }

    @GetMapping("/mikrotik/routers/{routerId}/users")
    @Operation(summary = "Get router users", description = "Get active users on a router")
    public ResponseEntity<List<Map<String, Object>>> getRouterUsers(@PathVariable Long routerId) {
        try {
            Optional<Router> routerOpt = mikrotikService.getRouterById(routerId);
            if (routerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> users = mikrotikService.getActiveHotspotUsers(routerOpt.get());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to get router users", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/mikrotik/routers/{routerId}/reboot")
    @Operation(summary = "Reboot router", description = "Reboot a MikroTik router")
    public ResponseEntity<Map<String, Object>> rebootRouter(@PathVariable Long routerId) {
        try {
            Optional<Router> routerOpt = mikrotikService.getRouterById(routerId);
            if (routerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            boolean rebooted = mikrotikService.rebootRouter(routerOpt.get());
            
            if (rebooted) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Router reboot initiated successfully"
                ));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Failed to reboot router"));
            }
        } catch (Exception e) {
            log.error("Failed to reboot router", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to reboot router"));
        }
    }

    // ==================== PAYMENT MANAGEMENT ====================

    @GetMapping("/payments")
    @Operation(summary = "Get all payments", description = "Get all payments with pagination")
    public ResponseEntity<Map<String, Object>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Payment> payments = paymentService.getAllPayments(pageable, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("payments", payments.getContent());
            response.put("totalElements", payments.getTotalElements());
            response.put("totalPages", payments.getTotalPages());
            response.put("currentPage", payments.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get payments", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve payments"));
        }
    }

    @GetMapping("/payments/statistics")
    @Operation(summary = "Get payment statistics", description = "Get payment statistics and analytics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        try {
            Map<String, Object> stats = selcomPaymentService.getPaymentStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get payment statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get payment statistics"));
        }
    }

    @PostMapping("/payments/refund")
    @Operation(summary = "Process refund", description = "Process payment refund")
    public ResponseEntity<Map<String, Object>> processRefund(@RequestBody Map<String, Object> request) {
        try {
            String transactionId = (String) request.get("transactionId");
            Double amount = Double.valueOf(request.get("amount").toString());
            String reason = (String) request.get("reason");

            // TODO: Implement refund functionality with new C2B API
            // For now, return a placeholder response
            Map<String, Object> result = Map.of(
                "success", false,
                "error", "Refund functionality not yet implemented with C2B API"
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to process refund", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process refund"));
        }
    }

    // ==================== STATIC IP MANAGEMENT ====================

    // TODO: Implement these endpoints when services are available
    /*
    @GetMapping("/static-ips")
    @Operation(summary = "Get all static IPs", description = "Get all static IP addresses")
    public ResponseEntity<List<StaticIp>> getAllStaticIps() {
        // TODO: Implement when StaticIpService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/static-ips")
    @Operation(summary = "Create static IP", description = "Create a new static IP assignment")
    public ResponseEntity<StaticIp> createStaticIp(@RequestBody StaticIp staticIp) {
        // TODO: Implement when StaticIpService is available
        return ResponseEntity.ok(staticIp);
    }

    // ==================== LOCATION MANAGEMENT ====================

    @GetMapping("/locations")
    @Operation(summary = "Get all locations", description = "Get all service locations")
    public ResponseEntity<List<Location>> getAllLocations() {
        // TODO: Implement when LocationService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/locations")
    @Operation(summary = "Create location", description = "Create a new service location")
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        // TODO: Implement when LocationService is available
        return ResponseEntity.ok(location);
    }

    // ==================== FINANCE MANAGEMENT ====================

    @GetMapping("/finance")
    @Operation(summary = "Get finance records", description = "Get all finance records")
    public ResponseEntity<List<Finance>> getAllFinanceRecords() {
        // TODO: Implement when FinanceService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/finance")
    @Operation(summary = "Create finance record", description = "Create a new finance record")
    public ResponseEntity<Finance> createFinanceRecord(@RequestBody Finance finance) {
        // TODO: Implement when FinanceService is available
        return ResponseEntity.ok(finance);
    }

    // ==================== SMS CAMPAIGN MANAGEMENT ====================

    @GetMapping("/sms-campaigns")
    @Operation(summary = "Get SMS campaigns", description = "Get all SMS campaigns")
    public ResponseEntity<List<SmsCampaign>> getAllSmsCampaigns() {
        // TODO: Implement when SmsCampaignService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/sms-campaigns")
    @Operation(summary = "Create SMS campaign", description = "Create a new SMS campaign")
    public ResponseEntity<SmsCampaign> createSmsCampaign(@RequestBody SmsCampaign campaign) {
        // TODO: Implement when SmsCampaignService is available
        return ResponseEntity.ok(campaign);
    }

    @PostMapping("/sms-campaigns/{campaignId}/send")
    @Operation(summary = "Send SMS campaign", description = "Send an SMS campaign to target audience")
    public ResponseEntity<Map<String, Object>> sendSmsCampaign(@PathVariable Long campaignId) {
        // TODO: Implement when SmsCampaignService is available
        return ResponseEntity.ok(Map.of("success", true, "message", "SMS campaign sent successfully"));
    }

    // ==================== LOYALTY PROGRAM MANAGEMENT ====================

    @GetMapping("/loyalty-programs")
    @Operation(summary = "Get loyalty programs", description = "Get all loyalty programs")
    public ResponseEntity<List<LoyaltyProgram>> getAllLoyaltyPrograms() {
        // TODO: Implement when LoyaltyService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/loyalty-programs")
    @Operation(summary = "Create loyalty program", description = "Create a new loyalty program")
    public ResponseEntity<LoyaltyProgram> createLoyaltyProgram(@RequestBody LoyaltyProgram program) {
        // TODO: Implement when LoyaltyService is available
        return ResponseEntity.ok(program);
    }

    // ==================== CONFIGURATION SCRIPT MANAGEMENT ====================

    @GetMapping("/config-scripts")
    @Operation(summary = "Get configuration scripts", description = "Get all configuration scripts")
    public ResponseEntity<List<ConfigurationScript>> getAllConfigScripts() {
        // TODO: Implement when ConfigurationScriptService is available
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/config-scripts")
    @Operation(summary = "Create configuration script", description = "Create a new configuration script")
    public ResponseEntity<ConfigurationScript> createConfigScript(@RequestBody ConfigurationScript script) {
        // TODO: Implement when ConfigurationScriptService is available
        return ResponseEntity.ok(script);
    }

    @PostMapping("/config-scripts/{scriptId}/execute")
    @Operation(summary = "Execute configuration script", description = "Execute a configuration script on target router")
    public ResponseEntity<Map<String, Object>> executeConfigScript(@PathVariable Long scriptId) {
        // TODO: Implement when ConfigurationScriptService is available
        return ResponseEntity.ok(Map.of("success", true, "message", "Configuration script executed successfully"));
    }
    */

    // ==================== SYSTEM DASHBOARD ====================

    @GetMapping("/dashboard")
    @Operation(summary = "Get system dashboard", description = "Get comprehensive system dashboard data")
    public ResponseEntity<Map<String, Object>> getSystemDashboard() {
        try {
            Map<String, Object> dashboard = new HashMap<>();
            
            // User statistics
            Map<String, Object> userStats = userService.getUserStatistics();
            dashboard.put("userStatistics", userStats);
            
            // Voucher statistics
            Map<String, Object> voucherStats = voucherService.getVoucherStatistics();
            dashboard.put("voucherStatistics", voucherStats);
            
            // Payment statistics
            Map<String, Object> paymentStats = selcomPaymentService.getPaymentStatistics();
            dashboard.put("paymentStatistics", paymentStats);
            
            // Router status
            List<Router> routers = mikrotikService.getActiveRouters();
            dashboard.put("activeRouters", routers.size());
            
            // System health
            dashboard.put("systemHealth", "HEALTHY");
            dashboard.put("lastUpdated", LocalDateTime.now());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Failed to get system dashboard", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get system dashboard"));
        }
    }
} 