package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import com.ggnetworks.entity.RadiusAcct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private VoucherSessionRepository voucherSessionRepository;

    @Autowired
    private RouterRepository routerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private AccessPointRepository accessPointRepository;

    @Autowired
    private SessionManagementService sessionManagementService;

    @Autowired
    private RouterHealthMonitoringService routerHealthMonitoringService;

    @Autowired
    private RadiusAcctRepository radiusAcctRepository;

    /**
     * Get comprehensive dashboard metrics
     */
    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Active sessions (real-time from RADIUS)
        metrics.put("activeSessions", getActiveSessionsCount());
        metrics.put("activeSessionsList", getActiveSessions());
        metrics.put("activeHotspotSessions", getActiveHotspotSessionsCount());
        metrics.put("activePPPoESessions", getActivePPPoESessionsCount());
        metrics.put("realTimeActiveSessions", sessionManagementService.getRealTimeActiveSessions());
        
        // Router health (real-time)
        metrics.put("totalRouters", routerRepository.count());
        metrics.put("onlineRouters", getOnlineRoutersCount());
        metrics.put("offlineRouters", getOfflineRoutersCount());
        metrics.put("routerHealth", getRouterHealth());
        metrics.put("routerHealthSummary", routerHealthMonitoringService.getAllRoutersHealthSummary());
        
        // Revenue
        metrics.put("revenueToday", getRevenueToday());
        metrics.put("revenueThisMonth", getRevenueThisMonth());
        metrics.put("totalRevenue", getTotalRevenue());
        
        // Customers
        metrics.put("totalCustomers", customerRepository.count());
        metrics.put("newCustomersToday", getNewCustomersToday());
        metrics.put("activeCustomers", customerRepository.countByIsActiveTrue());
        
        // Vouchers
        metrics.put("totalVouchers", voucherRepository.count());
        metrics.put("activeVouchers", getActiveVouchersCount());
        metrics.put("usedVouchers", getUsedVouchersCount());
        
        // Access Points
        metrics.put("totalAPs", accessPointRepository.count());
        metrics.put("onlineAPs", accessPointRepository.countOnlineAPs());
        metrics.put("offlineAPs", accessPointRepository.countOfflineAPs());
        metrics.put("totalConnectedDevices", accessPointRepository.sumConnectedDevices());
        
        // Failed login attempts (from RADIUS)
        metrics.put("failedLoginAttempts", getFailedLoginAttempts());
        metrics.put("failedLoginAttemptsFromRadius", getFailedLoginAttemptsFromRadius());
        
        // Traffic usage (real-time)
        metrics.put("trafficUsage", getTrafficUsage());
        metrics.put("realTimeBandwidthUsage", getRealTimeBandwidthUsage());
        
        // Hotspot vs PPPoE ratio
        metrics.put("userRatio", getUserRatio());
        
        // Session duration analytics
        metrics.put("averageSessionDuration", getAverageSessionDuration());
        metrics.put("topActiveRouters", getTopActiveRouters());
        
        // Alerts
        metrics.put("alerts", getAlerts());
        
        return metrics;
    }

    private Long getActiveSessionsCount() {
        List<VoucherSession> activeSessions = voucherSessionRepository.findBySessionStatus(VoucherSession.SessionStatus.ACTIVE);
        return (long) activeSessions.size();
    }

    private List<Map<String, Object>> getActiveSessions() {
        List<VoucherSession> sessions = voucherSessionRepository.findBySessionStatus(VoucherSession.SessionStatus.ACTIVE);
        return sessions.stream().map(session -> {
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("id", session.getId());
            sessionData.put("voucherCode", session.getVoucherCode());
            sessionData.put("phoneNumber", session.getPhoneNumber());
            sessionData.put("macAddress", session.getMacAddress());
            sessionData.put("ipAddress", session.getIpAddress());
            sessionData.put("timeRemaining", session.getRemainingTimeSeconds());
            sessionData.put("packageId", session.getPackageId());
            return sessionData;
        }).collect(Collectors.toList());
    }

    private Long getOnlineRoutersCount() {
        return routerRepository.countByStatus(Router.RouterStatus.ONLINE);
    }

    private Long getOfflineRoutersCount() {
        return routerRepository.countByStatus(Router.RouterStatus.OFFLINE);
    }

    private List<Map<String, Object>> getRouterHealth() {
        List<Router> routers = routerRepository.findAll();
        return routers.stream().map(router -> {
            Map<String, Object> health = new HashMap<>();
            health.put("routerId", router.getRouterId());
            health.put("name", router.getName());
            health.put("status", router.getStatus().toString());
            health.put("ipAddress", router.getIpAddress());
            health.put("lastSeen", router.getLastSeen());
            health.put("cpuLoad", router.getCpuLoad());
            health.put("uptime", router.getUptime());
            return health;
        }).collect(Collectors.toList());
    }

    private BigDecimal getRevenueToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        
        BigDecimal revenue = paymentRepository.sumAmountByStatusAndCreatedAtBetween(
            Payment.PaymentStatus.SUCCESSFUL, startOfDay, endOfDay);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    private BigDecimal getRevenueThisMonth() {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = LocalDateTime.now();
        
        BigDecimal revenue = paymentRepository.sumAmountByStatusAndCreatedAtBetween(
            Payment.PaymentStatus.SUCCESSFUL, startOfMonth, endOfMonth);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    private BigDecimal getTotalRevenue() {
        List<Payment> payments = paymentRepository.findByStatus(Payment.PaymentStatus.SUCCESSFUL);
        return payments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Long getNewCustomersToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        return customerRepository.countByCreatedAtBetween(startOfDay, endOfDay);
    }

    private Long getUsedVouchersCount() {
        return voucherRepository.countByUsageStatus(Voucher.UsageStatus.USED);
    }

    private Long getActiveVouchersCount() {
        return voucherRepository.countByStatus(Voucher.VoucherStatus.ACTIVE);
    }

    private Long getFailedLoginAttempts() {
        // Count failed RADIUS authentication attempts from last 24 hours
        // This would query RadiusAcct for failed authentications
        // For now, return 0 as placeholder
        return 0L;
    }

    private Map<String, Object> getTrafficUsage() {
        Map<String, Object> traffic = new HashMap<>();
        
        // Get traffic from active sessions
        List<VoucherSession> activeSessions = voucherSessionRepository.findBySessionStatus(VoucherSession.SessionStatus.ACTIVE);
        long totalBytes = 0L; // Would sum from RadiusAcct
        
        traffic.put("totalBytes", totalBytes);
        traffic.put("totalGB", totalBytes / (1024.0 * 1024.0 * 1024.0));
        traffic.put("activeSessions", activeSessions.size());
        
        return traffic;
    }

    private Map<String, Object> getUserRatio() {
        Map<String, Object> ratio = new HashMap<>();
        
        long hotspotUsers = customerRepository.countByAccountType(Customer.AccountType.INDIVIDUAL);
        long pppoeUsers = customerRepository.countByAccountType(Customer.AccountType.BUSINESS) + 
                         customerRepository.countByAccountType(Customer.AccountType.ENTERPRISE);
        
        ratio.put("hotspot", hotspotUsers);
        ratio.put("pppoe", pppoeUsers);
        ratio.put("total", hotspotUsers + pppoeUsers);
        
        if (hotspotUsers + pppoeUsers > 0) {
            ratio.put("hotspotPercentage", (hotspotUsers * 100.0) / (hotspotUsers + pppoeUsers));
            ratio.put("pppoePercentage", (pppoeUsers * 100.0) / (hotspotUsers + pppoeUsers));
        } else {
            ratio.put("hotspotPercentage", 0.0);
            ratio.put("pppoePercentage", 0.0);
        }
        
        return ratio;
    }

    private List<Map<String, Object>> getAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        // Router offline alerts
        List<Router> offlineRouters = routerRepository.findByStatus(Router.RouterStatus.OFFLINE);
        for (Router router : offlineRouters) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("type", "ROUTER_OFFLINE");
            alert.put("severity", "HIGH");
            alert.put("message", "Router " + router.getName() + " is offline");
            alert.put("routerId", router.getRouterId());
            alerts.add(alert);
        }
        
        // AP offline alerts
        long offlineAPs = accessPointRepository.countOfflineAPs();
        if (offlineAPs > 0) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("type", "AP_OFFLINE");
            alert.put("severity", "MEDIUM");
            alert.put("message", offlineAPs + " Access Points are offline");
            alerts.add(alert);
        }
        
        return alerts;
    }

    /**
     * Get active hotspot sessions count from RADIUS
     */
    private Long getActiveHotspotSessionsCount() {
        try {
            return radiusAcctRepository.countSessionsByUserTypeSince("HOTSPOT", 
                LocalDateTime.now().minusDays(1));
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * Get active PPPoE sessions count from RADIUS
     */
    private Long getActivePPPoESessionsCount() {
        try {
            return radiusAcctRepository.countSessionsByUserTypeSince("PPPOE", 
                LocalDateTime.now().minusDays(1));
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * Get failed login attempts from RADIUS accounting
     */
    private Long getFailedLoginAttemptsFromRadius() {
        try {
            // Query radacct for failed authentications
            // This is a simplified version - actual implementation would query failed auth logs
            return 0L; // Placeholder - implement based on your RADIUS auth log structure
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * Get real-time bandwidth usage
     */
    private Map<String, Object> getRealTimeBandwidthUsage() {
        Map<String, Object> usage = new HashMap<>();
        try {
            List<RadiusAcct> activeSessions = 
                radiusAcctRepository.findAllActiveSessions();
            
            long totalInputOctets = 0;
            long totalOutputOctets = 0;
            
            for (RadiusAcct session : activeSessions) {
                if (session.getAcctInputOctets() != null) {
                    totalInputOctets += session.getAcctInputOctets();
                }
                if (session.getAcctOutputOctets() != null) {
                    totalOutputOctets += session.getAcctOutputOctets();
                }
            }
            
            usage.put("totalInputMB", totalInputOctets / (1024.0 * 1024.0));
            usage.put("totalOutputMB", totalOutputOctets / (1024.0 * 1024.0));
            usage.put("totalMB", (totalInputOctets + totalOutputOctets) / (1024.0 * 1024.0));
            usage.put("activeSessionsCount", activeSessions.size());
        } catch (Exception e) {
            usage.put("error", e.getMessage());
        }
        return usage;
    }

    /**
     * Get average session duration
     */
    private Double getAverageSessionDuration() {
        try {
            List<RadiusAcct> recentSessions = 
                radiusAcctRepository.findByAcctStartTimeBetween(
                    LocalDateTime.now().minusDays(1), LocalDateTime.now());
            
            if (recentSessions.isEmpty()) {
                return 0.0;
            }
            
            long totalDuration = 0;
            int count = 0;
            
            for (RadiusAcct session : recentSessions) {
                if (session.getAcctSessionTime() != null) {
                    totalDuration += session.getAcctSessionTime();
                    count++;
                }
            }
            
            return count > 0 ? (double) totalDuration / count : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }

    /**
     * Get top active routers by session count
     */
    private List<Map<String, Object>> getTopActiveRouters() {
        List<Map<String, Object>> topRouters = new ArrayList<>();
        try {
            List<Router> routers = routerRepository.findAll();
            
            for (Router router : routers) {
                if (router.getStatus() == Router.RouterStatus.ONLINE) {
                    Map<String, Object> routerData = new HashMap<>();
                    routerData.put("routerId", router.getId());
                    routerData.put("routerName", router.getName());
                    routerData.put("activeSessions", router.getActiveSessionsCount() != null ? 
                        router.getActiveSessionsCount() : 0);
                    routerData.put("ipAddress", router.getIpAddress());
                    routerData.put("location", router.getLocation());
                    topRouters.add(routerData);
                }
            }
            
            // Sort by active sessions (descending)
            topRouters.sort((a, b) -> {
                Integer sessionsA = (Integer) a.get("activeSessions");
                Integer sessionsB = (Integer) b.get("activeSessions");
                return sessionsB.compareTo(sessionsA);
            });
            
            // Return top 10
            return topRouters.stream().limit(10).collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            return topRouters;
        }
    }
}

