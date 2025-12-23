package com.tiendacats.backend.order.service;

import com.tiendacats.backend.order.dto.OrderCreateRequest;
import com.tiendacats.backend.order.dto.OrderResponse;
import com.tiendacats.backend.order.model.Order;
import com.tiendacats.backend.order.model.OrderItem;
import com.tiendacats.backend.order.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public OrderResponse create(OrderCreateRequest req, String uid, String email) {

        // validación simple
        if (req.getTotal() == null || req.getTotal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total inválido");
        }

        Order order = Order.builder()
                .userUid(uid)
                .userEmail(email)
                .total(req.getTotal())
                .createdAt(LocalDateTime.now())
                .deleted(false)
                .build();

        for (OrderCreateRequest.Item it : req.getItems()) {
            int subtotal = (it.getPrice() == null ? 0 : it.getPrice()) * (it.getQty() == null ? 0 : it.getQty());

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(it.getProductId())
                    .name(it.getName())
                    .price(it.getPrice())
                    .qty(it.getQty())
                    .subtotal(subtotal)
                    .build();

            order.getItems().add(item);
        }

        Order saved = repo.save(order);
        return toResponse(saved);
    }

    // compras del usuario
    public List<OrderResponse> myOrders(String uid) {
        return repo.findByUserUidAndDeletedFalseOrderByCreatedAtDesc(uid)
                .stream().map(this::toResponse).toList();
    }

    // admin ve todo
    public List<OrderResponse> allOrders() {
        return repo.findByDeletedFalseOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    private OrderResponse toResponse(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .userEmail(o.getUserEmail())
                .total(o.getTotal())
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(i ->
                        OrderResponse.Item.builder()
                                .productId(i.getProductId())
                                .name(i.getName())
                                .price(i.getPrice())
                                .qty(i.getQty())
                                .subtotal(i.getSubtotal())
                                .build()
                ).toList())
                .build();
    }
}
