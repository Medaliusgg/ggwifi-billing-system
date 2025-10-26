package com.ggnetworks.service;

import com.ggnetworks.entity.Invoice;
import com.ggnetworks.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    /**
     * Get all invoices
     */
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
    
    /**
     * Get invoice by ID
     */
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }
    
    /**
     * Get invoice by invoice number
     */
    public Optional<Invoice> getInvoiceByInvoiceNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber);
    }
    
    /**
     * Create new invoice
     */
    public Invoice createInvoice(Invoice invoice) {
        // Generate unique invoice number if not provided
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber());
        }
        
        // Set timestamps
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        
        return invoiceRepository.save(invoice);
    }
    
    /**
     * Update invoice
     */
    public Invoice updateInvoice(Invoice invoice) {
        invoice.setUpdatedAt(LocalDateTime.now());
        return invoiceRepository.save(invoice);
    }
    
    /**
     * Delete invoice
     */
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    
    /**
     * Get invoices by customer ID
     */
    public List<Invoice> getInvoicesByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get invoices by status
     */
    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }
    
    /**
     * Get invoices by date range
     */
    public List<Invoice> getInvoicesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return invoiceRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Get paid invoices
     */
    public List<Invoice> getPaidInvoices() {
        return invoiceRepository.findByStatus(Invoice.InvoiceStatus.PAID);
    }
    
    /**
     * Get unpaid invoices
     */
    public List<Invoice> getUnpaidInvoices() {
        return invoiceRepository.findByStatus(Invoice.InvoiceStatus.UNPAID);
    }
    
    /**
     * Generate unique invoice number
     */
    private String generateInvoiceNumber() {
        return "INV_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
    
    /**
     * Get invoice statistics
     */
    public Map<String, Object> getInvoiceStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total invoices
        long totalInvoices = invoiceRepository.count();
        stats.put("totalInvoices", totalInvoices);
        
        // Paid invoices
        long paidInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.PAID);
        stats.put("paidInvoices", paidInvoices);
        
        // Unpaid invoices
        long unpaidInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.UNPAID);
        stats.put("unpaidInvoices", unpaidInvoices);
        
        // Overdue invoices
        long overdueInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.OVERDUE);
        stats.put("overdueInvoices", overdueInvoices);
        
        // Payment rate
        double paymentRate = totalInvoices > 0 ? (double) paidInvoices / totalInvoices * 100 : 0;
        stats.put("paymentRate", Math.round(paymentRate * 100.0) / 100.0);
        
        return stats;
    }
}


