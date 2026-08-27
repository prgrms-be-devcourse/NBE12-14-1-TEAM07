package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrderStatus;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import java.time.LocalDateTime;
import java.util.List;

public record OrdersDto(
        int id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String email,
        OrderStatus orderStatus,
        List<OrdersDetailDto> ordersDetails
) {
    public OrdersDto(Orders orders) {
        this(
                orders.getId(),
                orders.getCreateDate(),
                orders.getModifyDate(),
                orders.getUsers().getEmail(),
                orders.getStatus(),
                // OrdersDetails를 Stream을 사용하여 List로 반환
                orders.getOrdersDetails()
                        .stream()
                        .map(OrdersDetailDto::new)
                        .toList()
        );
    }
}
