package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.entity.UserPermission;
import com.ggnetworks.entity.RolePermission;
import com.ggnetworks.repository.UserPermissionRepository;
import com.ggnetworks.repository.RolePermissionRepository;
import com.ggnetworks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@Service
@Transactional
public class PermissionService {
    
    @Autowired
    private UserPermissionRepository userPermissionRepository;
    
    @Autowired
    private RolePermissionRepository rolePermissionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Initialize default permissions for all roles
     */
    @PostConstruct
    public void initializeDefaultPermissions() {
        // Create permissions
        createPermissionIfNotExists("USER_CREATE", "Create new users", "USER", "CREATE");
        createPermissionIfNotExists("USER_READ", "View user information", "USER", "READ");
        createPermissionIfNotExists("USER_UPDATE", "Update user information", "USER", "UPDATE");
        createPermissionIfNotExists("USER_DELETE", "Delete users", "USER", "DELETE");
        
        createPermissionIfNotExists("PACKAGE_CREATE", "Create internet packages", "PACKAGE", "CREATE");
        createPermissionIfNotExists("PACKAGE_READ", "View internet packages", "PACKAGE", "READ");
        createPermissionIfNotExists("PACKAGE_UPDATE", "Update internet packages", "PACKAGE", "UPDATE");
        createPermissionIfNotExists("PACKAGE_DELETE", "Delete internet packages", "PACKAGE", "DELETE");
        
        createPermissionIfNotExists("VOUCHER_CREATE", "Generate vouchers", "VOUCHER", "CREATE");
        createPermissionIfNotExists("VOUCHER_READ", "View vouchers", "VOUCHER", "READ");
        createPermissionIfNotExists("VOUCHER_UPDATE", "Update vouchers", "VOUCHER", "UPDATE");
        createPermissionIfNotExists("VOUCHER_DELETE", "Delete vouchers", "VOUCHER", "DELETE");
        
        createPermissionIfNotExists("ROUTER_CREATE", "Add routers", "ROUTER", "CREATE");
        createPermissionIfNotExists("ROUTER_READ", "View routers", "ROUTER", "READ");
        createPermissionIfNotExists("ROUTER_UPDATE", "Update routers", "ROUTER", "UPDATE");
        createPermissionIfNotExists("ROUTER_DELETE", "Delete routers", "ROUTER", "DELETE");
        createPermissionIfNotExists("ROUTER_CONFIGURE", "Configure routers", "ROUTER", "CONFIGURE");
        
        createPermissionIfNotExists("FINANCE_CREATE", "Create financial records", "FINANCE", "CREATE");
        createPermissionIfNotExists("FINANCE_READ", "View financial data", "FINANCE", "READ");
        createPermissionIfNotExists("FINANCE_UPDATE", "Update financial records", "FINANCE", "UPDATE");
        createPermissionIfNotExists("FINANCE_DELETE", "Delete financial records", "FINANCE", "DELETE");
        createPermissionIfNotExists("FINANCE_APPROVE", "Approve financial transactions", "FINANCE", "APPROVE");
        
        createPermissionIfNotExists("MARKETING_CREATE", "Create marketing campaigns", "MARKETING", "CREATE");
        createPermissionIfNotExists("MARKETING_READ", "View marketing data", "MARKETING", "READ");
        createPermissionIfNotExists("MARKETING_UPDATE", "Update marketing campaigns", "MARKETING", "UPDATE");
        createPermissionIfNotExists("MARKETING_DELETE", "Delete marketing campaigns", "MARKETING", "DELETE");
        createPermissionIfNotExists("MARKETING_SEND", "Send marketing messages", "MARKETING", "SEND");
        
        createPermissionIfNotExists("SALES_CREATE", "Create sales records", "SALES", "CREATE");
        createPermissionIfNotExists("SALES_READ", "View sales data", "SALES", "READ");
        createPermissionIfNotExists("SALES_UPDATE", "Update sales records", "SALES", "UPDATE");
        createPermissionIfNotExists("SALES_DELETE", "Delete sales records", "SALES", "DELETE");
        
        createPermissionIfNotExists("CUSTOMER_READ", "View customer data", "CUSTOMER", "READ");
        createPermissionIfNotExists("CUSTOMER_UPDATE", "Update customer information", "CUSTOMER", "UPDATE");
        
        createPermissionIfNotExists("ANALYTICS_READ", "View analytics and reports", "ANALYTICS", "READ");
        createPermissionIfNotExists("ANALYTICS_EXPORT", "Export analytics data", "ANALYTICS", "EXPORT");
        
        createPermissionIfNotExists("SYSTEM_CONFIGURE", "Configure system settings", "SYSTEM", "CONFIGURE");
        createPermissionIfNotExists("SYSTEM_MONITOR", "Monitor system status", "SYSTEM", "MONITOR");
        
        // Assign permissions to roles
        assignRolePermissions();
    }
    
