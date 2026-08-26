package com.back.nbe12141team07.domain.orders.controller;

import com.back.nbe12141team07.domain.orders.service.OrdersService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    @PostMapping("/{date}/complete")
    public RsData<Integer> complete(
            // 문자열 자동으로 LocalDtae객체로 변환해서 파라미터 넣기.
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        int count = ordersService.completeOrders(date);

        return new RsData<>(
                "200-1",
                "%d건의 주문을 조회했습니다. (완료 처리 로직은 아직 없음)".formatted(count),
                count
        );
    }

}
