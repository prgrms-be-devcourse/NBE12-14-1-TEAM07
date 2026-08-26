package com.back.nbe12141team07.domain.orders.service;


import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.global.exception.OrdersNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;

    //id로 주문 조회, 없으면 custom exception 발생
    public Orders findById(int id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new OrdersNotFoundException(id));
    }

    //주문 삭제
    //Orders에 cascade = ALL, orphanRemoval = true이 걸려있기 때문에,
    // Orders를 삭제하면 OrdersDetail도 같이 삭제됨
    public void deleteOrders(int id) {
        Orders orders = findById(id);

        ordersRepository.delete(orders);
    }
}
