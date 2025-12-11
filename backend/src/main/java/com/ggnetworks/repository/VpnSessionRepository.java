package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * VPN Session Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnSessionRepository extends JpaRepository<VpnSession, Long> {
    
    List<VpnSession> findByProfile_Id(Long profileId);
    
    List<VpnSession> findByPeer_Id(Long peerId);
    
    @Query("SELECT v FROM VpnSession v WHERE v.stoppedAt IS NULL")
    List<VpnSession> findActiveSessions();
    
    @Query("SELECT v FROM VpnSession v WHERE v.startedAt BETWEEN :startDate AND :endDate")
    List<VpnSession> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);
}
