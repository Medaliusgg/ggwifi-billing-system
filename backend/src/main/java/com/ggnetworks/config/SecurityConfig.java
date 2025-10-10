package com.ggnetworks.config;

import com.ggnetworks.security.JwtAuthenticationFilter;
import com.ggnetworks.security.JwtAuthenticationEntryPoint;
import com.ggnetworks.security.CustomAuthenticationProvider;
import com.ggnetworks.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.config.Customizer;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
@EnableConfigurationProperties({com.ggnetworks.config.props.CorsProperties.class})
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        return customAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/login", "/auth/register", "/auth/otp/**", "/health", "/actuator/**", "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/otp/**", "/api/v1/health", "/api/v1/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(@org.springframework.lang.Nullable com.ggnetworks.config.props.CorsProperties corsProps) {
        CorsConfiguration configuration = new CorsConfiguration();
        if (corsProps != null && corsProps.getAllowedOrigins() != null && !corsProps.getAllowedOrigins().isEmpty()) {
            configuration.setAllowedOrigins(corsProps.getAllowedOrigins());
        } else {
            configuration.setAllowedOriginPatterns(List.of("*"));
        }
        configuration.setAllowedMethods(corsProps == null || corsProps.getAllowedMethods() == null || corsProps.getAllowedMethods().isEmpty()
                ? Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
                : corsProps.getAllowedMethods());
        configuration.setAllowedHeaders(corsProps == null || corsProps.getAllowedHeaders() == null || corsProps.getAllowedHeaders().isEmpty()
                ? Arrays.asList("*")
                : corsProps.getAllowedHeaders());
        configuration.setAllowCredentials(corsProps != null && Boolean.TRUE.equals(corsProps.getAllowCredentials()));
        configuration.setMaxAge(corsProps != null && corsProps.getMaxAge() != null ? corsProps.getMaxAge() : 3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 