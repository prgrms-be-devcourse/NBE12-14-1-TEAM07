package com.back.nbe12141team07.domain.product.entity;


import com.back.nbe12141team07.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String name;

    private int price;

    public Product(String name, int price) {
        this.name = name;
        this.price = price;
    }

    public void updateProduct(String name, int price) {
        this.name = name;
        this.price = price;
    }
}
