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
            int quantity
    ) {
    }

    @PatchMapping("/{orderId}/details/{detailId}")
    public RsData<OrdersDetailDto> modifyOrder(
            @PathVariable int orderId,
            @PathVariable int detailId,
            @RequestBody OrderModifyReqBody orderModifyBody
    ) {
        OrdersDetail orderDetail = ordersService.modifyOrders(orderId, detailId, orderModifyBody.quantity());

        return new RsData<OrdersDetailDto>(
                "200-1",
                "주문이 수정되었습니다",
                new OrdersDetailDto(orderDetail)
                );
    }
}
