package com.ggnetworks.repository;

import com.ggnetworks.entity.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {
    
    Optional<UserPermission> findByPermissionName(String permissionName);
    
    List<UserPermission> findByResource(String resource);
    
    List<UserPermission> findByAction(String action);
    
    @Query("SELECT p FROM UserPermission p WHERE p.resource = :resource AND p.action = :action")
    Optional<UserPermission> findByResourceAndAction(@Param("resource") String resource, @Param("action") String action);
}
