package com.tiendacats.backend.product.repository;

import com.tiendacats.backend.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
