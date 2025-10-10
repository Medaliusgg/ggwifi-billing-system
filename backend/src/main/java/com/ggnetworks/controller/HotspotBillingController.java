package com.ggnetworks.controller;

import com.ggnetworks.service.*;
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
@RequestMapping("/admin/hotspot-billing")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Hotspot Billing Management", description = "Advanced hotspot billing and management features")
public class HotspotBillingController {

    private final EnhancedVoucherService voucherService;
    private final EnhancedRadiusService radiusService;
    private final EnhancedRouterService routerService;
    private final PaymentService paymentService;
    private final CustomerProfileService customerProfileService;

    /**
     * Generate voucher automatically after payment
     */
    @PostMapping("/voucher/auto-generate")
    @Operation(summary = "Auto-generate voucher after payment", description = "Automatically generate voucher after successful payment")
    public ResponseEntity<Map<String, Object>> autoGenerateVoucherAfterPayment(@RequestBody PaymentVoucherRequest request) {
        try {
            log.info("Auto-generating voucher after payment: {}", request.getPaymentId());
            
            // This would be called automatically by payment webhook
            // For manual testing, we can trigger it here
            var result = voucherService.generateVoucherAfterPayment(request.getPayment());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voucher generation initiated");
            response.put("paymentId", request.getPaymentId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to auto-generate voucher after payment", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Generate bulk vouchers manually
     */
    @PostMapping("/voucher/bulk-generate")
    @Operation(summary = "Generate bulk vouchers", description = "Generate multiple vouchers manually for physical selling")
    public ResponseEntity<Map<String, Object>> generateBulkVouchers(@RequestBody BulkVoucherGenerationRequest request) {
        try {
            log.info("Generating {} vouchers for package: {}", request.getQuantity(), request.getPackageId());
            
            var result = voucherService.generateBulkVouchers(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isSuccess());
            response.put("totalRequested", result.getTotalRequested());
            response.put("totalGenerated", result.getTotalGenerated());
            response.put("vouchers", result.getVouchers());
            
            if (!result.getErrors().isEmpty()) {
                response.put("errors", result.getErrors());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to generate bulk vouchers", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Print voucher for physical selling
     */
    @PostMapping("/voucher/{voucherId}/print")
    @Operation(summary = "Print voucher", description = "Print voucher for physical selling")
    public ResponseEntity<Map<String, Object>> printVoucher(@PathVariable Long voucherId, @RequestBody PrintVoucherRequest request) {
        try {
            log.info("Printing voucher: {}", voucherId);
            
            var result = voucherService.printVoucher(voucherId, request.getPrintOptions());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isSuccess());
            response.put("voucher", result.getVoucher());
            response.put("printableContent", result.getPrintableContent());
            response.put("message", result.getMessage());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to print voucher", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Print multiple vouchers in batch
     */
    @PostMapping("/voucher/bulk-print")
    @Operation(summary = "Print multiple vouchers", description = "Print multiple vouchers in batch for physical selling")
    public ResponseEntity<Map<String, Object>> printBatchVouchers(@RequestBody BatchPrintRequest request) {
        try {
            log.info("Printing {} vouchers in batch", request.getVoucherIds().size());
            
            var result = voucherService.printBatchVouchers(request.getVoucherIds(), request.getPrintOptions());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isSuccess());
            response.put("totalRequested", result.getTotalRequested());
            response.put("totalPrinted", result.getTotalPrinted());
            response.put("results", result.getResults());
            
            if (!result.getErrors().isEmpty()) {
                response.put("errors", result.getErrors());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to print batch vouchers", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get vouchers ready for printing
     */
    @GetMapping("/voucher/ready-for-printing")
    @Operation(summary = "Get vouchers for printing", description = "Get vouchers that are ready for physical printing")
    public ResponseEntity<Map<String, Object>> getVouchersForPrinting(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String batchId) {
        try {
            var vouchers = voucherService.getVouchersForPrinting(location, batchId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("vouchers", vouchers);
            response.put("count", vouchers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get vouchers for printing", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get voucher statistics
     */
    @GetMapping("/voucher/statistics")
    @Operation(summary = "Get voucher statistics", description = "Get comprehensive voucher statistics")
    public ResponseEntity<Map<String, Object>> getVoucherStatistics(@RequestParam(required = false) String location) {
        try {
            var stats = voucherService.getVoucherStatistics(location);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("statistics", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get voucher statistics", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Generate QR code for voucher
     */
    @GetMapping("/voucher/{voucherId}/qr-code")
    @Operation(summary = "Generate QR code", description = "Generate QR code for voucher")
    public ResponseEntity<Map<String, Object>> generateVoucherQRCode(@PathVariable Long voucherId) {
        try {
            var qrCode = voucherService.generateVoucherQRCode(voucherId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", qrCode != null);
            response.put("qrCode", qrCode);
            response.put("voucherId", voucherId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to generate QR code for voucher", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get active sessions across all routers
     */
    @GetMapping("/sessions/active")
    @Operation(summary = "Get active sessions", description = "Get all active hotspot sessions across locations")
    public ResponseEntity<Map<String, Object>> getActiveSessions(@RequestParam(required = false) String location) {
        try {
            var sessions = radiusService.getActiveSessionsByLocation(location);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessions", sessions);
            response.put("count", sessions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get active sessions", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Disconnect user session
     */
    @PostMapping("/sessions/{sessionId}/disconnect")
    @Operation(summary = "Disconnect session", description = "Force disconnect a user session")
    public ResponseEntity<Map<String, Object>> disconnectSession(@PathVariable Long sessionId, @RequestBody DisconnectSessionRequest request) {
        try {
            log.info("Disconnecting session: {}", sessionId);
            
            boolean disconnected = radiusService.disconnectUser(request.getUsername(), request.getMacAddress(), request.getNasIp());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", disconnected);
            response.put("message", disconnected ? "Session disconnected successfully" : "Failed to disconnect session");
            response.put("sessionId", sessionId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to disconnect session", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get router status for all locations
     */
    @GetMapping("/routers/status")
    @Operation(summary = "Get router status", description = "Get status of all routers across locations")
    public ResponseEntity<Map<String, Object>> getRouterStatus(@RequestParam(required = false) String location) {
        try {
            List<com.ggnetworks.entity.Router> routers;
            
            if (location != null) {
                routers = routerService.getRoutersByLocation(location);
            } else {
                routers = routerService.getActiveRouters();
            }
            
            Map<String, Object> routerStatuses = new HashMap<>();
            for (var router : routers) {
                var status = routerService.getComprehensiveRouterStatus(router.getId());
                routerStatuses.put(router.getName(), status);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("routers", routerStatuses);
            response.put("count", routers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get router status", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Cleanup expired sessions
     */
    @PostMapping("/sessions/cleanup")
    @Operation(summary = "Cleanup expired sessions", description = "Clean up expired and inactive sessions")
    public ResponseEntity<Map<String, Object>> cleanupExpiredSessions() {
        try {
            log.info("Cleaning up expired sessions");
            
            radiusService.cleanupExpiredSessions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Expired sessions cleaned up successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to cleanup expired sessions", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get billing dashboard data
     */
    @GetMapping("/dashboard")
    @Operation(summary = "Get billing dashboard", description = "Get comprehensive billing dashboard data")
    public ResponseEntity<Map<String, Object>> getBillingDashboard(@RequestParam(required = false) String location) {
        try {
            // Get voucher statistics
            var voucherStats = voucherService.getVoucherStatistics(location);
            
            // Get active sessions count
            var activeSessionsCount = radiusService.getActiveSessionsCount();
            
            // Get router status
            var routers = location != null ? routerService.getRoutersByLocation(location) : routerService.getActiveRouters();
            
            Map<String, Object> dashboardData = new HashMap<>();
            dashboardData.put("voucherStatistics", voucherStats);
            dashboardData.put("activeSessionsCount", activeSessionsCount);
            dashboardData.put("totalRouters", routers.size());
            dashboardData.put("onlineRouters", routers.stream().filter(r -> r.isOnline()).count());
            dashboardData.put("location", location);
            dashboardData.put("lastUpdated", java.time.LocalDateTime.now());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("dashboard", dashboardData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get billing dashboard", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // Request DTOs
    public static class PaymentVoucherRequest {
        private Long paymentId;
        private com.ggnetworks.entity.Payment payment;

        public Long getPaymentId() { return paymentId; }
        public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
        public com.ggnetworks.entity.Payment getPayment() { return payment; }
        public void setPayment(com.ggnetworks.entity.Payment payment) { this.payment = payment; }
    }

    public static class BulkVoucherGenerationRequest {
        private Long packageId;
        private int quantity;
        private String assignedTo;
        private java.time.LocalDateTime expiresAt;
        private String location;

        public Long getPackageId() { return packageId; }
        public void setPackageId(Long packageId) { this.packageId = packageId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public String getAssignedTo() { return assignedTo; }
        public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
        public java.time.LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(java.time.LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class PrintVoucherRequest {
        private EnhancedVoucherService.PrintOptions printOptions;

        public EnhancedVoucherService.PrintOptions getPrintOptions() { return printOptions; }
        public void setPrintOptions(EnhancedVoucherService.PrintOptions printOptions) { this.printOptions = printOptions; }
    }

    public static class BatchPrintRequest {
        private List<Long> voucherIds;
        private EnhancedVoucherService.PrintOptions printOptions;

        public List<Long> getVoucherIds() { return voucherIds; }
        public void setVoucherIds(List<Long> voucherIds) { this.voucherIds = voucherIds; }
        public EnhancedVoucherService.PrintOptions getPrintOptions() { return printOptions; }
        public void setPrintOptions(EnhancedVoucherService.PrintOptions printOptions) { this.printOptions = printOptions; }
    }

    public static class DisconnectSessionRequest {
        private String username;
        private String macAddress;
        private String nasIp;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getMacAddress() { return macAddress; }
        public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
        public String getNasIp() { return nasIp; }
        public void setNasIp(String nasIp) { this.nasIp = nasIp; }
    }
}
