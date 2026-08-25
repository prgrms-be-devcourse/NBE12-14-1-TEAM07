package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;

// 주문 등록 성공 상세 Dto
public record OrdersDetailDto(
        int id,
        int productId,
        int quantity,
        int totalPrice
) {

    public OrdersDetailDto(OrdersDetail ordersDetail) {
        this(
                ordersDetail.getId(),
                ordersDetail.getProduct().getId(),
                ordersDetail.getQuantity(),
                ordersDetail.getTotalPrice()
        );
    }
}