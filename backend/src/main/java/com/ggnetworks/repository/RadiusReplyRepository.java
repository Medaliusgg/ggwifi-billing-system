package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusReplyRepository extends JpaRepository<RadiusReply, Long> {
    
    List<RadiusReply> findByUsername(String username);
    
    void deleteByUsername(String username);
    
    List<RadiusReply> findByUsernameAndIsActiveTrue(String username);
    
    Optional<RadiusReply> findByUsernameAndAttribute(String username, String attribute);
    
    List<RadiusReply> findByUserType(String userType);
    
    List<RadiusReply> findByNasIdentifier(String nasIdentifier);
    
    List<RadiusReply> findByIsActiveTrue();
    
    @Query("SELECT rr FROM RadiusReply rr WHERE rr.username = :username AND rr.attribute = :attribute AND rr.isActive = true")
    Optional<RadiusReply> findActiveByUsernameAndAttribute(@Param("username") String username, @Param("attribute") String attribute);
    
    @Query("SELECT COUNT(rr) FROM RadiusReply rr WHERE rr.userType = :userType")
    Long countByUserType(@Param("userType") String userType);
    
    @Query("SELECT rr FROM RadiusReply rr WHERE rr.username = :username AND rr.isActive = true")
    List<RadiusReply> findActiveByUsername(@Param("username") String username);
}
