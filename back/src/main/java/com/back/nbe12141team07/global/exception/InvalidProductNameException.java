package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class InvalidProductNameException extends BusinessException {

    public InvalidProductNameException() {
        super(
                HttpStatus.BAD_REQUEST,
                "상품 이름이 올바르지 않습니다."
        );
    }
}