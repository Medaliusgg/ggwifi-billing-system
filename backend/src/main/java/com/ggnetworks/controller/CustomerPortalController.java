package com.ggnetworks.controller;

import com.ggnetworks.entity.HotspotSession;
import com.ggnetworks.entity.HotspotVoucher;
import com.ggnetworks.entity.Package;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.entity.Promotion;
import com.ggnetworks.entity.Location;
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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Slf4j
@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@Tag(name = "Customer Portal", description = "Customer self-service portal endpoints")
public class CustomerPortalController {

    // ==================== SERVICE DEPENDENCIES ====================
    private final PackageService packageService;
    private final LocationService locationService;
    private final PromotionService promotionService;
    private final VoucherService voucherService;
    private final PaymentService paymentService;
    private final UserService userService;
    private final HotspotSessionService sessionService;

    // ==================== PACKAGE MANAGEMENT ====================

    /**
     * Get available hotspot packages for customer portal
     * Customer portal retrieves packages created by admin
     */
    @GetMapping("/packages/hotspot")
    @Operation(summary = "Get available hotspot packages", description = "Retrieve all active hotspot packages for customer purchase")
    public ResponseEntity<Map<String, Object>> getHotspotPackages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            log.info("Fetching hotspot packages for customer portal");
            Pageable pageable = PageRequest.of(page, size);
            Page<Package> packages = packageService.getHotspotPackages(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("packages", packages.getContent());
            response.put("totalElements", packages.getTotalElements());
            response.put("totalPages", packages.getTotalPages());
            response.put("currentPage", packages.getNumber());
            response.put("message", "Hotspot packages retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get hotspot packages for customer portal", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve packages"));
        }
    }

