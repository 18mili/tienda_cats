package com.tiendacats.backend.security;

import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class FirebaseJwtAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseTokenVerifier tokenVerifier;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        System.out.println("\n➡️ REQUEST: " + request.getMethod() + " " + uri);

        // Si no hay token -> sigue sin autenticar
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        try {
            FirebaseToken decodedToken = tokenVerifier.verify(token);

            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail(); // puede ser null y NO es problema

            System.out.println("✅ UID: " + uid);
            System.out.println("✅ EMAIL: " + email);
            System.out.println("✅ CLAIMS: " + decodedToken.getClaims());

            Map<String, Object> claims = decodedToken.getClaims();

            // roles: ["ADMIN"]  o role: "ADMIN"
            List<String> roles = new ArrayList<>();

            Object rolesClaim = claims.get("roles");
            if (rolesClaim instanceof Collection<?> col) {
                for (Object r : col) {
                    if (r != null) roles.add(String.valueOf(r).toUpperCase());
                }
            } else {
                Object roleClaim = claims.getOrDefault("role", "USER");
                if (roleClaim != null) roles.add(String.valueOf(roleClaim).toUpperCase());
            }

            if (roles.isEmpty()) roles = List.of("USER");

            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                    .toList();

            System.out.println("✅ AUTHORITIES: " + authorities);

            // ✅ Principal = UID (lo más correcto)
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(uid, null, authorities);

            // ✅ Guardar email como details (para OrderController)
            authentication.setDetails(email);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            System.out.println("❌ ERROR VALIDANDO TOKEN");
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
