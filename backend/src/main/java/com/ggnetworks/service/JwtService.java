package com.ggnetworks.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    
    @Value("${jwt.secret:ggnetworks-super-secret-key-for-jwt-token-generation-and-validation}")
    private String secretKey;
    
    @Value("${jwt.expiration:28800000}") // 8 hours in milliseconds
    private long jwtExpiration;
    
    @Value("${jwt.refresh-expiration:604800000}") // 7 days in milliseconds
    private long refreshExpiration;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername(), jwtExpiration);
    }
    
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, jwtExpiration);
    }
    
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, username, refreshExpiration);
    }

    public String generateTokenWithContext(String username, String ipAddress, String userAgent) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("ip", ipAddress);
        claims.put("ua", userAgent);
        
        List<String> authorities = new ArrayList<>();
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            authorities = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(java.util.stream.Collectors.toList());
        } catch (UsernameNotFoundException ex) {
            logger.warn("User {} not found in UserDetailsService. Issuing customer token with ROLE_CUSTOMER.", username);
            authorities = List.of("ROLE_CUSTOMER");
        }
        claims.put("authorities", authorities);
        
        return createToken(claims, username, jwtExpiration);
    }
    
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
    
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateTokenAgainstContext(String token, String requestIp, String requestUserAgent) {
        try {
            Claims claims = extractAllClaims(token);
            String ip = claims.get("ip", String.class);
            String ua = claims.get("ua", String.class);
            // If claims missing, accept but prefer match when present
            boolean ipOk = (ip == null) || ip.equals(requestIp);
            boolean uaOk = (ua == null) || (requestUserAgent != null && requestUserAgent.equals(ua));
            return ipOk && uaOk && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getTokenType(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return (String) claims.get("type");
        } catch (Exception e) {
            return "access";
        }
    }
    
    public boolean isRefreshToken(String token) {
        return "refresh".equals(getTokenType(token));
    }

    /**
     * Generate token with context (for customer authentication)
     */
    public String generateTokenWithContext(String username, String role, Long accountId, String fullName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("accountId", accountId);
        claims.put("fullName", fullName);
        claims.put("authorities", List.of("ROLE_CUSTOMER"));
        return createToken(claims, username, jwtExpiration);
    }

    /**
     * Generate temporary signup token (valid for 10 minutes)
     */
    public String generateSignupToken(String phoneNumber) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "signup");
        claims.put("purpose", "account_creation");
        long signupExpiration = 10 * 60 * 1000; // 10 minutes
        return createToken(claims, phoneNumber, signupExpiration);
    }

    /**
     * Validate signup token
     */
    public Boolean validateSignupToken(String token, String phoneNumber) {
        try {
            Claims claims = extractAllClaims(token);
            String type = claims.get("type", String.class);
            String subject = extractUsername(token);
            return "signup".equals(type) && subject.equals(phoneNumber) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Generate temporary reset token (valid for 10 minutes)
     */
    public String generateResetToken(String phoneNumber) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "reset");
        claims.put("purpose", "pin_reset");
        long resetExpiration = 10 * 60 * 1000; // 10 minutes
        return createToken(claims, phoneNumber, resetExpiration);
    }

    /**
     * Validate reset token
     */
    public Boolean validateResetToken(String token, String phoneNumber) {
        try {
            Claims claims = extractAllClaims(token);
            String type = claims.get("type", String.class);
            String subject = extractUsername(token);
            return "reset".equals(type) && subject.equals(phoneNumber) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}