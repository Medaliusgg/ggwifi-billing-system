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
        // IMPORTANT: When using allowCredentials(true), we MUST use allowedOriginPatterns
        // instead of allowedOrigins to avoid the "*" conflict
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",           // All localhost ports
            "http://127.0.0.1:*",         // All 127.0.0.1 ports
            "http://139.84.241.182:*",    // Production IP with any port
            "https://139.84.241.182:*",   // HTTPS production IP
            "http://139.84.241.182",      // Production IP without port
            "https://139.84.241.182",     // HTTPS production IP without port
            "https://admin.ggwifi.co.tz",
            "https://connect.ggwifi.co.tz",
            "https://hotspot.ggwifi.co.tz", // Customer portal
            "https://www.ggwifi.co.tz",
            "https://api.ggwifi.co.tz",   // API domain
            "http://admin.ggwifi.co.tz",
            "http://connect.ggwifi.co.tz",
            "http://hotspot.ggwifi.co.tz", // Customer portal HTTP
            "http://www.ggwifi.co.tz",
            "https://*.ggwifi.co.tz",     // All ggwifi subdomains
            "http://*.ggwifi.co.tz",      // All ggwifi subdomains HTTP
            "https://*.pages.dev",        // Cloudflare Pages
            "https://*.cloudflarepages.app", // Cloudflare Pages alternative
            "https://zenoapi.com",        // ZenoPay API servers (for webhook)
            "https://*.zenoapi.com"       // ZenoPay subdomains
        ));
        
        // DO NOT use setAllowedOrigins when using setAllowedOriginPatterns with allowCredentials(true)
        // This causes the "*" conflict error
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers (but not "*" when credentials are enabled)
        // Include all common headers that browsers might send
        // CRITICAL: Include x-api-key for ZenoPay webhook authentication
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "X-Requested-With",
            "Cache-Control",
            "Pragma",
            "X-CSRF-TOKEN",
            "X-Auth-Token",
            "Accept-Language",
            "Accept-Encoding",
            "x-api-key"                    // ZenoPay webhook authentication header
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

