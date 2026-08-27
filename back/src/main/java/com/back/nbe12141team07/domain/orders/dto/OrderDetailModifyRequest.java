package com.back.nbe12141team07.domain.orders.dto;

public record OrderDetailModifyRequest(
        int detailId,
        int productId,
        int quantity
) {
}
