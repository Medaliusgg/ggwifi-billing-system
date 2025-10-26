package com.ggnetworks.repository;

import com.ggnetworks.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUsernameAndPhoneNumber(String username, String phoneNumber);
    Optional<User> findByUsernameAndStaffId(String username, String staffId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Additional query methods
    List<User> findByRole(User.UserRole role);
    List<User> findByIsActiveTrue();
    List<User> findByDepartment(String department);
    List<User> findByStatus(User.UserStatus status);
    
    // Count methods
    long countByIsActiveTrue();
    long countByRole(User.UserRole role);
    long countByStatus(User.UserStatus status);
    long countByDepartment(String department);
    
    // Complex queries
    @Query("SELECT u FROM User u WHERE u.role IN :roles AND u.isActive = true")
    List<User> findActiveUsersByRoles(@Param("roles") List<User.UserRole> roles);
    
    @Query("SELECT u FROM User u WHERE u.department = :department AND u.isActive = true")
    List<User> findActiveUsersByDepartment(@Param("department") String department);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    long countActiveUsersByRole(@Param("role") User.UserRole role);
}
