package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing phone numbers, validation, and SMS marketing
 * Ensures phone number uniqueness and provides marketing capabilities
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PhoneNumberService {

    private final UserRepository userRepository;

    /**
     * Validate phone number format (Tanzania format)
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove any spaces, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");
        
        // Tanzania phone number format: 0XXXXXXXXX (10 digits starting with 0)
        // or +255XXXXXXXXX (12 digits starting with +255)
        return cleaned.matches("^(0[0-9]{8,9}|\\+255[0-9]{8,9})$");
    }

    /**
     * Normalize phone number to standard format
     */
    public String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return null;
        }
        
        // Remove any spaces, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");
        
        // Convert +255 format to 0 format
        if (cleaned.startsWith("+255")) {
            return "0" + cleaned.substring(4);
        }
        
        return cleaned;
    }

    /**
     * Check if phone number is unique (not already registered)
     */
    @Transactional(readOnly = true)
    public boolean isPhoneNumberUnique(String phoneNumber) {
        String normalized = normalizePhoneNumber(phoneNumber);
        if (normalized == null) {
            return false;
        }
        
        Optional<User> existingUser = userRepository.findByPhoneNumber(normalized);
        return existingUser.isEmpty();
    }

    /**
     * Get all unique phone numbers for SMS marketing
     */
    @Transactional(readOnly = true)
    public Set<String> getAllUniquePhoneNumbers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .collect(Collectors.toSet());
    }

    /**
     * Get phone numbers by user type for targeted marketing
     */
    @Transactional(readOnly = true)
    public Set<String> getPhoneNumbersByUserType(User.UserRole userRole) {
        List<User> users = userRepository.findByRole(userRole);
        return users.stream()
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .collect(Collectors.toSet());
    }

    /**
     * Get active users' phone numbers for marketing
     */
    @Transactional(readOnly = true)
    public Set<String> getActiveUsersPhoneNumbers() {
        List<User> users = userRepository.findAll(); // For now, get all users
        return users.stream()
                .filter(user -> user.getStatus() == User.UserStatus.ACTIVE)
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .collect(Collectors.toSet());
    }

    /**
     * Get phone numbers of users who have made payments (for promotional campaigns)
     */
    @Transactional(readOnly = true)
    public Set<String> getPhoneNumbersWithPaymentHistory() {
        // This would require a join with payment table
        // For now, return all active users
        return getActiveUsersPhoneNumbers();
    }

    /**
     * Validate and register a new phone number
     */
    @Transactional
    public boolean registerPhoneNumber(String phoneNumber, String fullName, User.UserRole role) {
        try {
            if (!isValidPhoneNumber(phoneNumber)) {
                log.warn("Invalid phone number format: {}", phoneNumber);
                return false;
            }
            
            String normalized = normalizePhoneNumber(phoneNumber);
            
            if (!isPhoneNumberUnique(normalized)) {
                log.warn("Phone number already registered: {}", normalized);
                return false;
            }
            
            User user = new User();
            user.setPhoneNumber(normalized);
            user.setFullName(fullName);
            user.setRole(role);
            user.setStatus(User.UserStatus.ACTIVE);
            user.setUsername(normalized); // Use phone number as username
            user.setPassword(generateDefaultPassword(normalized));
            
            userRepository.save(user);
            log.info("Successfully registered phone number: {} for user: {}", normalized, fullName);
            return true;
            
        } catch (Exception e) {
            log.error("Failed to register phone number: {}", phoneNumber, e);
            return false;
        }
    }

    /**
     * Generate default password based on phone number
     */
    private String generateDefaultPassword(String phoneNumber) {
        // Use last 4 digits of phone number as base password
        String basePassword = phoneNumber.substring(phoneNumber.length() - 4);
        return basePassword + "GG"; // Add GG prefix for GGNetworks
    }

    /**
     * Get phone number statistics for marketing insights
     */
    @Transactional(readOnly = true)
    public PhoneNumberStats getPhoneNumberStats() {
        List<User> allUsers = userRepository.findAll();
        List<User> activeUsers = allUsers.stream()
                .filter(user -> user.getStatus() == User.UserStatus.ACTIVE)
                .collect(Collectors.toList());
        
        long totalPhoneNumbers = allUsers.stream()
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .count();
        
        long activePhoneNumbers = activeUsers.stream()
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .count();
        
        long hotspotUsers = allUsers.stream()
                .filter(user -> user.getRole() == User.UserRole.HOTSPOT_USER)
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .count();
        
        long pppoeUsers = allUsers.stream()
                .filter(user -> user.getRole() == User.UserRole.PPPOE_USER)
                .map(User::getPhoneNumber)
                .filter(this::isValidPhoneNumber)
                .count();
        
        return PhoneNumberStats.builder()
                .totalPhoneNumbers(totalPhoneNumbers)
                .activePhoneNumbers(activePhoneNumbers)
                .hotspotUsers(hotspotUsers)
                .pppoeUsers(pppoeUsers)
                .build();
    }

    /**
     * Phone number statistics for marketing insights
     */
    public static class PhoneNumberStats {
        private final long totalPhoneNumbers;
        private final long activePhoneNumbers;
        private final long hotspotUsers;
        private final long pppoeUsers;

        public PhoneNumberStats(long totalPhoneNumbers, long activePhoneNumbers, 
                              long hotspotUsers, long pppoeUsers) {
            this.totalPhoneNumbers = totalPhoneNumbers;
            this.activePhoneNumbers = activePhoneNumbers;
            this.hotspotUsers = hotspotUsers;
            this.pppoeUsers = pppoeUsers;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private long totalPhoneNumbers;
            private long activePhoneNumbers;
            private long hotspotUsers;
            private long pppoeUsers;

            public Builder totalPhoneNumbers(long totalPhoneNumbers) {
                this.totalPhoneNumbers = totalPhoneNumbers;
                return this;
            }

            public Builder activePhoneNumbers(long activePhoneNumbers) {
                this.activePhoneNumbers = activePhoneNumbers;
                return this;
            }

            public Builder hotspotUsers(long hotspotUsers) {
                this.hotspotUsers = hotspotUsers;
                return this;
            }

            public Builder pppoeUsers(long pppoeUsers) {
                this.pppoeUsers = pppoeUsers;
                return this;
            }

            public PhoneNumberStats build() {
                return new PhoneNumberStats(totalPhoneNumbers, activePhoneNumbers, hotspotUsers, pppoeUsers);
            }
        }

        // Getters
        public long getTotalPhoneNumbers() { return totalPhoneNumbers; }
        public long getActivePhoneNumbers() { return activePhoneNumbers; }
        public long getHotspotUsers() { return hotspotUsers; }
        public long getPppoeUsers() { return pppoeUsers; }
    }
}
