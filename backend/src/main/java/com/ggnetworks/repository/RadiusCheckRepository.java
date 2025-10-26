package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusCheckRepository extends JpaRepository<RadiusCheck, Long> {
    
    List<RadiusCheck> findByUsername(String username);
    
    void deleteByUsername(String username);
    
    List<RadiusCheck> findByUsernameAndIsActiveTrue(String username);
    
    Optional<RadiusCheck> findByUsernameAndAttribute(String username, String attribute);
    
    List<RadiusCheck> findByUserType(String userType);
    
    List<RadiusCheck> findByNasIdentifier(String nasIdentifier);
    
    List<RadiusCheck> findByIsActiveTrue();
    
    List<RadiusCheck> findByExpiresAtBefore(LocalDateTime dateTime);
    
    List<RadiusCheck> findByExpiresAtAfter(LocalDateTime dateTime);
    
    @Query("SELECT rc FROM RadiusCheck rc WHERE rc.username = :username AND rc.attribute = :attribute AND (rc.expiresAt IS NULL OR rc.expiresAt > :now)")
    Optional<RadiusCheck> findActiveByUsernameAndAttribute(@Param("username") String username, @Param("attribute") String attribute, @Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(rc) FROM RadiusCheck rc WHERE rc.userType = :userType")
    Long countByUserType(@Param("userType") String userType);
    
    @Query("SELECT rc FROM RadiusCheck rc WHERE rc.username = :username AND rc.isActive = true AND (rc.expiresAt IS NULL OR rc.expiresAt > :now)")
    List<RadiusCheck> findActiveByUsername(@Param("username") String username, @Param("now") LocalDateTime now);
}
