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
            mappedBy = "ordersId",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrdersDetail> ordersDetails = new ArrayList<>();

    //수정 하드코딩용 추가
    public Orders(Users users) {
        this.users = users;
    }

    public void addOrderDetail(OrdersDetail ordersDetail) {
        this.ordersDetails.add(ordersDetail);
    }

}
