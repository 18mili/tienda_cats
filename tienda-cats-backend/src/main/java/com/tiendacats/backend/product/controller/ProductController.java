package com.tiendacats.backend.product.controller;

import com.tiendacats.backend.product.dto.*;
import com.tiendacats.backend.product.service.ProductService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(
        origins = {"http://localhost:5173", "http://localhost:5174"},
        allowedHeaders = "*"
)
@Tag(name = "Products", description = "Catálogo y administración de productos")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // ✅ ADMIN
    @PostMapping
    @SecurityRequirement(name = "BearerAuth")
    public ProductResponse create(@Valid @RequestBody ProductCreateRequest req) {
        return service.create(req);
    }

    // ✅ PÚBLICO
    @GetMapping
    public List<ProductResponse> findAll() {
        return service.findAll();
    }

    // ✅ PÚBLICO
    @GetMapping("/{id}")
    public ProductResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    // ✅ ADMIN
    @PutMapping("/{id}")
    @SecurityRequirement(name = "BearerAuth")
    public ProductResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest req
    ) {
        return service.update(id, req);
    }

    // ✅ ADMIN
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "BearerAuth")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
