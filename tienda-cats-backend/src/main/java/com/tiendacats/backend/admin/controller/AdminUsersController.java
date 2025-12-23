package com.tiendacats.backend.admin.controller;

import com.tiendacats.backend.admin.dto.FirebaseUserResponse;
import com.tiendacats.backend.admin.service.AdminUsersService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Admin endpoints")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"}, allowedHeaders = "*")
public class AdminUsersController {

    private final AdminUsersService service;

    public AdminUsersController(AdminUsersService service) {
        this.service = service;
    }

    @GetMapping("/users")
    @SecurityRequirement(name = "BearerAuth")
    public List<FirebaseUserResponse> users() {
        return service.listUsers();
    }
}
