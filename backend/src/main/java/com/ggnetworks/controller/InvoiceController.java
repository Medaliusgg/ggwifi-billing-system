package com.ggnetworks.controller;

import com.ggnetworks.entity.Invoice;
import com.ggnetworks.service.InvoiceService;
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
@RequestMapping("/api/v1/admin/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

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
    public ResponseEntity<Map<String, Object>> getAllInvoices() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Invoice> invoices = invoiceService.getAllInvoices();
            response.put("status", "success");
            response.put("message", "Invoices retrieved successfully");
            response.put("data", invoices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInvoiceById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Invoice> invoice = invoiceService.getInvoiceById(id);
            if (invoice.isPresent()) {
                response.put("status", "success");
                response.put("message", "Invoice retrieved successfully");
                response.put("data", invoice.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Invoice not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoice: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<Map<String, Object>> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Invoice> invoice = invoiceService.getInvoiceByInvoiceNumber(invoiceNumber);
            if (invoice.isPresent()) {
                response.put("status", "success");
                response.put("message", "Invoice retrieved successfully");
                response.put("data", invoice.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Invoice not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoice: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Map<String, Object>> getInvoicesByCustomerId(@PathVariable Long customerId) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Invoice> invoices = invoiceService.getInvoicesByCustomerId(customerId);
            response.put("status", "success");
            response.put("message", "Invoices retrieved successfully");
            response.put("data", invoices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getInvoicesByStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Invoice.InvoiceStatus invoiceStatus = Invoice.InvoiceStatus.valueOf(status.toUpperCase());
            List<Invoice> invoices = invoiceService.getInvoicesByStatus(invoiceStatus);
            response.put("status", "success");
            response.put("message", "Invoices retrieved successfully");
            response.put("data", invoices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/paid")
    public ResponseEntity<Map<String, Object>> getPaidInvoices() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Invoice> invoices = invoiceService.getPaidInvoices();
            response.put("status", "success");
            response.put("message", "Paid invoices retrieved successfully");
            response.put("data", invoices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve paid invoices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/unpaid")
    public ResponseEntity<Map<String, Object>> getUnpaidInvoices() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Invoice> invoices = invoiceService.getUnpaidInvoices();
            response.put("status", "success");
            response.put("message", "Unpaid invoices retrieved successfully");
            response.put("data", invoices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve unpaid invoices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getInvoiceStatistics() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> statistics = invoiceService.getInvoiceStatistics();
            response.put("status", "success");
            response.put("message", "Invoice statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve invoice statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


