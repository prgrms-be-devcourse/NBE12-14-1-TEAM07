package com.back.nbe12141team07.domain.orders.controller;

import com.back.nbe12141team07.domain.orders.service.OrdersService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;

    @DeleteMapping("/{orderId}/details/{detailId}")
    public RsData<Void> cancelDetail(
        @PathVariable int orderId,
        @PathVariable int detailId
    ) {
        ordersService.cancelOrderDetail(orderId, detailId);

        return new RsData<>(
                "200-1",
                "상세 주문이 취소되었습니다."
        );
    }
}
