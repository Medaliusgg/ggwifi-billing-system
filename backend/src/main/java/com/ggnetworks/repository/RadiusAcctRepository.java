package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusAcct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusAcctRepository extends JpaRepository<RadiusAcct, Long> {
    
    List<RadiusAcct> findByUsername(String username);
    
    Optional<RadiusAcct> findByAcctUniqueId(String acctUniqueId);
    
    List<RadiusAcct> findByAcctSessionId(String acctSessionId);
    
    List<RadiusAcct> findByNasIpAddress(String nasIpAddress);
    
    List<RadiusAcct> findByFramedIpAddress(String framedIpAddress);
    
    List<RadiusAcct> findByUserType(String userType);
    
    List<RadiusAcct> findByAcctStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    List<RadiusAcct> findByAcctStopTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT ra FROM RadiusAcct ra WHERE ra.username = :username AND ra.acctStopTime IS NULL")
    List<RadiusAcct> findActiveSessionsByUsername(@Param("username") String username);
    
    @Query("SELECT ra FROM RadiusAcct ra WHERE ra.acctStopTime IS NULL")
    List<RadiusAcct> findAllActiveSessions();
    
    @Query("SELECT COUNT(ra) FROM RadiusAcct ra WHERE ra.userType = :userType AND ra.acctStartTime >= :startTime")
    Long countSessionsByUserTypeSince(@Param("userType") String userType, @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT SUM(ra.acctInputOctets) FROM RadiusAcct ra WHERE ra.username = :username AND ra.acctStartTime >= :startTime")
    Long sumInputOctetsByUsernameSince(@Param("username") String username, @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT SUM(ra.acctOutputOctets) FROM RadiusAcct ra WHERE ra.username = :username AND ra.acctStartTime >= :startTime")
    Long sumOutputOctetsByUsernameSince(@Param("username") String username, @Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT SUM(ra.acctSessionTime) FROM RadiusAcct ra WHERE ra.username = :username AND ra.acctStartTime >= :startTime")
    Long sumSessionTimeByUsernameSince(@Param("username") String username, @Param("startTime") LocalDateTime startTime);
}
