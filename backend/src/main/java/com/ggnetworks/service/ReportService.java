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
}

