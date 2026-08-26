package com.back.nbe12141team07.domain.orders.dto;

public record OrdersDetailRequest(
        int productId,
        int quantity
) {
}
