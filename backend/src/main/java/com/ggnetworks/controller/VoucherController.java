package com.ggnetworks.controller;

import com.ggnetworks.entity.Voucher;
import com.ggnetworks.service.VoucherService;
import com.ggnetworks.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

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
            Optional<Voucher> voucher = voucherService.getVoucherByCode(id.toString());
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
}


