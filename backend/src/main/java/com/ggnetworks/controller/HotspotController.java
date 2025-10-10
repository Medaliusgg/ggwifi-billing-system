package com.ggnetworks.controller;

import com.ggnetworks.entity.HotspotSession;
import com.ggnetworks.entity.HotspotVoucher;
import com.ggnetworks.entity.Package;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hotspot")
@RequiredArgsConstructor
@Tag(name = "Hotspot Portal", description = "Hotspot portal endpoints for voucher-based access")
public class HotspotController {

    private final VoucherService voucherService;
    private final HotspotSessionService sessionService;
    private final PackageService packageService;
    private final PaymentService paymentService;
    private final RadiusService radiusService;

    // ==================== VOUCHER MANAGEMENT ====================

    @GetMapping("/packages")
    @Operation(summary = "Get hotspot packages", description = "Get all available hotspot packages")
    public ResponseEntity<List<Package>> getHotspotPackages() {
        try {
            List<Package> packages = packageService.getPackagesByType(Package.PackageType.HOTSPOT);
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            log.error("Failed to get hotspot packages", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/voucher/validate")
    @Operation(summary = "Validate voucher", description = "Validate a hotspot voucher code")
    public ResponseEntity<Map<String, Object>> validateVoucher(@RequestBody Map<String, String> request) {
        try {
            String voucherCode = request.get("voucherCode");
            String macAddress = request.get("macAddress");
            String ipAddress = request.get("ipAddress");

            if (voucherCode == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Voucher code is required"));
            }

            VoucherService.VoucherValidationResult result = voucherService.validateVoucher(voucherCode, macAddress, ipAddress);

            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isValid());
            response.put("message", result.getMessage());
            
            if (result.isValid()) {
                response.put("voucherId", result.getVoucherId());
                response.put("packageId", result.getPackageId());
                response.put("packageName", result.getPackageName());
                response.put("sessionInfo", result.getSessionInfo());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to validate voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to validate voucher"));
        }
    }

    @PostMapping("/voucher/connect")
    @Operation(summary = "Connect with voucher", description = "Connect to hotspot using voucher")
    public ResponseEntity<Map<String, Object>> connectWithVoucher(@RequestBody Map<String, String> request) {
        try {
            String voucherCode = request.get("voucherCode");
            String macAddress = request.get("macAddress");
            String ipAddress = request.get("ipAddress");

            if (voucherCode == null || macAddress == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Voucher code and MAC address are required"));
            }

            // Validate voucher first
            VoucherService.VoucherValidationResult validationResult = voucherService.validateVoucher(voucherCode, macAddress, ipAddress);
            
            if (!validationResult.isValid()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", validationResult.getMessage()));
            }

            // Create session
            HotspotVoucher voucher = voucherService.getVoucherByCode(voucherCode);
            HotspotSession session = sessionService.createSession(voucher, macAddress, ipAddress);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connected successfully");
            response.put("sessionId", session.getId());
            response.put("voucherCode", voucherCode);
            response.put("packageId", validationResult.getPackageId());
            response.put("packageName", validationResult.getPackageName());
            response.put("expiresAt", voucher.getExpiresAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to connect with voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to connect"));
        }
    }

    @PostMapping("/voucher/disconnect")
    @Operation(summary = "Disconnect voucher", description = "Disconnect from hotspot")
    public ResponseEntity<Map<String, Object>> disconnectVoucher(@RequestBody Map<String, String> request) {
        try {
            String voucherCode = request.get("voucherCode");
            String macAddress = request.get("macAddress");

            if (voucherCode == null || macAddress == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Voucher code and MAC address are required"));
            }

            boolean disconnected = sessionService.disconnectSession(voucherCode, macAddress);

            Map<String, Object> response = new HashMap<>();
            response.put("success", disconnected);
            response.put("message", disconnected ? "Disconnected successfully" : "Failed to disconnect");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to disconnect voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to disconnect"));
        }
    }

    @GetMapping("/voucher/{voucherCode}/status")
    @Operation(summary = "Get voucher status", description = "Get the status of a voucher")
    public ResponseEntity<Map<String, Object>> getVoucherStatus(@PathVariable String voucherCode) {
        try {
            HotspotVoucher voucher = voucherService.getVoucherByCode(voucherCode);
            if (voucher == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("voucherCode", voucher.getVoucherCode());
            response.put("status", voucher.getStatus());
            response.put("expiresAt", voucher.getExpiresAt());
            response.put("package", voucher.getPackageEntity());
            response.put("usedAt", voucher.getUsedAt());

            // Get active session if any
            HotspotSession activeSession = sessionService.getActiveSessionByVoucher(voucher.getId());
            if (activeSession != null) {
                response.put("activeSession", Map.of(
                    "sessionId", activeSession.getId(),
                    "macAddress", activeSession.getMacAddress(),
                    "ipAddress", activeSession.getIpAddress(),
                    "startTime", activeSession.getStartTime(),
                    "dataUsageMb", activeSession.getDataUsageMb()
                ));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get voucher status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get voucher status"));
        }
    }

    // ==================== SESSION MANAGEMENT ====================

    @GetMapping("/sessions/active")
    @Operation(summary = "Get active sessions", description = "Get all active hotspot sessions")
    public ResponseEntity<List<HotspotSession>> getActiveSessions() {
        try {
            List<HotspotSession> sessions = sessionService.getActiveSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Failed to get active sessions", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/sessions/{sessionId}/disconnect")
    @Operation(summary = "Force disconnect session", description = "Force disconnect a specific session")
    public ResponseEntity<Map<String, Object>> forceDisconnectSession(@PathVariable Long sessionId) {
        try {
            boolean disconnected = sessionService.forceDisconnectSession(sessionId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", disconnected);
            response.put("message", disconnected ? "Session disconnected successfully" : "Failed to disconnect session");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to force disconnect session", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to disconnect session"));
        }
    }

    // ==================== PAYMENT INTEGRATION ====================

    @PostMapping("/payment/initiate")
    @Operation(summary = "Initiate voucher payment", description = "Initiate payment for voucher purchase")
    public ResponseEntity<Map<String, Object>> initiateVoucherPayment(@RequestBody Map<String, Object> request) {
        try {
            Long packageId = Long.valueOf(request.get("packageId").toString());
            String phoneNumber = (String) request.get("phoneNumber");
            String paymentMethod = (String) request.get("paymentMethod");

            if (packageId == null || phoneNumber == null || paymentMethod == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Package ID, phone number, and payment method are required"));
            }

            Package packageEntity = packageService.getPackageById(packageId);
            if (packageEntity == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid package ID"));
            }

            // Create payment record
            Payment payment = paymentService.createVoucherPayment(packageEntity, phoneNumber, paymentMethod);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment initiated successfully");
            response.put("paymentId", payment.getId());
            response.put("amount", payment.getAmount());
            response.put("status", payment.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to initiate voucher payment", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to initiate payment"));
        }
    }

    @PostMapping("/payment/callback")
    @Operation(summary = "Payment callback", description = "Handle payment gateway callback")
    public ResponseEntity<Map<String, Object>> handlePaymentCallback(@RequestBody Map<String, Object> callback) {
        try {
            // Process payment callback and generate voucher
            HotspotVoucher voucher = voucherService.processPaymentCallback(callback);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment processed successfully");
            response.put("voucherCode", voucher.getVoucherCode());
            response.put("package", voucher.getPackageEntity());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to handle payment callback", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process payment"));
        }
    }

    // ==================== STATISTICS ====================

    @GetMapping("/statistics")
    @Operation(summary = "Get hotspot statistics", description = "Get hotspot usage statistics")
    public ResponseEntity<Map<String, Object>> getHotspotStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();
            
            // Get voucher statistics
            Map<String, Object> voucherStats = voucherService.getVoucherStatistics();
            statistics.put("voucherStats", voucherStats);
            
            // Get session statistics
            Map<String, Object> sessionStats = sessionService.getSessionStatistics();
            statistics.put("sessionStats", sessionStats);
            
            // Get package statistics
            Map<String, Object> packageStats = packageService.getPackageStatistics();
            statistics.put("packageStats", packageStats);

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Failed to get hotspot statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get statistics"));
        }
    }
} 