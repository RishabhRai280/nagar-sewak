package com.nagar_sewak.backend.config;

import com.nagar_sewak.backend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.http.HttpMethod.*; 
import com.nagar_sewak.backend.entities.Role;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                    // ================= PUBLIC READ ACCESS =================
                    // FIX: Added "/uploads/complaints/**" and "/uploads/projects/**" to allow public access to images
                    .requestMatchers(GET, "/projects", "/projects/**", "/complaints", "/api/map/data", "/api/wards/detect", "/uploads/complaints/**", "/uploads/projects/**").permitAll() 
                    .requestMatchers("/auth/**", "/login", "/register").permitAll()
                    
                    // ================= ADMIN/CONTRACTOR ACCESS =================
                    .requestMatchers(POST, "/projects").hasAuthority(Role.ADMIN.name())
                    .requestMatchers("/admin/**").hasAnyAuthority(Role.ADMIN.name(), Role.SUPER_ADMIN.name())
                    .requestMatchers("/dashboard/contractor").hasAuthority(Role.CONTRACTOR.name())
                    
                    // ================= CITIZEN ACCESS FIX =================
                    // FIX: Explicitly allow CITIZEN to access their dashboard and profile/notifications routes
                    .requestMatchers("/dashboard/citizen", "/citizen/**").hasAuthority(Role.CITIZEN.name())

                    // ================= CONTRACTOR/ADMIN UPDATE =================
                    .requestMatchers(PUT, "/projects/**").hasAnyAuthority(Role.ADMIN.name(), Role.CONTRACTOR.name())
                    .requestMatchers(PUT, "/complaints/**").hasAnyAuthority(Role.ADMIN.name(), Role.CONTRACTOR.name())

                    // ================= TENDER ACCESS =================
                    .requestMatchers("/tenders/complaints/*/submit").hasAuthority(Role.CONTRACTOR.name())
                    .requestMatchers("/tenders/my").hasAuthority(Role.CONTRACTOR.name())
                    .requestMatchers("/tenders/*/accept").hasAnyAuthority(Role.ADMIN.name(), Role.SUPER_ADMIN.name())
                    .requestMatchers("/tenders/complaints/*").hasAnyAuthority(Role.ADMIN.name(), Role.SUPER_ADMIN.name(), Role.CONTRACTOR.name())

                    // ================= CITIZEN WRITE/REPORTING =================
                    .requestMatchers(POST, "/complaints").hasAuthority(Role.CITIZEN.name())
                    .requestMatchers(POST, "/ratings").hasAuthority(Role.CITIZEN.name()) 

                    // Default Fallback: all other requests MUST be authenticated
                    .anyRequest().authenticated()
            )
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}