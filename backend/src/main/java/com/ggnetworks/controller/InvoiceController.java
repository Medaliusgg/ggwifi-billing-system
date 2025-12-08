package com.ggnetworks.controller;

import com.ggnetworks.entity.Invoice;
import com.ggnetworks.service.InvoiceService;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

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

    @GetMapping("/{id}/pdf")
    public ResponseEntity<Map<String, Object>> generateInvoicePdf(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);
            if (!invoiceOpt.isPresent()) {
                response.put("status", "error");
                response.put("message", "Invoice not found");
                return ResponseEntity.status(404).body(response);
            }

            String pdfContent = invoiceService.generateInvoicePdfContent(invoiceOpt.get());
            response.put("status", "success");
            response.put("message", "Invoice PDF generated successfully");
            response.put("data", Map.of("html", pdfContent, "invoiceId", id));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to generate PDF: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/template")
    public ResponseEntity<Map<String, Object>> getInvoiceTemplate() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> template = invoiceService.getInvoiceTemplate();
            response.put("status", "success");
            response.put("message", "Invoice template retrieved");
            response.put("data", template);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve template: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInvoice(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("INVOICE_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            // Validate required fields
            if (!request.containsKey("customerId") || request.get("customerId") == null) {
                response.put("status", "error");
                response.put("message", "customerId is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (!request.containsKey("amount") || request.get("amount") == null) {
                response.put("status", "error");
                response.put("message", "amount is required");
                return ResponseEntity.badRequest().body(response);
            }

            Invoice invoice = new Invoice();
            
            // Set customer (required)
            Long customerId = Long.valueOf(request.get("customerId").toString());
            invoice.setCustomerId(customerId);
            
            // Set package (optional)
            if (request.containsKey("packageId") && request.get("packageId") != null) {
                Long packageId = Long.valueOf(request.get("packageId").toString());
                invoice.setPackageId(packageId);
            }
            
            // Set amounts (amount is required)
            invoice.setAmount(new java.math.BigDecimal(request.get("amount").toString()));
            if (request.containsKey("totalAmount") && request.get("totalAmount") != null) {
                invoice.setTotalAmount(new java.math.BigDecimal(request.get("totalAmount").toString()));
            } else {
                invoice.setTotalAmount(invoice.getAmount());
            }
            if (request.containsKey("taxAmount") && request.get("taxAmount") != null) {
                invoice.setTaxAmount(new java.math.BigDecimal(request.get("taxAmount").toString()));
            }
            if (request.containsKey("discountAmount") && request.get("discountAmount") != null) {
                invoice.setDiscountAmount(new java.math.BigDecimal(request.get("discountAmount").toString()));
            }
            
            // Set currency (default to TZS)
            if (request.containsKey("currency") && request.get("currency") != null) {
                invoice.setCurrency(request.get("currency").toString());
            } else {
                invoice.setCurrency("TZS");
            }
            
            // Set status (default to PENDING)
            if (request.containsKey("status") && request.get("status") != null) {
                try {
                    invoice.setStatus(Invoice.InvoiceStatus.valueOf(request.get("status").toString().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    response.put("status", "error");
                    response.put("message", "Invalid status. Valid values: PENDING, PAID, UNPAID, OVERDUE, CANCELLED, REFUNDED, PARTIALLY_PAID");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                invoice.setStatus(Invoice.InvoiceStatus.PENDING);
            }
            
            // Set optional fields
            if (request.containsKey("notes") && request.get("notes") != null) {
                invoice.setNotes(request.get("notes").toString());
            }
            if (request.containsKey("phoneNumber") && request.get("phoneNumber") != null) {
                invoice.setPhoneNumber(request.get("phoneNumber").toString());
            }
            if (request.containsKey("email") && request.get("email") != null) {
                invoice.setEmail(request.get("email").toString());
            }
            
            Invoice created = invoiceService.createInvoice(invoice);
            response.put("status", "success");
            response.put("message", "Invoice created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            response.put("status", "error");
            response.put("message", "Invalid number format: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create invoice: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


