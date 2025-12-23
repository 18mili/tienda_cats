package com.tiendacats.backend.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateRequest {

    @NotNull
    private Integer total;

    @NotEmpty
    private List<Item> items;

    @Data
    public static class Item {
        @NotNull private Long productId;
        @NotNull private String name;
        @NotNull private Integer price;
        @NotNull private Integer qty;
    }
}
