package com.back.nbe12141team07.domain.orders.dto;

import com.back.nbe12141team07.domain.orders.entity.OrderDetailStatus;
import com.back.nbe12141team07.domain.orders.entity.OrderStatus;
import com.back.nbe12141team07.domain.orders.entity.Orders;

import java.time.LocalDateTime;
import java.util.List;

public record UserOrdersDto(
        int id,
        LocalDateTime modifyDate,
        OrderStatus orderStatus,
        List<OrdersDetailDto> ordersDetails
) {
    public UserOrdersDto(Orders orders) {
        this(
                orders.getId(),
                orders.getModifyDate(),
                orders.getStatus(),
                orders.getOrdersDetails()
                        .stream()
                        .map(OrdersDetailDto::new)
                        .toList()
        );
    }
}