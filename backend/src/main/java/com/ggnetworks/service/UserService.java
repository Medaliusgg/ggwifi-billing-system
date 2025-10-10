package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long userId) {
        Optional<User> userOpt = userRepository.findByIdAndDeletedAtIsNull(userId);
        return userOpt.orElse(null);
    }

    public User getUserByPhoneNumber(String phoneNumber) {
        Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        return userOpt.orElse(null);
    }

    public Page<User> getAllUsers(Pageable pageable, String role, String status) {
        if (role != null && status != null) {
            return userRepository.findByRoleAndStatusAndDeletedAtIsNull(
                    User.UserRole.valueOf(role.toUpperCase()), 
                    User.UserStatus.valueOf(status.toUpperCase()), 
                    pageable);
        } else if (role != null) {
            return userRepository.findByRoleAndDeletedAtIsNull(User.UserRole.valueOf(role.toUpperCase()), pageable);
        } else if (status != null) {
            return userRepository.findByStatusAndDeletedAtIsNull(User.UserStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            return userRepository.findAllByDeletedAtIsNull(pageable);
        }
    }

    public User getOrCreateUser(String phoneNumber, String fullName, User.UserRole role) {
        Optional<User> existingUser = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Create new user
        User newUser = new User();
        newUser.setPhoneNumber(phoneNumber);
        newUser.setFullName(fullName);
        newUser.setRole(role);
        newUser.setStatus(User.UserStatus.ACTIVE);
        newUser.setPassword(passwordEncoder.encode("default123")); // Default password

        return userRepository.save(newUser);
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        try {
            Optional<User> userOpt = userRepository.findByIdAndDeletedAtIsNull(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User not found");
            }

            User user = userOpt.get();
            User.UserStatus userStatus;
            try {
                userStatus = User.UserStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }

            user.setStatus(userStatus);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Failed to update user status", e);
            throw new RuntimeException("Failed to update user status", e);
        }
    }

    @Transactional
    public User updateUserProfile(String phoneNumber, String fullName) {
        try {
            Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User not found");
            }

            User user = userOpt.get();
            user.setFullName(fullName);
            user.setUpdatedAt(LocalDateTime.now());

            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Failed to update user profile", e);
            throw new RuntimeException("Failed to update user profile", e);
        }
    }

    @Transactional
    public User createUser(User userRequest) {
        try {
            // Check if user already exists
            if (userRepository.existsByPhoneNumberAndDeletedAtIsNull(userRequest.getPhoneNumber())) {
                throw new IllegalArgumentException("User with this phone number already exists");
            }

            User newUser = new User();
            newUser.setPhoneNumber(userRequest.getPhoneNumber());
            newUser.setFullName(userRequest.getFullName());
            newUser.setRole(userRequest.getRole());
            newUser.setStatus(User.UserStatus.ACTIVE);
            newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));

            return userRepository.save(newUser);
        } catch (Exception e) {
            log.error("Failed to create user", e);
            throw new RuntimeException("Failed to create user", e);
        }
    }

    @Transactional
    public User updateUser(Long userId, User userRequest) {
        try {
            Optional<User> userOpt = userRepository.findByIdAndDeletedAtIsNull(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User not found");
            }

            User existingUser = userOpt.get();
            existingUser.setFullName(userRequest.getFullName());
            existingUser.setRole(userRequest.getRole());
            existingUser.setStatus(userRequest.getStatus());
            existingUser.setUpdatedAt(LocalDateTime.now());

            // Update password if provided
            if (userRequest.getPassword() != null && !userRequest.getPassword().trim().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
            }

            return userRepository.save(existingUser);
        } catch (Exception e) {
            log.error("Failed to update user", e);
            throw new RuntimeException("Failed to update user", e);
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        try {
            Optional<User> userOpt = userRepository.findByIdAndDeletedAtIsNull(userId);
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User not found");
            }

            User user = userOpt.get();
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        } catch (Exception e) {
            log.error("Failed to delete user", e);
            throw new RuntimeException("Failed to delete user", e);
        }
    }

    public Map<String, Object> getUserStatistics() {
        try {
            long totalUsers = userRepository.countByDeletedAtIsNull();
            long activeUsers = userRepository.countByStatusAndDeletedAtIsNull(User.UserStatus.ACTIVE);
            long inactiveUsers = userRepository.countByStatusAndDeletedAtIsNull(User.UserStatus.INACTIVE);
            
            long adminUsers = userRepository.countByRoleAndDeletedAtIsNull(User.UserRole.ADMIN);
            long hotspotUsers = userRepository.countByRoleAndDeletedAtIsNull(User.UserRole.HOTSPOT_USER);
            long pppoeUsers = userRepository.countByRoleAndDeletedAtIsNull(User.UserRole.PPPOE_USER);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("inactiveUsers", inactiveUsers);
            stats.put("adminUsers", adminUsers);
            stats.put("hotspotUsers", hotspotUsers);
            stats.put("pppoeUsers", pppoeUsers);
            stats.put("activeRate", totalUsers > 0 ? (double) activeUsers / totalUsers * 100 : 0);

            return stats;
        } catch (Exception e) {
            log.error("Failed to get user statistics", e);
            return new HashMap<>();
        }
    }

    public boolean validateUserCredentials(String phoneNumber, String password) {
        try {
            Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
            if (userOpt.isEmpty()) {
                return false;
            }

            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword());
        } catch (Exception e) {
            log.error("Failed to validate user credentials", e);
            return false;
        }
    }

    public UserDetails loadUserByUsername(String phoneNumber) {
        try {
            Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
            if (userOpt.isEmpty()) {
                return null;
            }

            User user = userOpt.get();
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getPhoneNumber())
                    .password(user.getPassword())
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                    .accountExpired(false)
                    .accountLocked(user.getStatus() == User.UserStatus.INACTIVE)
                    .credentialsExpired(false)
                    .disabled(user.getStatus() == User.UserStatus.INACTIVE)
                    .build();
        } catch (Exception e) {
            log.error("Failed to load user by username", e);
            return null;
        }
    }
} 