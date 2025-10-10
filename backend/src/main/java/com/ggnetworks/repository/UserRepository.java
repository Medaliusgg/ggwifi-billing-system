package com.ggnetworks.repository;

import com.ggnetworks.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhoneNumberAndDeletedAtIsNull(String phoneNumber);

    Optional<User> findByPhoneNumber(String phoneNumber);
    
    Optional<User> findByUsernameAndDeletedAtIsNull(String username);

    boolean existsByPhoneNumberAndDeletedAtIsNull(String phoneNumber);

    // Add missing methods
    Optional<User> findByIdAndDeletedAtIsNull(Long id);
    
    long countByDeletedAtIsNull();
    
    long countByStatusAndDeletedAtIsNull(User.UserStatus status);
    
    long countByRoleAndDeletedAtIsNull(User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    Page<User> findAllActive(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    List<User> findByRole(@Param("role") User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = :status AND u.deletedAt IS NULL")
    List<User> findByRoleAndStatus(@Param("role") User.UserRole role, @Param("status") User.UserStatus status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    long countByRole(@Param("role") User.UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.deletedAt IS NULL")
    long countByCreatedAtAfter(@Param("startDate") java.time.LocalDateTime startDate);

    @Query("SELECT u FROM User u WHERE u.phoneNumber LIKE %:phoneNumber% AND u.deletedAt IS NULL")
    Page<User> findByPhoneNumberContaining(@Param("phoneNumber") String phoneNumber, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:fullName% AND u.deletedAt IS NULL")
    Page<User> findByFullNameContaining(@Param("fullName") String fullName, Pageable pageable);

    // Add missing methods for UserService
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = :status AND u.deletedAt IS NULL")
    Page<User> findByRoleAndStatusAndDeletedAtIsNull(@Param("role") User.UserRole role, @Param("status") User.UserStatus status, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.deletedAt IS NULL")
    Page<User> findByRoleAndDeletedAtIsNull(@Param("role") User.UserRole role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.deletedAt IS NULL")
    Page<User> findByStatusAndDeletedAtIsNull(@Param("status") User.UserStatus status, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    Page<User> findAllByDeletedAtIsNull(Pageable pageable);

    Optional<User> findByUsernameAndPhoneNumberAndDeletedAtIsNull(String username, String phoneNumber);
} 