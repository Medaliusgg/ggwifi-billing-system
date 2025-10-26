package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class EnhancedRadiusService {
    
    private static final Logger logger = LoggerFactory.getLogger(EnhancedRadiusService.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private RadiusCheckRepository radiusCheckRepository;
    
    @Autowired
    private RadiusReplyRepository radiusReplyRepository;
    
    @Autowired
    private RadiusAcctRepository radiusAcctRepository;
    
    @Autowired
    private RadiusNasRepository radiusNasRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private InternetPackageRepository internetPackageRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private MikroTikApiService mikrotikApiService;
    
    /**
     * Create RADIUS user after successful payment
     */
    @Transactional
    public boolean createRadiusUserAfterPayment(Long paymentId, String phoneNumber, String voucherCode) {
        try {
            // Get payment details
            Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
            
            if (payment.getStatus() != Payment.PaymentStatus.SUCCESSFUL) {
                logger.warn("Payment {} is not successful, cannot create RADIUS user", paymentId);
                return false;
            }
            
            // Get customer by phone number
            Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Get voucher details
            Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
            
            // Get internet package
            InternetPackage internetPackage = internetPackageRepository.findById(voucher.getPackageId())
                .orElseThrow(() -> new RuntimeException("Internet package not found"));
            
            // Calculate time limit in seconds
            int timeLimitSeconds = calculateTimeLimit(internetPackage);
            
            // Create RADIUS user credentials
            String radiusUsername = generateRadiusUsername(phoneNumber, voucherCode);
            String radiusPassword = generateRadiusPassword(voucherCode);
            
            // Create RADIUS check entry (authentication)
            RadiusCheck radiusCheck = new RadiusCheck();
            radiusCheck.setUsername(radiusUsername);
            radiusCheck.setAttribute("Cleartext-Password");
            radiusCheck.setOp(":=");
            radiusCheck.setValue(radiusPassword);
            radiusCheckRepository.save(radiusCheck);
            
            // Create RADIUS reply entries (authorization)
            createRadiusReplyEntries(radiusUsername, internetPackage, timeLimitSeconds);
            
            // Create user on MikroTik routers
            createUserOnMikroTikRouters(radiusUsername, radiusPassword, timeLimitSeconds);
            
            // Update voucher status
            voucher.setStatus(Voucher.VoucherStatus.ACTIVE);
            voucher.setActivatedAt(LocalDateTime.now());
            voucher.setActivatedBy(phoneNumber);
            voucherRepository.save(voucher);
            
            // Update customer last activity
            customer.setLastActivityAt(LocalDateTime.now());
            customer.setStatus(Customer.CustomerStatus.ACTIVE);
            customerRepository.save(customer);
            
            logger.info("Successfully created RADIUS user '{}' for customer {} after payment {}", 
                       radiusUsername, phoneNumber, paymentId);
            
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to create RADIUS user after payment {}: {}", paymentId, e.getMessage());
            return false;
        }
    }
    
    /**
     * Create RADIUS user for voucher login (printable vouchers)
     */
    @Transactional
    public boolean createRadiusUserForVoucherLogin(String phoneNumber, String voucherCode) {
        try {
            // Get customer by phone number
            Customer customer = customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Get voucher details
            Voucher voucher = voucherRepository.findByVoucherCode(voucherCode)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
            
            if (voucher.getStatus() != Voucher.VoucherStatus.GENERATED) {
                logger.warn("Voucher {} is not available for activation", voucherCode);
                return false;
            }
            
            // Get internet package
            InternetPackage internetPackage = internetPackageRepository.findById(voucher.getPackageId())
                .orElseThrow(() -> new RuntimeException("Internet package not found"));
            
            // Calculate time limit in seconds
            int timeLimitSeconds = calculateTimeLimit(internetPackage);
            
            // Create RADIUS user credentials
            String radiusUsername = generateRadiusUsername(phoneNumber, voucherCode);
            String radiusPassword = generateRadiusPassword(voucherCode);
            
            // Create RADIUS check entry (authentication)
            RadiusCheck radiusCheck = new RadiusCheck();
            radiusCheck.setUsername(radiusUsername);
            radiusCheck.setAttribute("Cleartext-Password");
            radiusCheck.setOp(":=");
            radiusCheck.setValue(radiusPassword);
            radiusCheckRepository.save(radiusCheck);
            
            // Create RADIUS reply entries (authorization)
            createRadiusReplyEntries(radiusUsername, internetPackage, timeLimitSeconds);
            
            // Create user on MikroTik routers
            createUserOnMikroTikRouters(radiusUsername, radiusPassword, timeLimitSeconds);
            
            // Update voucher status
            voucher.setStatus(Voucher.VoucherStatus.ACTIVE);
            voucher.setActivatedAt(LocalDateTime.now());
            voucher.setActivatedBy(phoneNumber);
            voucherRepository.save(voucher);
            
            // Update customer last activity
            customer.setLastActivityAt(LocalDateTime.now());
            customer.setStatus(Customer.CustomerStatus.ACTIVE);
            customerRepository.save(customer);
            
            logger.info("Successfully created RADIUS user '{}' for voucher login: {}", radiusUsername, voucherCode);
            
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to create RADIUS user for voucher login {}: {}", voucherCode, e.getMessage());
            return false;
        }
    }
    
    /**
     * Remove RADIUS user when session expires
     */
    @Transactional
    public boolean removeRadiusUser(String phoneNumber, String voucherCode) {
        try {
            String radiusUsername = generateRadiusUsername(phoneNumber, voucherCode);
            
            // Remove RADIUS check entries
            radiusCheckRepository.deleteByUsername(radiusUsername);
            
            // Remove RADIUS reply entries
            radiusReplyRepository.deleteByUsername(radiusUsername);
            
            // Remove user from MikroTik routers
            removeUserFromMikroTikRouters(radiusUsername);
            
            logger.info("Successfully removed RADIUS user '{}'", radiusUsername);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to remove RADIUS user for {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }
    
    /**
     * Get active RADIUS sessions
     */
    public List<Map<String, Object>> getActiveRadiusSessions() {
        try {
            String sql = """
                SELECT 
                    ra.username,
                    ra.nasipaddress,
                    ra.acctstarttime,
                    ra.acctsessiontime,
                    ra.acctinputoctets,
                    ra.acctoutputoctets,
                    ra.callingstationid,
                    ra.framedipaddress
                FROM radacct ra
                WHERE ra.acctstoptime IS NULL
                ORDER BY ra.acctstarttime DESC
                """;
            
            return jdbcTemplate.queryForList(sql);
            
        } catch (Exception e) {
            logger.error("Failed to get active RADIUS sessions: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Get RADIUS user statistics
     */
    public Map<String, Object> getRadiusUserStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Total RADIUS users
            long totalUsers = radiusCheckRepository.count();
            stats.put("totalUsers", totalUsers);
            
            // Active sessions
            List<Map<String, Object>> activeSessions = getActiveRadiusSessions();
            stats.put("activeSessions", activeSessions.size());
            
            // Sessions by NAS
            Map<String, Long> sessionsByNas = new HashMap<>();
            for (Map<String, Object> session : activeSessions) {
                String nasIp = (String) session.get("nasipaddress");
                sessionsByNas.put(nasIp, sessionsByNas.getOrDefault(nasIp, 0L) + 1);
            }
            stats.put("sessionsByNas", sessionsByNas);
            
            // Data usage statistics
            String dataUsageSql = """
                SELECT 
                    SUM(acctinputoctets + acctoutputoctets) as totalBytes,
                    COUNT(*) as totalSessions
                FROM radacct 
                WHERE acctstarttime >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                """;
            
            Map<String, Object> dataStats = jdbcTemplate.queryForMap(dataUsageSql);
            stats.put("dataUsage24h", dataStats);
            
            return stats;
            
        } catch (Exception e) {
            logger.error("Failed to get RADIUS user statistics: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }
    
    /**
     * Validate voucher code and phone number combination
     */
    public boolean validateVoucherLogin(String phoneNumber, String voucherCode) {
        try {
            // Check if customer exists
            Optional<Customer> customer = customerRepository.findByPhoneNumber(phoneNumber);
            if (customer.isEmpty()) {
                logger.warn("Customer not found for phone number: {}", phoneNumber);
                return false;
            }
            
            // Check if voucher exists and is valid
            Optional<Voucher> voucher = voucherRepository.findByVoucherCode(voucherCode);
            if (voucher.isEmpty()) {
                logger.warn("Voucher not found: {}", voucherCode);
                return false;
            }
            
            Voucher v = voucher.get();
            if (v.getStatus() != Voucher.VoucherStatus.GENERATED && v.getStatus() != Voucher.VoucherStatus.ACTIVE) {
                logger.warn("Voucher {} is not valid for login", voucherCode);
                return false;
            }
            
            // Check if voucher is not expired
            if (v.getExpiresAt() != null && v.getExpiresAt().isBefore(LocalDateTime.now())) {
                logger.warn("Voucher {} has expired", voucherCode);
                return false;
            }
            
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to validate voucher login for {}: {}", phoneNumber, e.getMessage());
            return false;
        }
    }
    
    // Helper methods
    
    private int calculateTimeLimit(InternetPackage internetPackage) {
        // Convert package duration to seconds
        switch (internetPackage.getDuration()) {
            case "HOURLY":
                return internetPackage.getDurationDays() * 3600; // hours to seconds
            case "DAILY":
                return internetPackage.getDurationDays() * 24 * 3600; // days to seconds
            case "WEEKLY":
                return internetPackage.getDurationDays() * 7 * 24 * 3600; // weeks to seconds
            case "MONTHLY":
                return internetPackage.getDurationDays() * 30 * 24 * 3600; // months to seconds
            default:
                return 24 * 3600; // default 24 hours
        }
    }
    
    private String generateRadiusUsername(String phoneNumber, String voucherCode) {
        // Create unique username: phone_voucher (e.g., 0742920510_VCH123456)
        return phoneNumber + "_" + voucherCode;
    }
    
    private String generateRadiusPassword(String voucherCode) {
        // Use voucher code as password for simplicity
        return voucherCode;
    }
    
    private void createRadiusReplyEntries(String username, InternetPackage internetPackage, int timeLimitSeconds) {
        // Create time limit reply
        RadiusReply timeLimitReply = new RadiusReply();
        timeLimitReply.setUsername(username);
        timeLimitReply.setAttribute("Session-Timeout");
        timeLimitReply.setOp(":=");
        timeLimitReply.setValue(String.valueOf(timeLimitSeconds));
        radiusReplyRepository.save(timeLimitReply);
        
        // Create idle timeout reply
        RadiusReply idleTimeoutReply = new RadiusReply();
        idleTimeoutReply.setUsername(username);
        idleTimeoutReply.setAttribute("Idle-Timeout");
        idleTimeoutReply.setOp(":=");
        idleTimeoutReply.setValue("300"); // 5 minutes idle timeout
        radiusReplyRepository.save(idleTimeoutReply);
        
        // Create service type reply
        RadiusReply serviceTypeReply = new RadiusReply();
        serviceTypeReply.setUsername(username);
        serviceTypeReply.setAttribute("Service-Type");
        serviceTypeReply.setOp(":=");
        serviceTypeReply.setValue("Framed-User");
        radiusReplyRepository.save(serviceTypeReply);
        
        // Create framed protocol reply
        RadiusReply framedProtocolReply = new RadiusReply();
        framedProtocolReply.setUsername(username);
        framedProtocolReply.setAttribute("Framed-Protocol");
        framedProtocolReply.setOp(":=");
        framedProtocolReply.setValue("PPP");
        radiusReplyRepository.save(framedProtocolReply);
    }
    
    private void createUserOnMikroTikRouters(String username, String password, int timeLimitSeconds) {
        // This would iterate through all configured MikroTik routers
        // For now, we'll use a default router configuration
        try {
            // Get default router configuration (this should come from database)
            String routerId = "DEFAULT_ROUTER";
            String routerIp = "192.168.1.1";
            String routerUsername = "admin";
            String routerPassword = "admin123";
            int routerPort = 8728;
            
            // Connect and create user
            if (mikrotikApiService.connectToRouter(routerId, routerIp, routerUsername, routerPassword, routerPort)) {
                mikrotikApiService.createRadiusUser(routerId, routerIp, username, password, "default", timeLimitSeconds);
            }
            
        } catch (Exception e) {
            logger.error("Failed to create user on MikroTik routers: {}", e.getMessage());
        }
    }
    
    private void removeUserFromMikroTikRouters(String username) {
        try {
            // Get default router configuration
            String routerId = "DEFAULT_ROUTER";
            String routerIp = "192.168.1.1";
            
            if (mikrotikApiService.isConnected(routerId, routerIp)) {
                mikrotikApiService.removeRadiusUser(routerId, routerIp, username);
            }
            
        } catch (Exception e) {
            logger.error("Failed to remove user from MikroTik routers: {}", e.getMessage());
        }
    }
}
