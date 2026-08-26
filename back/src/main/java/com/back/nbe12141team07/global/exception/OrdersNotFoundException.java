package com.back.nbe12141team07.global.exception;

import org.springframework.http.HttpStatus;

public class OrdersNotFoundException extends BusinessException {

    public OrdersNotFoundException(int id) {
        super(
                HttpStatus.NOT_FOUND,
                "주문을 찾을 수 없습니다. id : " + id
        );
    }
}