package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusReplyRepository extends JpaRepository<RadiusReply, Long> {
    
    // Find by username
    List<RadiusReply> findByUsername(String username);
    
    // Find by username and attribute
    Optional<RadiusReply> findByUsernameAndAttribute(String username, String attribute);
    
    // Find active replies
    List<RadiusReply> findByIsActiveTrue();
    
    // Find by user type
    List<RadiusReply> findByUserType(RadiusReply.UserType userType);
    
    // Find active replies by type
    List<RadiusReply> findByUserTypeAndIsActiveTrue(RadiusReply.UserType userType);
    
    // Find by attribute
    List<RadiusReply> findByAttribute(String attribute);
    
    // Find by operation
    List<RadiusReply> findByOp(String op);
    
    // Find by value
    List<RadiusReply> findByValue(String value);
    
    // Find by NAS identifier
    List<RadiusReply> findByNasIdentifier(String nasIdentifier);
    
    // Find by location
    List<RadiusReply> findByLocationId(Long locationId);
    
    // Find by router
    List<RadiusReply> findByRouterId(Long routerId);
    
    // Find by package
    List<RadiusReply> findByPackageId(Long packageId);
    
    // Find by priority
    @Query("SELECT r FROM RadiusReply r WHERE r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByPriority(@Param("priority") Integer priority);
    
    // Find by priority range
    @Query("SELECT r FROM RadiusReply r WHERE r.priority BETWEEN :minPriority AND :maxPriority AND r.isActive = true")
    List<RadiusReply> findByPriorityRange(@Param("minPriority") Integer minPriority, @Param("maxPriority") Integer maxPriority);
    
    // Find replies by multiple criteria
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByUsernameAndAttributeAndActive(@Param("username") String username, @Param("attribute") String attribute);
    
    // Find replies by multiple criteria with user type
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.userType = :userType AND r.isActive = true")
    List<RadiusReply> findByUsernameAndUserType(@Param("username") String username, @Param("userType") RadiusReply.UserType userType);
    
    // Find replies by multiple criteria with location
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.locationId = :locationId AND r.isActive = true")
    List<RadiusReply> findByUsernameAndLocation(@Param("username") String username, @Param("locationId") Long locationId);
    
    // Find replies by multiple criteria with router
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.routerId = :routerId AND r.isActive = true")
    List<RadiusReply> findByUsernameAndRouter(@Param("username") String username, @Param("routerId") Long routerId);
    
    // Find replies by multiple criteria with package
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.packageId = :packageId AND r.isActive = true")
    List<RadiusReply> findByUsernameAndPackage(@Param("username") String username, @Param("packageId") Long packageId);
    
    // Find replies by multiple criteria with NAS identifier
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.nasIdentifier = :nasIdentifier AND r.isActive = true")
    List<RadiusReply> findByUsernameAndNasIdentifier(@Param("username") String username, @Param("nasIdentifier") String nasIdentifier);
    
    // Find replies by attribute and value
    @Query("SELECT r FROM RadiusReply r WHERE r.attribute = :attribute AND r.value = :value AND r.isActive = true")
    List<RadiusReply> findByAttributeAndValue(@Param("attribute") String attribute, @Param("value") String value);
    
    // Find replies by attribute and operation
    @Query("SELECT r FROM RadiusReply r WHERE r.attribute = :attribute AND r.op = :op AND r.isActive = true")
    List<RadiusReply> findByAttributeAndOp(@Param("attribute") String attribute, @Param("op") String op);
    
    // Find replies by operation and value
    @Query("SELECT r FROM RadiusReply r WHERE r.op = :op AND r.value = :value AND r.isActive = true")
    List<RadiusReply> findByOpAndValue(@Param("op") String op, @Param("value") String value);
    
    // Find replies by user type and attribute
    @Query("SELECT r FROM RadiusReply r WHERE r.userType = :userType AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByUserTypeAndAttribute(@Param("userType") RadiusReply.UserType userType, @Param("attribute") String attribute);
    
    // Find replies by user type and operation
    @Query("SELECT r FROM RadiusReply r WHERE r.userType = :userType AND r.op = :op AND r.isActive = true")
    List<RadiusReply> findByUserTypeAndOp(@Param("userType") RadiusReply.UserType userType, @Param("op") String op);
    
    // Find replies by user type and value
    @Query("SELECT r FROM RadiusReply r WHERE r.userType = :userType AND r.value = :value AND r.isActive = true")
    List<RadiusReply> findByUserTypeAndValue(@Param("userType") RadiusReply.UserType userType, @Param("value") String value);
    
    // Find replies by location and attribute
    @Query("SELECT r FROM RadiusReply r WHERE r.locationId = :locationId AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByLocationAndAttribute(@Param("locationId") Long locationId, @Param("attribute") String attribute);
    
    // Find replies by router and attribute
    @Query("SELECT r FROM RadiusReply r WHERE r.routerId = :routerId AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByRouterAndAttribute(@Param("routerId") Long routerId, @Param("attribute") String attribute);
    
    // Find replies by package and attribute
    @Query("SELECT r FROM RadiusReply r WHERE r.packageId = :packageId AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByPackageAndAttribute(@Param("packageId") Long packageId, @Param("attribute") String attribute);
    
    // Find replies by NAS identifier and attribute
    @Query("SELECT r FROM RadiusReply r WHERE r.nasIdentifier = :nasIdentifier AND r.attribute = :attribute AND r.isActive = true")
    List<RadiusReply> findByNasIdentifierAndAttribute(@Param("nasIdentifier") String nasIdentifier, @Param("attribute") String attribute);
    
    // Count active replies by user type
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.userType = :userType AND r.isActive = true")
    Long countActiveRepliesByUserType(@Param("userType") RadiusReply.UserType userType);
    
    // Count active replies by attribute
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.attribute = :attribute AND r.isActive = true")
    Long countActiveRepliesByAttribute(@Param("attribute") String attribute);
    
    // Count active replies by operation
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.op = :op AND r.isActive = true")
    Long countActiveRepliesByOp(@Param("op") String op);
    
    // Count active replies by location
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.locationId = :locationId AND r.isActive = true")
    Long countActiveRepliesByLocation(@Param("locationId") Long locationId);
    
    // Count active replies by router
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.routerId = :routerId AND r.isActive = true")
    Long countActiveRepliesByRouter(@Param("routerId") Long routerId);
    
    // Count active replies by package
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.packageId = :packageId AND r.isActive = true")
    Long countActiveRepliesByPackage(@Param("packageId") Long packageId);
    
    // Count active replies by NAS identifier
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.nasIdentifier = :nasIdentifier AND r.isActive = true")
    Long countActiveRepliesByNasIdentifier(@Param("nasIdentifier") String nasIdentifier);
    
    // Count active replies by priority
    @Query("SELECT COUNT(r) FROM RadiusReply r WHERE r.priority = :priority AND r.isActive = true")
    Long countActiveRepliesByPriority(@Param("priority") Integer priority);
    
    // Find replies with highest priority
    @Query("SELECT r FROM RadiusReply r WHERE r.priority = (SELECT MAX(r2.priority) FROM RadiusReply r2 WHERE r2.isActive = true) AND r.isActive = true")
    List<RadiusReply> findRepliesWithHighestPriority();
    
    // Find replies with lowest priority
    @Query("SELECT r FROM RadiusReply r WHERE r.priority = (SELECT MIN(r2.priority) FROM RadiusReply r2 WHERE r2.isActive = true) AND r.isActive = true")
    List<RadiusReply> findRepliesWithLowestPriority();
    
    // Find replies by priority order
    List<RadiusReply> findByPriorityOrderByPriorityAsc(Integer priority);
    
    // Find replies by priority order descending
    List<RadiusReply> findByPriorityOrderByPriorityDesc(Integer priority);
    
    // Find replies by username and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.username = :username AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByUsernameAndPriority(@Param("username") String username, @Param("priority") Integer priority);
    
    // Find replies by user type and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.userType = :userType AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByUserTypeAndPriority(@Param("userType") RadiusReply.UserType userType, @Param("priority") Integer priority);
    
    // Find replies by attribute and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.attribute = :attribute AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByAttributeAndPriority(@Param("attribute") String attribute, @Param("priority") Integer priority);
    
    // Find replies by operation and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.op = :op AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByOpAndPriority(@Param("op") String op, @Param("priority") Integer priority);
    
    // Find replies by value and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.value = :value AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByValueAndPriority(@Param("value") String value, @Param("priority") Integer priority);
    
    // Find replies by location and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.locationId = :locationId AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByLocationAndPriority(@Param("locationId") Long locationId, @Param("priority") Integer priority);
    
    // Find replies by router and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.routerId = :routerId AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByRouterAndPriority(@Param("routerId") Long routerId, @Param("priority") Integer priority);
    
    // Find replies by package and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.packageId = :packageId AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByPackageAndPriority(@Param("packageId") Long packageId, @Param("priority") Integer priority);
    
    // Find replies by NAS identifier and priority
    @Query("SELECT r FROM RadiusReply r WHERE r.nasIdentifier = :nasIdentifier AND r.priority = :priority AND r.isActive = true")
    List<RadiusReply> findByNasIdentifierAndPriority(@Param("nasIdentifier") String nasIdentifier, @Param("priority") Integer priority);
    
    // Find replies created in date range
    @Query("SELECT r FROM RadiusReply r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    List<RadiusReply> findRepliesCreatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find replies updated in date range
    @Query("SELECT r FROM RadiusReply r WHERE r.updatedAt BETWEEN :startDate AND :endDate")
    List<RadiusReply> findRepliesUpdatedInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Delete by username
    void deleteByUsername(String username);
    
    // Delete by username and attribute
    void deleteByUsernameAndAttribute(String username, String attribute);
    
    // Soft delete by username
    @Query("UPDATE RadiusReply r SET r.isActive = false, r.updatedAt = :now WHERE r.username = :username")
    void softDeleteByUsername(@Param("username") String username, @Param("now") LocalDateTime now);
    
    // Soft delete by username and attribute
    @Query("UPDATE RadiusReply r SET r.isActive = false, r.updatedAt = :now WHERE r.username = :username AND r.attribute = :attribute")
    void softDeleteByUsernameAndAttribute(@Param("username") String username, @Param("attribute") String attribute, @Param("now") LocalDateTime now);
    
    // Update priority
    @Query("UPDATE RadiusReply r SET r.priority = :priority, r.updatedAt = :now WHERE r.id = :id")
    void updatePriority(@Param("id") Long id, @Param("priority") Integer priority, @Param("now") LocalDateTime now);
    
    // Update value
    @Query("UPDATE RadiusReply r SET r.value = :value, r.updatedAt = :now WHERE r.id = :id")
    void updateValue(@Param("id") Long id, @Param("value") String value, @Param("now") LocalDateTime now);
    
    // Update operation
    @Query("UPDATE RadiusReply r SET r.op = :op, r.updatedAt = :now WHERE r.id = :id")
    void updateOp(@Param("id") Long id, @Param("op") String op, @Param("now") LocalDateTime now);
    
    // Update active status
    @Query("UPDATE RadiusReply r SET r.isActive = :isActive, r.updatedAt = :now WHERE r.id = :id")
    void updateActiveStatus(@Param("id") Long id, @Param("isActive") Boolean isActive, @Param("now") LocalDateTime now);
    
    // Update notes
    @Query("UPDATE RadiusReply r SET r.notes = :notes, r.updatedAt = :now WHERE r.id = :id")
    void updateNotes(@Param("id") Long id, @Param("notes") String notes, @Param("now") LocalDateTime now);
} 