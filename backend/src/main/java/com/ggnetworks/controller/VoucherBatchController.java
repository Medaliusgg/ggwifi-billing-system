package com.ggnetworks.controller;

import com.ggnetworks.entity.VoucherBatch;
import com.ggnetworks.service.VoucherBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Voucher Batch Controller
 * Manages voucher batch generation and tracking
 */
@RestController
@RequestMapping("/api/v1/admin/voucher-batches")
@CrossOrigin(origins = "*")
public class VoucherBatchController {
    
    @Autowired
    private VoucherBatchService voucherBatchService;
    
    /**
     * Create a new voucher batch
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBatch(@RequestBody Map<String, Object> batchData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long packageId = Long.parseLong(batchData.get("packageId").toString());
            Integer quantity = Integer.parseInt(batchData.get("quantity").toString());
            BigDecimal unitPrice = new BigDecimal(batchData.get("unitPrice").toString());
            String createdBy = (String) batchData.get("createdBy");
            String notes = (String) batchData.getOrDefault("notes", "");
            
            VoucherBatch batch = voucherBatchService.createBatch(
                packageId, quantity, unitPrice, createdBy, notes);
            
            response.put("status", "success");
            response.put("message", "Voucher batch created successfully");
            response.put("batch", batch);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create batch: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Generate vouchers for a batch
     */
    @PostMapping("/{batchId}/generate")
    public ResponseEntity<Map<String, Object>> generateBatch(@PathVariable String batchId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            voucherBatchService.generateBatchVouchers(batchId);
            
            response.put("status", "success");
            response.put("message", "Vouchers generated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to generate vouchers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get batch by ID
     */
    @GetMapping("/{batchId}")
    public ResponseEntity<Map<String, Object>> getBatch(@PathVariable String batchId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            VoucherBatch batch = voucherBatchService.getBatch(batchId);
            
            response.put("status", "success");
            response.put("batch", batch);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get batch: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Get all batches
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBatches() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<VoucherBatch> batches = voucherBatchService.getAllBatches();
            
            response.put("status", "success");
            response.put("batches", batches);
            response.put("count", batches.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get batches: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Update batch statistics
     */
    @PostMapping("/{batchId}/update-stats")
    public ResponseEntity<Map<String, Object>> updateStats(@PathVariable String batchId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            voucherBatchService.updateBatchStats(batchId);
            
            response.put("status", "success");
            response.put("message", "Batch statistics updated");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

