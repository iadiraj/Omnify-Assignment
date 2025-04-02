package com.omnify.backend.configs;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.omnify.backend.security.JwtAuthFilter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig {
//        @Value("${frontend.url}")
//        private String frontendURL;
        private final JwtAuthFilter jwtAuthFilter;
        private static String[] PUBLIC_ROUTES = { "/api/v1/blogs/**", "/api/v1/auth/**", "/swagger-ui/**",
                        "/v3/api-docs/**", "/actuator/**", "/**" };

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                httpSecurity
                                .sessionManagement(sessionConfig -> sessionConfig
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .csrf(csrfConfig -> csrfConfig.disable())
                                .cors(corsConfig -> corsConfig
                                                .configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(PUBLIC_ROUTES).permitAll()
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
                return httpSecurity.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                return new CustomCorsConfiguration();
        }

        @Component
        public class CustomCorsConfiguration implements CorsConfigurationSource {
                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(List.of("*"));
                        config.setAllowedMethods(List.of("*"));
                        config.setAllowedHeaders(List.of("*"));
                        config.setAllowCredentials(false);
                        return config;
                }
        }
}
