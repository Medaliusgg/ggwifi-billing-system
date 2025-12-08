package com.ggnetworks.repository;

import com.ggnetworks.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    
    List<Referral> findByReferrerPhoneNumber(String referrerPhoneNumber);
    
    List<Referral> findByReferredPhoneNumber(String referredPhoneNumber);
    
    Optional<Referral> findByReferrerPhoneNumberAndReferredPhoneNumber(
        String referrerPhoneNumber, 
        String referredPhoneNumber
    );
    
    @Query("SELECT COUNT(r) FROM Referral r WHERE r.referrerPhoneNumber = :phoneNumber AND r.status = 'ACTIVE'")
    Long countActiveReferralsByReferrer(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT COUNT(r) FROM Referral r WHERE r.referrerPhoneNumber = :phoneNumber")
    Long countTotalReferralsByReferrer(@Param("phoneNumber") String phoneNumber);
}

