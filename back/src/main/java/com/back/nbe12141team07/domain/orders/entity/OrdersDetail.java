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
    private Orders orders;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;
    private int totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderDetailStatus status = OrderDetailStatus.ORDERED;

    public void updateOrder(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = product.getPrice()*quantity;
    }

    public OrdersDetail(Orders orders, Product product, int quantity, int totalPrice) {
        this.orders = orders;
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public void cancel() {
        this.status = OrderDetailStatus.CANCELED;
    }
    public void complte() {
        this.status = OrderDetailStatus.COMPLETED;
    }
}



