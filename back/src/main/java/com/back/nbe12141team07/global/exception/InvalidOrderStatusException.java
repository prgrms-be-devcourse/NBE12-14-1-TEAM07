package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class InvalidOrderStatusException extends BusinessException {

    public InvalidOrderStatusException() {
        super(
                HttpStatus.BAD_REQUEST,
                "잘못된 요청입니다. 해당 주문은 이미 처리되었습니다."
        );
    }
}