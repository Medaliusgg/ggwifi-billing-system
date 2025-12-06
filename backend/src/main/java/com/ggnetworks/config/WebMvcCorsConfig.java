package com.ggnetworks.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Additional CORS configuration via WebMvcConfigurer
 * This provides a backup CORS mechanism at the MVC level
 */
@Configuration
public class WebMvcCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "http://139.84.241.182:*",
                    "https://139.84.241.182:*",
                    "https://*.ggwifi.co.tz",
                    "http://*.ggwifi.co.tz"
                )
                .allowedOrigins(
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
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders(
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Credentials",
                    "Content-Type",
                    "Authorization",
                    "X-Requested-With"
                )
                .allowCredentials(true)
                .maxAge(3600);
    }
}

