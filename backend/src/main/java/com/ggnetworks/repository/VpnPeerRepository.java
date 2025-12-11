package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnPeer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * VPN Peer Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnPeerRepository extends JpaRepository<VpnPeer, Long> {
    
    Optional<VpnPeer> findByRouter_Id(Long routerId);
    
    Optional<VpnPeer> findByPeerPublicKey(String peerPublicKey);
    
    List<VpnPeer> findByVpnServer_Id(Long serverId);
    
    List<VpnPeer> findByStatus(VpnPeer.PeerStatus status);
    
    List<VpnPeer> findByRouter_IdAndStatus(Long routerId, VpnPeer.PeerStatus status);
    
    @Query("SELECT v FROM VpnPeer v WHERE v.vpnServer.id = :serverId AND v.status = 'ACTIVE'")
    List<VpnPeer> findActivePeersByServer(@Param("serverId") Long serverId);
    
    @Query("SELECT v FROM VpnPeer v WHERE v.lastHandshake < :threshold AND v.status = 'ACTIVE'")
    List<VpnPeer> findStalePeers(@Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT v FROM VpnPeer v WHERE v.allowedIp = :ip")
    Optional<VpnPeer> findByAllowedIp(@Param("ip") String ip);
}
