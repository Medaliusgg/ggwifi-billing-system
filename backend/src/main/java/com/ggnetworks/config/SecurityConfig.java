package com.ggnetworks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@ConditionalOnProperty(name = "app.security.enabled", havingValue = "true", matchIfMissing = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          AuthenticationProvider authenticationProvider) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
    }

    private static final RequestMatcher CUSTOMER_AUTH_MATCHER = request -> {
        String uri = request.getRequestURI();
        String servletPath = request.getServletPath();
        boolean matches =
            uri.startsWith("/api/v1/customer-auth")
            || uri.startsWith("/customer-auth")
            || servletPath.startsWith("/customer-auth");
        if (matches) {
            System.out.println("SecurityConfig CUSTOMER_AUTH_MATCHER matched request: " + uri);
        }
        return matches;
    };

    private static final RequestMatcher[] GENERAL_PUBLIC_MATCHERS = new RequestMatcher[]{
        new AntPathRequestMatcher("/swagger-ui.html"),
        new AntPathRequestMatcher("/swagger-ui/**"),
        new AntPathRequestMatcher("/api-docs/**"),
        new AntPathRequestMatcher("/v3/api-docs/**"),
        new AntPathRequestMatcher("/actuator/**"),
        new AntPathRequestMatcher("/api/v1/actuator/**"),
        new AntPathRequestMatcher("/auth/**"),
        new AntPathRequestMatcher("/api/v1/auth/**"),
        new AntPathRequestMatcher("/api/v1/testing/**"),  // Testing endpoints (only in testing profile)
        new AntPathRequestMatcher("/api/v1/customer-portal/**")  // Customer portal (public)
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(CUSTOMER_AUTH_MATCHER).permitAll()
                .requestMatchers(GENERAL_PUBLIC_MATCHERS).permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
