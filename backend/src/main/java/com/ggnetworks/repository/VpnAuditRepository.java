package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnAudit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * VPN Audit Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnAuditRepository extends JpaRepository<VpnAudit, Long> {
    
    List<VpnAudit> findByActorId(Long actorId);
    
    List<VpnAudit> findByAction(String action);
    
    List<VpnAudit> findByTargetTableAndTargetId(String targetTable, Long targetId);
    
    Page<VpnAudit> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT v FROM VpnAudit v WHERE v.targetTable = :targetTable AND v.targetId = :targetId ORDER BY v.createdAt DESC")
    List<VpnAudit> findByTarget(@Param("targetTable") String targetTable, @Param("targetId") Long targetId);
}
