package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnPeerConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * VPN Peer Config Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnPeerConfigRepository extends JpaRepository<VpnPeerConfig, Long> {
    
    List<VpnPeerConfig> findByPeer_Id(Long peerId);
    
    Optional<VpnPeerConfig> findByPeer_IdAndIsActiveTrue(Long peerId);
    
    @Query("SELECT v FROM VpnPeerConfig v WHERE v.peer.id = :peerId ORDER BY v.configVersion DESC")
    List<VpnPeerConfig> findByPeerOrderByVersionDesc(@Param("peerId") Long peerId);
    
    @Query("SELECT MAX(v.configVersion) FROM VpnPeerConfig v WHERE v.peer.id = :peerId")
    Integer findMaxVersionByPeer(@Param("peerId") Long peerId);
}
