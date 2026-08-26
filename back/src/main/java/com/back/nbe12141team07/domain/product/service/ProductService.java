package com.back.nbe12141team07.domain.product.service;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import com.back.nbe12141team07.global.exception.InvalidProductNameException;
import com.back.nbe12141team07.global.exception.InvalidProductPriceException;
import com.back.nbe12141team07.global.exception.ProductNotFoundException;
import jakarta.transaction.Transactional;
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

    @Transactional
    public Product modifyProduct(int id, String name, int price) {

        //0원 이상만 허용
        if(price < 0) {
            throw new InvalidProductPriceException();
        }

        //이름이 정상적이지 않을 경우 에외처리
        if (name == null || name.isBlank() || name.length() < 1 || name.length() > 50) {
            throw new InvalidProductNameException();
        }

        //product 객체 찾아서 가격과 이름 update
        Product product = findById(id);
        product.updateProduct(name, price);

        return product;
    }

    // 커스텀 Exception 사용
    public Product findById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
