package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrderDetailStatus;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;

// 주문 Dto
public record OrdersDetailDto(
        int id,
        int ordersId,
        int productId,
        int quantity,
        int totalPrice,
        OrderDetailStatus status
) {
    public OrdersDetailDto(OrdersDetail ordersDetail) {
        this(
                ordersDetail.getId(),
                ordersDetail.getOrders().getId(),
                ordersDetail.getProduct().getId(),
                ordersDetail.getQuantity(),
                ordersDetail.getTotalPrice(),
                ordersDetail.getStatus()
        );
    }
}