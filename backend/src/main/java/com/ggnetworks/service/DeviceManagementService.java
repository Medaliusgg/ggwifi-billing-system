package com.ggnetworks.service;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.entity.DeviceHistory;
import com.ggnetworks.repository.CustomerRepository;
import com.ggnetworks.repository.DeviceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeviceManagementService {

    @Autowired
    private DeviceHistoryRepository deviceHistoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Record device usage (MAC address)
     */
    @Transactional
    public DeviceHistory recordDeviceUsage(Long customerId, String phoneNumber, String macAddress, 
                                          String deviceFingerprint, String deviceType, String deviceName) {
        // Check if device already exists for this customer/phone
        Optional<DeviceHistory> existingOpt = deviceHistoryRepository.findByMacAddress(macAddress);
        
        if (existingOpt.isPresent()) {
            DeviceHistory existing = existingOpt.get();
            existing.recordUsage();
            existing.setDeviceFingerprint(deviceFingerprint);
            existing.setDeviceType(deviceType);
            existing.setDeviceName(deviceName);
            return deviceHistoryRepository.save(existing);
        } else {
            // Create new device history record
            DeviceHistory newDevice = new DeviceHistory(customerId, phoneNumber, macAddress, deviceFingerprint);
            newDevice.setDeviceType(deviceType);
            newDevice.setDeviceName(deviceName);
            
            // Update customer's device MAC history
            if (customerId != null) {
                Optional<Customer> customerOpt = customerRepository.findById(customerId);
                if (customerOpt.isPresent()) {
                    Customer customer = customerOpt.get();
                    customer.addDeviceMac(macAddress);
                    customerRepository.save(customer);
                }
            }
            
            return deviceHistoryRepository.save(newDevice);
        }
    }

    /**
     * Get device history for customer
     */
    public List<DeviceHistory> getDeviceHistoryByCustomer(Long customerId) {
        return deviceHistoryRepository.findByCustomerId(customerId);
    }

    /**
     * Get device history by phone number
     */
    public List<DeviceHistory> getDeviceHistoryByPhone(String phoneNumber) {
        return deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
    }

    /**
     * Get all devices for customer (by customer ID or phone)
     */
    public List<DeviceHistory> getDevicesForCustomer(Long customerId, String phoneNumber) {
        return deviceHistoryRepository.findByCustomerIdOrPhoneNumber(customerId, phoneNumber);
    }

    /**
     * Get device by MAC address
     */
    public Optional<DeviceHistory> getDeviceByMacAddress(String macAddress) {
        return deviceHistoryRepository.findByMacAddress(macAddress);
    }

    /**
     * Get all MAC addresses for a phone number (for MAC randomization tracking)
     */
    public List<String> getAllMacAddressesForPhone(String phoneNumber) {
        List<DeviceHistory> devices = deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
        return devices.stream()
            .map(DeviceHistory::getMacAddress)
            .distinct()
            .collect(Collectors.toList());
    }

    /**
     * Count distinct MAC addresses for phone number
     */
    public long countDistinctMacAddresses(String phoneNumber) {
        return deviceHistoryRepository.countDistinctMacAddressesByPhoneNumber(phoneNumber);
    }

    /**
     * Merge MAC addresses (link multiple MACs to one phone/customer)
     */
    @Transactional
    public void mergeMacAddresses(String phoneNumber, List<String> macAddresses) {
        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        Long customerId = customerOpt.map(Customer::getId).orElse(null);

        for (String macAddress : macAddresses) {
            Optional<DeviceHistory> deviceOpt = deviceHistoryRepository.findByMacAddress(macAddress);
            if (deviceOpt.isPresent()) {
                DeviceHistory device = deviceOpt.get();
                device.setCustomerId(customerId);
                device.setPhoneNumber(phoneNumber);
                deviceHistoryRepository.save(device);
            } else {
                // Create new device history
                DeviceHistory newDevice = new DeviceHistory(customerId, phoneNumber, macAddress, null);
                deviceHistoryRepository.save(newDevice);
            }
        }

        // Update customer's device MAC history
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            for (String macAddress : macAddresses) {
                customer.addDeviceMac(macAddress);
            }
            customerRepository.save(customer);
        }
    }

    /**
     * Blacklist device
     */
    @Transactional
    public void blacklistDevice(String macAddress, String reason) {
        Optional<DeviceHistory> deviceOpt = deviceHistoryRepository.findByMacAddress(macAddress);
        if (deviceOpt.isPresent()) {
            DeviceHistory device = deviceOpt.get();
            device.setIsBlacklisted(true);
            device.setBlacklistReason(reason);
            deviceHistoryRepository.save(device);
        }
    }

    /**
     * Unblacklist device
     */
    @Transactional
    public void unblacklistDevice(String macAddress) {
        Optional<DeviceHistory> deviceOpt = deviceHistoryRepository.findByMacAddress(macAddress);
        if (deviceOpt.isPresent()) {
            DeviceHistory device = deviceOpt.get();
            device.setIsBlacklisted(false);
            device.setBlacklistReason(null);
            deviceHistoryRepository.save(device);
        }
    }

    /**
     * Get blacklisted devices
     */
    public List<DeviceHistory> getBlacklistedDevices() {
        return deviceHistoryRepository.findByIsBlacklisted(true);
    }

    /**
     * Detect potential fraud (multiple MACs, suspicious patterns)
     */
    public Map<String, Object> detectFraud(String phoneNumber) {
        Map<String, Object> fraudReport = new HashMap<>();
        
        long distinctMacCount = countDistinctMacAddresses(phoneNumber);
        List<DeviceHistory> devices = deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
        
        fraudReport.put("phoneNumber", phoneNumber);
        fraudReport.put("distinctMacCount", distinctMacCount);
        fraudReport.put("totalDevices", devices.size());
        fraudReport.put("isSuspicious", distinctMacCount > 5); // More than 5 MACs is suspicious
        fraudReport.put("riskLevel", distinctMacCount > 10 ? "HIGH" : distinctMacCount > 5 ? "MEDIUM" : "LOW");
        
        // Check for devices used in short time spans (potential account sharing)
        List<DeviceHistory> recentDevices = devices.stream()
            .filter(d -> d.isRecentlyUsed(24)) // Used in last 24 hours
            .collect(Collectors.toList());
        
        fraudReport.put("recentDevicesCount", recentDevices.size());
        if (recentDevices.size() > 3) {
            fraudReport.put("riskLevel", "HIGH");
            fraudReport.put("isSuspicious", true);
        }
        
        return fraudReport;
    }

    /**
     * Get device statistics
     */
    public Map<String, Object> getDeviceStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalDevices = deviceHistoryRepository.count();
        long blacklistedDevices = deviceHistoryRepository.findByIsBlacklisted(true).size();
        long primaryDevices = deviceHistoryRepository.findByIsPrimaryDevice(true).size();
        
        stats.put("totalDevices", totalDevices);
        stats.put("blacklistedDevices", blacklistedDevices);
        stats.put("primaryDevices", primaryDevices);
        stats.put("activeDevices", totalDevices - blacklistedDevices);
        
        return stats;
    }

    /**
     * Set primary device for customer
     */
    @Transactional
    public void setPrimaryDevice(String phoneNumber, String macAddress) {
        // Unset all primary devices for this phone
        List<DeviceHistory> devices = deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
        for (DeviceHistory device : devices) {
            device.setIsPrimaryDevice(false);
            deviceHistoryRepository.save(device);
        }
        
        // Set new primary device
        Optional<DeviceHistory> deviceOpt = deviceHistoryRepository.findByMacAddress(macAddress);
        if (deviceOpt.isPresent()) {
            DeviceHistory device = deviceOpt.get();
            device.setIsPrimaryDevice(true);
            deviceHistoryRepository.save(device);
        }
    }

    /**
     * Get primary device for phone number
     */
    public Optional<DeviceHistory> getPrimaryDevice(String phoneNumber) {
        List<DeviceHistory> devices = deviceHistoryRepository.findDeviceHistoryByPhoneNumber(phoneNumber);
        return devices.stream()
            .filter(DeviceHistory::getIsPrimaryDevice)
            .findFirst();
    }
}

