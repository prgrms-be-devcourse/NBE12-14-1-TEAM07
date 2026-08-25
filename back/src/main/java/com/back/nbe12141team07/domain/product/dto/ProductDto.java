package com.back.nbe12141team07.domain.product.dto;

import com.back.nbe12141team07.domain.product.entity.Product;

import java.time.LocalDateTime;

public record ProductDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String name,
        int price
) {
    public ProductDto(Product product) {
        this(
                product.getId(),
                product.getCreateDate(),
                product.getModifyDate(),
                product.getName(),
                product.getPrice()
        );
    }
}