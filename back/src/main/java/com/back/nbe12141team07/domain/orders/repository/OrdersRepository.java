package com.back.nbe12141team07.domain.orders.repository;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    List<Orders> findByCreateDateGreaterThanEqualAndCreateDateLessThan(
            LocalDateTime start,
            LocalDateTime end
    );
}