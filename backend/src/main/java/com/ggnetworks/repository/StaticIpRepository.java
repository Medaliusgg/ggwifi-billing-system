package com.ggnetworks.repository;

import com.ggnetworks.entity.StaticIp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaticIpRepository extends JpaRepository<StaticIp, Long> {

    Optional<StaticIp> findByIpAddressAndDeletedAtIsNull(String ipAddress);

    @Query("SELECT si FROM StaticIp si WHERE si.status = :status AND si.deletedAt IS NULL")
    List<StaticIp> findByStatus(@Param("status") StaticIp.StaticIpStatus status);

    @Query("SELECT si FROM StaticIp si WHERE si.type = :type AND si.deletedAt IS NULL")
    List<StaticIp> findByType(@Param("type") StaticIp.StaticIpType type);

    @Query("SELECT si FROM StaticIp si WHERE si.user.id = :userId AND si.deletedAt IS NULL")
    List<StaticIp> findByUserId(@Param("userId") Long userId);

    @Query("SELECT si FROM StaticIp si WHERE si.router.id = :routerId AND si.deletedAt IS NULL")
    List<StaticIp> findByRouterId(@Param("routerId") Long routerId);

    @Query("SELECT si FROM StaticIp si WHERE si.status = :status AND si.type = :type AND si.deletedAt IS NULL")
    List<StaticIp> findByStatusAndType(@Param("status") StaticIp.StaticIpStatus status, 
                                     @Param("type") StaticIp.StaticIpType type);

    @Query("SELECT si FROM StaticIp si WHERE si.expiresAt <= :date AND si.deletedAt IS NULL")
    List<StaticIp> findExpiredStaticIps(@Param("date") LocalDateTime date);

    @Query("SELECT si FROM StaticIp si WHERE si.expiresAt BETWEEN :startDate AND :endDate AND si.deletedAt IS NULL")
    List<StaticIp> findStaticIpsExpiringBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(si) FROM StaticIp si WHERE si.status = :status AND si.deletedAt IS NULL")
    long countByStatus(@Param("status") StaticIp.StaticIpStatus status);

    @Query("SELECT COUNT(si) FROM StaticIp si WHERE si.type = :type AND si.deletedAt IS NULL")
    long countByType(@Param("type") StaticIp.StaticIpType type);

    @Query("SELECT COUNT(si) FROM StaticIp si WHERE si.status = 'AVAILABLE' AND si.deletedAt IS NULL")
    long countAvailableStaticIps();

    @Query("SELECT COUNT(si) FROM StaticIp si WHERE si.status = 'ASSIGNED' AND si.deletedAt IS NULL")
    long countAssignedStaticIps();

    @Query("SELECT si FROM StaticIp si WHERE si.deletedAt IS NULL")
    Page<StaticIp> findAllActive(Pageable pageable);

    @Query("SELECT si FROM StaticIp si WHERE si.ipAddress LIKE %:ipAddress% AND si.deletedAt IS NULL")
    Page<StaticIp> findByIpAddressContaining(@Param("ipAddress") String ipAddress, Pageable pageable);

    @Query("SELECT si FROM StaticIp si WHERE si.user.phoneNumber = :phoneNumber AND si.deletedAt IS NULL")
    List<StaticIp> findByUserPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT si FROM StaticIp si WHERE si.monthlyFee >= :minFee AND si.deletedAt IS NULL")
    List<StaticIp> findByMinimumMonthlyFee(@Param("minFee") Double minFee);

    @Query("SELECT si FROM StaticIp si WHERE si.subnetMask = :subnetMask AND si.deletedAt IS NULL")
    List<StaticIp> findBySubnetMask(@Param("subnetMask") String subnetMask);
} 