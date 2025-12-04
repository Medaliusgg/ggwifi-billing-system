package com.ggnetworks.service;

import com.ggnetworks.entity.Voucher;
import com.ggnetworks.entity.VoucherBatch;
import com.ggnetworks.repository.VoucherBatchRepository;
import com.ggnetworks.repository.VoucherRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Voucher Batch Service
 * Manages voucher batch generation, tracking, and analytics
 */
@Service
public class VoucherBatchService {
    
    private static final Logger logger = LoggerFactory.getLogger(VoucherBatchService.class);
    
    @Autowired
    private VoucherBatchRepository voucherBatchRepository;
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private VoucherService voucherService;
    
    /**
     * Create a new voucher batch
     */
    @Transactional
    public VoucherBatch createBatch(Long packageId, Integer quantity, BigDecimal unitPrice, 
                                   String createdBy, String notes) {
        VoucherBatch batch = new VoucherBatch();
        batch.setBatchId("BATCH_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        batch.setPackageId(packageId);
        batch.setQuantity(quantity);
        batch.setGenerated(0);
        batch.setSold(0);
        batch.setRedeemed(0);
        batch.setExpired(0);
        batch.setUnitPrice(unitPrice);
        batch.setTotalValue(unitPrice.multiply(new BigDecimal(quantity)));
        batch.setStatus(VoucherBatch.BatchStatus.PENDING);
        batch.setCreatedBy(createdBy);
        batch.setNotes(notes);
        
        return voucherBatchRepository.save(batch);
    }
    
    /**
     * Generate vouchers for a batch
     */
    @Transactional
    public void generateBatchVouchers(String batchId) {
        VoucherBatch batch = voucherBatchRepository.findByBatchId(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
        
        batch.setStatus(VoucherBatch.BatchStatus.GENERATING);
        voucherBatchRepository.save(batch);
        
        try {
            for (int i = 0; i < batch.getQuantity(); i++) {
                String voucherCode = voucherService.generateVoucherCode(batch.getPackageId());
                
                Voucher voucher = new Voucher();
                voucher.setVoucherCode(voucherCode);
                voucher.setPackageId(batch.getPackageId());
                voucher.setAmount(batch.getUnitPrice());
                voucher.setOrderId("BATCH_" + batchId);
                voucher.setStatus(Voucher.VoucherStatus.GENERATED);
                voucher.setUsageStatus(Voucher.UsageStatus.UNUSED);
                voucher.setGeneratedAt(LocalDateTime.now());
                voucher.setCreatedBy(batch.getCreatedBy());
                
                voucherRepository.save(voucher);
                
                batch.setGenerated(batch.getGenerated() + 1);
            }
            
            batch.setStatus(VoucherBatch.BatchStatus.COMPLETED);
            voucherBatchRepository.save(batch);
            
            logger.info("Generated {} vouchers for batch: {}", batch.getQuantity(), batchId);
        } catch (Exception e) {
            batch.setStatus(VoucherBatch.BatchStatus.CANCELLED);
            voucherBatchRepository.save(batch);
            logger.error("Failed to generate batch vouchers: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Update batch statistics
     */
    @Transactional
    public void updateBatchStats(String batchId) {
        VoucherBatch batch = voucherBatchRepository.findByBatchId(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
        
        List<Voucher> vouchers = voucherRepository.findByOrderId("BATCH_" + batchId);
        
        long sold = vouchers.stream()
            .filter(v -> v.getStatus() == Voucher.VoucherStatus.ACTIVE)
            .count();
        
        long redeemed = vouchers.stream()
            .filter(v -> v.getUsageStatus() == Voucher.UsageStatus.USED)
            .count();
        
        long expired = vouchers.stream()
            .filter(v -> v.getStatus() == Voucher.VoucherStatus.EXPIRED)
            .count();
        
        batch.setSold((int) sold);
        batch.setRedeemed((int) redeemed);
        batch.setExpired((int) expired);
        
        voucherBatchRepository.save(batch);
    }
    
    /**
     * Get batch by ID
     */
    public VoucherBatch getBatch(String batchId) {
        return voucherBatchRepository.findByBatchId(batchId)
            .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
    }
    
    /**
     * Get all batches
     */
    public List<VoucherBatch> getAllBatches() {
        return voucherBatchRepository.findAll();
    }
}

