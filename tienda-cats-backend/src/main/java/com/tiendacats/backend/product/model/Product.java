package com.tiendacats.backend.product.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer price;

    private String imageUrl;

    private String category;

    @Column(nullable = false)
    private boolean featured = false;

    private Integer stock;

    @Column(nullable = false)
    private boolean deleted = false;
}
