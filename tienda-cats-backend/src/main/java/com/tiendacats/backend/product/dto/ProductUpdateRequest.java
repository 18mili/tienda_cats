package com.tiendacats.backend.product.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductUpdateRequest {

    @NotNull
    private String name;

    @NotNull
    private Integer price;

    private String imageUrl;

    @NotNull
    private String category;

    private boolean featured;

    private Integer stock;
}
