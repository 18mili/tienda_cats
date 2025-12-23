package com.tiendacats.backend.admin.service;

import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.ListUsersPage;
import com.tiendacats.backend.admin.dto.FirebaseUserResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminUsersService {

    public List<FirebaseUserResponse> listUsers() {
        try {
            List<FirebaseUserResponse> out = new ArrayList<>();

            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);

            while (page != null) {
                for (ExportedUserRecord u : page.getValues()) {

                    // ✅ Soporta role: "ADMIN" y roles: ["ADMIN"]
                    String role = "USER";
                    Map<String, Object> claims = u.getCustomClaims();

                    Object rolesClaim = claims.get("roles");
                    if (rolesClaim instanceof Collection<?> col && !col.isEmpty()) {
                        Object first = col.iterator().next();
                        if (first != null) role = String.valueOf(first).toUpperCase();
                    } else {
                        Object roleClaim = claims.get("role");
                        if (roleClaim != null) role = String.valueOf(roleClaim).toUpperCase();
                    }

                    long createdAt = 0L;
                    if (u.getUserMetadata() != null) {
                        createdAt = u.getUserMetadata().getCreationTimestamp();
                    }

                    out.add(FirebaseUserResponse.builder()
                            .uid(u.getUid())
                            .email(u.getEmail())
                            .emailVerified(u.isEmailVerified())
                            .createdAt(createdAt)
                            .role(role)
                            .build());
                }

                page = page.getNextPage();
            }

            // más recientes primero
            out.sort((a, b) -> Long.compare(b.getCreatedAt(), a.getCreatedAt()));
            return out;

        } catch (Exception e) {
            throw new RuntimeException("Error listing Firebase users", e);
        }
    }
}
