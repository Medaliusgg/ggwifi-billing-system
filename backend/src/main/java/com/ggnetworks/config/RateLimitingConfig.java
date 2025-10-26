package com.ggnetworks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {

    private final ConcurrentHashMap<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final int MAX_LOGIN_ATTEMPTS_PER_MINUTE = 5;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitingInterceptor())
                .addPathPatterns("/api/v1/auth/login", "/api/v1/auth/admin-login", "/api/v1/auth/staff-login");
        
        registry.addInterceptor(generalRateLimitingInterceptor())
                .addPathPatterns("/api/v1/**")
                .excludePathPatterns("/api/v1/customer-portal/**");
    }

    @Bean
    public HandlerInterceptor rateLimitingInterceptor() {
        return new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
                String clientIp = getClientIp(request);
                String key = "login:" + clientIp;
                
                RateLimitInfo info = rateLimitMap.computeIfAbsent(key, k -> new RateLimitInfo());
                
                // Clean old entries
                cleanOldEntries();
                
                // Check rate limit
                if (info.getCount() >= MAX_LOGIN_ATTEMPTS_PER_MINUTE) {
                    response.setStatus(429);
                    response.getWriter().write("{\"status\":\"error\",\"message\":\"Too many login attempts. Please try again later.\"}");
                    response.setContentType("application/json");
                    return false;
                }
                
                info.increment();
                return true;
            }
        };
    }

    @Bean
    public HandlerInterceptor generalRateLimitingInterceptor() {
        return new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
                String clientIp = getClientIp(request);
                String key = "general:" + clientIp;
                
                RateLimitInfo info = rateLimitMap.computeIfAbsent(key, k -> new RateLimitInfo());
                
                // Clean old entries
                cleanOldEntries();
                
                // Check rate limit
                if (info.getCount() >= MAX_REQUESTS_PER_MINUTE) {
                    response.setStatus(429);
                    response.getWriter().write("{\"status\":\"error\",\"message\":\"Rate limit exceeded. Please try again later.\"}");
                    response.setContentType("application/json");
                    return false;
                }
                
                info.increment();
                return true;
            }
        };
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void cleanOldEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minus(1, ChronoUnit.MINUTES);
        rateLimitMap.entrySet().removeIf(entry -> 
            entry.getValue().getLastRequest().isBefore(cutoff));
    }

    private static class RateLimitInfo {
        private final AtomicInteger count = new AtomicInteger(0);
        private LocalDateTime lastRequest = LocalDateTime.now();

        public int getCount() {
            return count.get();
        }

        public void increment() {
            count.incrementAndGet();
            lastRequest = LocalDateTime.now();
        }

        public LocalDateTime getLastRequest() {
            return lastRequest;
        }
    }
}
