package com.ggnetworks.service;

import com.ggnetworks.entity.DeviceFingerprint;
import com.ggnetworks.repository.DeviceFingerprintRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Device Fingerprint Service
 * Handles device fingerprinting for MAC randomization immunity
 */
@Service
public class DeviceFingerprintService {
    
    private static final Logger logger = LoggerFactory.getLogger(DeviceFingerprintService.class);
    
    @Autowired
    private DeviceFingerprintRepository deviceFingerprintRepository;
    
    /**
     * Generate hash from fingerprint data
     */
    public String hashFingerprint(String userAgent, String canvas, String screen, 
                                  String timezone, String language, String localStorageId) {
        try {
            String combined = userAgent + "|" + canvas + "|" + screen + "|" + 
                            timezone + "|" + language + "|" + localStorageId;
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(combined.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (Exception e) {
            logger.error("Failed to hash fingerprint: {}", e.getMessage(), e);
            throw new RuntimeException("Fingerprint hashing failed", e);
        }
    }
    
    /**
     * Create or update device fingerprint
     */
    @Transactional
    public DeviceFingerprint createOrUpdateFingerprint(String fingerprintHash, String voucherCode, 
                                                      String phoneNumber, String macAddress, 
                                                      String ipAddress) {
        Optional<DeviceFingerprint> existing = deviceFingerprintRepository
            .findByFingerprintHash(fingerprintHash);
        
        if (existing.isPresent()) {
            DeviceFingerprint fingerprint = existing.get();
            fingerprint.setVoucherCode(voucherCode);
            fingerprint.setPhoneNumber(phoneNumber);
            fingerprint.setLastMacAddress(macAddress);
            fingerprint.setLastIpAddress(ipAddress);
            fingerprint.setLastSeen(LocalDateTime.now());
            fingerprint.setAccessCount(fingerprint.getAccessCount() + 1);
            return deviceFingerprintRepository.save(fingerprint);
        } else {
            DeviceFingerprint fingerprint = new DeviceFingerprint();
            fingerprint.setFingerprintHash(fingerprintHash);
            fingerprint.setVoucherCode(voucherCode);
            fingerprint.setPhoneNumber(phoneNumber);
            fingerprint.setFirstMacAddress(macAddress);
            fingerprint.setLastMacAddress(macAddress);
            fingerprint.setFirstIpAddress(ipAddress);
            fingerprint.setLastIpAddress(ipAddress);
            fingerprint.setFirstSeen(LocalDateTime.now());
            fingerprint.setLastSeen(LocalDateTime.now());
            fingerprint.setAccessCount(1);
            return deviceFingerprintRepository.save(fingerprint);
        }
    }
    
    /**
     * Find fingerprint by hash
     */
    public Optional<DeviceFingerprint> findByHash(String fingerprintHash) {
        return deviceFingerprintRepository.findByFingerprintHash(fingerprintHash);
    }
    
    /**
     * Find fingerprint by voucher code
     */
    public Optional<DeviceFingerprint> findByVoucherCode(String voucherCode) {
        return deviceFingerprintRepository.findByVoucherCode(voucherCode);
    }
    
    /**
     * Update MAC address for fingerprint (handles MAC randomization)
     */
    @Transactional
    public void updateMacAddress(String fingerprintHash, String newMacAddress) {
        Optional<DeviceFingerprint> fingerprintOpt = findByHash(fingerprintHash);
        if (fingerprintOpt.isPresent()) {
            DeviceFingerprint fingerprint = fingerprintOpt.get();
            fingerprint.setLastMacAddress(newMacAddress);
            fingerprint.setMacChangesCount(fingerprint.getMacChangesCount() + 1);
            fingerprint.setLastSeen(LocalDateTime.now());
            deviceFingerprintRepository.save(fingerprint);
            logger.info("Updated MAC address for fingerprint: {} -> {}", 
                       fingerprintHash.substring(0, 8), newMacAddress);
        }
    }
    
    /**
     * Update IP address for fingerprint (handles IP changes)
     */
    @Transactional
    public void updateIpAddress(String fingerprintHash, String newIpAddress) {
        Optional<DeviceFingerprint> fingerprintOpt = findByHash(fingerprintHash);
        if (fingerprintOpt.isPresent()) {
            DeviceFingerprint fingerprint = fingerprintOpt.get();
            fingerprint.setLastIpAddress(newIpAddress);
            fingerprint.setIpChangesCount(fingerprint.getIpChangesCount() + 1);
            fingerprint.setLastSeen(LocalDateTime.now());
            deviceFingerprintRepository.save(fingerprint);
            logger.info("Updated IP address for fingerprint: {} -> {}", 
                       fingerprintHash.substring(0, 8), newIpAddress);
        }
    }
}

