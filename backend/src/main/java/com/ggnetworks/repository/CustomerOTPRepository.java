package com.ggnetworks.repository;

import com.ggnetworks.entity.CustomerOTP;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerOTPRepository extends JpaRepository<CustomerOTP, Long> {
    
    Optional<CustomerOTP> findTopByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
        String phoneNumber,
        CustomerOTP.OTPPurpose purpose,
        LocalDateTime now
    );
    
    @Query("SELECT COUNT(otp) FROM CustomerOTP otp WHERE otp.phoneNumber = :phoneNumber " +
           "AND otp.createdAt >= :startTime AND otp.purpose = :purpose")
    Long countOTPsInTimeWindow(
        @Param("phoneNumber") String phoneNumber,
        @Param("startTime") LocalDateTime startTime,
        @Param("purpose") CustomerOTP.OTPPurpose purpose
    );
    
    @Query("SELECT otp FROM CustomerOTP otp WHERE otp.phoneNumber = :phoneNumber " +
           "AND otp.isUsed = false AND otp.expiresAt < :now")
    List<CustomerOTP> findExpiredOTPs(
        @Param("phoneNumber") String phoneNumber,
        @Param("now") LocalDateTime now
    );
    
    @Modifying
    @Query("DELETE FROM CustomerOTP otp WHERE otp.expiresAt < :cutoffTime")
    void deleteExpiredOTPs(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    @Modifying
    @Query("UPDATE CustomerOTP otp SET otp.isUsed = true, otp.usedAt = :usedAt " +
           "WHERE otp.id = :id")
    void markAsUsed(@Param("id") Long id, @Param("usedAt") LocalDateTime usedAt);
}



