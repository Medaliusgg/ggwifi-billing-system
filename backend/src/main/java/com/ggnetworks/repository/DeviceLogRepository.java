package com.ggnetworks.repository;

import com.ggnetworks.entity.DeviceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeviceLogRepository extends JpaRepository<DeviceLog, Long> {
    
    List<DeviceLog> findByDeviceId(Long deviceId);
    
    List<DeviceLog> findByLogLevel(DeviceLog.LogLevel logLevel);
    
    List<DeviceLog> findByAction(DeviceLog.LogAction action);
    
    List<DeviceLog> findByUserId(String userId);
    
    List<DeviceLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<DeviceLog> findByDeviceIdOrderByCreatedAtDesc(Long deviceId);
    
    List<DeviceLog> findByLogLevelAndCreatedAtBetween(DeviceLog.LogLevel logLevel, 
                                                     LocalDateTime startDate, 
                                                     LocalDateTime endDate);
    
    List<DeviceLog> findByActionAndCreatedAtBetween(DeviceLog.LogAction action, 
                                                    LocalDateTime startDate, 
                                                    LocalDateTime endDate);
    
    long countByLogLevel(DeviceLog.LogLevel logLevel);
    
    long countByAction(DeviceLog.LogAction action);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}

