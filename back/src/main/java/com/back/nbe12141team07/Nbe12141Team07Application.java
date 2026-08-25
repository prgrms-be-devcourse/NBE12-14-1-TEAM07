package com.back.nbe12141team07;

import com.back.nbe12141team07.domain.orders.entity.Orders;
import com.back.nbe12141team07.domain.orders.entity.OrdersDetail;
import com.back.nbe12141team07.domain.orders.repository.OrdersRepository;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import com.back.nbe12141team07.domain.users.entity.Users;
import com.back.nbe12141team07.domain.users.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Nbe12141Team07Application {

    public static void main(String[] args) {
        SpringApplication.run(Nbe12141Team07Application.class, args);
    }

    @Bean
    CommandLineRunner initData(
            UsersRepository usersRepository,
            ProductRepository productRepository,
            OrdersRepository ordersRepository
    ) {
        return args -> {
            Users user = new Users("test@test.com", "USER");
            usersRepository.save(user);

            Product product = new Product("테스트 원두", 5000);
            productRepository.save(product);

            Orders order = new Orders(user);

            OrdersDetail detail = new OrdersDetail(
                    order,
                    product,
                    2,
                    5000
            );

            order.addOrderDetail(detail);

            ordersRepository.save(order);
        };
    }

}
