package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.entity.OrderStatus;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;

    private static final int CUTOFF_HOUR = 14; // 14시 기준점

    public int completeOrders(LocalDate date) {
        LocalDateTime start = date.minusDays(1).atTime(CUTOFF_HOUR, 0); // 전날 14:00:00
        LocalDateTime end = date.atTime(CUTOFF_HOUR, 0); // 당일 14:00:00

        List<Orders> orders = ordersRepository
                .findByCreateDateGreaterThanEqualAndCreateDateLessThanAndStatus(start, end, OrderStatus.ORDERED);

        orders.forEach(Orders::complete);

        return orders.size();
    }
}
