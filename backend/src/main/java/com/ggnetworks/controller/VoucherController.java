package com.ggnetworks.controller;

import com.ggnetworks.entity.Voucher;
import com.ggnetworks.service.VoucherService;
import com.ggnetworks.service.PermissionService;
import com.ggnetworks.service.FreeRadiusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private FreeRadiusService freeRadiusService;

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
    public ResponseEntity<Map<String, Object>> getAllVouchers() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.getAllVouchers();
            response.put("status", "success");
            response.put("message", "Vouchers retrieved successfully");
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVoucherById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Voucher> voucher = voucherService.getVoucherById(id);
            if (voucher.isPresent()) {
                response.put("status", "success");
                response.put("message", "Voucher retrieved successfully");
                response.put("data", voucher.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Voucher not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/code/{voucherCode}")
    public ResponseEntity<Map<String, Object>> getVoucherByCode(@PathVariable String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Voucher> voucher = voucherService.getVoucherByCode(voucherCode);
            if (voucher.isPresent()) {
                response.put("status", "success");
                response.put("message", "Voucher retrieved successfully");
                response.put("data", voucher.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Voucher not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Map<String, Object>> getVouchersByPhoneNumber(@PathVariable String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.getVouchersByCustomerPhone(phoneNumber);
            response.put("status", "success");
            response.put("message", "Vouchers retrieved successfully");
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveVouchers() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.getActiveVouchers();
            response.put("status", "success");
            response.put("message", "Active vouchers retrieved successfully");
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve active vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/unused")
    public ResponseEntity<Map<String, Object>> getUnusedVouchers() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.getUnusedVouchers();
            response.put("status", "success");
            response.put("message", "Unused vouchers retrieved successfully");
            response.put("data", vouchers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve unused vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVoucher(@RequestBody Map<String, Object> voucherData) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            Long packageId = Long.valueOf(voucherData.get("packageId").toString());
            BigDecimal amount = new BigDecimal(voucherData.get("amount").toString());
            String customerName = (String) voucherData.get("customerName");
            String customerPhone = (String) voucherData.get("customerPhone");
            String customerEmail = (String) voucherData.getOrDefault("customerEmail", "");

            String voucherCode = voucherService.generateVoucherCode(packageId);
            Voucher voucher = voucherService.createVoucher(voucherCode, packageId, amount, customerName, customerPhone, customerEmail);

            response.put("status", "success");
            response.put("message", "Voucher created successfully");
            response.put("data", voucher);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/sessions/active")
    public ResponseEntity<Map<String, Object>> getActiveVoucherSessions() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            // Get active RADIUS sessions (which represent active voucher sessions)
            List<Map<String, Object>> activeSessions = freeRadiusService.getActiveRadiusSessions();
            
            // Enrich with voucher details
            List<Map<String, Object>> enrichedSessions = new ArrayList<>();
            for (Map<String, Object> session : activeSessions) {
                String username = (String) session.get("username");
                if (username != null && username.contains("_")) {
                    String[] parts = username.split("_");
                    if (parts.length >= 2) {
                        String phoneNumber = parts[0];
                        String voucherCode = parts[1];
                        
                        Optional<Voucher> voucherOpt = voucherService.getVoucherByCode(voucherCode);
                        if (voucherOpt.isPresent()) {
                            Voucher voucher = voucherOpt.get();
                            Map<String, Object> enriched = new HashMap<>(session);
                            enriched.put("voucherCode", voucherCode);
                            enriched.put("customerPhone", phoneNumber);
                            enriched.put("customerName", voucher.getCustomerName());
                            enriched.put("packageId", voucher.getPackageId());
                            enriched.put("packageName", voucher.getPackageName());
                            enriched.put("amount", voucher.getAmount());
                            enriched.put("activatedAt", voucher.getActivatedAt());
                            enrichedSessions.add(enriched);
                        }
                    }
                }
            }
            
            response.put("status", "success");
            response.put("message", "Active voucher sessions retrieved successfully");
            response.put("data", enrichedSessions);
            response.put("count", enrichedSessions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve active voucher sessions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{voucherCode}/use")
    public ResponseEntity<Map<String, Object>> markVoucherAsUsed(@PathVariable String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_WRITE");
        if (permissionCheck != null) return permissionCheck;

        try {
            boolean success = voucherService.markVoucherAsUsed(voucherCode);
            if (success) {
                response.put("status", "success");
                response.put("message", "Voucher marked as used successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Voucher not found or already used");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to mark voucher as used: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> createBulkVouchers(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            int quantity = (Integer) request.getOrDefault("quantity", 1);
            Long packageId = Long.valueOf(request.get("packageId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String customerName = (String) request.getOrDefault("customerName", "Pre-Generated");
            String customerPhone = (String) request.getOrDefault("customerPhone", "");
            String customerEmail = (String) request.getOrDefault("customerEmail", "");

            if (quantity < 1 || quantity > 1000) {
                response.put("status", "error");
                response.put("message", "Quantity must be between 1 and 1000");
                return ResponseEntity.badRequest().body(response);
            }

            List<Voucher> vouchers = voucherService.createBulkVouchers(
                quantity, packageId, amount, customerName, customerPhone, customerEmail);

            response.put("status", "success");
            response.put("message", "Bulk vouchers created successfully");
            response.put("data", vouchers);
            response.put("count", vouchers.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create bulk vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/template")
    public ResponseEntity<Map<String, Object>> createVouchersFromTemplate(@RequestBody Map<String, Object> template) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.createVouchersFromTemplate(template);
            response.put("status", "success");
            response.put("message", "Vouchers created from template successfully");
            response.put("data", vouchers);
            response.put("count", vouchers.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create vouchers from template: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getVoucherStatistics() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> stats = voucherService.getVoucherStatistics();
            response.put("status", "success");
            response.put("message", "Voucher statistics retrieved successfully");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve voucher statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getVoucherAnalytics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
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
            
            Map<String, Object> analytics = voucherService.getVoucherAnalytics(start, end);
            response.put("status", "success");
            response.put("message", "Voucher analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getVouchersByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Voucher.VoucherStatus voucherStatus = Voucher.VoucherStatus.valueOf(status.toUpperCase());
            List<Voucher> vouchers = voucherService.getVouchersByStatus(voucherStatus);
            response.put("status", "success");
            response.put("message", "Vouchers retrieved successfully");
            response.put("data", vouchers);
            response.put("count", vouchers.size());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", "Invalid status: " + status);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/package/{packageId}")
    public ResponseEntity<Map<String, Object>> getVouchersByPackage(@PathVariable Long packageId) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Voucher> vouchers = voucherService.getVouchersByPackage(packageId);
            response.put("status", "success");
            response.put("message", "Vouchers retrieved successfully");
            response.put("data", vouchers);
            response.put("count", vouchers.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{voucherCode}")
    public ResponseEntity<Map<String, Object>> deleteUnusedVoucher(@PathVariable String voucherCode) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("VOUCHER_DELETE");
        if (permissionCheck != null) return permissionCheck;

        try {
            boolean deleted = voucherService.deleteUnusedVoucher(voucherCode);
            if (deleted) {
                response.put("status", "success");
                response.put("message", "Voucher deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Voucher not found or already used");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete voucher: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


