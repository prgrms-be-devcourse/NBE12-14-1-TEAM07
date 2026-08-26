package com.back.nbe12141team07.domain.orders.service;

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

    private static final int CUTOFF_HOUR = 14;

    public int completeOrders(LocalDate date) {
        LocalDateTime start = date.minusDays(1).atTime(CUTOFF_HOUR, 0);
        LocalDateTime end = date.atTime(CUTOFF_HOUR, 0);

        List<Orders> orders = ordersRepository
                .findByCreateDateGreaterThanEqualAndCreateDateLessThan(start, end);

        return orders.size();
    }
}