    private void createPermissionIfNotExists(String name, String description, String resource, String action) {
        if (!userPermissionRepository.findByPermissionName(name).isPresent()) {
            UserPermission permission = new UserPermission(name, description, resource, action);
            userPermissionRepository.save(permission);
        }
    }
    
    private void assignRolePermissions() {
        // SUPER_ADMIN - All permissions
        assignPermissionsToRole(User.UserRole.SUPER_ADMIN, getAllPermissionNames());
        
        // ADMIN - Most permissions except system configuration
        Set<String> adminPermissions = new HashSet<>(getAllPermissionNames());
        adminPermissions.remove("SYSTEM_CONFIGURE");
        assignPermissionsToRole(User.UserRole.ADMIN, adminPermissions);
        
        // TECHNICIAN - Router and system monitoring permissions
        Set<String> technicianPermissions = Set.of(
            "ROUTER_CREATE", "ROUTER_READ", "ROUTER_UPDATE", "ROUTER_DELETE", "ROUTER_CONFIGURE",
            "PACKAGE_READ", "VOUCHER_READ", "CUSTOMER_READ", "SYSTEM_MONITOR"
        );
        assignPermissionsToRole(User.UserRole.TECHNICIAN, technicianPermissions);
        
        // FINANCE - Financial and customer permissions
        Set<String> financePermissions = Set.of(
            "FINANCE_CREATE", "FINANCE_READ", "FINANCE_UPDATE", "FINANCE_DELETE", "FINANCE_APPROVE",
            "CUSTOMER_READ", "CUSTOMER_UPDATE", "ANALYTICS_READ", "ANALYTICS_EXPORT",
            "PACKAGE_READ", "VOUCHER_READ", "SALES_READ"
        );
        assignPermissionsToRole(User.UserRole.FINANCE, financePermissions);
        
        // MARKETING - Marketing and customer permissions
        Set<String> marketingPermissions = Set.of(
            "MARKETING_CREATE", "MARKETING_READ", "MARKETING_UPDATE", "MARKETING_DELETE", "MARKETING_SEND",
            "CUSTOMER_READ", "CUSTOMER_UPDATE", "ANALYTICS_READ", "ANALYTICS_EXPORT",
            "PACKAGE_READ", "VOUCHER_READ"
        );
        assignPermissionsToRole(User.UserRole.MARKETING, marketingPermissions);
        
        // SALES - Sales and customer permissions
        Set<String> salesPermissions = Set.of(
            "SALES_CREATE", "SALES_READ", "SALES_UPDATE", "SALES_DELETE",
            "CUSTOMER_READ", "CUSTOMER_UPDATE", "ANALYTICS_READ",
            "PACKAGE_READ", "VOUCHER_READ", "VOUCHER_CREATE"
        );
        assignPermissionsToRole(User.UserRole.SALES, salesPermissions);
    }
    
    private void assignPermissionsToRole(User.UserRole role, Set<String> permissionNames) {
        for (String permissionName : permissionNames) {
            Optional<UserPermission> permissionOpt = userPermissionRepository.findByPermissionName(permissionName);
            if (permissionOpt.isPresent()) {
                UserPermission permission = permissionOpt.get();
                if (!rolePermissionRepository.existsByRoleAndPermission(role, permission)) {
                    RolePermission rolePermission = new RolePermission(role, permission);
                    rolePermissionRepository.save(rolePermission);
                }
            }
        }
    }
    
