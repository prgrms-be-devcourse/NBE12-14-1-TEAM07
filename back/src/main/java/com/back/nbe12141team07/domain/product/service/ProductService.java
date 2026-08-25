package com.back.nbe12141team07.domain.product.service;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public Product createProduct(String name , int price) {

        Product product = new Product(name, price);

        return productRepository.save(product);
    }

    public List<Product> findAll() {
        return productRepository.findAllByOrderByCreateDateDesc();
    }

    public Optional<Product> findById(int id) {

        return productRepository.findById(id);
    }
}
