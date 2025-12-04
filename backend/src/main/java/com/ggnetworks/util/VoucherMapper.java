package com.ggnetworks.util;

import com.ggnetworks.dto.VoucherDTO;
import com.ggnetworks.entity.Voucher;

/**
 * Utility class to map Voucher entities to DTOs
 */
public class VoucherMapper {

    /**
     * Convert Voucher entity to VoucherDTO
     * Safely handles lazy-loaded relationships
     */
    public static VoucherDTO toDTO(Voucher voucher) {
        if (voucher == null) {
            return null;
        }

        VoucherDTO dto = new VoucherDTO();
        dto.setId(voucher.getId());
        dto.setVoucherCode(voucher.getVoucherCode());
        dto.setOrderId(voucher.getOrderId());
        
        // Safely get packageId without triggering lazy loading
        try {
            dto.setPackageId(voucher.getPackageId());
        } catch (Exception e) {
            dto.setPackageId(null);
        }
        
        dto.setPackageName(voucher.getPackageName());
        dto.setCustomerName(voucher.getCustomerName());
        dto.setCustomerPhone(voucher.getCustomerPhone());
        dto.setCustomerEmail(voucher.getCustomerEmail());
        dto.setCustomerLocation(voucher.getCustomerLocation());
        dto.setAmount(voucher.getAmount());
        dto.setCurrency(voucher.getCurrency());
        dto.setStatus(voucher.getStatus() != null ? voucher.getStatus().toString() : null);
        dto.setUsageStatus(voucher.getUsageStatus() != null ? voucher.getUsageStatus().toString() : null);
        dto.setExpiresAt(voucher.getExpiresAt());
        dto.setUsedAt(voucher.getUsedAt());
        dto.setActivatedAt(voucher.getActivatedAt());
        dto.setGeneratedAt(voucher.getGeneratedAt());
        dto.setCreatedAt(voucher.getCreatedAt());
        dto.setUpdatedAt(voucher.getUpdatedAt());
        dto.setPaymentReference(voucher.getPaymentReference());
        dto.setTransactionId(voucher.getTransactionId());
        dto.setPaymentChannel(voucher.getPaymentChannel());
        
        return dto;
    }
}

