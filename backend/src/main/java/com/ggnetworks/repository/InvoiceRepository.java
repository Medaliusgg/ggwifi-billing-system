package com.ggnetworks.repository;

import com.ggnetworks.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByCustomerId(Long customerId);
    
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    
    List<Invoice> findByPaymentMethod(Invoice.PaymentMethod paymentMethod);
    
    List<Invoice> findByPaymentGateway(String paymentGateway);
    
    List<Invoice> findByPackageId(Long packageId);
    
    List<Invoice> findByRouterId(Long routerId);
    
    List<Invoice> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Invoice> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Invoice> findByPaidDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Invoice> findByIsRecurring(Boolean isRecurring);
    
    List<Invoice> findByCurrency(String currency);
    
    List<Invoice> findByPhoneNumber(String phoneNumber);
    
    List<Invoice> findByEmail(String email);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    long countByStatus(Invoice.InvoiceStatus status);
    
    long countByPaymentMethod(Invoice.PaymentMethod paymentMethod);
    
    long countByCustomerId(Long customerId);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}