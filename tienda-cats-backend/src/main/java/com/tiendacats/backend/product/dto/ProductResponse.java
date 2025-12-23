package com.tiendacats.backend.product.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private Integer price;
    private String imageUrl;
    private String category;
    private boolean featured;
    private Integer stock;
}
