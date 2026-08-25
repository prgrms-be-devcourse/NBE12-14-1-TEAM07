package com.back.nbe12141team07.domain.product.service;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import com.back.nbe12141team07.global.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public Product createProduct(String name , int price) {

        Product product = new Product(name, price);

        return productRepository.save(product);
    }

    // 커스텀 Exception 사용
    public Product findById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // 상품 삭제
    public void deleteProduct(int id) {
        // 상품이 존재하는지 확인
        Product product = findById(id);

        productRepository.delete(product);
    }
}