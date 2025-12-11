package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnServer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * VPN Server Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnServerRepository extends JpaRepository<VpnServer, Long> {
    
    Optional<VpnServer> findByName(String name);
    
    List<VpnServer> findByStatus(VpnServer.ServerStatus status);
    
    @Query("SELECT v FROM VpnServer v WHERE v.status = 'ACTIVE' ORDER BY v.loadFactor ASC, v.peerCount ASC")
    List<VpnServer> findBestAvailableServer();
    
    @Query("SELECT COUNT(v) FROM VpnPeer v WHERE v.vpnServer.id = :serverId AND v.status = 'ACTIVE'")
    Long countActivePeersByServer(Long serverId);
}
