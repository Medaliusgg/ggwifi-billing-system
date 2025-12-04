package com.ggnetworks.repository;

import com.ggnetworks.entity.AccessPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccessPointRepository extends JpaRepository<AccessPoint, Long> {
    
    Optional<AccessPoint> findByApId(String apId);
    
    Optional<AccessPoint> findByMacAddress(String macAddress);
    
    List<AccessPoint> findByRouterId(Long routerId);
    
    List<AccessPoint> findByStatus(AccessPoint.APStatus status);
    
    List<AccessPoint> findByLocation(String location);
    
    @Query("SELECT COUNT(a) FROM AccessPoint a WHERE a.status = 'ONLINE'")
    long countOnlineAPs();
    
    @Query("SELECT COUNT(a) FROM AccessPoint a WHERE a.status = 'OFFLINE'")
    long countOfflineAPs();
    
    @Query("SELECT SUM(a.connectedDevicesCount) FROM AccessPoint a WHERE a.status = 'ONLINE'")
    Long sumConnectedDevices();
}





