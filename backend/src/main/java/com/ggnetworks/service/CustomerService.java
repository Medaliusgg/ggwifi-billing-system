package com.ggnetworks.service;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    /**
     * Get all customers
     */
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    /**
     * Get customer by ID
     */
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    /**
     * Get customer by phone number
     */
    public Optional<Customer> getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber);
    }
    
    /**
     * Get customer by email
     */
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    /**
     * Create new customer
     */
    public Customer createCustomer(Customer customer) {
        // Set timestamps
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        
        return customerRepository.save(customer);
    }
    
    /**
     * Update customer
     */
    public Customer updateCustomer(Customer customer) {
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    
    /**
     * Delete customer
     */
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
    
    /**
     * Get customers by status
     */
    public List<Customer> getCustomersByStatus(Customer.CustomerStatus status) {
        return customerRepository.findByStatus(status);
    }
    
    /**
     * Get active customers
     */
    public List<Customer> getActiveCustomers() {
        return customerRepository.findByIsActiveTrue();
    }
    
    /**
     * Get customer statistics
     */
    public Map<String, Object> getCustomerStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total customers
        long totalCustomers = customerRepository.count();
        stats.put("totalCustomers", totalCustomers);
        
        // Active customers
        long activeCustomers = customerRepository.countByIsActiveTrue();
        stats.put("activeCustomers", activeCustomers);
        
        // Inactive customers
        long inactiveCustomers = totalCustomers - activeCustomers;
        stats.put("inactiveCustomers", inactiveCustomers);
        
        return stats;
    }
}


