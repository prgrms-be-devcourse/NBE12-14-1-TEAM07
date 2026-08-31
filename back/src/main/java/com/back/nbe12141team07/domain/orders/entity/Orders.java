package com.back.nbe12141team07.domain.orders.entity;

import com.back.nbe12141team07.domain.users.entity.Users;
import com.back.nbe12141team07.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Orders extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private Users users;

    @OneToMany(
            mappedBy = "orders",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrdersDetail> ordersDetails = new ArrayList<>();

    //상세 주문 삭제
    public void removeOrderDetail(OrdersDetail detail) {
        ordersDetails.remove(detail);
    }

    public Orders(Users users) {
        this.users = users;
    }

    // ordersDetails을 편하게 추가하기 위한 메서드
    public void addOrderDetail(OrdersDetail detail) {
        ordersDetails.add(detail);
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.ORDERED;

    public void complete() {
        this.status = OrderStatus.COMPLETED;
    }

    public void cancel() {
        this.status = OrderStatus.CANCELED;
    }

    public void modify() {
        this.status = OrderStatus.MODIFIED;
    }
}
