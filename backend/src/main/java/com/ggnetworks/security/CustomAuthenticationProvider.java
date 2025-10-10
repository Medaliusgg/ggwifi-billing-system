package com.ggnetworks.security;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final Logger debugLogger = LoggerFactory.getLogger("AuthDebugLogger");

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        debugLogger.info("[DEBUG] CustomAuthenticationProvider.authenticate() called with name: {} credentials: {}", authentication.getName(), authentication.getCredentials());
        String phoneNumber = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        if (phoneNumber == null || password == null) {
            throw new BadCredentialsException("Phone number and password are required");
        }
        
        debugLogger.info("[DEBUG] Authenticating with phoneNumber: {}", phoneNumber);
        Optional<User> userOpt = userRepository.findByPhoneNumberAndDeletedAtIsNull(phoneNumber);
        
        if (userOpt.isEmpty()) {
            throw new BadCredentialsException("User not found");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        
        return new UsernamePasswordAuthenticationToken(user, password, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
} 