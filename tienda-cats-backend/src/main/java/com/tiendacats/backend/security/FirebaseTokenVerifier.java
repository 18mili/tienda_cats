package com.tiendacats.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Component;

@Component
public class FirebaseTokenVerifier {

    public FirebaseToken verify(String token) throws FirebaseAuthException {
        // ✅ SIN checkRevoked para evitar 401 falsos en desarrollo
        return FirebaseAuth.getInstance().verifyIdToken(token);
    }
}
