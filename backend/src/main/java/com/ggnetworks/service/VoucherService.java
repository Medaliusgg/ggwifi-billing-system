package com.ggnetworks.service;

import com.ggnetworks.entity.Voucher;
import com.ggnetworks.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int MIN_VOUCHER_CODE_LENGTH = 6;
    private static final int MAX_VOUCHER_CODE_LENGTH = 8;
    private static final Random RANDOM = new Random();

    /**
     * Generate a unique 6-8 alphanumeric voucher code (A-Z, a-z, 0-9)
     */
    public String generateVoucherCode(Long packageId) {
        String voucherCode;
        int attempts = 0;
        int maxAttempts = 100;

        do {
            // Generate code with random length between 6-8 characters
            int codeLength = MIN_VOUCHER_CODE_LENGTH + RANDOM.nextInt(MAX_VOUCHER_CODE_LENGTH - MIN_VOUCHER_CODE_LENGTH + 1);
            voucherCode = generateAlphanumericCode(codeLength);
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique voucher code after " + maxAttempts + " attempts");
            }
        } while (voucherRepository.existsByVoucherCode(voucherCode));

        System.out.println("🎫 Generated unique voucher code (" + voucherCode.length() + " chars): " + voucherCode + " (attempts: " + attempts + ")");
        return voucherCode;
    }

    /**
     * Generate alphanumeric voucher code (A-Z, a-z, 0-9) with specified length
     */
    private String generateAlphanumericCode(int length) {
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        
        return code.toString();
    }

    /**
     * Generate voucher code with format based on package type (deprecated - using random length now)
     */
    private String generateFormattedCode(Long packageId) {
        // Use random length between 6-8
        int codeLength = MIN_VOUCHER_CODE_LENGTH + RANDOM.nextInt(MAX_VOUCHER_CODE_LENGTH - MIN_VOUCHER_CODE_LENGTH + 1);
        return generateAlphanumericCode(codeLength);
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
     * Generate random voucher code (6-8 alphanumeric characters)
     */
    private String generateRandomCode() {
        // Generate code with random length between 6-8 characters
        int codeLength = MIN_VOUCHER_CODE_LENGTH + RANDOM.nextInt(MAX_VOUCHER_CODE_LENGTH - MIN_VOUCHER_CODE_LENGTH + 1);
        return generateAlphanumericCode(codeLength);
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
     * Get voucher by ID
     */
    public Optional<Voucher> getVoucherById(Long id) {
        return voucherRepository.findById(id);
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

    /**
     * Create bulk vouchers (professional feature)
     */
    public List<Voucher> createBulkVouchers(int quantity, Long packageId, BigDecimal amount,
                                            String customerName, String customerPhone, String customerEmail) {
        List<Voucher> vouchers = new java.util.ArrayList<>();
        
        for (int i = 0; i < quantity; i++) {
            String voucherCode = generateVoucherCode(packageId);
            Voucher voucher = createVoucher(voucherCode, packageId, amount, 
                                          customerName, customerPhone, customerEmail);
            vouchers.add(voucher);
        }
        
        return vouchers;
    }

    /**
     * Create vouchers with template (professional feature)
     */
    public List<Voucher> createVouchersFromTemplate(Map<String, Object> template) {
        int quantity = (Integer) template.getOrDefault("quantity", 1);
        Long packageId = Long.valueOf(template.get("packageId").toString());
        BigDecimal amount = new BigDecimal(template.get("amount").toString());
        String customerName = (String) template.getOrDefault("customerName", "Pre-Generated");
        String customerPhone = (String) template.getOrDefault("customerPhone", "");
        String customerEmail = (String) template.getOrDefault("customerEmail", "");
        
        return createBulkVouchers(quantity, packageId, amount, customerName, customerPhone, customerEmail);
    }

    /**
     * Get voucher statistics (professional feature)
     */
    public Map<String, Object> getVoucherStatistics() {
        Map<String, Object> stats = new java.util.HashMap<>();
        List<Voucher> allVouchers = voucherRepository.findAll();
        
        long total = allVouchers.size();
        long used = allVouchers.stream().filter(Voucher::isUsed).count();
        long unused = total - used;
        long active = allVouchers.stream().filter(v -> v.getStatus() == Voucher.VoucherStatus.ACTIVE).count();
        long generated = allVouchers.stream().filter(v -> v.getStatus() == Voucher.VoucherStatus.GENERATED).count();
        long expired = allVouchers.stream().filter(v -> v.getStatus() == Voucher.VoucherStatus.EXPIRED).count();
        
        BigDecimal totalAmount = allVouchers.stream()
            .map(Voucher::getAmount)
            .filter(amt -> amt != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal usedAmount = allVouchers.stream()
            .filter(Voucher::isUsed)
            .map(Voucher::getAmount)
            .filter(amt -> amt != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("total", total);
        stats.put("used", used);
        stats.put("unused", unused);
        stats.put("active", active);
        stats.put("generated", generated);
        stats.put("expired", expired);
        stats.put("totalAmount", totalAmount);
        stats.put("usedAmount", usedAmount);
        stats.put("unusedAmount", totalAmount.subtract(usedAmount));
        
        return stats;
    }

    /**
     * Get vouchers by status (professional feature)
     */
    public List<Voucher> getVouchersByStatus(Voucher.VoucherStatus status) {
        return voucherRepository.findByStatus(status);
    }

    /**
     * Get vouchers by package (professional feature)
     */
    public List<Voucher> getVouchersByPackage(Long packageId) {
        return voucherRepository.findByPackageId(packageId);
    }

    /**
     * Get vouchers created in date range (professional feature)
     */
    public List<Voucher> getVouchersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return voucherRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Delete unused voucher (professional feature)
     */
    public boolean deleteUnusedVoucher(String voucherCode) {
        Optional<Voucher> voucherOpt = voucherRepository.findByVoucherCode(voucherCode);
        if (voucherOpt.isPresent() && !voucherOpt.get().isUsed()) {
            voucherRepository.delete(voucherOpt.get());
            return true;
        }
        return false;
    }
    
    /**
     * Get voucher analytics for hotspot billing system
     */
    public Map<String, Object> getVoucherAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Voucher> vouchers = voucherRepository.findByCreatedAtBetween(startDate, endDate);
        
        // Total metrics
        long totalVouchers = vouchers.size();
        long usedVouchers = vouchers.stream().filter(Voucher::isUsed).count();
        long unusedVouchers = totalVouchers - usedVouchers;
        
        // Revenue metrics
        BigDecimal totalRevenue = vouchers.stream()
            .map(Voucher::getAmount)
            .filter(amt -> amt != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal usedRevenue = vouchers.stream()
            .filter(Voucher::isUsed)
            .map(Voucher::getAmount)
            .filter(amt -> amt != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Redemption rate
        double redemptionRate = totalVouchers > 0 ? 
            Math.round((double) usedVouchers / totalVouchers * 10000.0) / 100.0 : 0.0;
        
        // By package
        Map<Long, Map<String, Object>> packageMetrics = new HashMap<>();
        for (Voucher voucher : vouchers) {
            Long pkgId = voucher.getPackageId();
            if (pkgId != null) {
                packageMetrics.putIfAbsent(pkgId, new HashMap<>());
                Map<String, Object> metrics = packageMetrics.get(pkgId);
                
                metrics.put("packageId", pkgId);
                metrics.put("packageName", voucher.getPackageName());
                metrics.put("totalVouchers", ((Long) metrics.getOrDefault("totalVouchers", 0L)) + 1);
                metrics.put("usedVouchers", ((Long) metrics.getOrDefault("usedVouchers", 0L)) + 
                    (voucher.isUsed() ? 1 : 0));
                metrics.put("totalRevenue", ((BigDecimal) metrics.getOrDefault("totalRevenue", BigDecimal.ZERO))
                    .add(voucher.getAmount() != null ? voucher.getAmount() : BigDecimal.ZERO));
            }
        }
        
        // Daily redemption trend
        Map<String, Long> dailyRedemptions = new HashMap<>();
        vouchers.stream()
            .filter(Voucher::isUsed)
            .filter(v -> v.getUsedAt() != null)
            .forEach(v -> {
                String date = v.getUsedAt().toLocalDate().toString();
                dailyRedemptions.put(date, dailyRedemptions.getOrDefault(date, 0L) + 1);
            });
        
        // Status breakdown
        Map<String, Long> statusCounts = vouchers.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                v -> v.getStatus() != null ? v.getStatus().name() : "UNKNOWN",
                java.util.stream.Collectors.counting()
            ));
        
        analytics.put("period", Map.of("start", startDate.toString(), "end", endDate.toString()));
        analytics.put("totalVouchers", totalVouchers);
        analytics.put("usedVouchers", usedVouchers);
        analytics.put("unusedVouchers", unusedVouchers);
        analytics.put("redemptionRate", redemptionRate);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("usedRevenue", usedRevenue);
        analytics.put("unusedRevenue", totalRevenue.subtract(usedRevenue));
        analytics.put("byPackage", packageMetrics);
        analytics.put("dailyRedemptions", dailyRedemptions);
        analytics.put("byStatus", statusCounts);
        analytics.put("averageVoucherValue", totalVouchers > 0 ? 
            totalRevenue.divide(BigDecimal.valueOf(totalVouchers), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO);
        analytics.put("generatedAt", LocalDateTime.now().toString());
        
        return analytics;
    }
}