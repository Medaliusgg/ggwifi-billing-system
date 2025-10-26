package com.ggnetworks.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
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
        
        // Add user authorities to the token
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(java.util.stream.Collectors.toList()));
        
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
}