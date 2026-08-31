package com.back.nbe12141team07.domain.product.service;

import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.repository.ProductRepository;
import com.back.nbe12141team07.global.exception.InvalidProductNameException;
import com.back.nbe12141team07.global.exception.InvalidProductPriceException;
import com.back.nbe12141team07.global.exception.ProductAlreadyExistException;
import com.back.nbe12141team07.global.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public Product createProduct(String name , int price) {

        Optional<Product> op = productRepository.findByName(name);
        if(op.isPresent()) {
            throw new ProductAlreadyExistException(name);
        }

        Product product = new Product(name, price);

        return productRepository.save(product);
    }

    public Product modifyProduct(int id, String name, int price) {


        if(price < 0) {
            throw new InvalidProductPriceException();
        }

        if (name == null || name.isBlank() || name.length() < 2 || name.length() > 50) {
            throw new InvalidProductNameException();
        }

        Product product = findById(id);

        product.updateProduct(name, price);

        return product;
    }

    // 커스텀 Exception 사용
    public Product findById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
    public List<Product> findAll() {
        return productRepository.findAllByOrderByCreateDateDesc();
    }
    // 상품 삭제
    public void deleteProduct(int id) {
        // 상품이 존재하는지 확인
        Product product = findById(id);

        productRepository.delete(product);
    }
}
