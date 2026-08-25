package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;

public record OrdersDetailDto(
        int orderId,
        int orderDetailId,
        int quantity
) {
    public OrdersDetailDto(OrdersDetail ordersDetail) {
        this(
                ordersDetail.getOrdersId().getId(),
                ordersDetail.getId(),
                ordersDetail.getQuantity()
        );
    }
}
