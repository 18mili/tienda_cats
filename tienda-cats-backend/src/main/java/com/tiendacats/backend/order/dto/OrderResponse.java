package com.tiendacats.backend.order.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String userEmail;
    private Integer total;
    private LocalDateTime createdAt;
    private List<Item> items;

    @Data
    @Builder
    public static class Item {
        private Long productId;
        private String name;
        private Integer price;
        private Integer qty;
        private Integer subtotal;
    }
}
