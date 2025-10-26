package com.ggnetworks.service;

import com.ggnetworks.entity.Voucher;
import com.ggnetworks.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int VOUCHER_CODE_LENGTH = 8;
    private static final Random RANDOM = new Random();

    /**
     * Generate a unique 8-digit voucher code based on package type
     */
    public String generateVoucherCode(Long packageId) {
        String voucherCode;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            voucherCode = generateFormattedCode(packageId);
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique voucher code after " + maxAttempts + " attempts");
            }
        } while (voucherRepository.existsByVoucherCode(voucherCode));

        System.out.println("🎫 Generated unique voucher code: " + voucherCode + " (attempts: " + attempts + ")");
        return voucherCode;
    }

    /**
     * Generate voucher code with format based on package type
     */
    private String generateFormattedCode(Long packageId) {
        String format = determineVoucherFormat(packageId);
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < VOUCHER_CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        
        return code.toString();
    }

    /**
     * Determine voucher format based on package type
     */
    private String determineVoucherFormat(Long packageId) {
        // For now, use a simple format
        // In the future, you could customize based on package type
        return "XXXX-XXXX";
    }

    /**
     * Generate a simple voucher code (for testing)
     */
    public String generateVoucherCode() {
        String voucherCode;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            voucherCode = generateRandomCode();
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique voucher code after " + maxAttempts + " attempts");
            }
        } while (voucherRepository.existsByVoucherCode(voucherCode));

        System.out.println("🎫 Generated simple voucher code: " + voucherCode + " (attempts: " + attempts + ")");
        return voucherCode;
    }

    /**
     * Generate random voucher code
     */
    private String generateRandomCode() {
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < VOUCHER_CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        
        return code.toString();
    }

    /**
     * Create a new voucher
     */
    public Voucher createVoucher(String voucherCode, Long packageId, BigDecimal amount, 
                               String customerName, String customerPhone, String customerEmail) {
        Voucher voucher = new Voucher();
        voucher.setVoucherCode(voucherCode);
        voucher.setPackageId(packageId);
        voucher.setAmount(amount);
        voucher.setCustomerName(customerName);
        voucher.setCustomerPhone(customerPhone);
        voucher.setCustomerEmail(customerEmail);
        voucher.setIsUsed(false);
        voucher.setIsActive(true);
        voucher.setCreatedAt(LocalDateTime.now());
        voucher.setUpdatedAt(LocalDateTime.now());
        
        return voucherRepository.save(voucher);
    }

    /**
     * Get voucher by code
     */
    public Optional<Voucher> getVoucherByCode(String voucherCode) {
        return voucherRepository.findByVoucherCode(voucherCode);
    }

    /**
     * Mark voucher as used
     */
    public boolean markVoucherAsUsed(String voucherCode) {
        Optional<Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
        
        if (voucherOpt.isPresent()) {
            Voucher voucher = voucherOpt.get();
            voucher.setIsUsed(true);
            voucher.setUsedAt(LocalDateTime.now());
            voucher.setUpdatedAt(LocalDateTime.now());
            voucherRepository.save(voucher);
            return true;
        }
        
        return false;
    }

    /**
     * Get all vouchers
     */
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    /**
     * Get vouchers by customer phone
     */
    public List<Voucher> getVouchersByCustomerPhone(String customerPhone) {
        return voucherRepository.findByCustomerPhone(customerPhone);
    }

    /**
     * Get active vouchers
     */
    public List<Voucher> getActiveVouchers() {
        return voucherRepository.findUnusedVouchers(java.time.LocalDateTime.now());
    }

    /**
     * Get unused vouchers
     */
    public List<Voucher> getUnusedVouchers() {
        return voucherRepository.findUnusedVouchers(java.time.LocalDateTime.now());
    }
}