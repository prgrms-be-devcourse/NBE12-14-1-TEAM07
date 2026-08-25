package com.back.nbe12141team07.domain.product.repository;

import com.back.nbe12141team07.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}
