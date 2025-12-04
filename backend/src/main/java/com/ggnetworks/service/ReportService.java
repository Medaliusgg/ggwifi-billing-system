package com.ggnetworks.service;

import com.ggnetworks.entity.Customer;
import com.ggnetworks.entity.Invoice;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.entity.Report;
import com.ggnetworks.entity.Transaction;
import com.ggnetworks.entity.Voucher;
import com.ggnetworks.repository.CustomerRepository;
import com.ggnetworks.repository.InvoiceRepository;
import com.ggnetworks.repository.PaymentRepository;
import com.ggnetworks.repository.ReportRepository;
import com.ggnetworks.repository.RouterRepository;
import com.ggnetworks.repository.TransactionRepository;
import com.ggnetworks.repository.VoucherRepository;
import com.ggnetworks.repository.RadiusAcctRepository;
import com.ggnetworks.entity.RadiusAcct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private RouterRepository routerRepository;
    
    @Autowired
    private RadiusAcctRepository radiusAcctRepository;
    
    public Report createReport(Report report) {
        if (report.getCreatedAt() == null) {
            report.setCreatedAt(LocalDateTime.now());
        }
        return reportRepository.save(report);
    }
    
    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }
    
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
    
    public List<Report> getReportsByType(Report.ReportType reportType) {
        return reportRepository.findByReportType(reportType);
    }
    
    public Report updateReport(Long id, Report updatedReport) {
        Report existing = reportRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        existing.setName(updatedReport.getName());
        existing.setDescription(updatedReport.getDescription());
        existing.setReportType(updatedReport.getReportType());
        existing.setTemplateName(updatedReport.getTemplateName());
        existing.setParameters(updatedReport.getParameters());
        existing.setScheduleType(updatedReport.getScheduleType());
        existing.setScheduleCron(updatedReport.getScheduleCron());
        existing.setRecipients(updatedReport.getRecipients());
        existing.setIsActive(updatedReport.getIsActive());
        return reportRepository.save(existing);
    }
    
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
    
    public Map<String, Object> generateFinancialReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Revenue
        List<Payment> payments = paymentRepository.findByCreatedAtBetween(startDate, endDate);
        double totalRevenue = payments.stream()
            .filter(p -> p.getStatus() == com.ggnetworks.entity.Payment.PaymentStatus.SUCCESSFUL)
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount().doubleValue() : 0.0)
            .sum();
        
        // Transactions
        List<Transaction> transactions = transactionRepository.findByCreatedAtBetween(startDate, endDate);
        long totalTransactions = transactions.size();
        double totalTransactionAmount = transactions.stream()
            .filter(t -> t.getStatus() == com.ggnetworks.entity.Transaction.TransactionStatus.COMPLETED)
            .mapToDouble(t -> t.getAmount() != null ? t.getAmount().doubleValue() : 0.0)
            .sum();
        
        // Invoices
        List<Invoice> invoices = invoiceRepository.findByCreatedAtBetween(startDate, endDate);
        long totalInvoices = invoices.size();
        double totalInvoiceAmount = invoices.stream()
            .mapToDouble(i -> i.getTotalAmount() != null ? i.getTotalAmount().doubleValue() : 0.0)
            .sum();
        
        report.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        report.put("revenue", Map.of(
            "total", totalRevenue,
            "currency", "TZS"
        ));
        report.put("transactions", Map.of(
            "total", totalTransactions,
            "amount", totalTransactionAmount
        ));
        report.put("invoices", Map.of(
            "total", totalInvoices,
            "amount", totalInvoiceAmount
        ));
        report.put("generatedAt", LocalDateTime.now().toString());
        
        return report;
    }
    
    public Map<String, Object> generateCustomerReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        List<Customer> customers = customerRepository.findByRegistrationDateBetween(startDate, endDate);
        long totalCustomers = customers.size();
        long activeCustomers = customers.stream()
            .filter(c -> c.getStatus() == Customer.CustomerStatus.ACTIVE)
            .count();
        
        report.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        report.put("customers", Map.of(
            "total", totalCustomers,
            "active", activeCustomers,
            "inactive", totalCustomers - activeCustomers
        ));
        report.put("generatedAt", LocalDateTime.now().toString());
        
        return report;
    }
    
    public Map<String, Object> generateNetworkReport() {
        Map<String, Object> report = new HashMap<>();
        
        long totalRouters = routerRepository.count();
        long onlineRouters = routerRepository.countByStatus(com.ggnetworks.entity.Router.RouterStatus.ONLINE);
        
        report.put("routers", Map.of(
            "total", totalRouters,
            "online", onlineRouters,
            "offline", totalRouters - onlineRouters
        ));
        report.put("generatedAt", LocalDateTime.now().toString());
        
        return report;
    }
    
    public Map<String, Object> generateSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();
        
        List<Voucher> vouchers = voucherRepository.findByCreatedAtBetween(startDate, endDate);
        long totalVouchers = vouchers.size();
        long usedVouchers = vouchers.stream().filter(v -> v.isUsed()).count();
        
        double totalSales = vouchers.stream()
            .mapToDouble(v -> v.getAmount() != null ? v.getAmount().doubleValue() : 0.0)
            .sum();
        
        report.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        report.put("vouchers", Map.of(
            "total", totalVouchers,
            "used", usedVouchers,
            "unused", totalVouchers - usedVouchers
        ));
        report.put("sales", Map.of(
            "total", totalSales,
            "currency", "TZS"
        ));
        report.put("generatedAt", LocalDateTime.now().toString());
        
        return report;
    }
    
    public Map<String, Object> getReportStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReports", reportRepository.count());
        stats.put("activeReports", reportRepository.countByIsActive(true));
        long daily = reportRepository.findByScheduleType(Report.ScheduleType.DAILY).size();
        long weekly = reportRepository.findByScheduleType(Report.ScheduleType.WEEKLY).size();
        long monthly = reportRepository.findByScheduleType(Report.ScheduleType.MONTHLY).size();
        stats.put("scheduledReports", daily + weekly + monthly);
        return stats;
    }
    
    /**
     * Get usage per plan (hotspot vs PPPoE)
     */
    public Map<String, Object> getUsagePerPlan(String startDate, String endDate) {
        Map<String, Object> usage = new HashMap<>();
        try {
            LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : LocalDateTime.now().minusDays(30);
            LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : LocalDateTime.now();
            
            long hotspotSessions = radiusAcctRepository.countSessionsByUserTypeSince("HOTSPOT", start);
            long pppoeSessions = radiusAcctRepository.countSessionsByUserTypeSince("PPPOE", start);
            
            usage.put("hotspot", hotspotSessions);
            usage.put("pppoe", pppoeSessions);
            usage.put("total", hotspotSessions + pppoeSessions);
            usage.put("period", Map.of("start", start.toString(), "end", end.toString()));
        } catch (Exception e) {
            usage.put("error", e.getMessage());
        }
        return usage;
    }
    
    /**
     * Get top customers by data usage
     */
    public List<Map<String, Object>> getTopCustomersByUsage(int limit) {
        List<Map<String, Object>> topCustomers = new ArrayList<>();
        try {
            // Query radacct for top users by data usage
            List<RadiusAcct> sessions = radiusAcctRepository.findAllActiveSessions();
            
            Map<String, Long> customerUsage = new HashMap<>();
            for (RadiusAcct session : sessions) {
                String username = session.getUsername();
                long totalBytes = (session.getAcctInputOctets() != null ? session.getAcctInputOctets() : 0) +
                                 (session.getAcctOutputOctets() != null ? session.getAcctOutputOctets() : 0);
                customerUsage.merge(username, totalBytes, Long::sum);
            }
            
            customerUsage.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .forEach(entry -> {
                    Map<String, Object> customer = new HashMap<>();
                    customer.put("username", entry.getKey());
                    customer.put("totalBytes", entry.getValue());
                    customer.put("totalMB", entry.getValue() / (1024.0 * 1024.0));
                    topCustomers.add(customer);
                });
        } catch (Exception e) {
            // Return empty list on error
        }
        return topCustomers;
    }
    
    /**
     * Get router uptime reports
     */
    public Map<String, Object> getRouterUptimeReports() {
        Map<String, Object> reports = new HashMap<>();
        try {
            List<com.ggnetworks.entity.Router> routers = routerRepository.findAll();
            List<Map<String, Object>> routerReports = new ArrayList<>();
            
            for (com.ggnetworks.entity.Router router : routers) {
                Map<String, Object> routerReport = new HashMap<>();
                routerReport.put("routerId", router.getId());
                routerReport.put("routerName", router.getName());
                routerReport.put("status", router.getStatus());
                routerReport.put("lastHealthCheck", router.getLastHealthCheck());
                routerReport.put("uptime", router.getUptime());
                routerReports.add(routerReport);
            }
            
            reports.put("routers", routerReports);
            reports.put("totalRouters", routers.size());
        } catch (Exception e) {
            reports.put("error", e.getMessage());
        }
        return reports;
    }
    
    /**
     * Get session duration distribution
     */
    public Map<String, Object> getSessionDurationDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        try {
            List<RadiusAcct> recentSessions = radiusAcctRepository
                .findByAcctStartTimeBetween(LocalDateTime.now().minusDays(7), LocalDateTime.now());
            
            Map<String, Integer> durationRanges = new HashMap<>();
            durationRanges.put("0-1h", 0);
            durationRanges.put("1-4h", 0);
            durationRanges.put("4-12h", 0);
            durationRanges.put("12-24h", 0);
            durationRanges.put("24h+", 0);
            
            for (RadiusAcct session : recentSessions) {
                if (session.getAcctSessionTime() != null) {
                    int hours = session.getAcctSessionTime() / 3600;
                    if (hours < 1) durationRanges.put("0-1h", durationRanges.get("0-1h") + 1);
                    else if (hours < 4) durationRanges.put("1-4h", durationRanges.get("1-4h") + 1);
                    else if (hours < 12) durationRanges.put("4-12h", durationRanges.get("4-12h") + 1);
                    else if (hours < 24) durationRanges.put("12-24h", durationRanges.get("12-24h") + 1);
                    else durationRanges.put("24h+", durationRanges.get("24h+") + 1);
                }
            }
            
            distribution.put("distribution", durationRanges);
            distribution.put("totalSessions", recentSessions.size());
        } catch (Exception e) {
            distribution.put("error", e.getMessage());
        }
        return distribution;
    }
    
    /**
     * Get peak usage times
     */
    public Map<String, Object> getPeakUsageTimes() {
        Map<String, Object> peakTimes = new HashMap<>();
        try {
            List<RadiusAcct> sessions = radiusAcctRepository
                .findByAcctStartTimeBetween(LocalDateTime.now().minusDays(7), LocalDateTime.now());
            
            Map<Integer, Integer> hourDistribution = new HashMap<>();
            for (int i = 0; i < 24; i++) {
                hourDistribution.put(i, 0);
            }
            
            for (RadiusAcct session : sessions) {
                if (session.getAcctStartTime() != null) {
                    int hour = session.getAcctStartTime().getHour();
                    hourDistribution.put(hour, hourDistribution.get(hour) + 1);
                }
            }
            
            peakTimes.put("hourlyDistribution", hourDistribution);
            
            // Find peak hour
            int peakHour = hourDistribution.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0);
            peakTimes.put("peakHour", peakHour);
        } catch (Exception e) {
            peakTimes.put("error", e.getMessage());
        }
        return peakTimes;
    }
    
    /**
     * Get failed login trends
     */
    public Map<String, Object> getFailedLoginTrends() {
        Map<String, Object> trends = new HashMap<>();
        try {
            // This would query RADIUS auth log for failed attempts
            // Placeholder implementation
            trends.put("last24h", 0);
            trends.put("last7d", 0);
            trends.put("last30d", 0);
            trends.put("trend", "stable");
        } catch (Exception e) {
            trends.put("error", e.getMessage());
        }
        return trends;
    }
    
    /**
     * Get device type distribution
     */
    public Map<String, Object> getDeviceTypeDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        try {
            // This would analyze MAC addresses or user agents
            // Placeholder implementation
            distribution.put("mobile", 0);
            distribution.put("desktop", 0);
            distribution.put("tablet", 0);
            distribution.put("other", 0);
        } catch (Exception e) {
            distribution.put("error", e.getMessage());
        }
        return distribution;
    }
}

