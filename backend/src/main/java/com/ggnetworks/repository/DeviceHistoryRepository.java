package com.ggnetworks.repository;

import com.ggnetworks.entity.DeviceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceHistoryRepository extends JpaRepository<DeviceHistory, Long> {
    
    Optional<DeviceHistory> findByMacAddress(String macAddress);
    
    List<DeviceHistory> findByCustomerId(Long customerId);
    
    List<DeviceHistory> findByPhoneNumber(String phoneNumber);
    
    @Query("SELECT d FROM DeviceHistory d WHERE d.customerId = :customerId OR d.phoneNumber = :phoneNumber")
    List<DeviceHistory> findByCustomerIdOrPhoneNumber(@Param("customerId") Long customerId, @Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT d FROM DeviceHistory d WHERE d.macAddress = :macAddress ORDER BY d.lastSeen DESC")
    List<DeviceHistory> findByMacAddressOrderByLastSeenDesc(@Param("macAddress") String macAddress);
    
    List<DeviceHistory> findByIsBlacklisted(Boolean isBlacklisted);
    
    List<DeviceHistory> findByIsPrimaryDevice(Boolean isPrimaryDevice);
    
    @Query("SELECT COUNT(DISTINCT d.macAddress) FROM DeviceHistory d WHERE d.phoneNumber = :phoneNumber")
    long countDistinctMacAddressesByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT d FROM DeviceHistory d WHERE d.phoneNumber = :phoneNumber ORDER BY d.lastSeen DESC")
    List<DeviceHistory> findDeviceHistoryByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}





