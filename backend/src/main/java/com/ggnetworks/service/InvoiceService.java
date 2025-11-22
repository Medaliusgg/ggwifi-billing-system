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
    
    /**
     * Generate PDF content for invoice (returns HTML template that can be converted to PDF)
     */
    public String generateInvoicePdfContent(Invoice invoice) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; margin: 20px; }");
        html.append(".header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }");
        html.append(".invoice-info { float: right; text-align: right; }");
        html.append(".company-info { float: left; }");
        html.append(".clear { clear: both; }");
        html.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
        html.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
        html.append("th { background-color: #f2f2f2; }");
        html.append(".total { text-align: right; font-weight: bold; }");
        html.append(".footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }");
        html.append("</style></head><body>");
        
        html.append("<div class='header'>");
        html.append("<div class='company-info'>");
        html.append("<h2>GG-WIFI</h2>");
        html.append("<p>Internet Service Provider</p>");
        html.append("</div>");
        html.append("<div class='invoice-info'>");
        html.append("<h2>INVOICE</h2>");
        html.append("<p><strong>Invoice #:</strong> ").append(invoice.getInvoiceNumber()).append("</p>");
        html.append("<p><strong>Date:</strong> ").append(invoice.getCreatedAt() != null ? invoice.getCreatedAt().toLocalDate() : "").append("</p>");
        html.append("<p><strong>Status:</strong> ").append(invoice.getStatus()).append("</p>");
        html.append("</div>");
        html.append("<div class='clear'></div>");
        html.append("</div>");
        
        html.append("<div>");
        html.append("<h3>Bill To:</h3>");
        html.append("<p>Customer ID: ").append(invoice.getCustomerId()).append("</p>");
        if (invoice.getEmail() != null) {
            html.append("<p>Email: ").append(invoice.getEmail()).append("</p>");
        }
        if (invoice.getPhoneNumber() != null) {
            html.append("<p>Phone: ").append(invoice.getPhoneNumber()).append("</p>");
        }
        html.append("</div>");
        
        html.append("<table>");
        html.append("<thead><tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>");
        html.append("<tbody>");
        html.append("<tr>");
        html.append("<td>").append(invoice.getNotes() != null ? invoice.getNotes() : "Internet Service").append("</td>");
        html.append("<td>1</td>");
        html.append("<td>").append(invoice.getAmount() != null ? invoice.getAmount() : "0.00").append(" ").append(invoice.getCurrency() != null ? invoice.getCurrency() : "TZS").append("</td>");
        html.append("<td>").append(invoice.getTotalAmount() != null ? invoice.getTotalAmount() : "0.00").append(" ").append(invoice.getCurrency() != null ? invoice.getCurrency() : "TZS").append("</td>");
        html.append("</tr>");
        html.append("</tbody>");
        html.append("</table>");
        
        html.append("<div class='total'>");
        html.append("<p>Subtotal: ").append(invoice.getAmount() != null ? invoice.getAmount() : "0.00").append(" ").append(invoice.getCurrency() != null ? invoice.getCurrency() : "TZS").append("</p>");
        if (invoice.getTaxAmount() != null && invoice.getTaxAmount().compareTo(BigDecimal.ZERO) > 0) {
            html.append("<p>Tax: ").append(invoice.getTaxAmount()).append(" ").append(invoice.getCurrency() != null ? invoice.getCurrency() : "TZS").append("</p>");
        }
        html.append("<p><strong>Total: ").append(invoice.getTotalAmount() != null ? invoice.getTotalAmount() : "0.00").append(" ").append(invoice.getCurrency() != null ? invoice.getCurrency() : "TZS").append("</strong></p>");
        html.append("</div>");
        
        html.append("<div class='footer'>");
        html.append("<p>Thank you for your business!</p>");
        html.append("<p>For inquiries, contact: support@ggwifi.co.tz</p>");
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }
    
    /**
     * Get invoice template (for customization)
     */
    public Map<String, Object> getInvoiceTemplate() {
        Map<String, Object> template = new HashMap<>();
        template.put("companyName", "GG-WIFI");
        template.put("companyAddress", "Tanzania");
        template.put("companyEmail", "support@ggwifi.co.tz");
        template.put("companyPhone", "+255 742 844 024");
        template.put("logoUrl", "/assets/logo.png");
        template.put("footerText", "Thank you for your business!");
        return template;
    }
}


