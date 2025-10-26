package com.ggnetworks.repository;

import com.ggnetworks.entity.Router;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RouterRepository extends JpaRepository<Router, Long> {
    
    Optional<Router> findByRouterId(String routerId);
    
    Optional<Router> findByIpAddress(String ipAddress);
    
    Optional<Router> findBySerialNumber(String serialNumber);
    
    Optional<Router> findByMacAddress(String macAddress);
    
    List<Router> findByStatus(Router.RouterStatus status);
    
    List<Router> findByRouterType(Router.RouterType routerType);
    
    List<Router> findByLocation(String location);
    
    List<Router> findByIsActive(Boolean isActive);
    
    List<Router> findByLastSeenBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Router> findByNameContainingIgnoreCase(String name);
    
    List<Router> findByModelContainingIgnoreCase(String model);
    
    List<Router> findByFirmwareVersion(String firmwareVersion);
    
    List<Router> findByStatusAndIsActive(Router.RouterStatus status, Boolean isActive);
    
    boolean existsByRouterId(String routerId);
    
    boolean existsByIpAddress(String ipAddress);
    
    boolean existsBySerialNumber(String serialNumber);
    
    boolean existsByMacAddress(String macAddress);
    
    long countByStatus(Router.RouterStatus status);
    
    long countByRouterType(Router.RouterType routerType);
    
    long countByIsActive(Boolean isActive);
    
    long countByLocation(String location);
    
    // Dashboard methods - count by status string for compatibility
    @Query("SELECT COUNT(r) FROM Router r WHERE r.status = :status")
    long countByStatusString(@Param("status") String status);
}
