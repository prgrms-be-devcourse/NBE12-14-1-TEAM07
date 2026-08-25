package com.back.nbe12141team07.domain.product.service;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public Product createProduct(String name , int price) {

        Product product = new Product(name, price);

        return productRepository.save(product);
    }

    public Product modifyProduct(int id, String name, int price) {
        Product product = productRepository.findById(id).orElse(null);

        if(product == null) {
            return null;
        }

        product.updateProduct(name, price);

        return product;
    }
}
