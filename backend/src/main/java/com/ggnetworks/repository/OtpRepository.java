package com.ggnetworks.repository;

import com.ggnetworks.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    @Query("SELECT o FROM Otp o WHERE o.phoneNumber = :phoneNumber AND o.type = :type AND o.isUsed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC")
    List<Otp> findValidOtpsByPhoneNumberAndType(@Param("phoneNumber") String phoneNumber, 
                                                @Param("type") Otp.OtpType type, 
                                                @Param("now") LocalDateTime now);

    @Query("SELECT o FROM Otp o WHERE o.phoneNumber = :phoneNumber AND o.otpCode = :otpCode AND o.type = :type AND o.isUsed = false AND o.expiresAt > :now")
    Optional<Otp> findValidOtp(@Param("phoneNumber") String phoneNumber, 
                               @Param("otpCode") String otpCode, 
                               @Param("type") Otp.OtpType type, 
                               @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(o) FROM Otp o WHERE o.phoneNumber = :phoneNumber AND o.type = :type AND o.createdAt >= :startTime")
    long countByPhoneNumberAndTypeAndCreatedAtAfter(@Param("phoneNumber") String phoneNumber, 
                                                   @Param("type") Otp.OtpType type, 
                                                   @Param("startTime") LocalDateTime startTime);

    @Modifying
    @Query("UPDATE Otp o SET o.isUsed = true WHERE o.phoneNumber = :phoneNumber AND o.type = :type AND o.isUsed = false")
    void markAllOtpsAsUsed(@Param("phoneNumber") String phoneNumber, @Param("type") Otp.OtpType type);

    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiresAt < :now")
    void deleteExpiredOtps(@Param("now") LocalDateTime now);

    @Query("SELECT o FROM Otp o WHERE o.expiresAt < :now AND o.isUsed = false")
    List<Otp> findExpiredUnusedOtps(@Param("now") LocalDateTime now);

    // Additional methods for OTP service
    @Query("SELECT o FROM Otp o WHERE o.phoneNumber = :phoneNumber AND o.type = :type AND o.isUsed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC LIMIT 1")
    Optional<Otp> findByPhoneNumberAndTypeAndIsUsedFalseAndExpiresAtAfter(@Param("phoneNumber") String phoneNumber, 
                                                                          @Param("type") Otp.OtpType type, 
                                                                          @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Otp o SET o.isUsed = true WHERE o.phoneNumber = :phoneNumber AND o.type = :type AND o.isUsed = false")
    void invalidateExistingOtps(@Param("phoneNumber") String phoneNumber, @Param("type") Otp.OtpType type);

    @Query("SELECT COUNT(o) FROM Otp o WHERE o.isUsed = true")
    long countByIsUsedTrue();

    @Query("SELECT COUNT(o) FROM Otp o WHERE o.expiresAt < :now")
    long countByExpiresAtBefore(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(o) FROM Otp o WHERE o.isUsed = false AND o.expiresAt > :now")
    long countByIsUsedFalseAndExpiresAtAfter(@Param("now") LocalDateTime now);
} 