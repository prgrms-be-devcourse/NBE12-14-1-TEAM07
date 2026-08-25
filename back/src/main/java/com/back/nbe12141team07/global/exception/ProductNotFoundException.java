package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends BusinessException {

    public ProductNotFoundException(int id) {
        super(
                HttpStatus.NOT_FOUND,
                "상품을 찾을 수 없습니다. id: " + id
        );
    }
}