package com.ggnetworks.repository;

import com.ggnetworks.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    
    Optional<Device> findByDeviceId(String deviceId);
    
    List<Device> findByDeviceType(Device.DeviceType deviceType);
    
    List<Device> findByStatus(Device.DeviceStatus status);
    
    List<Device> findByManufacturer(String manufacturer);
    
    List<Device> findByAssignedTo(String assignedTo);
    
    List<Device> findByLocation(String location);
    
    List<Device> findByIpAddress(String ipAddress);
    
    List<Device> findByMacAddress(String macAddress);
    
    List<Device> findBySerialNumber(String serialNumber);
    
    List<Device> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Device> findByLastMaintenanceBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Device> findByNextMaintenanceBefore(LocalDateTime date);
    
    List<Device> findByWarrantyExpiryBefore(LocalDateTime date);
    
    boolean existsByDeviceId(String deviceId);
    
    boolean existsByIpAddress(String ipAddress);
    
    boolean existsByMacAddress(String macAddress);
    
    boolean existsBySerialNumber(String serialNumber);
    
    long countByDeviceType(Device.DeviceType deviceType);
    
    long countByStatus(Device.DeviceStatus status);
    
    long countByManufacturer(String manufacturer);
    
    long countByAssignedTo(String assignedTo);
    
    long countByLocation(String location);
    
    @Query("SELECT d.deviceType, COUNT(d) FROM Device d GROUP BY d.deviceType")
    List<Object[]> countByDeviceTypeGrouped();
    
    @Query("SELECT d.status, COUNT(d) FROM Device d GROUP BY d.status")
    List<Object[]> countByStatusGrouped();
    
    @Query("SELECT d.manufacturer, COUNT(d) FROM Device d GROUP BY d.manufacturer")
    List<Object[]> countByManufacturerGrouped();
    
    @Query("SELECT d.location, COUNT(d) FROM Device d GROUP BY d.location")
    List<Object[]> countByLocationGrouped();
    
    @Query("SELECT COUNT(d) FROM Device d WHERE d.nextMaintenance < :currentDate")
    long countDevicesNeedingMaintenance(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT COUNT(d) FROM Device d WHERE d.warrantyExpiry < :currentDate")
    long countDevicesWithExpiredWarranty(@Param("currentDate") LocalDateTime currentDate);
}
