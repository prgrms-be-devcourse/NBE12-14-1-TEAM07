package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.dto.OrderDetailModifyRequest;
import com.back.nbe12141team07.domain.orders.dto.OrderModifyRequest;
import com.back.nbe12141team07.domain.orders.dto.OrdersDetailRequest;
import com.back.nbe12141team07.domain.orders.entity.OrderDetailStatus;
import com.back.nbe12141team07.domain.orders.entity.OrderStatus;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import com.back.nbe12141team07.domain.product.service.ProductService;
import com.back.nbe12141team07.domain.users.entity.Users;
import com.back.nbe12141team07.domain.users.repository.UsersRepository;
import com.back.nbe12141team07.global.exception.OrdersDetailNotFoundException;
import com.back.nbe12141team07.global.exception.OrdersNotFoundException;
import com.back.nbe12141team07.global.exception.ProductNotFoundException;
import com.back.nbe12141team07.global.exception.*;
import com.back.nbe12141team07.domain.users.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static com.back.nbe12141team07.domain.orders.entity.OrderStatus.CANCELED;
import static com.back.nbe12141team07.domain.orders.entity.OrderStatus.COMPLETED;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final ProductService productService;
    private final UsersRepository usersRepository;

    private static final LocalTime CUTOFF = LocalTime.of(14, 0);

    private static final int CUTOFF_HOUR = 14; // 14시 기준점
    private final ProductRepository productRepository;

    public LocalDate resolveDeliveryDate(LocalDateTime base) {
        LocalDate date = base.toLocalDate();
        return base.toLocalTime().isBefore(CUTOFF) ? date : date.plusDays(1);
    }

    private LocalDateTime startOf(LocalDate deliveryDate) {
        return deliveryDate.minusDays(1).atTime(CUTOFF);
    }

    private LocalDateTime endOf(LocalDate deliveryDate) {
        return deliveryDate.atTime(CUTOFF);
    }

    public List<Orders> getMyOrders(String email, LocalDate deliveryDate) {
        return ordersRepository.findByUsersEmailAndCreateDateGreaterThanEqualAndCreateDateLessThan(
                email, startOf(deliveryDate), endOf(deliveryDate));
    }

    public List<Orders> searchOrders(LocalDate deliveryDate) {
        return ordersRepository.findByCreateDateGreaterThanEqualAndCreateDateLessThan(
                startOf(deliveryDate), endOf(deliveryDate));
    }

    @Transactional
    public List<OrdersDetail> modifyOrders(int orderId, OrderModifyRequest reqbody) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new OrdersNotFoundException(orderId));

        if (order.getStatus() == COMPLETED) {
            throw new InvalidOrderStatusException();
        }

        for(OrderDetailModifyRequest request : reqbody.details()) {
            OrdersDetail detail = order.getOrdersDetails()
                    .stream()
                    .filter(d -> d.getId() == request.detailId())
                    .findFirst()
                    .orElseThrow(() -> new OrdersDetailNotFoundException(orderId, request.detailId()));

            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new ProductNotFoundException(request.productId()));

            detail.updateOrder(product, request.quantity());
        }

        return order.getOrdersDetails();

    }

    public Orders createOrders(String email, List<OrdersDetailRequest> ordersDetails) {

        // 이메일과 권한("users")을 넣어 users 생성
        Users users = usersRepository.findByEmail(email)
                .orElseGet(() -> usersRepository.save(
                        new Users(email, "users")
                ));

        // 생성한 users로 Orders 생성
        Orders orders = new Orders(users);

        // Request의 Orderdetails 순회
        for (OrdersDetailRequest detailRequest : ordersDetails) {

            // 상품 꺼내기
            Product product = productService.findById(
                    detailRequest.productId()
            );

            // totalPrice = 상품가격 * 수량
            int totalPrice = product.getPrice() * detailRequest.quantity();

            // ordersDetail 생성
            OrdersDetail ordersDetail = new OrdersDetail(
                    orders,
                    product,
                    detailRequest.quantity(),
                    totalPrice
            );

            // orders의 List<OrdersDetail>에 add
            orders.addOrderDetail(ordersDetail);
        }

        return ordersRepository.save(orders);
    }

    @Transactional
    public void cancelOrderDetail(int orderId, int detailId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new OrdersNotFoundException(orderId));

        if (order.getStatus() == COMPLETED) {
            throw new InvalidOrderStatusException();
        }

        OrdersDetail detail = order.getOrdersDetails()
                .stream()
                .filter(d -> d.getId() == detailId)
                .findFirst()
                .orElseThrow(() -> new OrdersDetailNotFoundException(orderId, detailId));

        detail.cancel();
    }

    public Orders findById(int id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new OrdersNotFoundException(id));
    }

    // 주문 취소 (하드 삭제 대신 status를 CANCELED로 변경 - 상세 항목도 함께 취소 처리)
    @Transactional
    public void deleteOrders(int id) {
        Orders orders = findById(id);
        orders.cancel();
        orders.getOrdersDetails().forEach(OrdersDetail::cancel);

        if (orders.getStatus() == COMPLETED) {
            throw new InvalidOrderStatusException();
        }


        ordersRepository.delete(orders);
    }

    public int completeOrders(LocalDate date) {
        LocalDateTime start = date.minusDays(1).atTime(CUTOFF_HOUR, 0); // 전날 14:00:00
        LocalDateTime end = date.atTime(CUTOFF_HOUR, 0); // 당일 14:00:00

        List<Orders> orders = ordersRepository
                .findByCreateDateGreaterThanEqualAndCreateDateLessThanAndStatus(start, end, OrderStatus.ORDERED);


        orders.forEach(order -> {
            order.complete();
            order.getOrdersDetails().forEach(detail -> {
                if(detail.getStatus() != OrderDetailStatus.CANCELED) {
                    detail.complete();
                }
            });
        });

        return orders.size();
    }
}
