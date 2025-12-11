package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.entity.UserPermission;
import com.ggnetworks.entity.RolePermission;
import com.ggnetworks.repository.UserRepository;
import com.ggnetworks.repository.RolePermissionRepository;
import com.ggnetworks.repository.UserPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Permission Service
 * Handles permission checking for users based on roles and permissions
 */
@Service
public class PermissionService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RolePermissionRepository rolePermissionRepository;
    
    @Autowired
    private UserPermissionRepository userPermissionRepository;
    
    /**
     * Check if a user has a specific permission
     * @param username The username to check
     * @param permissionName The permission name (e.g., "USER_UPDATE", "ANALYTICS_READ")
     * @return true if user has the permission, false otherwise
     */
    public boolean hasPermission(String username, String permissionName) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // Super admin has all permissions
        if (user.getRole() == User.UserRole.SUPER_ADMIN) {
            return true;
        }
        
        // Check if permission exists
        Optional<UserPermission> permissionOpt = userPermissionRepository.findByPermissionName(permissionName);
        if (permissionOpt.isEmpty()) {
            return false;
        }
        
        UserPermission permission = permissionOpt.get();
        
        // Check if user's role has this permission
        List<RolePermission> rolePermissions = rolePermissionRepository.findByRole(user.getRole());
        return rolePermissions.stream()
                .anyMatch(rp -> rp.getPermission().getPermissionName().equals(permissionName));
    }
    
    /**
     * Get all permissions for a user based on their role
     */
    public List<String> getUserPermissions(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        
        User user = userOpt.get();
        
        // Super admin has all permissions
        if (user.getRole() == User.UserRole.SUPER_ADMIN) {
            return userPermissionRepository.findAll().stream()
                    .map(UserPermission::getPermissionName)
                    .collect(Collectors.toList());
        }
        
        // Get permissions for user's role
        return rolePermissionRepository.findPermissionsByRole(user.getRole()).stream()
                .map(UserPermission::getPermissionName)
                .collect(Collectors.toList());
    }
    
    /**
     * Check if user has any of the specified permissions
     */
    public boolean hasAnyPermission(String username, List<String> permissionNames) {
        return permissionNames.stream()
                .anyMatch(permission -> hasPermission(username, permission));
    }
    
    /**
     * Check if user has all of the specified permissions
     */
    public boolean hasAllPermissions(String username, List<String> permissionNames) {
        return permissionNames.stream()
                .allMatch(permission -> hasPermission(username, permission));
    }
}
