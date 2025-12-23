package com.tiendacats.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductCreateRequest {

    @NotBlank
    private String name;

    @NotNull
    private Integer price;

    private String imageUrl;

    @NotBlank
    private String category;

    private boolean featured;

    private Integer stock;
}
