package com.ggnetworks.config;

import com.ggnetworks.service.JwtService;
import com.ggnetworks.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("🔧 SecurityConfig - Creating SecurityFilterChain");
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"))
                .xssProtection(xss -> xss.disable())
                .frameOptions(frame -> frame.sameOrigin())
                .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).preload(true))
            )
            .authorizeHttpRequests(authz -> authz
                // Public endpoints (no authentication required)
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/admin-login", "/api/v1/auth/staff-login", "/api/v1/auth/simple-login", "/api/v1/auth/refresh", "/api/v1/auth/test", "/api/v1/customer-portal/packages", "/api/v1/test/**").permitAll()
                .requestMatchers("/api/v1/customer-portal/**").permitAll()
                .requestMatchers("/customer-portal/**").permitAll()
                .requestMatchers("/auth/login", "/auth/register", "/auth/admin-login", "/auth/staff-login", "/auth/simple-login", "/auth/refresh", "/auth/test").permitAll()
                .requestMatchers("/test/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                
                // Admin endpoints (ADMIN or SUPER_ADMIN role required)
                .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                
                // Dashboard endpoints (ADMIN or SUPER_ADMIN role required)
                .requestMatchers("/dashboard/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                
                // Technician endpoints
                .requestMatchers("/technician/**").hasAnyRole("TECHNICIAN", "ADMIN", "SUPER_ADMIN")
                
                // RADIUS endpoints
                .requestMatchers("/radius/**").hasAnyRole("TECHNICIAN", "ADMIN", "SUPER_ADMIN")
                
                // Finance endpoints
                .requestMatchers("/finance/**").hasAnyRole("FINANCE", "ADMIN", "SUPER_ADMIN")
                
                // Marketing endpoints
                .requestMatchers("/marketing/**").hasAnyRole("MARKETING", "ADMIN", "SUPER_ADMIN")
                
                // SMS endpoints
                .requestMatchers("/api/v1/sms/**").hasAnyRole("MARKETING", "ADMIN", "SUPER_ADMIN", "FINANCE")
                
                // Sales endpoints
                .requestMatchers("/sales/**").hasAnyRole("SALES", "ADMIN", "SUPER_ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        System.out.println("🔧 SecurityConfig - JWT Filter added to filter chain");
        
        SecurityFilterChain chain = http.build();
        System.out.println("🔧 SecurityConfig - SecurityFilterChain created: " + chain);
        return chain;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}