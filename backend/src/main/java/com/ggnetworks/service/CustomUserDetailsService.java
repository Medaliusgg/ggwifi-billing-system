package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
        log.info("Attempting to load user with phone number: {}", phoneNumber);
        
        Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        
        if (userOpt.isEmpty()) {
            log.warn("User not found with phone number: {}", phoneNumber);
            throw new UsernameNotFoundException("User not found with phone number: " + phoneNumber);
        }
        
        User user = userOpt.get();
        log.info("User found with phone number: {}", phoneNumber);
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getPhoneNumber())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .accountExpired(false)
                .accountLocked(user.getStatus() == User.UserStatus.INACTIVE)
                .credentialsExpired(false)
                .disabled(user.getStatus() == User.UserStatus.INACTIVE)
                .build();
    }
} 