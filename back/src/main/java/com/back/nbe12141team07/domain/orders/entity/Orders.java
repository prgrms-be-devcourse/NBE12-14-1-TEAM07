package com.back.nbe12141team07.domain.orders.entity;

import com.back.nbe12141team07.domain.user.entity.User;
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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "ordersId",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrdersDetail> ordersDetails = new ArrayList<>();

}