    private Set<String> getAllPermissionNames() {
        return Set.of(
            "USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE",
            "PACKAGE_CREATE", "PACKAGE_READ", "PACKAGE_UPDATE", "PACKAGE_DELETE",
            "VOUCHER_CREATE", "VOUCHER_READ", "VOUCHER_UPDATE", "VOUCHER_DELETE",
            "ROUTER_CREATE", "ROUTER_READ", "ROUTER_UPDATE", "ROUTER_DELETE", "ROUTER_CONFIGURE",
            "FINANCE_CREATE", "FINANCE_READ", "FINANCE_UPDATE", "FINANCE_DELETE", "FINANCE_APPROVE",
            "MARKETING_CREATE", "MARKETING_READ", "MARKETING_UPDATE", "MARKETING_DELETE", "MARKETING_SEND",
            "SALES_CREATE", "SALES_READ", "SALES_UPDATE", "SALES_DELETE",
            "CUSTOMER_READ", "CUSTOMER_UPDATE",
            "ANALYTICS_READ", "ANALYTICS_EXPORT",
            "SYSTEM_CONFIGURE", "SYSTEM_MONITOR"
        );
    }
    
    /**
     * Check if user has specific permission
     */
    public boolean hasPermission(String username, String resource, String action) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<UserPermission> permissionOpt = rolePermissionRepository
            .findPermissionByRoleResourceAndAction(user.getRole(), resource, action);
        
        return permissionOpt.isPresent();
    }
    
    /**
     * Check if user has specific permission by permission name
     */
    public boolean hasPermission(String username, String permissionName) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<UserPermission> permissionOpt = userPermissionRepository.findByPermissionName(permissionName);
        if (permissionOpt.isEmpty()) {
            return false;
        }
        
        UserPermission permission = permissionOpt.get();
        Optional<UserPermission> rolePermissionOpt = rolePermissionRepository
            .findPermissionByRoleResourceAndAction(user.getRole(), permission.getResource(), permission.getAction());
        
        return rolePermissionOpt.isPresent();
    }
    
    /**
     * Get all permissions for a user
     */
    public List<UserPermission> getUserPermissions(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        
        User user = userOpt.get();
        return rolePermissionRepository.findPermissionsByRole(user.getRole());
    }
    
    /**
     * Get permissions for a role
     */
    public List<UserPermission> getRolePermissions(User.UserRole role) {
        return rolePermissionRepository.findPermissionsByRole(role);
    }
    
    /**
     * Create a new user with proper role assignment
     */
    public User createUserWithRole(String adminUsername, String username, String email, String password, 
                                  String firstName, String lastName, String phoneNumber, String staffId,
                                  User.UserRole role, String department, String position) {
        
        // Only SUPER_ADMIN can create SUPER_ADMIN users
        // ADMIN users can create other ADMIN users and lower-level users
        if (role == User.UserRole.SUPER_ADMIN) {
            // Check if the current user is SUPER_ADMIN
            User currentUser = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new SecurityException("Current user not found"));
            
            if (currentUser.getRole() != User.UserRole.SUPER_ADMIN) {
                throw new SecurityException("Only SUPER_ADMIN can create SUPER_ADMIN users");
            }
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hash the password
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        user.setStaffId(staffId); // Set staffId
        user.setRole(role);
        user.setDepartment(department);
        user.setPosition(position);
        user.setIsActive(true);
        user.setStatus(User.UserStatus.ACTIVE);
        
        return userRepository.save(user);
    }
    
    /**
     * Update user role (only ADMIN and SUPER_ADMIN can do this)
     */
    public boolean updateUserRole(String adminUsername, String targetUsername, User.UserRole newRole) {
        Optional<User> adminOpt = userRepository.findByUsername(adminUsername);
        if (adminOpt.isEmpty()) {
            return false;
        }
        
        User admin = adminOpt.get();
        if (admin.getRole() != User.UserRole.ADMIN && admin.getRole() != User.UserRole.SUPER_ADMIN) {
            throw new SecurityException("Only ADMIN and SUPER_ADMIN can update user roles");
        }
        
        Optional<User> targetOpt = userRepository.findByUsername(targetUsername);
        if (targetOpt.isEmpty()) {
            return false;
        }
        
        User target = targetOpt.get();
        target.setRole(newRole);
        userRepository.save(target);
        
        return true;
    }
}
