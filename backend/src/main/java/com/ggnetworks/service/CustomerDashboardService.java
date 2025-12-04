package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Customer Dashboard Service
 * Aggregates all customer data for dashboard display
 */
@Service
public class CustomerDashboardService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomerDashboardService.class);
    
    @Autowired
    private CustomerAccountRepository customerAccountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private VoucherSessionRepository voucherSessionRepository;
    
    @Autowired
    private InternetPackageRepository packageRepository;
    
    @Autowired
    private LoyaltyTransactionRepository loyaltyTransactionRepository;
    
    @Autowired
    private LoyaltyRedemptionRepository loyaltyRedemptionRepository;
    
    @Autowired
    private LoyaltyRewardRepository loyaltyRewardRepository;
    
    @Autowired
    private DeviceHistoryRepository deviceHistoryRepository;
    
    @Autowired
    private CustomerDeviceRegistryRepository deviceRegistryRepository;
    
    @Autowired
    private EnhancedLoyaltyService loyaltyService;
    
    /**
     * Get complete dashboard data for customer
     */
    public Map<String, Object> getDashboardData(String phoneNumber) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Get account
            Optional<CustomerAccount> accountOpt = customerAccountRepository.findByPhoneNumber(phoneNumber);
            if (accountOpt.isEmpty()) {
                dashboard.put("error", "Account not found");
                return dashboard;
            }
            
            CustomerAccount account = accountOpt.get();
            
            // A. Customer Profile
            dashboard.put("profile", getCustomerProfile(phoneNumber, account));
            
            // B. GGPoints Module
            dashboard.put("loyalty", getLoyaltyData(phoneNumber));
            
            // C. Transactions & Payment History
            dashboard.put("transactions", getTransactionHistory(phoneNumber));
            
            // D. Package History
            dashboard.put("packages", getPackageHistory(phoneNumber));
            
            // E. Active Voucher Sessions
            dashboard.put("activeSessions", getActiveSessions(phoneNumber));
            
            // F. Device Registry
            dashboard.put("devices", getDeviceRegistry(phoneNumber));
            
            // G. Available Rewards
            dashboard.put("availableRewards", getAvailableRewards(phoneNumber));
            
            // H. Statistics Summary
            dashboard.put("statistics", getStatistics(phoneNumber));
            
            return dashboard;
            
        } catch (Exception e) {
            logger.error("Error getting dashboard data: {}", e.getMessage(), e);
            dashboard.put("error", e.getMessage());
            return dashboard;
        }
    }
    
    /**
     * A. Customer Profile
     */
    private Map<String, Object> getCustomerProfile(String phoneNumber, CustomerAccount account) {
        Map<String, Object> profile = new HashMap<>();
        
        // Get customer entity if exists
        Optional<Customer> customerOpt = customerRepository.findByPrimaryPhoneNumber(phoneNumber);
        
        profile.put("phoneNumber", phoneNumber);
        profile.put("fullName", account.getFullName() != null ? account.getFullName() : 
                   (customerOpt.isPresent() ? 
                    customerOpt.get().getFirstName() + " " + customerOpt.get().getLastName() : ""));
        profile.put("email", account.getEmail() != null ? account.getEmail() : 
                   (customerOpt.isPresent() ? customerOpt.get().getEmail() : ""));
        profile.put("isVerified", account.getIsVerified());
        profile.put("lastSeen", account.getLastSeenAt());
        profile.put("lastLogin", account.getLastLoginAt());
        profile.put("createdAt", account.getCreatedAt());
        
        // Device history count
        long deviceCount = deviceHistoryRepository.findByPhoneNumber(phoneNumber).size();
        profile.put("deviceCount", deviceCount);
        
        // Loyalty tier
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            profile.put("loyaltyTier", customer.getLoyaltyTier() != null ? customer.getLoyaltyTier().toString() : "BRONZE");
            profile.put("loyaltyPoints", customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0);
        } else {
            profile.put("loyaltyTier", "BRONZE");
            profile.put("loyaltyPoints", 0);
        }
        
        return profile;
    }
    
    /**
     * B. GGPoints Module
     */
    private Map<String, Object> getLoyaltyData(String phoneNumber) {
        Map<String, Object> loyalty = new HashMap<>();
        
        try {
            // Get customer
            Optional<Customer> customerOpt = customerRepository.findByPrimaryPhoneNumber(phoneNumber);
            if (customerOpt.isEmpty()) {
                loyalty.put("totalPoints", 0);
                loyalty.put("tier", "BRONZE");
                loyalty.put("transactions", new ArrayList<>());
                loyalty.put("redemptions", new ArrayList<>());
                return loyalty;
            }
            
            Customer customer = customerOpt.get();
            
            loyalty.put("totalPoints", customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0);
            loyalty.put("tier", customer.getLoyaltyTier() != null ? customer.getLoyaltyTier().toString() : "BRONZE");
            loyalty.put("totalEarned", customer.getTotalPointsEarned() != null ? customer.getTotalPointsEarned() : 0);
            loyalty.put("totalRedeemed", customer.getTotalPointsRedeemed() != null ? customer.getTotalPointsRedeemed() : 0);
            
            // Get transactions
            List<LoyaltyTransaction> transactions = loyaltyTransactionRepository.findByPhoneNumber(phoneNumber);
            List<Map<String, Object>> transactionList = transactions.stream()
                .limit(20) // Last 20 transactions
                .map(t -> {
                    Map<String, Object> tx = new HashMap<>();
                    tx.put("id", t.getId());
                    tx.put("type", t.getTransactionType().toString());
                    tx.put("points", t.getPoints());
                    tx.put("balance", t.getBalanceAfter());
                    tx.put("description", t.getDescription());
                    tx.put("createdAt", t.getCreatedAt());
                    tx.put("expiresAt", t.getExpiresAt());
                    tx.put("isExpired", t.getIsExpired());
                    return tx;
                })
                .collect(Collectors.toList());
            loyalty.put("transactions", transactionList);
            
            // Get redemptions
            List<LoyaltyRedemption> redemptions = loyaltyRedemptionRepository.findByPhoneNumber(phoneNumber);
            List<Map<String, Object>> redemptionList = redemptions.stream()
                .limit(10) // Last 10 redemptions
                .map(r -> {
                    Map<String, Object> rd = new HashMap<>();
                    rd.put("redemptionId", r.getRedemptionId());
                    rd.put("status", r.getStatus().toString());
                    rd.put("pointsUsed", r.getPointsUsed());
                    rd.put("requestedAt", r.getRequestedAt());
                    rd.put("approvedAt", r.getApprovedAt());
                    rd.put("deliveredAt", r.getDeliveredAt());
                    rd.put("deliveryMethod", r.getDeliveryMethod() != null ? r.getDeliveryMethod().toString() : "");
                    return rd;
                })
                .collect(Collectors.toList());
            loyalty.put("redemptions", redemptionList);
            
            // Get progress towards next reward
            List<LoyaltyReward> availableRewards = loyaltyRewardRepository.findByIsActive(true)
                .stream()
                .filter(r -> r.getPointsRequired() > (customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0))
                .sorted(Comparator.comparing(LoyaltyReward::getPointsRequired))
                .limit(3)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> progressList = new ArrayList<>();
            int currentPoints = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
            for (LoyaltyReward reward : availableRewards) {
                Map<String, Object> progress = new HashMap<>();
                progress.put("rewardName", reward.getRewardName());
                progress.put("pointsRequired", reward.getPointsRequired());
                progress.put("currentPoints", currentPoints);
                progress.put("pointsNeeded", reward.getPointsRequired() - currentPoints);
                progress.put("progressPercentage", (currentPoints * 100.0) / reward.getPointsRequired());
                progressList.add(progress);
            }
            loyalty.put("progress", progressList);
            
        } catch (Exception e) {
            logger.error("Error getting loyalty data: {}", e.getMessage());
            loyalty.put("error", e.getMessage());
        }
        
        return loyalty;
    }
    
    /**
     * C. Transactions & Payment History
     */
    private Map<String, Object> getTransactionHistory(String phoneNumber) {
        Map<String, Object> history = new HashMap<>();
        
        try {
            // Get payments
            List<Payment> payments = paymentRepository.findByPhoneNumber(phoneNumber);
            List<Map<String, Object>> paymentList = payments.stream()
                .sorted(Comparator.comparing(Payment::getCreatedAt).reversed())
                .limit(50)
                .map(p -> {
                    Map<String, Object> pay = new HashMap<>();
                    pay.put("id", p.getId());
                    pay.put("paymentId", p.getPaymentId());
                    pay.put("description", p.getDescription());
                    pay.put("amount", p.getAmount());
                    pay.put("currency", p.getCurrency());
                    pay.put("paymentMethod", p.getPaymentMethod() != null ? p.getPaymentMethod().toString() : "");
                    pay.put("status", p.getStatus() != null ? p.getStatus().toString() : "");
                    pay.put("createdAt", p.getCreatedAt());
                    pay.put("processedAt", p.getProcessedAt());
                    return pay;
                })
                .collect(Collectors.toList());
            
            history.put("payments", paymentList);
            history.put("totalPayments", payments.size());
            
            // Calculate totals
            BigDecimal totalSpent = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCESSFUL)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            history.put("totalSpent", totalSpent);
            
            // Get transactions (from payments for now)
            List<Transaction> transactions = new ArrayList<>(); // TransactionRepository doesn't have findByPhoneNumber
            List<Map<String, Object>> transactionList = transactions.stream()
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .limit(50)
                .map(t -> {
                    Map<String, Object> tx = new HashMap<>();
                    tx.put("id", t.getId());
                    tx.put("transactionId", t.getTransactionId());
                    tx.put("amount", t.getAmount());
                    tx.put("type", t.getTransactionType() != null ? t.getTransactionType().toString() : "");
                    tx.put("status", t.getStatus() != null ? t.getStatus().toString() : "");
                    tx.put("createdAt", t.getCreatedAt());
                    return tx;
                })
                .collect(Collectors.toList());
            
            history.put("transactions", transactionList);
            history.put("totalTransactions", transactions.size());
            
        } catch (Exception e) {
            logger.error("Error getting transaction history: {}", e.getMessage());
            history.put("error", e.getMessage());
        }
        
        return history;
    }
    
    /**
     * D. Package History
     */
    private Map<String, Object> getPackageHistory(String phoneNumber) {
        Map<String, Object> packages = new HashMap<>();
        
        try {
            // Get vouchers (which represent package purchases)
            List<Voucher> vouchers = voucherRepository.findByCustomerPhoneNumber(phoneNumber);
            
            // Group by package
            Map<Long, List<Voucher>> vouchersByPackage = vouchers.stream()
                .filter(v -> v.getPackageId() != null)
                .collect(Collectors.groupingBy(Voucher::getPackageId));
            
            List<Map<String, Object>> packageList = new ArrayList<>();
            for (Map.Entry<Long, List<Voucher>> entry : vouchersByPackage.entrySet()) {
                Long packageId = entry.getKey();
                List<Voucher> packageVouchers = entry.getValue();
                
                Optional<InternetPackage> packageOpt = packageRepository.findById(packageId);
                if (packageOpt.isPresent()) {
                    InternetPackage pkg = packageOpt.get();
                    Map<String, Object> pkgData = new HashMap<>();
                    pkgData.put("packageId", packageId);
                    pkgData.put("packageName", pkg.getName());
                    pkgData.put("purchaseCount", packageVouchers.size());
                    pkgData.put("lastPurchased", packageVouchers.stream()
                        .map(Voucher::getCreatedAt)
                        .max(LocalDateTime::compareTo)
                        .orElse(null));
                    pkgData.put("totalSpent", packageVouchers.stream()
                        .map(Voucher::getAmount)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add));
                    packageList.add(pkgData);
                }
            }
            
            packages.put("history", packageList);
            packages.put("totalPackages", packageList.size());
            
            // Get active package (from active sessions)
            List<VoucherSession> activeSessions = voucherSessionRepository.findByPhoneNumber(phoneNumber)
                .stream()
                .filter(s -> s.getSessionStatus() == VoucherSession.SessionStatus.ACTIVE)
                .collect(Collectors.toList());
            
            if (!activeSessions.isEmpty()) {
                VoucherSession activeSession = activeSessions.get(0);
                Optional<InternetPackage> activePackageOpt = packageRepository.findById(activeSession.getPackageId());
                if (activePackageOpt.isPresent()) {
                    InternetPackage activePkg = activePackageOpt.get();
                    Map<String, Object> active = new HashMap<>();
                    active.put("packageId", activePkg.getId());
                    active.put("packageName", activePkg.getName());
                    active.put("remainingTime", activeSession.getRemainingTimeSeconds());
                    active.put("expiresAt", activeSession.getExpiresAt());
                    packages.put("activePackage", active);
                }
            }
            
        } catch (Exception e) {
            logger.error("Error getting package history: {}", e.getMessage());
            packages.put("error", e.getMessage());
        }
        
        return packages;
    }
    
    /**
     * E. Active Voucher Sessions
     */
    private List<Map<String, Object>> getActiveSessions(String phoneNumber) {
        try {
            List<VoucherSession> sessions = voucherSessionRepository.findByPhoneNumber(phoneNumber)
                .stream()
                .filter(s -> s.getSessionStatus() == VoucherSession.SessionStatus.ACTIVE)
                .collect(Collectors.toList());
            
            return sessions.stream()
                .map(s -> {
                    Map<String, Object> session = new HashMap<>();
                    session.put("sessionId", s.getId());
                    session.put("voucherCode", s.getVoucherCode());
                    session.put("remainingTime", s.getRemainingTimeSeconds());
                    session.put("elapsedTime", s.getElapsedTimeSeconds());
                    session.put("expiresAt", s.getExpiresAt());
                    session.put("isConnected", s.getIsConnected());
                    session.put("macAddress", s.getMacAddress());
                    session.put("ipAddress", s.getIpAddress());
                    session.put("macChangesCount", s.getMacChangesCount());
                    session.put("ipChangesCount", s.getIpChangesCount());
                    session.put("persistentSession", s.getPersistentSession());
                    session.put("autoReconnectEnabled", s.getAutoReconnectEnabled());
                    return session;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting active sessions: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * F. Device Registry
     */
    private Map<String, Object> getDeviceRegistry(String phoneNumber) {
        Map<String, Object> devices = new HashMap<>();
        
        try {
            List<CustomerDeviceRegistry> deviceList = deviceRegistryRepository.findByPhoneNumber(phoneNumber);
            
            List<Map<String, Object>> deviceData = deviceList.stream()
                .map(d -> {
                    Map<String, Object> dev = new HashMap<>();
                    dev.put("id", d.getId());
                    dev.put("deviceName", d.getDeviceName());
                    dev.put("deviceType", d.getDeviceType() != null ? d.getDeviceType().toString() : "");
                    dev.put("macAddress", d.getMacAddress());
                    dev.put("isPrimary", d.getIsPrimary());
                    dev.put("isTrusted", d.getIsTrusted());
                    dev.put("autoConnectEnabled", d.getAutoConnectEnabled());
                    dev.put("lastUsedAt", d.getLastUsedAt());
                    dev.put("sessionCount", d.getSessionCount());
                    dev.put("totalUsageHours", d.getTotalUsageHours());
                    return dev;
                })
                .collect(Collectors.toList());
            
            devices.put("devices", deviceData);
            devices.put("totalDevices", deviceList.size());
            devices.put("primaryDevice", deviceList.stream()
                .filter(CustomerDeviceRegistry::getIsPrimary)
                .findFirst()
                .map(d -> Map.of("name", d.getDeviceName(), "mac", d.getMacAddress()))
                .orElse(new HashMap<>()));
            
        } catch (Exception e) {
            logger.error("Error getting device registry: {}", e.getMessage());
            devices.put("error", e.getMessage());
        }
        
        return devices;
    }
    
    /**
     * G. Available Rewards
     */
    private List<Map<String, Object>> getAvailableRewards(String phoneNumber) {
        try {
            Optional<Customer> customerOpt = customerRepository.findByPrimaryPhoneNumber(phoneNumber);
            int currentPoints = customerOpt.map(c -> c.getLoyaltyPoints() != null ? c.getLoyaltyPoints() : 0)
                .orElse(0);
            
            return loyaltyRewardRepository.findByIsActive(true)
                .stream()
                .filter(r -> r.getPointsRequired() <= currentPoints)
                .sorted(Comparator.comparing(LoyaltyReward::getPointsRequired))
                .map(r -> {
                    Map<String, Object> reward = new HashMap<>();
                    reward.put("rewardId", r.getRewardId());
                    reward.put("rewardName", r.getRewardName());
                    reward.put("description", r.getDescription());
                    reward.put("pointsRequired", r.getPointsRequired());
                    reward.put("imageUrl", r.getImageUrl());
                    reward.put("category", r.getCategory() != null ? r.getCategory().toString() : "");
                    reward.put("deliveryMethod", r.getDeliveryMethod() != null ? r.getDeliveryMethod().toString() : "");
                    reward.put("inventoryCount", r.getInventoryCount());
                    return reward;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting available rewards: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * H. Statistics Summary
     */
    private Map<String, Object> getStatistics(String phoneNumber) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Total spent
            List<Payment> payments = paymentRepository.findByPhoneNumber(phoneNumber);
            BigDecimal totalSpent = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCESSFUL)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            stats.put("totalSpent", totalSpent);
            
            // Total sessions
            long totalSessions = voucherSessionRepository.findByPhoneNumber(phoneNumber).size();
            stats.put("totalSessions", totalSessions);
            
            // Total vouchers
            long totalVouchers = voucherRepository.findByCustomerPhoneNumber(phoneNumber).size();
            stats.put("totalVouchers", totalVouchers);
            
            // Total devices
            long totalDevices = deviceRegistryRepository.countDevicesByPhoneNumber(phoneNumber);
            stats.put("totalDevices", totalDevices);
            
            // Loyalty points
            Optional<Customer> customerOpt = customerRepository.findByPrimaryPhoneNumber(phoneNumber);
            stats.put("loyaltyPoints", customerOpt.map(c -> c.getLoyaltyPoints() != null ? c.getLoyaltyPoints() : 0)
                .orElse(0));
            
        } catch (Exception e) {
            logger.error("Error getting statistics: {}", e.getMessage());
        }
        
        return stats;
    }
}

