package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;

    public OrdersDetail modifyOrders(int id, int orderDetailId, int quantity) {
        Orders order = ordersRepository.findById(id).get();

        OrdersDetail detail = order.getOrdersDetails()
                .stream()
                .filter(d -> d.getId() == orderDetailId)
                .findFirst()
                .orElseThrow();

        detail.updateOrderQuantity(quantity);

        return detail;
    }
}
