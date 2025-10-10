package com.ggnetworks.repository;

import com.ggnetworks.entity.Router;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouterRepository extends JpaRepository<Router, Long> {

    Optional<Router> findByIpAddressAndDeletedAtIsNull(String ipAddress);

    Optional<Router> findByMacAddressAndDeletedAtIsNull(String macAddress);

    Optional<Router> findBySerialNumberAndDeletedAtIsNull(String serialNumber);

    // Add missing method
    Optional<Router> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT r FROM Router r WHERE r.status = :status AND r.deletedAt IS NULL")
    List<Router> findByStatus(@Param("status") Router.RouterStatus status);

    @Query("SELECT r FROM Router r WHERE r.type = :type AND r.deletedAt IS NULL")
    List<Router> findByType(@Param("type") Router.RouterType type);

    @Query("SELECT r FROM Router r WHERE r.location = :location AND r.deletedAt IS NULL")
    List<Router> findByLocation(@Param("location") String location);

    @Query("SELECT r FROM Router r WHERE r.model LIKE %:model% AND r.deletedAt IS NULL")
    List<Router> findByModelContaining(@Param("model") String model);

    @Query("SELECT r FROM Router r WHERE r.deletedAt IS NULL")
    Page<Router> findAllActive(Pageable pageable);

    @Query("SELECT r FROM Router r WHERE r.name LIKE %:name% AND r.deletedAt IS NULL")
    Page<Router> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT r FROM Router r WHERE r.ipAddress LIKE %:ipAddress% AND r.deletedAt IS NULL")
    Page<Router> findByIpAddressContaining(@Param("ipAddress") String ipAddress, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Router r WHERE r.status = :status AND r.deletedAt IS NULL")
    long countByStatus(@Param("status") Router.RouterStatus status);

    @Query("SELECT COUNT(r) FROM Router r WHERE r.type = :type AND r.deletedAt IS NULL")
    long countByType(@Param("type") Router.RouterType type);

    @Query("SELECT r FROM Router r WHERE r.nextMaintenance <= :date AND r.deletedAt IS NULL")
    List<Router> findRoutersNeedingMaintenance(@Param("date") java.time.LocalDateTime date);

    @Query("SELECT r FROM Router r WHERE r.cpuUsagePercent > :threshold AND r.deletedAt IS NULL")
    List<Router> findOverloadedRouters(@Param("threshold") Double threshold);
} 