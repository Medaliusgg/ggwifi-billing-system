package com.ggnetworks.service;

import com.ggnetworks.entity.HotspotVoucher;
import com.ggnetworks.entity.Package;
import com.ggnetworks.entity.RadiusReply;
import com.ggnetworks.entity.RadiusUser;
import com.ggnetworks.repository.HotspotVoucherRepository;
import com.ggnetworks.repository.PackageRepository;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherService {

    private final HotspotVoucherRepository voucherRepository;
    private final PackageRepository packageRepository;
    private final UserRepository userRepository;
    private final RadiusService radiusService;
    private final MikroTikService mikrotikService;

    @Value("${voucher.code.length:8}")
    private int voucherCodeLength;

    @Value("${voucher.code.prefix:GG}")
    private String voucherPrefix;

    @Value("${voucher.expiration.default-days:30}")
    private int defaultExpirationDays;

    @Value("${voucher.validation.check-mac:true}")
    private boolean checkMacAddress;

    @Value("${voucher.validation.allow-multiple-devices:false}")
    private boolean allowMultipleDevices;

    /**
     * Generate a single voucher with FreeRADIUS integration
     */
    @Transactional
    public HotspotVoucher generateVoucher(Long packageId, String assignedTo, LocalDateTime expiresAt) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found");
            }

            Package pkg = packageOpt.get();
            
            // Generate unique voucher code
            String voucherCode = generateUniqueVoucherCode();
            
            // Set expiration date if not provided
            if (expiresAt == null) {
                expiresAt = LocalDateTime.now().plusDays(defaultExpirationDays);
            }

            HotspotVoucher voucher = new HotspotVoucher();
            voucher.setVoucherCode(voucherCode);
            voucher.setPackageEntity(pkg);
            voucher.setStatus(HotspotVoucher.VoucherStatus.GENERATED);
            voucher.setAssignedTo(assignedTo);
            voucher.setExpiresAt(expiresAt);

            voucher = voucherRepository.save(voucher);
            log.info("Generated voucher: {} for package: {}", voucherCode, pkg.getName());
            
            // Create FreeRADIUS entry for voucher authentication
            createVoucherInRadius(voucher, pkg);
            
            return voucher;
        } catch (Exception e) {
            log.error("Failed to generate voucher for package: {}", packageId, e);
            throw new RuntimeException("Failed to generate voucher", e);
        }
    }

    /**
     * Generate bulk vouchers with FreeRADIUS integration
     */
    @Transactional
    public List<HotspotVoucher> generateBulkVouchers(Long packageId, int quantity, String assignedTo, LocalDateTime expiresAt) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found");
            }

            Package pkg = packageOpt.get();
            List<HotspotVoucher> vouchers = new ArrayList<>();

            // Set expiration date if not provided
            if (expiresAt == null) {
                expiresAt = LocalDateTime.now().plusDays(defaultExpirationDays);
            }

            for (int i = 0; i < quantity; i++) {
                String voucherCode = generateUniqueVoucherCode();
                
                HotspotVoucher voucher = new HotspotVoucher();
                voucher.setVoucherCode(voucherCode);
                voucher.setPackageEntity(pkg);
                voucher.setStatus(HotspotVoucher.VoucherStatus.GENERATED);
                voucher.setAssignedTo(assignedTo);
                voucher.setExpiresAt(expiresAt);

                vouchers.add(voucher);
            }

            List<HotspotVoucher> savedVouchers = voucherRepository.saveAll(vouchers);
            log.info("Generated {} vouchers for package: {}", quantity, pkg.getName());
            
            // Create FreeRADIUS entries for all vouchers
            for (HotspotVoucher voucher : savedVouchers) {
                createVoucherInRadius(voucher, pkg);
            }
            
            return savedVouchers;
        } catch (Exception e) {
            log.error("Failed to generate bulk vouchers for package: {}", packageId, e);
            throw new RuntimeException("Failed to generate bulk vouchers", e);
        }
    }

    /**
     * Validate voucher in real-time
     */
    @Transactional
    public VoucherValidationResult validateVoucher(String voucherCode, String macAddress, String ipAddress) {
        try {
            log.info("Validating voucher: {} for MAC: {}, IP: {}", voucherCode, macAddress, ipAddress);

            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            if (voucherOpt.isEmpty()) {
                return VoucherValidationResult.builder()
                        .valid(false)
                        .message("Invalid voucher code")
                        .build();
            }

            HotspotVoucher voucher = voucherOpt.get();

            // Check voucher status
            if (voucher.getStatus() == HotspotVoucher.VoucherStatus.EXPIRED) {
                return VoucherValidationResult.builder()
                        .valid(false)
                        .message("Voucher has expired")
                        .build();
            }

            if (voucher.getStatus() == HotspotVoucher.VoucherStatus.USED && !allowMultipleDevices) {
                // Check if voucher is already in use by another device
                // For now, we'll use a simple check - this can be enhanced later
                if (voucher.getAssignedTo() != null && !voucher.getAssignedTo().equals(macAddress)) {
                    return VoucherValidationResult.builder()
                            .valid(false)
                            .message("Voucher is already in use by another device")
                            .build();
                }
            }

            // Check expiration
            if (voucher.getExpiresAt().isBefore(LocalDateTime.now())) {
                voucher.setStatus(HotspotVoucher.VoucherStatus.EXPIRED);
                voucherRepository.save(voucher);
                
                return VoucherValidationResult.builder()
                        .valid(false)
                        .message("Voucher has expired")
                        .build();
            }

            // Check MAC address binding if enabled
            if (checkMacAddress && voucher.getAssignedTo() != null && !voucher.getAssignedTo().equals(macAddress)) {
                return VoucherValidationResult.builder()
                        .valid(false)
                        .message("Voucher is not assigned to this device")
                        .build();
            }

            // Voucher is valid
            Package pkg = voucher.getPackageEntity();
            
            VoucherValidationResult result = VoucherValidationResult.builder()
                    .valid(true)
                    .message("Voucher is valid")
                    .voucherId(voucher.getId())
                    .packageId(pkg.getId())
                    .packageName(pkg.getName())
                    .durationDays(pkg.getDurationDays())
                    .bandwidthLimitMb(pkg.getBandwidthLimitMb())
                    .price(pkg.getPrice().doubleValue())
                    .build();

            log.info("Voucher validation successful: {}", voucherCode);
            return result;

        } catch (Exception e) {
            log.error("Failed to validate voucher: {}", voucherCode, e);
            return VoucherValidationResult.builder()
                    .valid(false)
                    .message("Validation failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Activate voucher
     */
    @Transactional
    public boolean activateVoucher(String voucherCode, String macAddress, String ipAddress) {
        try {
            log.info("Activating voucher: {} for MAC: {}, IP: {}", voucherCode, macAddress, ipAddress);

            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            if (voucherOpt.isEmpty()) {
                log.warn("Voucher not found: {}", voucherCode);
                return false;
            }

            HotspotVoucher voucher = voucherOpt.get();

            // Validate voucher first
            VoucherValidationResult validation = validateVoucher(voucherCode, macAddress, ipAddress);
            if (!validation.isValid()) {
                log.warn("Voucher validation failed: {}", validation.getMessage());
                return false;
            }

            // Update voucher status
            voucher.setStatus(HotspotVoucher.VoucherStatus.ASSIGNED);
            voucher.setAssignedTo(macAddress);
            voucherRepository.save(voucher);

            // Create RADIUS session
            String username = "voucher_" + voucherCode;
            String password = voucherCode; // Use voucher code as password
            
            RadiusService.RadiusAuthResult authResult = radiusService.authenticateUser(username, password, macAddress, ipAddress);
            
            if (authResult.isSuccess()) {
                log.info("Voucher activated successfully: {}", voucherCode);
                return true;
            } else {
                log.error("Failed to activate voucher: {}. Error: {}", voucherCode, authResult.getMessage());
                return false;
            }

        } catch (Exception e) {
            log.error("Failed to activate voucher: {}", voucherCode, e);
            return false;
        }
    }

    /**
     * Deactivate voucher
     */
    @Transactional
    public boolean deactivateVoucher(String voucherCode, String macAddress) {
        try {
            log.info("Deactivating voucher: {} for MAC: {}", voucherCode, macAddress);

            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode);
            if (voucherOpt.isEmpty()) {
                return false;
            }

            HotspotVoucher voucher = voucherOpt.get();

            // Disconnect user from all routers
            boolean disconnected = radiusService.disconnectUser("voucher_" + voucherCode, macAddress);
            
            if (disconnected) {
                // Update voucher status
                voucher.setStatus(HotspotVoucher.VoucherStatus.GENERATED);
                voucher.setAssignedTo(null);
                voucher.setUsedAt(null);
                voucherRepository.save(voucher);

                log.info("Voucher deactivated successfully: {}", voucherCode);
                return true;
            } else {
                log.warn("Failed to disconnect user for voucher: {}", voucherCode);
                return false;
            }

        } catch (Exception e) {
            log.error("Failed to deactivate voucher: {}", voucherCode, e);
            return false;
        }
    }

    /**
     * Get voucher usage statistics
     */
    public Map<String, Object> getVoucherStatistics() {
        try {
            long totalVouchers = voucherRepository.count();
            long generatedVouchers = voucherRepository.countByStatus(HotspotVoucher.VoucherStatus.GENERATED);
            long assignedVouchers = voucherRepository.countByStatus(HotspotVoucher.VoucherStatus.ASSIGNED);
            long usedVouchers = voucherRepository.countByStatus(HotspotVoucher.VoucherStatus.USED);
            long expiredVouchers = voucherRepository.countByStatus(HotspotVoucher.VoucherStatus.EXPIRED);

            // Calculate usage rate
            double usageRate = totalVouchers > 0 ? (double) usedVouchers / totalVouchers * 100 : 0;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalVouchers", totalVouchers);
            stats.put("generatedVouchers", generatedVouchers);
            stats.put("assignedVouchers", assignedVouchers);
            stats.put("usedVouchers", usedVouchers);
            stats.put("expiredVouchers", expiredVouchers);
            stats.put("usageRate", usageRate);

            return stats;
        } catch (Exception e) {
            log.error("Failed to get voucher statistics", e);
            return new HashMap<>();
        }
    }

    /**
     * Get vouchers by package
     */
    public List<HotspotVoucher> getVouchersByPackage(Long packageId) {
        return voucherRepository.findByPackageId(packageId);
    }

    /**
     * Get vouchers by status
     */
    public List<HotspotVoucher> getVouchersByStatus(HotspotVoucher.VoucherStatus status) {
        return voucherRepository.findByStatus(status);
    }

    /**
     * Get vouchers by assigned user
     */
    public List<HotspotVoucher> getVouchersByAssignedTo(String assignedTo) {
        return voucherRepository.findByAssignedTo(assignedTo);
    }

    /**
     * Get voucher history by user with pagination
     */
    public org.springframework.data.domain.Page<HotspotVoucher> getVoucherHistoryByUser(String phoneNumber, org.springframework.data.domain.Pageable pageable) {
        return voucherRepository.findByAssignedToAndDeletedAtIsNull(phoneNumber, pageable);
    }

    /**
     * Get expiring vouchers
     */
    public List<HotspotVoucher> getExpiringVouchers(int daysThreshold) {
        LocalDateTime threshold = LocalDateTime.now().plusDays(daysThreshold);
        return voucherRepository.findExpiredVouchers(threshold);
    }

    /**
     * Clean up expired vouchers
     */
    @Transactional
    public int cleanupExpiredVouchers() {
        try {
            List<HotspotVoucher> expiredVouchers = voucherRepository.findExpiredVouchers(LocalDateTime.now());

            for (HotspotVoucher voucher : expiredVouchers) {
                voucher.setStatus(HotspotVoucher.VoucherStatus.EXPIRED);
            }

            voucherRepository.saveAll(expiredVouchers);
            log.info("Cleaned up {} expired vouchers", expiredVouchers.size());
            
            return expiredVouchers.size();
        } catch (Exception e) {
            log.error("Failed to cleanup expired vouchers", e);
            return 0;
        }
    }

    /**
     * Generate unique voucher code
     */
    private String generateUniqueVoucherCode() {
        String voucherCode;
        do {
            voucherCode = voucherPrefix + generateRandomString(voucherCodeLength - voucherPrefix.length());
        } while (voucherRepository.existsByVoucherCodeAndDeletedAtIsNull(voucherCode));
        
        return voucherCode;
    }

    /**
     * Generate random string
     */
    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return sb.toString();
    }

    /**
     * Voucher validation result
     */
    public static class VoucherValidationResult {
        private boolean valid;
        private String message;
        private Long voucherId;
        private Long packageId;
        private String packageName;
        private Integer durationDays;
        private Long bandwidthLimitMb;
        private Double price;

        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private VoucherValidationResult result = new VoucherValidationResult();

            public Builder valid(boolean valid) {
                result.valid = valid;
                return this;
            }

            public Builder message(String message) {
                result.message = message;
                return this;
            }

            public Builder voucherId(Long voucherId) {
                result.voucherId = voucherId;
                return this;
            }

            public Builder packageId(Long packageId) {
                result.packageId = packageId;
                return this;
            }

            public Builder packageName(String packageName) {
                result.packageName = packageName;
                return this;
            }

            public Builder durationDays(Integer durationDays) {
                result.durationDays = durationDays;
                return this;
            }

            public Builder bandwidthLimitMb(Long bandwidthLimitMb) {
                result.bandwidthLimitMb = bandwidthLimitMb;
                return this;
            }

            public Builder price(Double price) {
                result.price = price;
                return this;
            }

            public VoucherValidationResult build() {
                return result;
            }
        }

        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Long getVoucherId() { return voucherId; }
        public Long getPackageId() { return packageId; }
        public String getPackageName() { return packageName; }
        public Integer getDurationDays() { return durationDays; }
        public Long getBandwidthLimitMb() { return bandwidthLimitMb; }
        public Double getPrice() { return price; }
        
        // Additional methods for controller compatibility
        public Map<String, Object> getSessionInfo() {
            Map<String, Object> sessionInfo = new HashMap<>();
            sessionInfo.put("packageName", packageName);
            sessionInfo.put("durationDays", durationDays);
            sessionInfo.put("bandwidthLimitMb", bandwidthLimitMb);
            sessionInfo.put("price", price);
            return sessionInfo;
        }
    }

    public HotspotVoucher getVoucherByCode(String voucherCode) {
        try {
            return voucherRepository.findByVoucherCodeAndDeletedAtIsNull(voucherCode).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get voucher by code", e);
            return null;
        }
    }

    public HotspotVoucher processPaymentCallback(Map<String, Object> callback) {
        try {
            // This is a placeholder implementation
            // In a real implementation, you would process the payment callback
            // and generate a voucher based on the payment details
            log.info("Processing payment callback: {}", callback);
            
            // Extract payment details from callback
            String phoneNumber = (String) callback.get("phoneNumber");
            Long packageId = Long.valueOf(callback.get("packageId").toString());
            
            // Create PPPoE user in FreeRADIUS after successful payment
            createPppoeUserInRadius(phoneNumber, packageId);
            
            return null; // Return null for now as this is a placeholder
        } catch (Exception e) {
            log.error("Failed to process payment callback", e);
            throw new RuntimeException("Failed to process payment callback", e);
        }
    }

    /**
     * Create FreeRADIUS entry for voucher authentication
     */
    private void createVoucherInRadius(HotspotVoucher voucher, Package pkg) {
        try {
            // Create radcheck entry for voucher authentication
            RadiusUser radiusUser = new RadiusUser();
            radiusUser.setUsername("voucher_" + voucher.getVoucherCode());
            radiusUser.setAttribute("Cleartext-Password");
            radiusUser.setValue(voucher.getVoucherCode());
            radiusUser.setOp(":=");
            radiusUser.setUserType(RadiusUser.UserType.HOTSPOT_USER);
            radiusUser.setNasIdentifier("GGNetworks-Hotspot");
            radiusUser.setPackageId(pkg.getId());
            radiusUser.setExpiresAt(voucher.getExpiresAt());
            radiusUser.setIsActive(true);
            radiusUser.setDataLimitMb(pkg.getBandwidthLimitMb());
            radiusUser.setTimeLimitMinutes((long) (pkg.getDurationDays() * 24 * 60)); // Convert days to minutes
            radiusUser.setSessionTimeout((long) (pkg.getDurationDays() * 24 * 60 * 60)); // Convert days to seconds
            radiusUser.setIdleTimeout(300L); // 5 minutes idle timeout
            radiusUser.setConcurrentUse(1); // Single device only
            radiusUser.setNotes("Voucher: " + voucher.getVoucherCode() + " | Package: " + pkg.getName());

            radiusService.createRadiusUser(radiusUser);
            log.info("Created FreeRADIUS entry for voucher: {}", voucher.getVoucherCode());

            // Add Expiration check used by FreeRADIUS 'expiration' module
            RadiusUser expirationCheck = new RadiusUser();
            expirationCheck.setUsername("voucher_" + voucher.getVoucherCode());
            expirationCheck.setAttribute("Expiration");
            expirationCheck.setOp(":=");
            expirationCheck.setValue(formatExpiration(voucher.getExpiresAt()));
            expirationCheck.setUserType(RadiusUser.UserType.HOTSPOT_USER);
            expirationCheck.setNasIdentifier("GGNetworks-Hotspot");
            expirationCheck.setPackageId(pkg.getId());
            expirationCheck.setIsActive(true);
            radiusService.createRadiusUser(expirationCheck);

            // Enforce single concurrent session at RADIUS level
            RadiusUser simultaneousUse = new RadiusUser();
            simultaneousUse.setUsername("voucher_" + voucher.getVoucherCode());
            simultaneousUse.setAttribute("Simultaneous-Use");
            simultaneousUse.setOp(":=");
            simultaneousUse.setValue("1");
            simultaneousUse.setUserType(RadiusUser.UserType.HOTSPOT_USER);
            simultaneousUse.setNasIdentifier("GGNetworks-Hotspot");
            simultaneousUse.setPackageId(pkg.getId());
            simultaneousUse.setIsActive(true);
            radiusService.createRadiusUser(simultaneousUse);

            // Create radreply entry for rate limiting and session attributes
            // Note: Using default speed values since Package entity doesn't have speed fields
            // In production, you should use DataPlan entity which has speed fields
            RadiusReply radiusReply = new RadiusReply();
            radiusReply.setUsername("voucher_" + voucher.getVoucherCode());
            radiusReply.setAttribute("WISPr-Bandwidth-Max-Down");
            radiusReply.setValue("10000000"); // Default 10 Mbps download
            radiusReply.setOp(":=");
            radiusReply.setUserType(RadiusReply.UserType.HOTSPOT_USER);
            radiusReply.setNasIdentifier("GGNetworks-Hotspot");
            radiusReply.setPackageId(pkg.getId());
            radiusReply.setIsActive(true);
            radiusReply.setPriority(1);
            radiusReply.setNotes("Download speed limit for voucher: " + voucher.getVoucherCode());

            radiusService.createRadiusReply(radiusReply);

            // Create upload speed limit
            RadiusReply uploadReply = new RadiusReply();
            uploadReply.setUsername("voucher_" + voucher.getVoucherCode());
            uploadReply.setAttribute("WISPr-Bandwidth-Max-Up");
            uploadReply.setValue("5000000"); // Default 5 Mbps upload
            uploadReply.setOp(":=");
            uploadReply.setUserType(RadiusReply.UserType.HOTSPOT_USER);
            uploadReply.setNasIdentifier("GGNetworks-Hotspot");
            uploadReply.setPackageId(pkg.getId());
            uploadReply.setIsActive(true);
            uploadReply.setPriority(2);
            uploadReply.setNotes("Upload speed limit for voucher: " + voucher.getVoucherCode());

            radiusService.createRadiusReply(uploadReply);

            // Create session timeout
            RadiusReply sessionReply = new RadiusReply();
            sessionReply.setUsername("voucher_" + voucher.getVoucherCode());
            sessionReply.setAttribute("Session-Timeout");
            sessionReply.setValue(String.valueOf(pkg.getDurationDays() * 24 * 60 * 60)); // Convert days to seconds
            sessionReply.setOp(":=");
            sessionReply.setUserType(RadiusReply.UserType.HOTSPOT_USER);
            sessionReply.setNasIdentifier("GGNetworks-Hotspot");
            sessionReply.setPackageId(pkg.getId());
            sessionReply.setIsActive(true);
            sessionReply.setPriority(3);
            sessionReply.setNotes("Session timeout for voucher: " + voucher.getVoucherCode());

            radiusService.createRadiusReply(sessionReply);

            // Add combined rate for MikroTik (commonly honored on PPP/Hotspot)
            RadiusReply mikrotikRate = new RadiusReply();
            mikrotikRate.setUsername("voucher_" + voucher.getVoucherCode());
            mikrotikRate.setAttribute("Mikrotik-Rate-Limit");
            mikrotikRate.setValue("10M/5M");
            mikrotikRate.setOp(":=");
            mikrotikRate.setUserType(RadiusReply.UserType.HOTSPOT_USER);
            mikrotikRate.setNasIdentifier("GGNetworks-Hotspot");
            mikrotikRate.setPackageId(pkg.getId());
            mikrotikRate.setIsActive(true);
            mikrotikRate.setPriority(4);
            mikrotikRate.setNotes("Combined rate for voucher: " + voucher.getVoucherCode());
            radiusService.createRadiusReply(mikrotikRate);

            log.info("Created complete FreeRADIUS configuration for voucher: {}", voucher.getVoucherCode());

        } catch (Exception e) {
            log.error("Failed to create FreeRADIUS entry for voucher: {}", voucher.getVoucherCode(), e);
            throw new RuntimeException("Failed to create FreeRADIUS entry for voucher", e);
        }
    }

    /**
     * Create FreeRADIUS entry for PPPoE user after successful payment
     */
    public void createPppoeUserInRadius(String phoneNumber, Long packageId) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found");
            }

            Package pkg = packageOpt.get();
            
            // Generate PPPoE username (phone number)
            String pppoeUsername = phoneNumber;
            String pppoePassword = generatePppoePassword(phoneNumber);

            // Create radcheck entry for PPPoE authentication
            RadiusUser radiusUser = new RadiusUser();
            radiusUser.setUsername(pppoeUsername);
            radiusUser.setAttribute("Cleartext-Password");
            radiusUser.setValue(pppoePassword);
            radiusUser.setOp(":=");
            radiusUser.setUserType(RadiusUser.UserType.PPPOE_USER);
            radiusUser.setNasIdentifier("GGNetworks-PPPoE");
            radiusUser.setPackageId(pkg.getId());
            radiusUser.setExpiresAt(LocalDateTime.now().plusDays(pkg.getDurationDays()));
            radiusUser.setIsActive(true);
            radiusUser.setDataLimitMb(pkg.getBandwidthLimitMb());
            radiusUser.setTimeLimitMinutes((long) (pkg.getDurationDays() * 24 * 60)); // Convert days to minutes
            radiusUser.setSessionTimeout((long) (pkg.getDurationDays() * 24 * 60 * 60)); // Convert days to seconds
            radiusUser.setIdleTimeout(300L); // 5 minutes idle timeout
            radiusUser.setConcurrentUse(1); // Single device only
            radiusUser.setNotes("PPPoE User: " + phoneNumber + " | Package: " + pkg.getName());

            radiusService.createRadiusUser(radiusUser);
            log.info("Created FreeRADIUS entry for PPPoE user: {}", phoneNumber);

            // Add Expiration for PPPoE
            RadiusUser expirationCheck = new RadiusUser();
            expirationCheck.setUsername(pppoeUsername);
            expirationCheck.setAttribute("Expiration");
            expirationCheck.setOp(":=");
            expirationCheck.setValue(formatExpiration(LocalDateTime.now().plusDays(pkg.getDurationDays())));
            expirationCheck.setUserType(RadiusUser.UserType.PPPOE_USER);
            expirationCheck.setNasIdentifier("GGNetworks-PPPoE");
            expirationCheck.setPackageId(pkg.getId());
            expirationCheck.setIsActive(true);
            radiusService.createRadiusUser(expirationCheck);

            // Enforce single concurrent session at RADIUS level
            RadiusUser simultaneousUse = new RadiusUser();
            simultaneousUse.setUsername(pppoeUsername);
            simultaneousUse.setAttribute("Simultaneous-Use");
            simultaneousUse.setOp(":=");
            simultaneousUse.setValue("1");
            simultaneousUse.setUserType(RadiusUser.UserType.PPPOE_USER);
            simultaneousUse.setNasIdentifier("GGNetworks-PPPoE");
            simultaneousUse.setPackageId(pkg.getId());
            simultaneousUse.setIsActive(true);
            radiusService.createRadiusUser(simultaneousUse);

            // Create radreply entry for rate limiting
            RadiusReply radiusReply = new RadiusReply();
            radiusReply.setUsername(pppoeUsername);
            radiusReply.setAttribute("WISPr-Bandwidth-Max-Down");
            radiusReply.setValue("10000000"); // Default 10 Mbps download
            radiusReply.setOp(":=");
            radiusReply.setUserType(RadiusReply.UserType.PPPOE_USER);
            radiusReply.setNasIdentifier("GGNetworks-PPPoE");
            radiusReply.setPackageId(pkg.getId());
            radiusReply.setIsActive(true);
            radiusReply.setPriority(1);
            radiusReply.setNotes("Download speed limit for PPPoE user: " + phoneNumber);

            radiusService.createRadiusReply(radiusReply);

            // Create upload speed limit
            RadiusReply uploadReply = new RadiusReply();
            uploadReply.setUsername(pppoeUsername);
            uploadReply.setAttribute("WISPr-Bandwidth-Max-Up");
            uploadReply.setValue("5000000"); // Default 5 Mbps upload
            uploadReply.setOp(":=");
            uploadReply.setUserType(RadiusReply.UserType.PPPOE_USER);
            uploadReply.setNasIdentifier("GGNetworks-PPPoE");
            uploadReply.setPackageId(pkg.getId());
            uploadReply.setIsActive(true);
            uploadReply.setPriority(2);
            uploadReply.setNotes("Upload speed limit for PPPoE user: " + phoneNumber);

            radiusService.createRadiusReply(uploadReply);

            // Create session timeout
            RadiusReply sessionReply = new RadiusReply();
            sessionReply.setUsername(pppoeUsername);
            sessionReply.setAttribute("Session-Timeout");
            sessionReply.setValue(String.valueOf(pkg.getDurationDays() * 24 * 60 * 60)); // Convert days to seconds
            sessionReply.setOp(":=");
            sessionReply.setUserType(RadiusReply.UserType.PPPOE_USER);
            sessionReply.setNasIdentifier("GGNetworks-PPPoE");
            sessionReply.setPackageId(pkg.getId());
            sessionReply.setIsActive(true);
            sessionReply.setPriority(3);
            sessionReply.setNotes("Session timeout for PPPoE user: " + phoneNumber);

            radiusService.createRadiusReply(sessionReply);

            // Add MikroTik combined rate
            RadiusReply mikrotikRate = new RadiusReply();
            mikrotikRate.setUsername(pppoeUsername);
            mikrotikRate.setAttribute("Mikrotik-Rate-Limit");
            mikrotikRate.setValue("10M/5M");
            mikrotikRate.setOp(":=");
            mikrotikRate.setUserType(RadiusReply.UserType.PPPOE_USER);
            mikrotikRate.setNasIdentifier("GGNetworks-PPPoE");
            mikrotikRate.setPackageId(pkg.getId());
            mikrotikRate.setIsActive(true);
            mikrotikRate.setPriority(4);
            mikrotikRate.setNotes("Combined rate for PPPoE user: " + phoneNumber);
            radiusService.createRadiusReply(mikrotikRate);

            log.info("Created complete FreeRADIUS configuration for PPPoE user: {}", phoneNumber);

        } catch (Exception e) {
            log.error("Failed to create FreeRADIUS entry for PPPoE user: {}", phoneNumber, e);
            throw new RuntimeException("Failed to create FreeRADIUS entry for PPPoE user", e);
        }
    }

    private String formatExpiration(LocalDateTime expiresAt) {
        if (expiresAt == null) {
            return null;
        }
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd yyyy HH:mm:ss", Locale.ENGLISH);
        return expiresAt.format(fmt);
    }

    /**
     * Generate PPPoE password based on phone number
     */
    private String generatePppoePassword(String phoneNumber) {
        // Generate a secure password based on phone number
        String basePassword = phoneNumber.substring(phoneNumber.length() - 4); // Last 4 digits
        String randomSuffix = generateRandomString(4);
        return basePassword + randomSuffix;
    }
} 