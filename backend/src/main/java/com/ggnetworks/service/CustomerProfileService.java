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
import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;
    private final DeviceHistoryRepository deviceHistoryRepository;
    private final MarketingCommunicationRepository marketingCommunicationRepository;
    private final HotspotSessionRepository hotspotSessionRepository;
    private final PaymentRepository paymentRepository;
    private final InternetApplicationFormRepository applicationFormRepository;

    // Phone number validation pattern
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+255[0-9]{8}$");

    /**
     * Normalize phone number to standard format
     */
    public String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) return null;
        
        // Remove all non-digit characters
        String digits = phoneNumber.replaceAll("[^0-9]", "");
        
        // Convert to +255 format
        if (digits.startsWith("255")) {
            return "+" + digits;
        } else if (digits.startsWith("0")) {
            return "+255" + digits.substring(1);
        } else if (digits.length() == 9) {
            return "+255" + digits;
        } else if (digits.length() == 10) {
            return "+255" + digits.substring(1);
        }
        
        return phoneNumber; // Return as-is if can't normalize
    }

    /**
     * Validate phone number format
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && PHONE_PATTERN.matcher(phoneNumber).matches();
    }

    /**
     * Get or create customer profile by phone number
     */
    @Transactional
    public CustomerProfile getOrCreateCustomerProfile(String phoneNumber, CustomerProfile.CustomerType customerType) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);
        
        if (!isValidPhoneNumber(normalizedPhone)) {
            throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
        }

        Optional<CustomerProfile> existingProfile = customerProfileRepository.findByPhoneNumberAndDeletedAtIsNull(normalizedPhone);
        
        if (existingProfile.isPresent()) {
            CustomerProfile profile = existingProfile.get();
            
            // Update customer type if needed
            if (profile.getCustomerType() != customerType) {
                if (profile.getCustomerType() == CustomerProfile.CustomerType.HOTSPOT_USER && 
                    customerType == CustomerProfile.CustomerType.PPPOE_USER) {
                    profile.setCustomerType(CustomerProfile.CustomerType.BOTH);
                } else if (profile.getCustomerType() == CustomerProfile.CustomerType.PPPOE_USER && 
                          customerType == CustomerProfile.CustomerType.HOTSPOT_USER) {
                    profile.setCustomerType(CustomerProfile.CustomerType.BOTH);
                }
                profile.setLastActivityDate(LocalDateTime.now());
                return customerProfileRepository.save(profile);
            }
            
            return profile;
        }

        // Create new customer profile
        CustomerProfile newProfile = new CustomerProfile();
        newProfile.setPhoneNumber(normalizedPhone);
        newProfile.setCustomerType(customerType);
        newProfile.setStatus(CustomerProfile.CustomerStatus.ACTIVE);
        newProfile.setRegistrationDate(LocalDateTime.now());
        newProfile.setLastActivityDate(LocalDateTime.now());
        
        // Generate referral code
        newProfile.setReferralCode(generateReferralCode(normalizedPhone));
        
        return customerProfileRepository.save(newProfile);
    }

    /**
     * Track device usage and detect MAC randomization
     */
    @Transactional
    public DeviceHistory trackDeviceUsage(String phoneNumber, String macAddress, String ipAddress, 
                                        String userAgent, String apName, String location) {
        
        CustomerProfile customerProfile = getOrCreateCustomerProfile(phoneNumber, CustomerProfile.CustomerType.HOTSPOT_USER);
        
        // Check if this MAC is already associated with this customer
        Optional<DeviceHistory> existingDevice = deviceHistoryRepository
                .findByCustomerProfileAndMacAddressAndDeletedAtIsNull(customerProfile, macAddress);
        
        if (existingDevice.isPresent()) {
            DeviceHistory device = existingDevice.get();
            device.setLastSeen(LocalDateTime.now());
            device.setIpAddress(ipAddress);
            device.setApName(apName);
            device.setLocation(location);
            device.setTotalSessions(device.getTotalSessions() + 1);
            return deviceHistoryRepository.save(device);
        }

        // Check for MAC randomization
        List<DeviceHistory> customerDevices = deviceHistoryRepository
                .findByCustomerProfileAndDeletedAtIsNull(customerProfile);
        
        boolean isMacRandomized = detectMacRandomization(customerDevices, macAddress, userAgent, ipAddress);
        
        // Create new device history
        DeviceHistory newDevice = new DeviceHistory();
        newDevice.setCustomerProfile(customerProfile);
        newDevice.setMacAddress(macAddress);
        newDevice.setIpAddress(ipAddress);
        newDevice.setUserAgent(userAgent);
        newDevice.setApName(apName);
        newDevice.setLocation(location);
        newDevice.setDeviceFingerprint(generateDeviceFingerprint(userAgent, ipAddress));
        newDevice.setDeviceType(detectDeviceType(userAgent));
        newDevice.setIsMacRandomized(isMacRandomized);
        newDevice.setStatus(isMacRandomized ? DeviceHistory.DeviceStatus.SUSPICIOUS : DeviceHistory.DeviceStatus.ACTIVE);
        
        if (isMacRandomized) {
            newDevice.setRandomizationCount(1);
            log.warn("MAC randomization detected for phone: {}, MAC: {}", phoneNumber, macAddress);
        }
        
        return deviceHistoryRepository.save(newDevice);
    }

    /**
     * Detect MAC randomization based on device patterns
     */
    private boolean detectMacRandomization(List<DeviceHistory> customerDevices, String newMac, 
                                        String userAgent, String ipAddress) {
        
        if (customerDevices.isEmpty()) {
            return false; // First device, not randomized
        }

        // Check if this user has multiple devices with similar fingerprints
        String newFingerprint = generateDeviceFingerprint(userAgent, ipAddress);
        
        for (DeviceHistory device : customerDevices) {
            // If same user agent but different MAC, likely randomized
            if (device.getUserAgent() != null && 
                device.getUserAgent().equals(userAgent) && 
                !device.getMacAddress().equals(newMac)) {
                return true;
            }
            
            // If similar fingerprint but different MAC
            if (device.getDeviceFingerprint() != null && 
                device.getDeviceFingerprint().equals(newFingerprint) && 
                !device.getMacAddress().equals(newMac)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Generate device fingerprint for tracking
     */
    private String generateDeviceFingerprint(String userAgent, String ipAddress) {
        // Simple fingerprint based on user agent and IP subnet
        String ipSubnet = ipAddress != null ? ipAddress.substring(0, ipAddress.lastIndexOf(".")) : "";
        return (userAgent + "_" + ipSubnet).hashCode() + "";
    }

    /**
     * Detect device type from user agent
     */
    private DeviceHistory.DeviceType detectDeviceType(String userAgent) {
        if (userAgent == null) return DeviceHistory.DeviceType.UNKNOWN;
        
        String ua = userAgent.toLowerCase();
        
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return DeviceHistory.DeviceType.MOBILE_PHONE;
        } else if (ua.contains("tablet") || ua.contains("ipad")) {
            return DeviceHistory.DeviceType.TABLET;
        } else if (ua.contains("windows") || ua.contains("macintosh")) {
            return DeviceHistory.DeviceType.LAPTOP;
        } else if (ua.contains("smart-tv") || ua.contains("tv")) {
            return DeviceHistory.DeviceType.SMART_TV;
        } else if (ua.contains("xbox") || ua.contains("playstation")) {
            return DeviceHistory.DeviceType.GAMING_CONSOLE;
        }
        
        return DeviceHistory.DeviceType.UNKNOWN;
    }

    /**
     * Get comprehensive customer profile by phone number
     */
    public Map<String, Object> getCustomerProfileByPhone(String phoneNumber) {
        String normalizedPhone = normalizePhoneNumber(phoneNumber);
        
        Optional<CustomerProfile> profileOpt = customerProfileRepository
                .findByPhoneNumberAndDeletedAtIsNull(normalizedPhone);
        
        if (profileOpt.isEmpty()) {
            return Map.of("error", "Customer not found");
        }

        CustomerProfile profile = profileOpt.get();
        Map<String, Object> customerData = new HashMap<>();
        
        // Basic profile info
        customerData.put("profile", profile);
        
        // Device history
        List<DeviceHistory> devices = deviceHistoryRepository
                .findByCustomerProfileAndDeletedAtIsNull(profile);
        customerData.put("devices", devices);
        
        // Session history - find sessions through vouchers assigned to this customer
        List<HotspotSession> sessions = hotspotSessionRepository
                .findByVoucherAssignedToAndDeletedAtIsNull(profile.getPhoneNumber());
        customerData.put("sessions", sessions);
        
        // Payment history
        // Note: Payment entity doesn't have direct customerProfile relationship
        // Using phone number to find payments instead
        List<Payment> payments = paymentRepository.findByUserPhoneNumber(profile.getPhoneNumber());
        customerData.put("payments", payments);
        
        // Application forms (for PPPoE users)
        List<InternetApplicationForm> applications = applicationFormRepository
                .findByUserPhoneNumber(profile.getPhoneNumber());
        customerData.put("applications", applications);
        
        // Marketing communications
        List<MarketingCommunication> communications = marketingCommunicationRepository
                .findByCustomerProfileAndDeletedAtIsNull(profile);
        customerData.put("communications", communications);
        
        // Statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDevices", devices.size());
        stats.put("totalSessions", sessions.size());
        stats.put("totalPayments", payments.size());
        stats.put("totalSpent", payments.stream().mapToDouble(payment -> payment.getAmount().doubleValue()).sum());
        stats.put("suspiciousDevices", devices.stream()
                .filter(d -> d.getIsMacRandomized()).count());
        
        customerData.put("statistics", stats);
        
        return customerData;
    }

    /**
     * Send marketing communication
     */
    @Transactional
    public MarketingCommunication sendMarketingCommunication(String phoneNumber, 
                                                          MarketingCommunication.CommunicationType type,
                                                          MarketingCommunication.Channel channel,
                                                          String subject, String message) {
        
        CustomerProfile customerProfile = customerProfileRepository
                .findByPhoneNumberAndDeletedAtIsNull(phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        
        MarketingCommunication communication = new MarketingCommunication();
        communication.setCustomerProfile(customerProfile);
        communication.setPhoneNumber(phoneNumber);
        communication.setCommunicationType(type);
        communication.setChannel(channel);
        communication.setSubject(subject);
        communication.setMessageContent(message);
        communication.setCustomerType(customerProfile.getCustomerType());
        communication.setStatus(MarketingCommunication.CommunicationStatus.PENDING);
        communication.setScheduledAt(LocalDateTime.now());
        
        return marketingCommunicationRepository.save(communication);
    }

    /**
     * Generate referral code based on phone number
     */
    private String generateReferralCode(String phoneNumber) {
        // Simple referral code generation
        String last4 = phoneNumber.substring(phoneNumber.length() - 4);
        return "GG" + last4 + new Random().nextInt(100);
    }

    /**
     * Update customer loyalty points
     */
    @Transactional
    public CustomerProfile updateLoyaltyPoints(String phoneNumber, int points) {
        CustomerProfile profile = customerProfileRepository
                .findByPhoneNumberAndDeletedAtIsNull(phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        
        profile.setLoyaltyPoints(profile.getLoyaltyPoints() + points);
        profile.setLoyaltyTier(calculateLoyaltyTier(profile.getLoyaltyPoints()));
        profile.setLastActivityDate(LocalDateTime.now());
        
        return customerProfileRepository.save(profile);
    }

    /**
     * Calculate loyalty tier based on points
     */
    private CustomerProfile.LoyaltyTier calculateLoyaltyTier(int points) {
        if (points >= CustomerProfile.LoyaltyTier.DIAMOND.getPointsRequired()) {
            return CustomerProfile.LoyaltyTier.DIAMOND;
        } else if (points >= CustomerProfile.LoyaltyTier.PLATINUM.getPointsRequired()) {
            return CustomerProfile.LoyaltyTier.PLATINUM;
        } else if (points >= CustomerProfile.LoyaltyTier.GOLD.getPointsRequired()) {
            return CustomerProfile.LoyaltyTier.GOLD;
        } else if (points >= CustomerProfile.LoyaltyTier.SILVER.getPointsRequired()) {
            return CustomerProfile.LoyaltyTier.SILVER;
        } else {
            return CustomerProfile.LoyaltyTier.BRONZE;
        }
    }

    /**
     * Get customers by type (Hotspot vs PPPoE)
     */
    public List<CustomerProfile> getCustomersByType(CustomerProfile.CustomerType customerType) {
        return customerProfileRepository.findByCustomerTypeAndDeletedAtIsNull(customerType);
    }

    /**
     * Get suspicious devices (MAC randomization)
     */
    public List<DeviceHistory> getSuspiciousDevices() {
        return deviceHistoryRepository.findByIsMacRandomizedTrueAndDeletedAtIsNull();
    }

    /**
     * Export customer data for marketing
     */
    public List<Map<String, Object>> exportCustomerDataForMarketing(CustomerProfile.CustomerType customerType) {
        List<CustomerProfile> customers = getCustomersByType(customerType);
        List<Map<String, Object>> exportData = new ArrayList<>();
        
        for (CustomerProfile customer : customers) {
            Map<String, Object> customerData = new HashMap<>();
            customerData.put("phoneNumber", customer.getPhoneNumber());
            customerData.put("fullName", customer.getFullName());
            customerData.put("email", customer.getEmail());
            customerData.put("customerType", customer.getCustomerType());
            customerData.put("loyaltyTier", customer.getLoyaltyTier());
            customerData.put("totalSpent", customer.getTotalSpent());
            customerData.put("lastActivity", customer.getLastActivityDate());
            customerData.put("marketingConsent", customer.getMarketingConsent());
            customerData.put("smsConsent", customer.getSmsConsent());
            customerData.put("emailConsent", customer.getEmailConsent());
            
            exportData.add(customerData);
        }
        
        return exportData;
    }

    // Additional methods for AdminCustomerController
    public Page<CustomerProfile> getCustomersByTypePaged(CustomerProfile.CustomerType customerType, Pageable pageable) {
        return customerProfileRepository.findByCustomerTypeAndDeletedAtIsNull(customerType, pageable);
    }

    public CustomerProfile getCustomerProfileById(Long id) {
        return customerProfileRepository.findById(id).orElse(null);
    }

    public Map<String, Object> getCustomerStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", customerProfileRepository.count());
        stats.put("hotspotCustomers", customerProfileRepository.countByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType.HOTSPOT_USER));
        stats.put("pppoeCustomers", customerProfileRepository.countByCustomerTypeAndDeletedAtIsNull(CustomerProfile.CustomerType.PPPOE_USER));
        stats.put("activeCustomers", customerProfileRepository.countByStatusAndDeletedAtIsNull(CustomerProfile.CustomerStatus.ACTIVE));
        stats.put("suspendedCustomers", customerProfileRepository.countByStatusAndDeletedAtIsNull(CustomerProfile.CustomerStatus.SUSPENDED));
        return stats;
    }

    @Transactional
    public CustomerProfile updateCustomerStatus(Long customerId, CustomerProfile.CustomerStatus status) {
        CustomerProfile profile = customerProfileRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        profile.setStatus(status);
        return customerProfileRepository.save(profile);
    }

    @Transactional
    public CustomerProfile updateMarketingConsent(Long customerId, Boolean marketingConsent, Boolean smsConsent, Boolean emailConsent) {
        CustomerProfile profile = customerProfileRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        profile.setMarketingConsent(marketingConsent);
        profile.setSmsConsent(smsConsent);
        profile.setEmailConsent(emailConsent);
        return customerProfileRepository.save(profile);
    }
} 