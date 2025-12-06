package com.ggnetworks.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * CORS Filter to handle preflight OPTIONS requests
 * This ensures CORS headers are always set, even for OPTIONS requests
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CustomCorsFilter implements Filter {

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
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
        "https://139.84.241.182",
        "https://admin.ggwifi.co.tz",
        "https://connect.ggwifi.co.tz",
        "https://hotspot.ggwifi.co.tz", // Customer portal
        "https://www.ggwifi.co.tz",
        "https://api.ggwifi.co.tz",     // API domain
        "http://admin.ggwifi.co.tz",
        "http://connect.ggwifi.co.tz",
        "http://hotspot.ggwifi.co.tz",  // Customer portal HTTP
        "http://www.ggwifi.co.tz"
    );
    
    // Explicit list of allowed headers (cannot use "*" when allowCredentials is true)
    private static final String ALLOWED_HEADERS = 
        "Content-Type, Authorization, X-Requested-With, Accept, Origin, " +
        "Access-Control-Request-Method, Access-Control-Request-Headers, " +
        "Cache-Control, Pragma, X-CSRF-TOKEN, X-Auth-Token, " +
        "Accept-Language, Accept-Encoding";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String origin = request.getHeader("Origin");
        
        // Check if origin is allowed - more permissive for development
        boolean isAllowedOrigin = false;
        if (origin != null) {
            // Check exact matches first
            if (ALLOWED_ORIGINS.contains(origin)) {
                isAllowedOrigin = true;
            }
            // Allow any localhost port
            else if (origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:")) {
                isAllowedOrigin = true;
            }
            // Allow any 127.0.0.1 port
            else if (origin.startsWith("http://127.0.0.1:") || origin.startsWith("https://127.0.0.1:")) {
                isAllowedOrigin = true;
            }
            // Allow production IP with any port
            else if (origin.startsWith("http://139.84.241.182") || origin.startsWith("https://139.84.241.182")) {
                isAllowedOrigin = true;
            }
            // Allow production domains
            else if (origin.contains("ggwifi.co.tz")) {
                isAllowedOrigin = true;
            }
        }

        // Always set CORS headers if origin is present (even if not in list, for debugging)
        if (origin != null) {
            if (isAllowedOrigin) {
                response.setHeader("Access-Control-Allow-Origin", origin);
            } else {
                // For debugging: allow but log
                System.out.println("⚠️ CORS: Allowing origin not in list: " + origin);
                response.setHeader("Access-Control-Allow-Origin", origin);
            }
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
            // CRITICAL: Cannot use "*" when allowCredentials is true - must explicitly list headers
            response.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
            response.setHeader("Access-Control-Expose-Headers", 
                "Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Content-Type, Authorization, X-Requested-With");
            response.setHeader("Access-Control-Max-Age", "3600");
        }

        // Handle preflight OPTIONS request - MUST return before chain.doFilter
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            System.out.println("✅ CORS: Handling OPTIONS preflight request from origin: " + origin);
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().flush();
            return; // Don't continue to next filter
        }

        chain.doFilter(req, res);
    }
}

