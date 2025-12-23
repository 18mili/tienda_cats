package com.tiendacats.backend.admin.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FirebaseUserResponse {
    private String uid;
    private String email;
    private boolean emailVerified;
    private long createdAt; // epoch ms (opcional)
    private String role;    // ADMIN/USER (si existe el claim)
}
