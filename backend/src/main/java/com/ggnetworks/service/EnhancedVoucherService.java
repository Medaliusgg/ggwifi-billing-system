package com.ggnetworks.service;

import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Enhanced voucher service for WiFi hotspot billing
 * Supports automatic generation, manual bulk generation, and printing
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedVoucherService {

    private final HotspotVoucherRepository voucherRepository;
    private final PackageRepository packageRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final EnhancedRadiusService radiusService;
    private final SmsService smsService;

    @Value("${voucher.code.length:8}")
    private int voucherCodeLength;

    @Value("${voucher.code.prefix:GG}")
    private String voucherPrefix;

    @Value("${voucher.expiration.default-days:30}")
    private int defaultExpirationDays;

    @Value("${voucher.printing.enabled:true}")
    private boolean printingEnabled;

    /**
     * Generate voucher automatically after successful payment
     */
    @Transactional
    public CompletableFuture<VoucherGenerationResult> generateVoucherAfterPayment(Payment payment) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Generating voucher after payment: {}", payment.getId());

                // Get package from payment
                if (payment.getPackageId() == null) {
                    throw new IllegalArgumentException("Payment does not have associated package");
                }

                Optional<Package> packageOpt = packageRepository.findById(payment.getPackageId());
                if (packageOpt.isEmpty()) {
                    throw new IllegalArgumentException("Package not found");
                }

                Package packageEntity = packageOpt.get();

                // Generate voucher
                HotspotVoucher voucher = generateSingleVoucher(
                    packageEntity.getId(),
                    payment.getUser().getPhoneNumber(),
                    LocalDateTime.now().plusDays(defaultExpirationDays)
                );

                // Create RADIUS user for immediate use
                radiusService.createRadiusUserForVoucher(voucher, null, null, null);

                // Send SMS notification
                if (payment.getUser() != null && payment.getUser().getPhoneNumber() != null) {
                    sendVoucherSmsNotification(payment.getUser().getPhoneNumber(), voucher);
                }

                // Update payment with voucher reference
                payment.setVoucherId(voucher.getId());
                paymentRepository.save(payment);

                log.info("Voucher generated successfully after payment: {}", payment.getId());

                return VoucherGenerationResult.builder()
                        .success(true)
                        .voucher(voucher)
                        .message("Voucher generated successfully")
                        .smsSent(true)
                        .radiusCreated(true)
                        .build();

            } catch (Exception e) {
                log.error("Failed to generate voucher after payment: {}", payment.getId(), e);
                return VoucherGenerationResult.builder()
                        .success(false)
                        .message("Failed to generate voucher: " + e.getMessage())
                        .build();
            }
        });
    }

    /**
     * Generate vouchers in bulk manually
     */
    @Transactional
    public BulkVoucherGenerationResult generateBulkVouchers(BulkVoucherRequest request) {
        try {
            log.info("Generating {} vouchers for package: {}", request.getQuantity(), request.getPackageId());

            Optional<Package> packageOpt = packageRepository.findById(request.getPackageId());
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found");
            }

            Package packageEntity = packageOpt.get();
            List<HotspotVoucher> vouchers = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            // Generate vouchers in batches
            int batchSize = 100;
            for (int i = 0; i < request.getQuantity(); i += batchSize) {
                int currentBatchSize = Math.min(batchSize, request.getQuantity() - i);
                
                for (int j = 0; j < currentBatchSize; j++) {
                    try {
                        HotspotVoucher voucher = generateSingleVoucher(
                            request.getPackageId(),
                            request.getAssignedTo(),
                            request.getExpiresAt()
                        );
                        vouchers.add(voucher);

                        // Create RADIUS user
                        radiusService.createRadiusUserForVoucher(voucher, null, null, null);

                    } catch (Exception e) {
                        errors.add("Failed to generate voucher " + (i + j + 1) + ": " + e.getMessage());
                    }
                }
            }

            log.info("Generated {} vouchers successfully, {} errors", vouchers.size(), errors.size());

            return BulkVoucherGenerationResult.builder()
                    .success(vouchers.size() > 0)
                    .vouchers(vouchers)
                    .totalRequested(request.getQuantity())
                    .totalGenerated(vouchers.size())
                    .errors(errors)
                    .build();

        } catch (Exception e) {
            log.error("Failed to generate bulk vouchers", e);
            return BulkVoucherGenerationResult.builder()
                    .success(false)
                    .totalRequested(request.getQuantity())
                    .totalGenerated(0)
                    .errors(List.of(e.getMessage()))
                    .build();
        }
    }

    /**
     * Generate single voucher with enhanced features
     */
    @Transactional
    public HotspotVoucher generateSingleVoucher(Long packageId, String assignedTo, LocalDateTime expiresAt) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found");
            }

            Package packageEntity = packageOpt.get();
            
            // Generate unique voucher code
            String voucherCode = generateUniqueVoucherCode();
            
            // Set expiration date if not provided
            if (expiresAt == null) {
                expiresAt = LocalDateTime.now().plusDays(defaultExpirationDays);
            }

            HotspotVoucher voucher = new HotspotVoucher();
            voucher.setVoucherCode(voucherCode);
            voucher.setPackageEntity(packageEntity);
            voucher.setStatus(HotspotVoucher.VoucherStatus.GENERATED);
            voucher.setAssignedTo(assignedTo);
            voucher.setExpiresAt(expiresAt);
            voucher.setGeneratedAt(LocalDateTime.now());

            // Set additional voucher properties
            voucher.setPrintStatus(PrintStatus.NOT_PRINTED);
            voucher.setBatchId(generateBatchId());
            voucher.setLocation(request.getLocation()); // From request context

            HotspotVoucher savedVoucher = voucherRepository.save(voucher);
            
            log.info("Generated voucher: {} for package: {}", voucherCode, packageEntity.getName());
            
            return savedVoucher;
        } catch (Exception e) {
            log.error("Failed to generate voucher for package: {}", packageId, e);
            throw new RuntimeException("Failed to generate voucher", e);
        }
    }

    /**
     * Print voucher (physical copy)
     */
    @Transactional
    public VoucherPrintResult printVoucher(Long voucherId, PrintOptions options) {
        try {
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByIdAndDeletedAtIsNull(voucherId);
            if (voucherOpt.isEmpty()) {
                throw new IllegalArgumentException("Voucher not found");
            }

            HotspotVoucher voucher = voucherOpt.get();

            // Generate printable voucher content
            String printableContent = generatePrintableVoucherContent(voucher, options);
            
            // Update print status
            voucher.setPrintStatus(PrintStatus.PRINTED);
            voucher.setPrintedAt(LocalDateTime.now());
            voucher.setPrintedBy(options.getPrintedBy());
            voucherRepository.save(voucher);

            log.info("Voucher printed: {}", voucher.getVoucherCode());

            return VoucherPrintResult.builder()
                    .success(true)
                    .voucher(voucher)
                    .printableContent(printableContent)
                    .message("Voucher printed successfully")
                    .build();

        } catch (Exception e) {
            log.error("Failed to print voucher: {}", voucherId, e);
            return VoucherPrintResult.builder()
                    .success(false)
                    .message("Failed to print voucher: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Print multiple vouchers in batch
     */
    @Transactional
    public BatchPrintResult printBatchVouchers(List<Long> voucherIds, PrintOptions options) {
        try {
            List<VoucherPrintResult> results = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            for (Long voucherId : voucherIds) {
                try {
                    VoucherPrintResult result = printVoucher(voucherId, options);
                    results.add(result);
                } catch (Exception e) {
                    errors.add("Failed to print voucher " + voucherId + ": " + e.getMessage());
                }
            }

            int successCount = (int) results.stream().filter(VoucherPrintResult::isSuccess).count();

            return BatchPrintResult.builder()
                    .success(successCount > 0)
                    .totalRequested(voucherIds.size())
                    .totalPrinted(successCount)
                    .results(results)
                    .errors(errors)
                    .build();

        } catch (Exception e) {
            log.error("Failed to print batch vouchers", e);
            return BatchPrintResult.builder()
                    .success(false)
                    .totalRequested(voucherIds.size())
                    .totalPrinted(0)
                    .errors(List.of(e.getMessage()))
                    .build();
        }
    }

    /**
     * Get vouchers ready for printing
     */
    public List<HotspotVoucher> getVouchersForPrinting(String location, String batchId) {
        return voucherRepository.findByLocationAndPrintStatusAndDeletedAtIsNull(
            location, PrintStatus.NOT_PRINTED
        ).stream()
        .filter(voucher -> batchId == null || batchId.equals(voucher.getBatchId()))
        .collect(Collectors.toList());
    }

    /**
     * Generate QR code for voucher
     */
    public String generateVoucherQRCode(Long voucherId) {
        try {
            Optional<HotspotVoucher> voucherOpt = voucherRepository.findByIdAndDeletedAtIsNull(voucherId);
            if (voucherOpt.isEmpty()) {
                throw new IllegalArgumentException("Voucher not found");
            }

            HotspotVoucher voucher = voucherOpt.get();
            
            // Generate QR code content
            StringBuilder qrContent = new StringBuilder();
            qrContent.append("voucher_code=").append(voucher.getVoucherCode());
            qrContent.append("&package_name=").append(voucher.getPackageEntity().getName());
            qrContent.append("&price=").append(voucher.getPackageEntity().getPrice());
            qrContent.append("&duration=").append(voucher.getPackageEntity().getDurationDays());
            qrContent.append("&expires=").append(voucher.getExpiresAt().format(DateTimeFormatter.ISO_LOCAL_DATE));
            qrContent.append("&location=").append(voucher.getLocation());

            // In production, use a proper QR code library
            return qrContent.toString();

        } catch (Exception e) {
            log.error("Failed to generate QR code for voucher: {}", voucherId, e);
            return null;
        }
    }

    /**
     * Get voucher statistics
     */
    public VoucherStatistics getVoucherStatistics(String location) {
        try {
            List<HotspotVoucher> vouchers;
            
            if (location != null) {
                vouchers = voucherRepository.findByLocationAndDeletedAtIsNull(location);
            } else {
                vouchers = voucherRepository.findAll();
            }

            VoucherStatistics stats = new VoucherStatistics();
            stats.setTotalVouchers(vouchers.size());
            stats.setGeneratedVouchers(vouchers.stream()
                    .filter(v -> v.getStatus() == HotspotVoucher.VoucherStatus.GENERATED)
                    .count());
            stats.setUsedVouchers(vouchers.stream()
                    .filter(v -> v.getStatus() == HotspotVoucher.VoucherStatus.USED)
                    .count());
            stats.setExpiredVouchers(vouchers.stream()
                    .filter(v -> v.getStatus() == HotspotVoucher.VoucherStatus.EXPIRED)
                    .count());
            stats.setPrintedVouchers(vouchers.stream()
                    .filter(v -> v.getPrintStatus() == PrintStatus.PRINTED)
                    .count());

            return stats;
        } catch (Exception e) {
            log.error("Failed to get voucher statistics", e);
            return new VoucherStatistics();
        }
    }

    // Private helper methods
    private String generateUniqueVoucherCode() {
        String code;
        int attempts = 0;
        do {
            code = voucherPrefix + generateRandomCode(voucherCodeLength - voucherPrefix.length());
            attempts++;
            if (attempts > 100) {
                throw new RuntimeException("Unable to generate unique voucher code after 100 attempts");
            }
        } while (voucherRepository.findByVoucherCodeAndDeletedAtIsNull(code).isPresent());
        
        return code;
    }

    private String generateRandomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < length; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return code.toString();
    }

    private String generateBatchId() {
        return "BATCH_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    }

    private String generatePrintableVoucherContent(HotspotVoucher voucher, PrintOptions options) {
        StringBuilder content = new StringBuilder();
        
        content.append("========================================\n");
        content.append("        GGWIFI WiFi Voucher        \n");
        content.append("========================================\n\n");
        
        content.append("Voucher Code: ").append(voucher.getVoucherCode()).append("\n");
        content.append("Package: ").append(voucher.getPackageEntity().getName()).append("\n");
        content.append("Price: TZS ").append(voucher.getPackageEntity().getPrice()).append("\n");
        content.append("Duration: ").append(voucher.getPackageEntity().getDurationDays()).append(" days\n");
        
        if (voucher.getPackageEntity().getBandwidthLimitMb() != null) {
            content.append("Data Limit: ").append(voucher.getPackageEntity().getBandwidthLimitMb()).append(" MB\n");
        }
        
        content.append("Expires: ").append(voucher.getExpiresAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("\n");
        content.append("Location: ").append(voucher.getLocation()).append("\n\n");
        
        if (options.isIncludeQRCode()) {
            content.append("QR Code: ").append(generateVoucherQRCode(voucher.getId())).append("\n\n");
        }
        
        content.append("Instructions:\n");
        content.append("1. Connect to GGWIFI WiFi\n");
        content.append("2. Enter voucher code when prompted\n");
        content.append("3. Enjoy your internet access!\n\n");
        
        content.append("Support: +255 742 844 024\n");
        content.append("Website: www.ggwifi.co.tz\n");
        content.append("========================================\n");
        
        return content.toString();
    }

    private void sendVoucherSmsNotification(String phoneNumber, HotspotVoucher voucher) {
        try {
            String message = String.format(
                "Your GGWIFI voucher: %s\nPackage: %s\nPrice: TZS %s\nExpires: %s\nEnjoy your internet!",
                voucher.getVoucherCode(),
                voucher.getPackageEntity().getName(),
                voucher.getPackageEntity().getPrice(),
                voucher.getExpiresAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
            );
            
            smsService.sendSms(phoneNumber, message, null);
            log.info("SMS sent for voucher: {}", voucher.getVoucherCode());
        } catch (Exception e) {
            log.error("Failed to send SMS for voucher: {}", voucher.getVoucherCode(), e);
        }
    }

    // Enums and DTOs
    public enum PrintStatus {
        NOT_PRINTED, PRINTED, PRINT_FAILED
    }

    public static class BulkVoucherRequest {
        private Long packageId;
        private int quantity;
        private String assignedTo;
        private LocalDateTime expiresAt;
        private String location;

        // Getters and setters
        public Long getPackageId() { return packageId; }
        public void setPackageId(Long packageId) { this.packageId = packageId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public String getAssignedTo() { return assignedTo; }
        public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class PrintOptions {
        private boolean includeQRCode = true;
        private String printedBy;
        private String printerName;

        // Getters and setters
        public boolean isIncludeQRCode() { return includeQRCode; }
        public void setIncludeQRCode(boolean includeQRCode) { this.includeQRCode = includeQRCode; }
        public String getPrintedBy() { return printedBy; }
        public void setPrintedBy(String printedBy) { this.printedBy = printedBy; }
        public String getPrinterName() { return printerName; }
        public void setPrinterName(String printerName) { this.printerName = printerName; }
    }

    public static class VoucherGenerationResult {
        private boolean success;
        private HotspotVoucher voucher;
        private String message;
        private boolean smsSent;
        private boolean radiusCreated;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private VoucherGenerationResult result = new VoucherGenerationResult();

            public Builder success(boolean success) {
                result.success = success;
                return this;
            }

            public Builder voucher(HotspotVoucher voucher) {
                result.voucher = voucher;
                return this;
            }

            public Builder message(String message) {
                result.message = message;
                return this;
            }

            public Builder smsSent(boolean smsSent) {
                result.smsSent = smsSent;
                return this;
            }

            public Builder radiusCreated(boolean radiusCreated) {
                result.radiusCreated = radiusCreated;
                return this;
            }

            public VoucherGenerationResult build() {
                return result;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public HotspotVoucher getVoucher() { return voucher; }
        public String getMessage() { return message; }
        public boolean isSmsSent() { return smsSent; }
        public boolean isRadiusCreated() { return radiusCreated; }
    }

    public static class BulkVoucherGenerationResult {
        private boolean success;
        private List<HotspotVoucher> vouchers;
        private int totalRequested;
        private int totalGenerated;
        private List<String> errors;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private BulkVoucherGenerationResult result = new BulkVoucherGenerationResult();

            public Builder success(boolean success) {
                result.success = success;
                return this;
            }

            public Builder vouchers(List<HotspotVoucher> vouchers) {
                result.vouchers = vouchers;
                return this;
            }

            public Builder totalRequested(int totalRequested) {
                result.totalRequested = totalRequested;
                return this;
            }

            public Builder totalGenerated(int totalGenerated) {
                result.totalGenerated = totalGenerated;
                return this;
            }

            public Builder errors(List<String> errors) {
                result.errors = errors;
                return this;
            }

            public BulkVoucherGenerationResult build() {
                return result;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public List<HotspotVoucher> getVouchers() { return vouchers; }
        public int getTotalRequested() { return totalRequested; }
        public int getTotalGenerated() { return totalGenerated; }
        public List<String> getErrors() { return errors; }
    }

    public static class VoucherPrintResult {
        private boolean success;
        private HotspotVoucher voucher;
        private String printableContent;
        private String message;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private VoucherPrintResult result = new VoucherPrintResult();

            public Builder success(boolean success) {
                result.success = success;
                return this;
            }

            public Builder voucher(HotspotVoucher voucher) {
                result.voucher = voucher;
                return this;
            }

            public Builder printableContent(String printableContent) {
                result.printableContent = printableContent;
                return this;
            }

            public Builder message(String message) {
                result.message = message;
                return this;
            }

            public VoucherPrintResult build() {
                return result;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public HotspotVoucher getVoucher() { return voucher; }
        public String getPrintableContent() { return printableContent; }
        public String getMessage() { return message; }
    }

    public static class BatchPrintResult {
        private boolean success;
        private int totalRequested;
        private int totalPrinted;
        private List<VoucherPrintResult> results;
        private List<String> errors;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private BatchPrintResult result = new BatchPrintResult();

            public Builder success(boolean success) {
                result.success = success;
                return this;
            }

            public Builder totalRequested(int totalRequested) {
                result.totalRequested = totalRequested;
                return this;
            }

            public Builder totalPrinted(int totalPrinted) {
                result.totalPrinted = totalPrinted;
                return this;
            }

            public Builder results(List<VoucherPrintResult> results) {
                result.results = results;
                return this;
            }

            public Builder errors(List<String> errors) {
                result.errors = errors;
                return this;
            }

            public BatchPrintResult build() {
                return result;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public int getTotalRequested() { return totalRequested; }
        public int getTotalPrinted() { return totalPrinted; }
        public List<VoucherPrintResult> getResults() { return results; }
        public List<String> getErrors() { return errors; }
    }

    public static class VoucherStatistics {
        private long totalVouchers;
        private long generatedVouchers;
        private long usedVouchers;
        private long expiredVouchers;
        private long printedVouchers;

        // Getters and setters
        public long getTotalVouchers() { return totalVouchers; }
        public void setTotalVouchers(long totalVouchers) { this.totalVouchers = totalVouchers; }
        public long getGeneratedVouchers() { return generatedVouchers; }
        public void setGeneratedVouchers(long generatedVouchers) { this.generatedVouchers = generatedVouchers; }
        public long getUsedVouchers() { return usedVouchers; }
        public void setUsedVouchers(long usedVouchers) { this.usedVouchers = usedVouchers; }
        public long getExpiredVouchers() { return expiredVouchers; }
        public void setExpiredVouchers(long expiredVouchers) { this.expiredVouchers = expiredVouchers; }
        public long getPrintedVouchers() { return printedVouchers; }
        public void setPrintedVouchers(long printedVouchers) { this.printedVouchers = printedVouchers; }
    }
}
