package com.ggnetworks.controller;

import com.ggnetworks.entity.*;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin/customers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Customer Management", description = "Comprehensive customer management for both Hotspot and PPPoE users")
public class AdminCustomerController {

    private final CustomerProfileService customerProfileService;
    private final DeviceHistoryService deviceHistoryService;
    private final MarketingCommunicationService marketingCommunicationService;
    private final HotspotSessionService hotspotSessionService;
    private final PaymentService paymentService;
    private final InternetApplicationFormService applicationFormService;

    // ==================== CUSTOMER SEARCH & PROFILES ====================

    @GetMapping("/search")
    @Operation(summary = "Search customers by phone number", description = "Search and get comprehensive customer profile by phone number")
    public ResponseEntity<Map<String, Object>> searchCustomerByPhone(@RequestParam String phoneNumber) {
        try {
            Map<String, Object> customerData = customerProfileService.getCustomerProfileByPhone(phoneNumber);
            
            if (customerData.containsKey("error")) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(customerData);
        } catch (Exception e) {
            log.error("Failed to search customer by phone number: {}", phoneNumber, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to search customer"));
        }
    }

    @GetMapping("/by-type/{customerType}")
    @Operation(summary = "Get customers by type", description = "Get all customers filtered by type (HOTSPOT_USER, PPPOE_USER, BOTH)")
    public ResponseEntity<Map<String, Object>> getCustomersByType(
            @PathVariable String customerType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            CustomerProfile.CustomerType type = CustomerProfile.CustomerType.valueOf(customerType.toUpperCase());
            Pageable pageable = PageRequest.of(page, size);
            
            Page<CustomerProfile> customers = customerProfileService.getCustomersByTypePaged(type, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("customers", customers.getContent());
            response.put("totalElements", customers.getTotalElements());
            response.put("totalPages", customers.getTotalPages());
            response.put("currentPage", customers.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get customers by type: {}", customerType, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customers"));
        }
    }

