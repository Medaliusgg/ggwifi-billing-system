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
                    "http://*.ggwifi.co.tz",
                    "https://*.pages.dev",
                    "https://*.cloudflarepages.app"
                )
                // DO NOT use allowedOrigins when using allowedOriginPatterns with allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders(
                    "Content-Type",
                    "Authorization",
                    "X-Requested-With",
                    "Accept",
                    "Origin",
                    "Access-Control-Request-Method",
                    "Access-Control-Request-Headers"
                )
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

