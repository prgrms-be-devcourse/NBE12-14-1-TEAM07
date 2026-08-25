package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class InvalidProductPriceException extends BusinessException {

    public InvalidProductPriceException() {
        super(
                HttpStatus.BAD_REQUEST,
                "상품 가격은 0원 이상이어야 합니다."
        );
    }
}