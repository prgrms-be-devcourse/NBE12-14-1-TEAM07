package com.back.nbe12141team07.domain.product.repository;

import com.back.nbe12141team07.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 날짜 기준 내림차순 다건 조회
    List<Product> findAllByOrderByCreateDateDesc();
    Optional<Product> findByName(String name);
}
