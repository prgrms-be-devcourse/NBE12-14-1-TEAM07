package com.back.nbe12141team07.domain.orders.service;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.domain.users.entity.Users;
import com.back.nbe12141team07.domain.users.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrdersServiceTest {

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private UsersRepository usersRepository;

    // createDate는 @CreatedDate라 저장 시점에 now()로 덮어써지므로, 저장 후 원하는 값으로 다시 세팅한다
    private void 주문을_생성한다(LocalDateTime createDate) {
        Users users = new Users();
        ReflectionTestUtils.setField(users, "email", "test@test.com");
        ReflectionTestUtils.setField(users, "role", "users");
        usersRepository.save(users);

        Orders orders = new Orders();
        ReflectionTestUtils.setField(orders, "users", users);
        Orders saved = ordersRepository.save(orders);

        ReflectionTestUtils.setField(saved, "createDate", createDate);
        ordersRepository.save(saved);
    }

    @Test
    void 배치_시작_경계값_직전_주문은_해당_배치에_포함되지_않는다() {
        주문을_생성한다(LocalDateTime.of(2026, 7, 11, 13, 59, 59));

        int count = ordersService.completeOrders(LocalDate.of(2026, 7, 12));

        assertThat(count).isEqualTo(0);
    }

    @Test
    void 배치_시작_경계값_주문은_포함된다() {
        주문을_생성한다(LocalDateTime.of(2026, 7, 11, 14, 0, 0));

        int count = ordersService.completeOrders(LocalDate.of(2026, 7, 12));

        assertThat(count).isEqualTo(1);
    }

    @Test
    void 배치_종료_경계값_직전_주문까지_포함된다() {
        주문을_생성한다(LocalDateTime.of(2026, 7, 12, 13, 59, 59));

        int count = ordersService.completeOrders(LocalDate.of(2026, 7, 12));

        assertThat(count).isEqualTo(1);
    }

    @Test
    void 배치_종료_경계값_주문은_포함되지_않는다() {
        주문을_생성한다(LocalDateTime.of(2026, 7, 12, 14, 0, 0));

        int count = ordersService.completeOrders(LocalDate.of(2026, 7, 12));

        assertThat(count).isEqualTo(0);
    }
}
