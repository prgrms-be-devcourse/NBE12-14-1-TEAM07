package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.global.exception.InvalidOrdersQuantityException;
import com.back.nbe12141team07.global.exception.OrdersDetailNotFoundException;
import com.back.nbe12141team07.global.exception.OrdersNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;

    @Transactional //실제 서비스 구현하는 자리에 Transactional 추가
    public OrdersDetail modifyOrders(int orderId, int detailId, int quantity) {

        //한 order 내에 상세 취소는 따로 구현할거라 0포함
        if(quantity <= 0) {
            throw new InvalidOrdersQuantityException();
        }

        //orderNotFound 예외처리
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new OrdersNotFoundException(orderId));


        //orderDetail을 위한 orderDetailNotFound 예외 처리 추가
        OrdersDetail detail = order.getOrdersDetails()
                .stream()
                .filter(d -> d.getId() == detailId)
                .findFirst()
                .orElseThrow(() -> new OrdersDetailNotFoundException(orderId, detailId));

        detail.updateOrderQuantity(quantity);

        return detail;
    }
}
