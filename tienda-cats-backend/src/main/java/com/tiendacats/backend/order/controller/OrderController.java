package com.tiendacats.backend.order.controller;

import com.tiendacats.backend.order.dto.OrderCreateRequest;
import com.tiendacats.backend.order.dto.OrderResponse;
import com.tiendacats.backend.order.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Purchases / orders")
@SecurityRequirement(name = "BearerAuth") // ✅ IMPORTANTE: hace que Swagger mande el token
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"}, allowedHeaders = "*")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // USER creates order (token required)
    @PostMapping
    public OrderResponse create(@Valid @RequestBody OrderCreateRequest req, Authentication authentication) {
        Authentication auth = requireAuth(authentication);

        String uid = auth.getName();
        String email = (auth.getDetails() != null) ? String.valueOf(auth.getDetails()) : "";

        return service.create(req, uid, email);
    }

    // USER views own orders (token required)
    @GetMapping("/me")
    public List<OrderResponse> myOrders(Authentication authentication) {
        Authentication auth = requireAuth(authentication);
        return service.myOrders(auth.getName());
    }

    // ADMIN views all orders (ADMIN enforced in SecurityConfig)
    @GetMapping
    public List<OrderResponse> allOrders(Authentication authentication) {
        requireAuth(authentication);
        return service.allOrders();
    }

    private Authentication requireAuth(Authentication authentication) {
        if (authentication == null) throw new RuntimeException("Not authenticated (authentication null)");
        String name = authentication.getName();
        if (name == null || name.isBlank() || "anonymousUser".equalsIgnoreCase(name)) {
            throw new RuntimeException("Not authenticated (anonymousUser)");
        }
        return authentication;
    }
}
