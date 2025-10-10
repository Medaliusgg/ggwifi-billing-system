package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceHistoryService {

    private final DeviceHistoryRepository deviceHistoryRepository;
    private final CustomerProfileRepository customerProfileRepository;

    // ==================== DEVICE MANAGEMENT ====================

    /**
     * Get devices by customer ID
     */
    public List<DeviceHistory> getDevicesByCustomerId(Long customerId) {
        try {
            CustomerProfile customerProfile = customerProfileRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
            
            return deviceHistoryRepository.findByCustomerProfileAndDeletedAtIsNull(customerProfile);
        } catch (Exception e) {
            log.error("Failed to get devices for customer ID: {}", customerId, e);
            throw new RuntimeException("Failed to get devices", e);
        }
    }

    /**
     * Get devices by customer profile with pagination
     */
    public Page<DeviceHistory> getDevicesByCustomerProfile(CustomerProfile customerProfile, Pageable pageable) {
        try {
            return deviceHistoryRepository.findByCustomerProfileAndDeletedAtIsNull(customerProfile, pageable);
        } catch (Exception e) {
            log.error("Failed to get devices for customer profile: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to get devices", e);
        }
    }

    /**
     * Get devices by status
     */
    public List<DeviceHistory> getDevicesByStatus(DeviceHistory.DeviceStatus status) {
        try {
            return deviceHistoryRepository.findByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("Failed to get devices by status: {}", status, e);
            throw new RuntimeException("Failed to get devices by status", e);
        }
    }

    /**
     * Get devices by device type
     */
    public List<DeviceHistory> getDevicesByType(DeviceHistory.DeviceType deviceType) {
        try {
            return deviceHistoryRepository.findByDeviceTypeAndDeletedAtIsNull(deviceType);
        } catch (Exception e) {
            log.error("Failed to get devices by type: {}", deviceType, e);
            throw new RuntimeException("Failed to get devices by type", e);
        }
    }

    /**
     * Get suspicious devices (MAC randomization)
     */
    public List<DeviceHistory> getSuspiciousDevices() {
        try {
            return deviceHistoryRepository.findByIsMacRandomizedTrueAndDeletedAtIsNull();
        } catch (Exception e) {
            log.error("Failed to get suspicious devices", e);
            throw new RuntimeException("Failed to get suspicious devices", e);
        }
    }

    /**
     * Get devices by MAC address
     */
    public List<DeviceHistory> getDevicesByMacAddress(String macAddress) {
        try {
            return deviceHistoryRepository.findByMacAddressAndDeletedAtIsNull(macAddress);
        } catch (Exception e) {
            log.error("Failed to get devices by MAC address: {}", macAddress, e);
            throw new RuntimeException("Failed to get devices by MAC address", e);
        }
    }

    /**
     * Get devices by IP address
     */
    public List<DeviceHistory> getDevicesByIpAddress(String ipAddress) {
        try {
            return deviceHistoryRepository.findByIpAddressAndDeletedAtIsNull(ipAddress);
        } catch (Exception e) {
            log.error("Failed to get devices by IP address: {}", ipAddress, e);
            throw new RuntimeException("Failed to get devices by IP address", e);
        }
    }

    /**
     * Get devices by location
     */
    public List<DeviceHistory> getDevicesByLocation(String location) {
        try {
            return deviceHistoryRepository.findByLocationAndDeletedAtIsNull(location);
        } catch (Exception e) {
            log.error("Failed to get devices by location: {}", location, e);
            throw new RuntimeException("Failed to get devices by location", e);
        }
    }

    /**
     * Get devices by AP name
     */
    public List<DeviceHistory> getDevicesByApName(String apName) {
        try {
            return deviceHistoryRepository.findByApNameAndDeletedAtIsNull(apName);
        } catch (Exception e) {
            log.error("Failed to get devices by AP name: {}", apName, e);
            throw new RuntimeException("Failed to get devices by AP name", e);
        }
    }

    // ==================== DEVICE STATUS MANAGEMENT ====================

    /**
     * Update device status
     */
    @Transactional
    public DeviceHistory updateDeviceStatus(Long deviceId, DeviceHistory.DeviceStatus status) {
        try {
            DeviceHistory device = deviceHistoryRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Device not found"));
            
            device.setStatus(status);
            return deviceHistoryRepository.save(device);
        } catch (Exception e) {
            log.error("Failed to update device status: {}", deviceId, e);
            throw new RuntimeException("Failed to update device status", e);
        }
    }

    /**
     * Ban device
     */
    @Transactional
    public DeviceHistory banDevice(Long deviceId) {
        try {
            DeviceHistory device = deviceHistoryRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Device not found"));
            
            device.setStatus(DeviceHistory.DeviceStatus.BANNED);
            return deviceHistoryRepository.save(device);
        } catch (Exception e) {
            log.error("Failed to ban device: {}", deviceId, e);
            throw new RuntimeException("Failed to ban device", e);
        }
    }

    /**
     * Whitelist device
     */
    @Transactional
    public DeviceHistory whitelistDevice(Long deviceId) {
        try {
            DeviceHistory device = deviceHistoryRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Device not found"));
            
            device.setStatus(DeviceHistory.DeviceStatus.WHITELISTED);
            return deviceHistoryRepository.save(device);
        } catch (Exception e) {
            log.error("Failed to whitelist device: {}", deviceId, e);
            throw new RuntimeException("Failed to whitelist device", e);
        }
    }

    /**
     * Activate device
     */
    @Transactional
    public DeviceHistory activateDevice(Long deviceId) {
        try {
            DeviceHistory device = deviceHistoryRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("Device not found"));
            
            device.setStatus(DeviceHistory.DeviceStatus.ACTIVE);
            return deviceHistoryRepository.save(device);
        } catch (Exception e) {
            log.error("Failed to activate device: {}", deviceId, e);
            throw new RuntimeException("Failed to activate device", e);
        }
    }

    // ==================== DEVICE ANALYTICS ====================

    /**
     * Get device statistics
     */
    public Map<String, Object> getDeviceStatistics() {
        try {
            Object[] stats = deviceHistoryRepository.getDeviceStatistics();
            
            Map<String, Object> statistics = Map.of(
                "totalDevices", stats[0],
                "suspiciousDevices", stats[1],
                "bannedDevices", stats[2],
                "whitelistedDevices", stats[3],
                "avgSessions", stats[4],
                "avgDataUsage", stats[5]
            );
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get device statistics", e);
            throw new RuntimeException("Failed to get device statistics", e);
        }
    }

    /**
     * Get device statistics by customer profile
     */
    public Map<String, Object> getDeviceStatisticsByCustomer(CustomerProfile customerProfile) {
        try {
            Object[] stats = deviceHistoryRepository.getDeviceStatisticsByCustomer(customerProfile);
            
            Map<String, Object> statistics = Map.of(
                "totalDevices", stats[0],
                "suspiciousDevices", stats[1],
                "bannedDevices", stats[2],
                "whitelistedDevices", stats[3],
                "avgSessions", stats[4],
                "avgDataUsage", stats[5]
            );
            
            return statistics;
        } catch (Exception e) {
            log.error("Failed to get device statistics for customer: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to get device statistics", e);
        }
    }

    /**
     * Get devices with high session count
     */
    public List<DeviceHistory> getDevicesWithHighSessions(Long minSessions) {
        try {
            return deviceHistoryRepository.findByMinSessions(minSessions);
        } catch (Exception e) {
            log.error("Failed to get devices with high sessions: {}", minSessions, e);
            throw new RuntimeException("Failed to get devices with high sessions", e);
        }
    }

    /**
     * Get devices with high data usage
     */
    public List<DeviceHistory> getDevicesWithHighDataUsage(Long minDataUsage) {
        try {
            return deviceHistoryRepository.findByMinDataUsage(minDataUsage);
        } catch (Exception e) {
            log.error("Failed to get devices with high data usage: {}", minDataUsage, e);
            throw new RuntimeException("Failed to get devices with high data usage", e);
        }
    }

    /**
     * Get devices by randomization count
     */
    public List<DeviceHistory> getDevicesByRandomizationCount(Integer minCount) {
        try {
            return deviceHistoryRepository.findByRandomizationCountGreaterThanEqual(minCount);
        } catch (Exception e) {
            log.error("Failed to get devices by randomization count: {}", minCount, e);
            throw new RuntimeException("Failed to get devices by randomization count", e);
        }
    }

    // ==================== DEVICE SEARCH & FILTERING ====================

    /**
     * Search devices by IP address pattern
     */
    public List<DeviceHistory> searchDevicesByIpPattern(String pattern) {
        try {
            return deviceHistoryRepository.findByIpAddressPattern(pattern);
        } catch (Exception e) {
            log.error("Failed to search devices by IP pattern: {}", pattern, e);
            throw new RuntimeException("Failed to search devices by IP pattern", e);
        }
    }

    /**
     * Search devices by user agent pattern
     */
    public List<DeviceHistory> searchDevicesByUserAgentPattern(String pattern) {
        try {
            return deviceHistoryRepository.findByUserAgentPattern(pattern);
        } catch (Exception e) {
            log.error("Failed to search devices by user agent pattern: {}", pattern, e);
            throw new RuntimeException("Failed to search devices by user agent pattern", e);
        }
    }

    /**
     * Get devices by date range
     */
    public List<DeviceHistory> getDevicesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return deviceHistoryRepository.findByFirstSeenBetweenAndDeletedAtIsNull(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get devices by date range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get devices by date range", e);
        }
    }

    /**
     * Get devices by last seen date range
     */
    public List<DeviceHistory> getDevicesByLastSeenRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return deviceHistoryRepository.findByLastSeenBetweenAndDeletedAtIsNull(startDate, endDate);
        } catch (Exception e) {
            log.error("Failed to get devices by last seen range: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to get devices by last seen range", e);
        }
    }

    /**
     * Get inactive devices
     */
    public List<DeviceHistory> getInactiveDevices(LocalDateTime cutoffDate) {
        try {
            return deviceHistoryRepository.findByLastSeenBeforeAndDeletedAtIsNull(cutoffDate);
        } catch (Exception e) {
            log.error("Failed to get inactive devices before: {}", cutoffDate, e);
            throw new RuntimeException("Failed to get inactive devices", e);
        }
    }

    // ==================== DEVICE COUNTING ====================

    /**
     * Count devices by type
     */
    public long countDevicesByType(DeviceHistory.DeviceType deviceType) {
        try {
            return deviceHistoryRepository.countByDeviceTypeAndDeletedAtIsNull(deviceType);
        } catch (Exception e) {
            log.error("Failed to count devices by type: {}", deviceType, e);
            throw new RuntimeException("Failed to count devices by type", e);
        }
    }

    /**
     * Count devices by status
     */
    public long countDevicesByStatus(DeviceHistory.DeviceStatus status) {
        try {
            return deviceHistoryRepository.countByStatusAndDeletedAtIsNull(status);
        } catch (Exception e) {
            log.error("Failed to count devices by status: {}", status, e);
            throw new RuntimeException("Failed to count devices by status", e);
        }
    }

    /**
     * Count suspicious devices
     */
    public long countSuspiciousDevices() {
        try {
            return deviceHistoryRepository.countByIsMacRandomizedTrueAndDeletedAtIsNull();
        } catch (Exception e) {
            log.error("Failed to count suspicious devices", e);
            throw new RuntimeException("Failed to count suspicious devices", e);
        }
    }

    /**
     * Count devices by customer profile
     */
    public long countDevicesByCustomer(CustomerProfile customerProfile) {
        try {
            return deviceHistoryRepository.countByCustomerProfileAndDeletedAtIsNull(customerProfile);
        } catch (Exception e) {
            log.error("Failed to count devices for customer: {}", customerProfile.getId(), e);
            throw new RuntimeException("Failed to count devices by customer", e);
        }
    }

    /**
     * Count devices by location
     */
    public long countDevicesByLocation(String location) {
        try {
            return deviceHistoryRepository.countByLocationAndDeletedAtIsNull(location);
        } catch (Exception e) {
            log.error("Failed to count devices by location: {}", location, e);
            throw new RuntimeException("Failed to count devices by location", e);
        }
    }

    /**
     * Count devices by AP name
     */
    public long countDevicesByApName(String apName) {
        try {
            return deviceHistoryRepository.countByApNameAndDeletedAtIsNull(apName);
        } catch (Exception e) {
            log.error("Failed to count devices by AP name: {}", apName, e);
            throw new RuntimeException("Failed to count devices by AP name", e);
        }
    }
} 