package com.back.nbe12141team07.domain.orders.controller;

import com.back.nbe12141team07.domain.orders.dto.OrdersDetailDto;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.service.OrdersService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;

    record OrderModifyReqBody(
            int orderDetailId,
            int quantity
    ) {
    }

    @PatchMapping("/{id}")
    @Transactional
    public RsData<OrdersDetailDto> modifyOrder(
            @PathVariable int id,
            @RequestBody OrderModifyReqBody orderModifyBody
    ) {
        OrdersDetail order = ordersService.modifyOrders(id, orderModifyBody.orderDetailId, orderModifyBody.quantity);

        return new RsData<OrdersDetailDto>(
                "200-1",
                "주문이 수정되었습니다",
                new OrdersDetailDto(order)
                );
    }
}
