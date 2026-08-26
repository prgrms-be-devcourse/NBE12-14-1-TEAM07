package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;

//상세정보 return을 위해 ordersDetailDto 추가
public record OrdersDetailDto(
        int orderId,
        int orderDetailId,
        int quantity
) {
    public OrdersDetailDto(OrdersDetail ordersDetail) {
        this(
                ordersDetail.getOrders().getId(),
                ordersDetail.getId(),
                ordersDetail.getQuantity()
        );
    }
}
