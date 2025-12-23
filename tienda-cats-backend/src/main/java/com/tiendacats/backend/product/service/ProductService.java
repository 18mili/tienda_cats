package com.tiendacats.backend.product.service;

import com.tiendacats.backend.product.dto.*;
import com.tiendacats.backend.product.model.Product;
import com.tiendacats.backend.product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public ProductResponse create(ProductCreateRequest req) {
        Product p = Product.builder()
                .name(req.getName())
                .price(req.getPrice())
                .imageUrl(req.getImageUrl())
                .category(req.getCategory())
                .featured(req.isFeatured())
                .stock(req.getStock() == null ? 0 : req.getStock())
                .deleted(false)
                .build();

        return toResponse(repo.save(p));
    }

    public List<ProductResponse> findAll() {
        return repo.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no existe"));

        if (p.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no existe");
        }
        return toResponse(p);
    }

    public ProductResponse update(Long id, ProductUpdateRequest req) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no existe"));

        if (p.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no existe");
        }

        p.setName(req.getName());
        p.setPrice(req.getPrice());
        p.setImageUrl(req.getImageUrl());
        p.setCategory(req.getCategory());
        p.setFeatured(req.isFeatured());
        p.setStock(req.getStock() == null ? p.getStock() : req.getStock());

        return toResponse(repo.save(p));
    }

    public void delete(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no existe"));

        p.setDeleted(true);
        repo.save(p);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .category(p.getCategory())
                .featured(p.isFeatured())
                .stock(p.getStock())
                .build();
    }
}
