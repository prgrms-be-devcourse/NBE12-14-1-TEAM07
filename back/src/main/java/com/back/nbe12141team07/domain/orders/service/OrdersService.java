package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.controller.OrdersController;
import com.back.nbe12141team07.domain.orders.dto.OrdersDetailRequest;
import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.service.ProductService;
import com.back.nbe12141team07.domain.users.entity.Users;
import com.back.nbe12141team07.global.exception.OrdersDetailNotFoundException;
import com.back.nbe12141team07.global.exception.OrdersNotFoundException;
import com.back.nbe12141team07.domain.users.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final ProductService productService;
    private final UsersRepository usersRepository;

    private static final LocalTime CUTOFF = LocalTime.of(14, 0);

    private static final int CUTOFF_HOUR = 14; // 14시 기준점

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

    public List<Orders> getUserOrders(String email) {
        LocalDate deliveryDate = resolveDeliveryDate(LocalDateTime.now());
        return ordersRepository.findByUsersEmailAndCreateDateGreaterThanEqualAndCreateDateLessThan(email, startOf(deliveryDate), endOf(deliveryDate));
    }

    public List<Orders> getUsersOrders(LocalDate deliveryDate) {
        return ordersRepository.findByCreateDateGreaterThanEqualAndCreateDateLessThan(
                startOf(deliveryDate), endOf(deliveryDate));
    }

    @org.springframework.transaction.annotation.Transactional
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

    public Orders createOrders(String email, List<OrdersDetailRequest> ordersDetails) {

        // 이메일과 권한("users")을 넣어 users 생성
        Users users = usersRepository.save(
                new Users(email, "users"));

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

        OrdersDetail detail = order.getOrdersDetails()
                .stream()
                .filter(d -> d.getId() == detailId)
                .findFirst()
                .orElseThrow(() -> new OrdersDetailNotFoundException(orderId, detailId));

        order.removeOrderDetail(detail);
    }

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

    public int completeOrders(LocalDate date) {
        LocalDateTime start = date.minusDays(1).atTime(CUTOFF_HOUR, 0); // 전날 14:00:00
        LocalDateTime end = date.atTime(CUTOFF_HOUR, 0); // 당일 14:00:00

        List<Orders> orders = ordersRepository
                .findByCreateDateGreaterThanEqualAndCreateDateLessThan(start, end);

        orders.forEach(Orders::complete);

        return orders.size();
    }
}
