package com.back.nbe12141team07.domain.orders.controller;

import com.back.nbe12141team07.domain.orders.dto.OrdersDetailRequest;
import com.back.nbe12141team07.domain.orders.dto.OrdersDto;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.service.OrdersService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    record OrdersSaveReqBody (
            String email,
            List<OrdersDetailRequest> ordersDetails
    ) {
    }

    @PostMapping
    @Transactional
    public RsData<OrdersDto> save(@Valid @RequestBody OrdersSaveReqBody reqBody) {
        Orders orders = ordersService.createOrders(reqBody.email(), reqBody.ordersDetails);

        return new RsData<>(
                "201-1",
                "%d번 주문이 성공적으로 등록되었습니다.".formatted(orders.getId()),
                new OrdersDto(orders)
        );
    }

    @GetMapping("/{id}")
    @Transactional
    public OrdersDto detail(@PathVariable int id) {
        Orders orders = ordersService.findById(id);

        return new OrdersDto(orders);
    }


}
