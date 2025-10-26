package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Find user by username
     */
    public User findByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElse(null);
    }
    
    /**
     * Find user by email
     */
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }
    
    /**
     * Find user by phone number
     */
    public User findByPhoneNumber(String phoneNumber) {
        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        return userOpt.orElse(null);
    }
    
    /**
     * Create new user
     */
    public User createUser(User user) {
        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default values
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        if (user.getStatus() == null) {
            user.setStatus(User.UserStatus.ACTIVE);
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Update user
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * Delete user
     */
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    /**
     * Get all users
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Get users by role
     */
    public List<User> findUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    
    /**
     * Get active users
     */
    public List<User> findActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }
    
    /**
     * Get users by department
     */
    public List<User> findUsersByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }
    
    /**
     * Count total users
     */
    public long countUsers() {
        return userRepository.count();
    }
    
    /**
     * Count active users
     */
    public long countActiveUsers() {
        return userRepository.countByIsActiveTrue();
    }
    
    /**
     * Count users by role
     */
    public long countUsersByRole(User.UserRole role) {
        return userRepository.countByRole(role);
    }
    
    /**
     * Check if username exists
     */
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
    
    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    /**
     * Check if phone number exists
     */
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).isPresent();
    }
    
    /**
     * Activate user
     */
    public User activateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(true);
            user.setStatus(User.UserStatus.ACTIVE);
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Deactivate user
     */
    public User deactivateUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(false);
            user.setStatus(User.UserStatus.INACTIVE);
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Suspend user
     */
    public User suspendUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(false);
            user.setStatus(User.UserStatus.SUSPENDED);
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Change user password
     */
    public User changePassword(Long userId, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Verify user email
     */
    public User verifyEmail(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsEmailVerified(true);
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Verify user phone
     */
    public User verifyPhone(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsPhoneVerified(true);
            return userRepository.save(user);
        }
        return null;
    }
}