    @GetMapping("/{customerId}/profile")
    @Operation(summary = "Get detailed customer profile", description = "Get comprehensive customer profile with all related data")
    public ResponseEntity<CustomerProfile> getCustomerProfile(@PathVariable Long customerId) {
        try {
            CustomerProfile customerProfile = customerProfileService.getCustomerProfileById(customerId);
            
            if (customerProfile == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(customerProfile);
        } catch (Exception e) {
            log.error("Failed to get customer profile: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== DEVICE MANAGEMENT ====================

    @GetMapping("/devices/suspicious")
    @Operation(summary = "Get suspicious devices", description = "Get all devices flagged for MAC randomization")
    public ResponseEntity<List<DeviceHistory>> getSuspiciousDevices() {
        try {
            List<DeviceHistory> suspiciousDevices = customerProfileService.getSuspiciousDevices();
            return ResponseEntity.ok(suspiciousDevices);
        } catch (Exception e) {
            log.error("Failed to get suspicious devices", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{customerId}/devices")
    @Operation(summary = "Get customer devices", description = "Get all devices associated with a customer")
    public ResponseEntity<List<DeviceHistory>> getCustomerDevices(@PathVariable Long customerId) {
        try {
            List<DeviceHistory> devices = deviceHistoryService.getDevicesByCustomerId(customerId);
            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            log.error("Failed to get customer devices: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/devices/{deviceId}/status")
    @Operation(summary = "Update device status", description = "Update device status (ACTIVE, SUSPICIOUS, BANNED, WHITELISTED)")
    public ResponseEntity<DeviceHistory> updateDeviceStatus(
            @PathVariable Long deviceId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            DeviceHistory.DeviceStatus deviceStatus = DeviceHistory.DeviceStatus.valueOf(status.toUpperCase());
            
            DeviceHistory updatedDevice = deviceHistoryService.updateDeviceStatus(deviceId, deviceStatus);
            return ResponseEntity.ok(updatedDevice);
        } catch (Exception e) {
            log.error("Failed to update device status: {}", deviceId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== SESSION MANAGEMENT ====================

    @GetMapping("/{customerId}/sessions")
    @Operation(summary = "Get customer sessions", description = "Get all hotspot sessions for a customer")
    public ResponseEntity<Map<String, Object>> getCustomerSessions(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<HotspotSession> sessions = hotspotSessionService.getSessionsByCustomerId(customerId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessions", sessions.getContent());
            response.put("totalElements", sessions.getTotalElements());
            response.put("totalPages", sessions.getTotalPages());
            response.put("currentPage", sessions.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get customer sessions: {}", customerId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customer sessions"));
        }
    }

    @PostMapping("/sessions/{sessionId}/disconnect")
    @Operation(summary = "Force disconnect session", description = "Force disconnect a specific session")
    public ResponseEntity<Map<String, Object>> forceDisconnectSession(@PathVariable Long sessionId) {
        try {
            boolean disconnected = hotspotSessionService.forceDisconnectSession(sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", disconnected);
            response.put("message", disconnected ? "Session disconnected successfully" : "Failed to disconnect session");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to force disconnect session: {}", sessionId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to disconnect session"));
        }
    }

    // ==================== PAYMENT & TRANSACTION HISTORY ====================

    @GetMapping("/{customerId}/payments")
    @Operation(summary = "Get customer payments", description = "Get all payment history for a customer")
    public ResponseEntity<Map<String, Object>> getCustomerPayments(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Payment> payments = paymentService.getPaymentsByCustomerId(customerId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("payments", payments.getContent());
            response.put("totalElements", payments.getTotalElements());
            response.put("totalPages", payments.getTotalPages());
            response.put("currentPage", payments.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get customer payments: {}", customerId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customer payments"));
        }
    }

    // ==================== APPLICATION FORMS (PPPoE) ====================

    @GetMapping("/{customerId}/applications")
    @Operation(summary = "Get customer applications", description = "Get all PPPoE application forms for a customer")
    public ResponseEntity<List<InternetApplicationForm>> getCustomerApplications(@PathVariable Long customerId) {
        try {
            List<InternetApplicationForm> applications = applicationFormService.getApplicationsByCustomerId(customerId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            log.error("Failed to get customer applications: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== MARKETING & COMMUNICATIONS ====================

    @GetMapping("/{customerId}/communications")
    @Operation(summary = "Get customer communications", description = "Get all marketing communications sent to a customer")
    public ResponseEntity<Map<String, Object>> getCustomerCommunications(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<MarketingCommunication> communications = marketingCommunicationService
                    .getCommunicationsByCustomerId(customerId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("communications", communications.getContent());
            response.put("totalElements", communications.getTotalElements());
            response.put("totalPages", communications.getTotalPages());
            response.put("currentPage", communications.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get customer communications: {}", customerId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customer communications"));
        }
    }

    @PostMapping("/{customerId}/send-message")
    @Operation(summary = "Send marketing message", description = "Send a marketing message to a customer")
    public ResponseEntity<MarketingCommunication> sendMarketingMessage(
            @PathVariable Long customerId,
            @RequestBody Map<String, Object> request) {
        try {
            String phoneNumber = (String) request.get("phoneNumber");
            String type = (String) request.get("type");
            String channel = (String) request.get("channel");
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            MarketingCommunication.CommunicationType communicationType = 
                    MarketingCommunication.CommunicationType.valueOf(type.toUpperCase());
            MarketingCommunication.Channel communicationChannel = 
                    MarketingCommunication.Channel.valueOf(channel.toUpperCase());
            
            MarketingCommunication communication = customerProfileService.sendMarketingCommunication(
                    phoneNumber, communicationType, communicationChannel, subject, message);
            
            return ResponseEntity.ok(communication);
        } catch (Exception e) {
            log.error("Failed to send marketing message to customer: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== LOYALTY & REWARDS ====================

    @PostMapping("/{customerId}/loyalty/points")
    @Operation(summary = "Update loyalty points", description = "Add or subtract loyalty points for a customer")
    public ResponseEntity<CustomerProfile> updateLoyaltyPoints(
            @PathVariable Long customerId,
            @RequestBody Map<String, Object> request) {
        try {
            String phoneNumber = (String) request.get("phoneNumber");
            Integer points = (Integer) request.get("points");
            
            CustomerProfile updatedProfile = customerProfileService.updateLoyaltyPoints(phoneNumber, points);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            log.error("Failed to update loyalty points for customer: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== EXPORT & REPORTING ====================

    @GetMapping("/export/marketing/{customerType}")
    @Operation(summary = "Export customer data for marketing", description = "Export customer data for marketing campaigns")
    public ResponseEntity<List<Map<String, Object>>> exportCustomerDataForMarketing(@PathVariable String customerType) {
        try {
            CustomerProfile.CustomerType type = CustomerProfile.CustomerType.valueOf(customerType.toUpperCase());
            List<Map<String, Object>> exportData = customerProfileService.exportCustomerDataForMarketing(type);
            return ResponseEntity.ok(exportData);
        } catch (Exception e) {
            log.error("Failed to export customer data for marketing: {}", customerType, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get customer statistics", description = "Get comprehensive customer statistics")
    public ResponseEntity<Map<String, Object>> getCustomerStatistics() {
        try {
            Map<String, Object> statistics = customerProfileService.getCustomerStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Failed to get customer statistics", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get customer statistics"));
        }
    }

    // ==================== CUSTOMER MANAGEMENT ====================

    @PutMapping("/{customerId}/status")
    @Operation(summary = "Update customer status", description = "Update customer status (ACTIVE, INACTIVE, SUSPENDED, BANNED)")
    public ResponseEntity<CustomerProfile> updateCustomerStatus(
            @PathVariable Long customerId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            CustomerProfile.CustomerStatus customerStatus = CustomerProfile.CustomerStatus.valueOf(status.toUpperCase());
            
            CustomerProfile updatedProfile = customerProfileService.updateCustomerStatus(customerId, customerStatus);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            log.error("Failed to update customer status: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{customerId}/consent")
    @Operation(summary = "Update marketing consent", description = "Update customer marketing consent preferences")
    public ResponseEntity<CustomerProfile> updateMarketingConsent(
            @PathVariable Long customerId,
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean marketingConsent = request.get("marketingConsent");
            Boolean smsConsent = request.get("smsConsent");
            Boolean emailConsent = request.get("emailConsent");
            
            CustomerProfile updatedProfile = customerProfileService.updateMarketingConsent(
                    customerId, marketingConsent, smsConsent, emailConsent);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            log.error("Failed to update marketing consent for customer: {}", customerId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 