    /**
     * Get popular hotspot packages
     * Customer portal displays popular packages created by admin
     */
    @GetMapping("/packages/hotspot/popular")
    @Operation(summary = "Get popular hotspot packages", description = "Retrieve popular hotspot packages for customer portal")
    public ResponseEntity<Map<String, Object>> getPopularHotspotPackages() {
        try {
            log.info("Fetching popular hotspot packages for customer portal");
            List<Package> packages = packageService.getPopularHotspotPackages();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("packages", packages);
            response.put("message", "Popular packages retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get popular hotspot packages", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve popular packages"));
        }
    }

    /**
     * Get package by ID for customer portal
     */
    @GetMapping("/packages/{packageId}")
    @Operation(summary = "Get package by ID", description = "Get specific package details for customer portal")
    public ResponseEntity<Map<String, Object>> getPackageById(@PathVariable Long packageId) {
        try {
            log.info("Fetching package details for ID: {}", packageId);
            Package packageDetails = packageService.getPackageById(packageId);
            
            if (packageDetails == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("package", packageDetails);
            response.put("message", "Package details retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get package by ID: {}", packageId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve package details"));
        }
    }

    // ==================== COVERAGE MANAGEMENT ====================

    /**
     * Get coverage areas for customer portal
     * Customer portal retrieves coverage information
     */
    @GetMapping("/coverage/areas")
    @Operation(summary = "Get coverage areas", description = "Get all active coverage areas for customer portal")
    public ResponseEntity<Map<String, Object>> getCoverageAreas() {
        try {
            log.info("Fetching coverage areas for customer portal");
            List<Location> coverageAreas = locationService.getActiveLocations();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("coverageAreas", coverageAreas);
            response.put("message", "Coverage areas retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get coverage areas", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve coverage areas"));
        }
    }

    /**
     * Check coverage availability for customer location
     */
    @PostMapping("/coverage/check")
    @Operation(summary = "Check coverage availability", description = "Check if customer location has coverage")
    public ResponseEntity<Map<String, Object>> checkCoverageAvailability(
            @RequestBody Map<String, String> request) {
        
        try {
            String location = request.get("location");
            if (location == null || location.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Location is required"));
            }
            
            log.info("Checking coverage availability for location: {}", location);
            boolean hasCoverage = locationService.checkCoverageAvailability(location);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasCoverage", hasCoverage);
            response.put("location", location);
            response.put("message", hasCoverage ? "Coverage available" : "No coverage available");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to check coverage availability", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to check coverage"));
        }
    }

    /**
     * Get coverage areas by city
     */
    @GetMapping("/coverage/city/{city}")
    @Operation(summary = "Get coverage by city", description = "Get coverage areas for specific city")
    public ResponseEntity<Map<String, Object>> getCoverageByCity(@PathVariable String city) {
        try {
            log.info("Fetching coverage areas for city: {}", city);
            List<Location> coverageAreas = locationService.getLocationsByCity(city);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("coverageAreas", coverageAreas);
            response.put("city", city);
            response.put("message", "Coverage areas for city retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get coverage by city: {}", city, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve coverage for city"));
        }
    }

    // ==================== CAMPAIGN MANAGEMENT ====================

    /**
     * Get active promotions/campaigns for customer portal
     * Customer portal retrieves campaigns created by admin
     */
    @GetMapping("/promotions")
    @Operation(summary = "Get active promotions", description = "Get active promotions and campaigns for customer portal")
    public ResponseEntity<Map<String, Object>> getActivePromotions() {
        try {
            log.info("Fetching active promotions for customer portal");
            List<Promotion> promotions = promotionService.getActivePromotions();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("promotions", promotions);
            response.put("message", "Active promotions retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get active promotions", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve promotions"));
        }
    }

    /**
     * Get promotion by ID
     */
    @GetMapping("/promotions/{promotionId}")
    @Operation(summary = "Get promotion by ID", description = "Get specific promotion details")
    public ResponseEntity<Map<String, Object>> getPromotionById(@PathVariable Long promotionId) {
        try {
            log.info("Fetching promotion details for ID: {}", promotionId);
            Promotion promotion = promotionService.getPromotionById(promotionId);
            
            if (promotion == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("promotion", promotion);
            response.put("message", "Promotion details retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get promotion by ID: {}", promotionId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve promotion details"));
        }
    }

    // ==================== VOUCHER MANAGEMENT ====================

    /**
     * Validate voucher code for customer portal
     */
    @PostMapping("/vouchers/validate")
    @Operation(summary = "Validate voucher code", description = "Validate a voucher code for hotspot access")
    public ResponseEntity<Map<String, Object>> validateVoucher(
            @RequestBody Map<String, String> request) {
        
        try {
            String voucherCode = request.get("voucherCode");
            String macAddress = request.get("macAddress");
            String ipAddress = request.get("ipAddress");

            if (voucherCode == null || voucherCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Voucher code is required"));
            }

            log.info("Validating voucher code: {}", voucherCode);
            VoucherService.VoucherValidationResult result = voucherService.validateVoucher(voucherCode, macAddress, ipAddress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result.isValid());
            response.put("message", result.getMessage());
            
            if (result.isValid()) {
                response.put("voucherId", result.getVoucherId());
                response.put("packageId", result.getPackageId());
                response.put("packageName", result.getPackageName());
                response.put("durationDays", result.getDurationDays());
                response.put("bandwidthLimitMb", result.getBandwidthLimitMb());
                response.put("price", result.getPrice());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to validate voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to validate voucher"));
        }
    }

    /**
     * Activate voucher for customer portal
     */
    @PostMapping("/vouchers/activate")
    @Operation(summary = "Activate voucher", description = "Activate a voucher for hotspot access")
    public ResponseEntity<Map<String, Object>> activateVoucher(
            @RequestBody Map<String, String> request) {
        
        try {
            String voucherCode = request.get("voucherCode");
            String macAddress = request.get("macAddress");
            String ipAddress = request.get("ipAddress");

            if (voucherCode == null || voucherCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Voucher code is required"));
            }

            log.info("Activating voucher code: {}", voucherCode);
            boolean activated = voucherService.activateVoucher(voucherCode, macAddress, ipAddress);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", activated);
            response.put("message", activated ? "Voucher activated successfully" : "Failed to activate voucher");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to activate voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to activate voucher"));
        }
    }

    /**
     * Purchase voucher for customer portal
     */
    @PostMapping("/vouchers/purchase")
    @Operation(summary = "Purchase voucher", description = "Purchase a voucher using payment gateway")
    public ResponseEntity<Map<String, Object>> purchaseVoucher(
            @RequestBody Map<String, Object> request) {
        
        try {
            Long packageId = Long.valueOf(request.get("packageId").toString());
            String phoneNumber = (String) request.get("phoneNumber");
            String paymentMethod = (String) request.get("paymentMethod");
            String macAddress = (String) request.get("macAddress");
            String ipAddress = (String) request.get("ipAddress");

            if (packageId == null || phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Package ID and phone number are required"));
            }

            log.info("Processing voucher purchase for package ID: {} and phone: {}", packageId, phoneNumber);
            // Placeholder implementation - will be implemented with proper payment integration
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voucher purchase endpoint ready - implementation pending");
            response.put("packageId", packageId);
            response.put("phoneNumber", phoneNumber);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to purchase voucher", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to process voucher purchase"));
        }
    }

    /**
     * Get voucher history for customer
     */
    @GetMapping("/vouchers/history")
    @Operation(summary = "Get voucher history", description = "Get user's voucher usage history")
    public ResponseEntity<Map<String, Object>> getVoucherHistory(
            @RequestParam String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Phone number is required"));
            }

            log.info("Fetching voucher history for phone: {}", phoneNumber);
            Pageable pageable = PageRequest.of(page, size);
            Page<HotspotVoucher> vouchers = voucherService.getVoucherHistoryByUser(phoneNumber, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("vouchers", vouchers.getContent());
            response.put("totalElements", vouchers.getTotalElements());
            response.put("totalPages", vouchers.getTotalPages());
            response.put("currentPage", vouchers.getNumber());
            response.put("message", "Voucher history retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get voucher history", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve voucher history"));
        }
    }

    // ==================== SESSION MANAGEMENT ====================

    /**
     * Get active sessions for customer
     */
    @GetMapping("/sessions/active")
    @Operation(summary = "Get active sessions", description = "Get user's active hotspot sessions")
    public ResponseEntity<Map<String, Object>> getActiveSessions(
            @RequestParam String phoneNumber) {
        
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Phone number is required"));
            }

            log.info("Fetching active sessions for phone: {}", phoneNumber);
            // Placeholder implementation - will be implemented with proper session service
            List<HotspotSession> sessions = new ArrayList<>();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessions", sessions);
            response.put("message", "Active sessions retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get active sessions", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve active sessions"));
        }
    }

    /**
     * Disconnect session for customer
     */
    @PostMapping("/sessions/disconnect")
    @Operation(summary = "Disconnect session", description = "Disconnect an active hotspot session")
    public ResponseEntity<Map<String, Object>> disconnectSession(
            @RequestBody Map<String, String> request) {
        
        try {
            String sessionId = request.get("sessionId");
            String phoneNumber = request.get("phoneNumber");

            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Session ID is required"));
            }

            log.info("Disconnecting session: {} for phone: {}", sessionId, phoneNumber);
            // Placeholder implementation - will be implemented with proper session service
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Session disconnect endpoint ready - implementation pending");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to disconnect session", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to disconnect session"));
        }
    }

    // ==================== PAYMENT MANAGEMENT ====================

    /**
     * Get payment history for customer
     */
    @GetMapping("/payments/history")
    @Operation(summary = "Get payment history", description = "Get user's payment history")
    public ResponseEntity<Map<String, Object>> getPaymentHistory(
            @RequestParam String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Phone number is required"));
            }

            log.info("Fetching payment history for phone: {}", phoneNumber);
            Pageable pageable = PageRequest.of(page, size);
            Page<Payment> payments = paymentService.getPaymentHistoryByUser(phoneNumber, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payments", payments.getContent());
            response.put("totalElements", payments.getTotalElements());
            response.put("totalPages", payments.getTotalPages());
            response.put("currentPage", payments.getNumber());
            response.put("message", "Payment history retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get payment history", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve payment history"));
        }
    }

    /**
     * Get payment methods for customer
     */
    @GetMapping("/payment-methods")
    @Operation(summary = "Get payment methods", description = "Get available payment methods")
    public ResponseEntity<Map<String, Object>> getPaymentMethods() {
        try {
            log.info("Fetching available payment methods");
            // Placeholder implementation - will be implemented with proper payment service
            Map<String, Object> paymentMethods = Map.of(
                "mobileMoney", List.of("M-Pesa", "Airtel Money", "Tigo Pesa"),
                "bankTransfer", List.of("CRDB Bank", "NMB Bank"),
                "cash", List.of("Cash Payment")
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentMethods", paymentMethods);
            response.put("message", "Payment methods retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get payment methods", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve payment methods"));
        }
    }

    /**
     * Verify payment for customer
     */
    @GetMapping("/payments/verify/{transactionId}")
    @Operation(summary = "Verify payment", description = "Verify payment status by transaction ID")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @PathVariable String transactionId) {
        
        try {
            if (transactionId == null || transactionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Transaction ID is required"));
            }

            log.info("Verifying payment for transaction: {}", transactionId);
            // Placeholder implementation - will be implemented with proper payment service
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", "PENDING");
            response.put("message", "Payment verification endpoint ready - implementation pending");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to verify payment", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to verify payment"));
        }
    }

    // ==================== USER PROFILE MANAGEMENT ====================

    /**
     * Get user profile for customer portal
     */
    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Get user profile information")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestParam String phoneNumber) {
        try {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Phone number is required"));
            }

            log.info("Fetching user profile for phone: {}", phoneNumber);
            User user = userService.getUserByPhoneNumber(phoneNumber);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            response.put("message", "User profile retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get user profile", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve user profile"));
        }
    }

    /**
     * Update user profile for customer portal
     */
    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update user profile information")
    public ResponseEntity<Map<String, Object>> updateUserProfile(
            @RequestBody Map<String, String> request) {
        
        try {
            String phoneNumber = request.get("phoneNumber");
            String fullName = request.get("fullName");
            String email = request.get("email");

            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Phone number is required"));
            }

            log.info("Updating user profile for phone: {}", phoneNumber);
            // Placeholder implementation - will be implemented with proper user service
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User profile update endpoint ready - implementation pending");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to update user profile", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to update user profile"));
        }
    }

    // ==================== SYSTEM STATUS ====================

    /**
     * Get system status for customer portal
     */
    @GetMapping("/status")
    @Operation(summary = "Get system status", description = "Get current system status and statistics")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        try {
            log.info("Fetching system status for customer portal");
            
            Map<String, Object> status = new HashMap<>();
            status.put("success", true);
            status.put("systemStatus", "OPERATIONAL");
            status.put("lastUpdated", java.time.LocalDateTime.now());
            status.put("message", "System is operational");
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Failed to get system status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to retrieve system status"));
        }
    }
} 