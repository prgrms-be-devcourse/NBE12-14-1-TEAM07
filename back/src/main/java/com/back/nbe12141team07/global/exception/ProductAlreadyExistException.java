package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class ProductAlreadyExistException extends BusinessException{

    public ProductAlreadyExistException(String name) {
        super(
                HttpStatus.CONFLICT,
                name + "은 이미 존재하는 상품입니다."
        );
    }
}
