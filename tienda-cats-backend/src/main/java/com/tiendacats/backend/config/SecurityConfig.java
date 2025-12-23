package com.tiendacats.backend.config;

import com.tiendacats.backend.security.FirebaseJwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final FirebaseJwtAuthenticationFilter firebaseFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(h -> h.frameOptions(f -> f.disable()))
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

                .authorizeHttpRequests(auth -> auth
                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Swagger
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

                        // H2 + Health
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // =========================
                        // PRODUCTS (PUBLIC GET)
                        // =========================
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/products",
                                "/api/v1/products/**",
                                "/api/v1/productos",
                                "/api/v1/productos/**",

                                // reports públicos (ya te funcionan)
                                "/api/v1/product-report/**",
                                "/api/v1/products/report/**",
                                "/api/v1/reports/**"
                        ).permitAll()

                        // =========================
                        // PRODUCTS (ADMIN CRUD)
                        // (Agrego también variantes /admin/products por si tu controller vive ahí)
                        // =========================
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/products/**",
                                "/api/v1/productos/**",
                                "/api/v1/admin/products/**",
                                "/api/v1/admin/productos/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/products/**",
                                "/api/v1/productos/**",
                                "/api/v1/admin/products/**",
                                "/api/v1/admin/productos/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/products/**",
                                "/api/v1/productos/**",
                                "/api/v1/admin/products/**",
                                "/api/v1/admin/productos/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // ORDERS (NO TOCO)
                        // =========================
                        .requestMatchers(HttpMethod.POST, "/api/v1/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/orders").hasRole("ADMIN")

                        // =========================
                        // ADMIN (NO TOCO)
                        // =========================
                        .requestMatchers(HttpMethod.GET, "/api/v1/admin/**").hasRole("ADMIN")

                        // resto
                        .anyRequest().authenticated()
                )

                .addFilterBefore(firebaseFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
