package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.global.exception.OrdersDetailNotFoundException;
import com.back.nbe12141team07.global.exception.OrdersNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;

    @Transactional
    public void cancelOrderDetail(int orderId, int detailId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new OrdersNotFoundException(orderId));

        OrdersDetail detail = order.getOrdersDetails()
                .stream()
                .filter(d -> d.getId() == detailId)
                .findFirst()
                .orElseThrow(() -> new OrdersDetailNotFoundException(orderId, detailId));

        order.removeOrderDetail(detail);
    }
}
