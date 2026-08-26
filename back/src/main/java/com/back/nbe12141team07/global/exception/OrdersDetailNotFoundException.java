package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class OrdersDetailNotFoundException extends BusinessException {

    public OrdersDetailNotFoundException(int orderId, int detailId) {
        super(
                HttpStatus.NOT_FOUND,
                "%d번 주문의 %d번 상세주문을 찾을 수 없습니다.".formatted(orderId, detailId)
        );
    }
}