package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrderDetailStatus;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;

public record OrdersDetailDto(
        int id,
        int ordersId,
        int productId,
        String productName,
        int quantity,
        int totalPrice,
        OrderDetailStatus status
) {
    public OrdersDetailDto(OrdersDetail ordersDetail) {
        this(
                ordersDetail.getId(),
                ordersDetail.getOrders().getId(),
                ordersDetail.getProduct().getId(),
                ordersDetail.getProduct().getName(),
                ordersDetail.getQuantity(),
                ordersDetail.getTotalPrice(),
                ordersDetail.getStatus()
        );
    }
}