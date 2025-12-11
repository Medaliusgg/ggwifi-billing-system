package com.ggnetworks.repository;

import com.ggnetworks.entity.VpnProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * VPN Profile Repository
 * Module J: VPN Module
 */
@Repository
public interface VpnProfileRepository extends JpaRepository<VpnProfile, Long> {
    
    List<VpnProfile> findByCustomer_Id(Long customerId);
    
    Optional<VpnProfile> findByCustomer_IdAndStatus(Long customerId, VpnProfile.ProfileStatus status);
    
    List<VpnProfile> findByStatus(VpnProfile.ProfileStatus status);
}
