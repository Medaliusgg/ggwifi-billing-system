package com.ggnetworks.config;

import com.ggnetworks.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        System.out.println("🔍 JWT Filter - ENTRY - Request: " + request.getRequestURI());
        System.out.println("🔍 JWT Filter - ENTRY - Method: " + request.getMethod());
        
        // Skip JWT processing for public endpoints
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/api/v1/customer-portal/") || 
            requestURI.startsWith("/api/v1/auth/") ||
            requestURI.startsWith("/customer-portal/") || 
            requestURI.startsWith("/auth/") ||
            requestURI.equals("/") ||
            requestURI.equals("/api/v1") ||
            requestURI.startsWith("/static/") ||
            requestURI.startsWith("/css/") ||
            requestURI.startsWith("/js/") ||
            requestURI.startsWith("/images/")) {
            System.out.println("🔍 JWT Filter - Skipping public endpoint: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        System.out.println("🔍 JWT Filter - Request: " + request.getRequestURI());
        System.out.println("🔍 JWT Filter - Auth Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("🔍 JWT Filter - No valid auth header, skipping");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        username = jwtService.extractUsername(jwt);
        
        System.out.println("🔍 JWT Filter - Extracted username: " + username);
        System.out.println("🔍 JWT Filter - JWT token: " + jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            
            String reqUa = request.getHeader("User-Agent");
            String reqIp = request.getHeader("X-Forwarded-For");
            if (reqIp == null || reqIp.isBlank()) reqIp = request.getRemoteAddr();
            boolean isValid = jwtService.validateToken(jwt, username);
            System.out.println("🔍 JWT Filter - Token valid: " + isValid);
            
            if (isValid) {
                System.out.println("🔍 JWT Filter - User authorities: " + userDetails.getAuthorities());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("🔍 JWT Filter - Authentication set for user: " + username + " with roles: " + userDetails.getAuthorities());
                System.out.println("🔍 JWT Filter - User authorities: " + userDetails.getAuthorities().toString());
            } else {
                System.out.println("🔍 JWT Filter - Token validation failed for user: " + username);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}