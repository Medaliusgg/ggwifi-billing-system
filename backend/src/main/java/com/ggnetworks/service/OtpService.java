package com.ggnetworks.service;

import com.ggnetworks.entity.Otp;
import com.ggnetworks.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;

    @Value("${otp.expiration}")
    private int otpExpirationSeconds;

    @Value("${otp.max-retries}")
    private int maxRetries;

    @Value("${otp.length}")
    private int otpLength;

    /**
     * Generate and send OTP for phone verification
     */
    @Transactional
    public Otp generateOtp(String phoneNumber, Otp.OtpType type) {
        try {
            // Invalidate any existing OTPs for this phone number and type
            otpRepository.invalidateExistingOtps(phoneNumber, type);

            // Generate new OTP
            String otpCode = generateOtpCode();
            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(otpExpirationSeconds);

            Otp otp = new Otp();
            otp.setPhoneNumber(phoneNumber);
            otp.setOtpCode(otpCode);
            otp.setType(type);
            otp.setExpiresAt(expiresAt);
            otp.setIsUsed(false);
            otp.setRetryCount(0);

            Otp savedOtp = otpRepository.save(otp);
            
            // TODO: Integrate with SMS service to send OTP
            log.info("OTP generated for {}: {} (Type: {})", phoneNumber, otpCode, type);
            
            return savedOtp;
        } catch (Exception e) {
            log.error("Failed to generate OTP for phone number: {}", phoneNumber, e);
            throw new RuntimeException("Failed to generate OTP", e);
        }
    }

    /**
     * Validate OTP code
     */
    @Transactional
    public boolean validateOtp(String phoneNumber, String otpCode, Otp.OtpType type) {
        try {
            Optional<Otp> otpOpt = otpRepository.findByPhoneNumberAndTypeAndIsUsedFalseAndExpiresAtAfter(
                    phoneNumber, type, LocalDateTime.now());

            if (otpOpt.isEmpty()) {
                log.warn("No valid OTP found for phone number: {}, type: {}", phoneNumber, type);
                return false;
            }

            Otp otp = otpOpt.get();

            // Check if OTP has exceeded max retries
            if (otp.getRetryCount() >= maxRetries) {
                log.warn("OTP exceeded max retries for phone number: {}", phoneNumber);
                return false;
            }

            // Check if OTP code matches
            if (!otp.getOtpCode().equals(otpCode)) {
                // Increment retry count
                otp.setRetryCount(otp.getRetryCount() + 1);
                otpRepository.save(otp);
                log.warn("Invalid OTP code for phone number: {}", phoneNumber);
                return false;
            }

            // Mark OTP as used
            otp.setIsUsed(true);
            otpRepository.save(otp);

            log.info("OTP validated successfully for phone number: {}", phoneNumber);
            return true;

        } catch (Exception e) {
            log.error("Failed to validate OTP for phone number: {}", phoneNumber, e);
            return false;
        }
    }

    /**
     * Resend OTP
     */
    @Transactional
    public Otp resendOtp(String phoneNumber, Otp.OtpType type) {
        try {
            // Check if there's a recent OTP that hasn't expired
            Optional<Otp> recentOtp = otpRepository.findByPhoneNumberAndTypeAndIsUsedFalseAndExpiresAtAfter(
                    phoneNumber, type, LocalDateTime.now());

            if (recentOtp.isPresent()) {
                Otp otp = recentOtp.get();
                // Check if enough time has passed since last OTP (rate limiting)
                if (otp.getCreatedAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                    throw new RuntimeException("Please wait before requesting another OTP");
                }
            }

            return generateOtp(phoneNumber, type);
        } catch (Exception e) {
            log.error("Failed to resend OTP for phone number: {}", phoneNumber, e);
            throw new RuntimeException("Failed to resend OTP", e);
        }
    }

    /**
     * Clean up expired OTPs
     */
    @Transactional
    public void cleanupExpiredOtps() {
        try {
            otpRepository.deleteExpiredOtps(LocalDateTime.now());
            log.info("Cleaned up expired OTPs");
        } catch (Exception e) {
            log.error("Failed to cleanup expired OTPs", e);
        }
    }

    /**
     * Generate random OTP code
     */
    private String generateOtpCode() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }

    /**
     * Get OTP statistics
     */
    public OtpStatistics getOtpStatistics() {
        try {
            long totalOtps = otpRepository.count();
            long usedOtps = otpRepository.countByIsUsedTrue();
            long expiredOtps = otpRepository.countByExpiresAtBefore(LocalDateTime.now());
            long activeOtps = otpRepository.countByIsUsedFalseAndExpiresAtAfter(LocalDateTime.now());

            return new OtpStatistics(totalOtps, usedOtps, expiredOtps, activeOtps);
        } catch (Exception e) {
            log.error("Failed to get OTP statistics", e);
            return new OtpStatistics(0, 0, 0, 0);
        }
    }

    public static class OtpStatistics {
        private final long totalOtps;
        private final long usedOtps;
        private final long expiredOtps;
        private final long activeOtps;

        public OtpStatistics(long totalOtps, long usedOtps, long expiredOtps, long activeOtps) {
            this.totalOtps = totalOtps;
            this.usedOtps = usedOtps;
            this.expiredOtps = expiredOtps;
            this.activeOtps = activeOtps;
        }

        // Getters
        public long getTotalOtps() { return totalOtps; }
        public long getUsedOtps() { return usedOtps; }
        public long getExpiredOtps() { return expiredOtps; }
        public long getActiveOtps() { return activeOtps; }
    }
} 