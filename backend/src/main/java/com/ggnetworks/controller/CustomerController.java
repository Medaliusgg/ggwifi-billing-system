package com.ggnetworks.controller;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.service.CustomerService;
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
@RequestMapping("/admin/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

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
    public ResponseEntity<Map<String, Object>> getAllCustomers() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Customer> customers = customerService.getAllCustomers();
            response.put("status", "success");
            response.put("message", "Customers retrieved successfully");
            response.put("data", customers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCustomerById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Customer> customer = customerService.getCustomerById(id);
            if (customer.isPresent()) {
                response.put("status", "success");
                response.put("message", "Customer retrieved successfully");
                response.put("data", customer.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Customer not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Map<String, Object>> getCustomerByPhoneNumber(@PathVariable String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Customer> customer = customerService.getCustomerByPhoneNumber(phoneNumber);
            if (customer.isPresent()) {
                response.put("status", "success");
                response.put("message", "Customer retrieved successfully");
                response.put("data", customer.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Customer not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Map<String, Object>> getCustomerByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Customer> customer = customerService.getCustomerByEmail(email);
            if (customer.isPresent()) {
                response.put("status", "success");
                response.put("message", "Customer retrieved successfully");
                response.put("data", customer.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Customer not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveCustomers() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            List<Customer> customers = customerService.getActiveCustomers();
            response.put("status", "success");
            response.put("message", "Active customers retrieved successfully");
            response.put("data", customers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve active customers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getCustomerStatistics() {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_READ");
        if (permissionCheck != null) return permissionCheck;

        try {
            Map<String, Object> statistics = customerService.getCustomerStatistics();
            response.put("status", "success");
            response.put("message", "Customer statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve customer statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


