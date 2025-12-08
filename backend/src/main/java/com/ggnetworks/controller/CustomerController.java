package com.ggnetworks.controller;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.service.CustomerService;
import com.ggnetworks.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

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

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCustomer(@RequestBody Map<String, Object> customerData) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_CREATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            Customer customer = new Customer();
            customer.setCustomerId((String) customerData.getOrDefault("customerId", "CUST_" + System.currentTimeMillis()));
            customer.setFirstName((String) customerData.get("firstName"));
            customer.setLastName((String) customerData.get("lastName"));
            customer.setEmail((String) customerData.get("email"));
            customer.setPrimaryPhoneNumber((String) customerData.get("primaryPhoneNumber"));
            if (customerData.containsKey("secondaryPhoneNumber")) {
                customer.setSecondaryPhoneNumber((String) customerData.get("secondaryPhoneNumber"));
            }
            if (customerData.containsKey("status")) {
                customer.setStatus(Customer.CustomerStatus.valueOf(customerData.get("status").toString().toUpperCase()));
            } else {
                customer.setStatus(Customer.CustomerStatus.ACTIVE);
            }
            if (customerData.containsKey("accountType")) {
                customer.setAccountType(Customer.AccountType.valueOf(customerData.get("accountType").toString().toUpperCase()));
            }
            if (customerData.containsKey("emailVerified")) {
                customer.setEmailVerified(Boolean.valueOf(customerData.get("emailVerified").toString()));
            }
            if (customerData.containsKey("phoneVerified")) {
                customer.setPhoneVerified(Boolean.valueOf(customerData.get("phoneVerified").toString()));
            }
            customer.setRegistrationDate(LocalDateTime.now());

            Customer created = customerService.createCustomer(customer);
            response.put("status", "success");
            response.put("message", "Customer created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCustomer(@PathVariable Long id, @RequestBody Map<String, Object> customerData) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_UPDATE");
        if (permissionCheck != null) return permissionCheck;

        try {
            Optional<Customer> customerOpt = customerService.getCustomerById(id);
            if (customerOpt.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Customer not found");
                return ResponseEntity.status(404).body(response);
            }

            Customer customer = customerOpt.get();
            if (customerData.containsKey("firstName")) customer.setFirstName((String) customerData.get("firstName"));
            if (customerData.containsKey("lastName")) customer.setLastName((String) customerData.get("lastName"));
            if (customerData.containsKey("email")) customer.setEmail((String) customerData.get("email"));
            if (customerData.containsKey("primaryPhoneNumber")) customer.setPrimaryPhoneNumber((String) customerData.get("primaryPhoneNumber"));
            if (customerData.containsKey("secondaryPhoneNumber")) customer.setSecondaryPhoneNumber((String) customerData.get("secondaryPhoneNumber"));
            if (customerData.containsKey("status")) {
                customer.setStatus(Customer.CustomerStatus.valueOf(customerData.get("status").toString().toUpperCase()));
            }
            if (customerData.containsKey("accountType")) {
                customer.setAccountType(Customer.AccountType.valueOf(customerData.get("accountType").toString().toUpperCase()));
            }
            if (customerData.containsKey("emailVerified")) {
                customer.setEmailVerified(Boolean.valueOf(customerData.get("emailVerified").toString()));
            }
            if (customerData.containsKey("phoneVerified")) {
                customer.setPhoneVerified(Boolean.valueOf(customerData.get("phoneVerified").toString()));
            }

            Customer updated = customerService.updateCustomer(customer);
            response.put("status", "success");
            response.put("message", "Customer updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        ResponseEntity<Map<String, Object>> permissionCheck = checkPermission("CUSTOMER_DELETE");
        if (permissionCheck != null) return permissionCheck;

        try {
            if (!customerService.getCustomerById(id).isPresent()) {
                response.put("status", "error");
                response.put("message", "Customer not found");
                return ResponseEntity.status(404).body(response);
            }

            customerService.deleteCustomer(id);
            response.put("status", "success");
            response.put("message", "Customer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete customer: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


