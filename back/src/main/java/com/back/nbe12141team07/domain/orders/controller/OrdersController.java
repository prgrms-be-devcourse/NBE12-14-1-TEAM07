package com.back.nbe12141team07.domain.orders.controller;

import com.back.nbe12141team07.domain.orders.dto.*;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.service.OrdersService;
import com.back.nbe12141team07.global.exception.BusinessException;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    @Value("${admin.email}")
    private String adminEmail;

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

    // 사용자 주문 다건 조회 -> email 기준 + 같은 날짜 기준
    // /{email}로 받았다가 단건 조회랑 Spring의 경로 충돌 문제로 /me로 변환 후
    // email을 RequestParam 조건으로 변경 (URL 방식 -> 쿼리 스트링 방식)
    @GetMapping("/me")
    public RsData<List<UserOrdersDto>> getUserOrderList(
            @RequestParam String email
    ) {
        List<Orders> orders = ordersService.getUserOrders(email);
        return new RsData<> (
                "200-1",
                "사용자 권한으로 주문이 다건 조회되었습니다",
                orders.stream()
                        .map(UserOrdersDto::new)
                        .toList() // List<Orders> -> List<OrdersDto>로 변환
        );
    }

    // 관리자 주문 다건 조회 -> 배송일 기준
    @GetMapping
    public RsData<List<OrdersDto>> getUsersOrderList(
            // 관리자 이메일 검증을 위해 email 필요, deliveryDate 기준으로 조회
            @RequestParam String email,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate deliveryDate
    ) {
        // 권한 예외처리
        if (!adminEmail.equalsIgnoreCase(email)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "권한이 없습니다");
        }

        // null 예외처리(null이면 LocalDateTime.now()로)
        LocalDate target = (deliveryDate != null)
                ? deliveryDate
                : ordersService.resolveDeliveryDate(LocalDateTime.now());

        List<Orders> orders = ordersService.getUsersOrders(target);

        return new RsData<>(
                "200-1",
                "관리자 권한으로 주문이 다건 조회되었습니다",
                orders.stream().map(OrdersDto::new).toList()
        );
    }

    @PatchMapping("/{orderId}")
    public RsData<List<OrdersDetailDto>> modifyOrder(
            @PathVariable int orderId,
            @RequestBody OrderModifyRequest modifyReqBody
            ) {
        List<OrdersDetail> orderDetail = ordersService.modifyOrders(orderId, modifyReqBody);

        List<OrdersDetailDto> ordersDetailDtoList = orderDetail.stream()
                .map(d -> new OrdersDetailDto(d))
                .toList();

        return new RsData<>(
                "200-1",
                "주문이 수정되었습니다",
                ordersDetailDtoList
        );
    }

    // DELETE /api/orders/{id} : 주문 삭제
    @DeleteMapping("/{id}")
    @Transactional
    public RsData<Void> delete(@PathVariable int id) {
        ordersService.deleteOrders(id);
        return new RsData<>(
                "200-1",
                "%d번 주문이 삭제되었습니다.".formatted(id)
        );
    }

    @PostMapping("/{date}/complete")
    @Transactional
    public RsData<Integer> complete(
            // 문자열 자동으로 LocalDtae객체로 변환해서 파라미터 넣기.
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        int count = ordersService.completeOrders(date);
        return new RsData<>(
                "200-1",
                "%d건의 주문이 처리 완료되었습니다.".formatted(count),
                count
        );
    }
}
