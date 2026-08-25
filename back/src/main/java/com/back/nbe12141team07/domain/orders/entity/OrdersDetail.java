package com.back.nbe12141team07.domain.orders.entity;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class OrdersDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orders_id", nullable = false)
    private Orders ordersId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product productId;

    private int quantity;
    private int price;

    public void updateOrderQuantity(int quantity) {
        this.quantity = quantity;
    }


    //수정 구현용 하드코딩 코드
    public OrdersDetail(
            Orders orders,
            Product product,
            int quantity,
            int price
    ) {
        this.ordersId = orders;
        this.productId = product;
        this.quantity = quantity;
        this.price = price;
    }
}



