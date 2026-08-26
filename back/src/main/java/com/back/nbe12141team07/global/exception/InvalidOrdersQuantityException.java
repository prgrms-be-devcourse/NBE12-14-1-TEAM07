package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class InvalidOrdersQuantityException extends BusinessException {

    public InvalidOrdersQuantityException() {
        super(
                HttpStatus.BAD_REQUEST,
                "주문 수량은 0개 이상이어야 합니다"
        );
    }
}