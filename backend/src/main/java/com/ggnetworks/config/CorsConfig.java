package com.ggnetworks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Use allowedOriginPatterns for more flexibility (supports wildcards)
        // This allows any localhost port and specific production origins
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",           // All localhost ports
            "http://127.0.0.1:*",         // All 127.0.0.1 ports
            "http://139.84.241.182:*",    // Production IP with any port
            "https://139.84.241.182:*",   // HTTPS production IP
            "http://139.84.241.182",      // Production IP without port
            "https://139.84.241.182",     // HTTPS production IP without port
            "https://admin.ggwifi.co.tz",
            "https://connect.ggwifi.co.tz",
            "https://www.ggwifi.co.tz",
            "http://admin.ggwifi.co.tz",
            "http://connect.ggwifi.co.tz",
            "http://www.ggwifi.co.tz"
        ));
        
        // Also set specific origins as fallback
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://139.84.241.182:8080",
            "http://139.84.241.182",
            "https://139.84.241.182"
        ));
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers (but not "*" when credentials are enabled)
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Expose headers for frontend access
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Content-Type",
            "Authorization",
            "X-Requested-With"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);
        
        // Apply CORS configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}

