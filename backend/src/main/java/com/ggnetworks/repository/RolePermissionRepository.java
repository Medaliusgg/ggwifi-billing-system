package com.ggnetworks.repository;

import com.ggnetworks.entity.UserPermission;
import com.ggnetworks.entity.RolePermission;
import com.ggnetworks.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    
    List<RolePermission> findByRole(User.UserRole role);
    
    @Query("SELECT rp.permission FROM RolePermission rp WHERE rp.role = :role")
    List<UserPermission> findPermissionsByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT rp.permission FROM RolePermission rp WHERE rp.role = :role AND rp.permission.resource = :resource")
    List<UserPermission> findPermissionsByRoleAndResource(@Param("role") User.UserRole role, @Param("resource") String resource);
    
    @Query("SELECT rp.permission FROM RolePermission rp WHERE rp.role = :role AND rp.permission.resource = :resource AND rp.permission.action = :action")
    Optional<UserPermission> findPermissionByRoleResourceAndAction(@Param("role") User.UserRole role, @Param("resource") String resource, @Param("action") String action);
    
    boolean existsByRoleAndPermission(User.UserRole role, UserPermission permission);
}
