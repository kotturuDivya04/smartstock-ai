package com.smartstock.config;

import com.smartstock.auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthFilter,
                        AuthenticationProvider authenticationProvider) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.authenticationProvider = authenticationProvider;
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of(
                                "https://smartstock-ai-frontend.vercel.app",
                                "https://smartstock-ai-divya-b352.vercel.app"));
                configuration.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(List.of(
                                "Authorization", "Content-Type", "Accept", "Origin"));

                configuration.setAllowCredentials(false);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> {
                                })
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/api/health/**",
                                                                "/actuator/**",
                                                                "/error")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(
                                                jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}