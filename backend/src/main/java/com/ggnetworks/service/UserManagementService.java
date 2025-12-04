package com.ggnetworks.service;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.entity.DeviceHistory;
import com.ggnetworks.entity.VoucherSession;
import com.ggnetworks.entity.Invoice;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.repository.CustomerRepository;
import com.ggnetworks.repository.DeviceHistoryRepository;
import com.ggnetworks.repository.VoucherSessionRepository;
import com.ggnetworks.repository.InvoiceRepository;
import com.ggnetworks.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DeviceHistoryRepository deviceHistoryRepository;

    @Autowired
    private VoucherSessionRepository voucherSessionRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeviceManagementService deviceManagementService;

    /**
     * Search users by phone number or MAC address
     */
    public List<Map<String, Object>> searchUsers(String query) {
        List<Map<String, Object>> results = new ArrayList<>();

        // Search by phone number
        Optional<Customer> customerByPhone = customerRepository.findByPhoneNumber(query);
        if (customerByPhone.isPresent()) {
            results.add(buildUserProfile(customerByPhone.get()));
        }

        // Search by MAC address
        Optional<DeviceHistory> deviceOpt = deviceHistoryRepository.findByMacAddress(query);
        if (deviceOpt.isPresent()) {
            DeviceHistory device = deviceOpt.get();
            if (device.getCustomerId() != null) {
                Optional<Customer> customerOpt = customerRepository.findById(device.getCustomerId());
                if (customerOpt.isPresent() && !results.stream().anyMatch(r -> r.get("customerId").equals(customerOpt.get().getId()))) {
                    results.add(buildUserProfile(customerOpt.get()));
                }
            } else if (device.getPhoneNumber() != null) {
                Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(device.getPhoneNumber());
                if (customerOpt.isPresent() && !results.stream().anyMatch(r -> r.get("customerId").equals(customerOpt.get().getId()))) {
                    results.add(buildUserProfile(customerOpt.get()));
                }
            }
        }

        // Search by name (partial match)
        List<Customer> customersByName = customerRepository.findByFirstNameContainingIgnoreCase(query);
        customersByName.addAll(customerRepository.findByLastNameContainingIgnoreCase(query));
        for (Customer customer : customersByName) {
            if (!results.stream().anyMatch(r -> r.get("customerId").equals(customer.getId()))) {
                results.add(buildUserProfile(customer));
            }
        }

        return results;
    }

    /**
     * Get full user profile with all related data
     */
    public Map<String, Object> getUserProfile(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return Map.of("error", "Customer not found");
        }

        Customer customer = customerOpt.get();
        Map<String, Object> profile = buildUserProfile(customer);

        // Add device history
        List<DeviceHistory> devices = deviceHistoryRepository.findByCustomerId(customerId);
        profile.put("deviceHistory", devices);
        profile.put("deviceCount", devices.size());
        profile.put("distinctMacCount", deviceManagementService.countDistinctMacAddresses(customer.getPrimaryPhoneNumber()));

        // Add session history
        List<VoucherSession> sessions = voucherSessionRepository.findByPhoneNumber(customer.getPrimaryPhoneNumber());
        profile.put("sessionHistory", sessions);
        profile.put("totalSessions", sessions.size());
        profile.put("activeSessions", sessions.stream()
            .filter(s -> s.getSessionStatus() == VoucherSession.SessionStatus.ACTIVE)
            .count());

        // Add invoice history
        List<Invoice> invoices = invoiceRepository.findByCustomerId(customerId);
        profile.put("invoiceHistory", invoices);
        profile.put("totalInvoices", invoices.size());

        // Add payment history
        List<Payment> payments = paymentRepository.findByCustomerId(customerId);
        profile.put("paymentHistory", payments);
        profile.put("totalPayments", payments.size());

        return profile;
    }

    /**
     * Get user profile by phone number
     */
    public Map<String, Object> getUserProfileByPhone(String phoneNumber) {
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (!customerOpt.isPresent()) {
            return Map.of("error", "Customer not found");
        }
        return getUserProfile(customerOpt.get().getId());
    }

    /**
     * Build basic user profile map
     */
    private Map<String, Object> buildUserProfile(Customer customer) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("customerId", customer.getId());
        profile.put("phoneNumber", customer.getPrimaryPhoneNumber());
        profile.put("email", customer.getEmail());
        profile.put("fullName", customer.getFullName());
        profile.put("status", customer.getStatus());
        profile.put("accountType", customer.getAccountType());
        profile.put("loyaltyPoints", customer.getLoyaltyPoints());
        profile.put("loyaltyStatus", customer.getLoyaltyStatus());
        profile.put("totalSpent", customer.getTotalSpent());
        profile.put("registrationDate", customer.getRegistrationDate());
        profile.put("lastLogin", customer.getLastLogin());
        profile.put("lastDeviceMac", customer.getLastDeviceMac());
        profile.put("deviceMacHistory", customer.getDeviceMacList());
        profile.put("isBlacklisted", customer.getStatus() == Customer.CustomerStatus.BLACKLISTED);
        profile.put("blacklistReason", customer.getBlacklistReason());
        return profile;
    }

    /**
     * Blacklist user (customer)
     */
    @Transactional
    public void blacklistUser(Long customerId, String reason) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setStatus(Customer.CustomerStatus.BLACKLISTED);
            customer.setBlacklistReason(reason);
            customerRepository.save(customer);
        }
    }

    /**
     * Blacklist user by phone number
     */
    @Transactional
    public void blacklistUserByPhone(String phoneNumber, String reason) {
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (customerOpt.isPresent()) {
            blacklistUser(customerOpt.get().getId(), reason);
        }
    }

    /**
     * Unblacklist user
     */
    @Transactional
    public void unblacklistUser(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setStatus(Customer.CustomerStatus.ACTIVE);
            customer.setBlacklistReason(null);
            customerRepository.save(customer);
        }
    }

    /**
     * Disable user
     */
    @Transactional
    public void disableUser(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setStatus(Customer.CustomerStatus.INACTIVE);
            customerRepository.save(customer);
        }
    }

    /**
     * Enable user
     */
    @Transactional
    public void enableUser(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setStatus(Customer.CustomerStatus.ACTIVE);
            customerRepository.save(customer);
        }
    }

    /**
     * Get MAC randomization analysis for user
     */
    public Map<String, Object> getMacRandomizationAnalysis(String phoneNumber) {
        Map<String, Object> analysis = new HashMap<>();
        
        long distinctMacCount = deviceManagementService.countDistinctMacAddresses(phoneNumber);
        List<DeviceHistory> devices = deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
        List<String> allMacs = deviceManagementService.getAllMacAddressesForPhone(phoneNumber);
        
        analysis.put("phoneNumber", phoneNumber);
        analysis.put("distinctMacCount", distinctMacCount);
        analysis.put("totalDevices", devices.size());
        analysis.put("allMacAddresses", allMacs);
        analysis.put("hasMacRandomization", distinctMacCount > 1);
        analysis.put("riskLevel", distinctMacCount > 5 ? "HIGH" : distinctMacCount > 2 ? "MEDIUM" : "LOW");
        
        // Group devices by MAC
        Map<String, List<DeviceHistory>> devicesByMac = devices.stream()
            .collect(Collectors.groupingBy(DeviceHistory::getMacAddress));
        analysis.put("devicesByMac", devicesByMac);
        
        return analysis;
    }

    /**
     * Get user statistics
     */
    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = customerRepository.count();
        long activeUsers = customerRepository.countByIsActiveTrue();
        long blacklistedUsers = customerRepository.countByStatus(Customer.CustomerStatus.BLACKLISTED);
        
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("blacklistedUsers", blacklistedUsers);
        stats.put("inactiveUsers", totalUsers - activeUsers - blacklistedUsers);
        
        return stats;
    }
}





