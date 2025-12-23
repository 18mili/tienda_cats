package com.tiendacats.backend.order.repository;

import com.tiendacats.backend.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUidAndDeletedFalseOrderByCreatedAtDesc(String userUid);
    List<Order> findByDeletedFalseOrderByCreatedAtDesc();
}
