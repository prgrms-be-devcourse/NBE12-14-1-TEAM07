package com.back.nbe12141team07.domain.orders.dto;

import lombok.Getter;

// 주문 상세(상품 번호, 수량) Request
public record OrdersDetailRequest(
        int productId,
        int quantity
) {
}