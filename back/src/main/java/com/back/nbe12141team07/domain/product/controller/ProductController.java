package com.back.nbe12141team07.domain.product.controller;

import com.back.nbe12141team07.domain.product.dto.ProductDto;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.service.ProductService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    record ProductSaveReqBody (
        @NotBlank(message = "제목을 입력해주세요.")
        String name,
        int price
    ) {
    }

    @PostMapping
    @Transactional
    public RsData<ProductDto> save(@Valid @RequestBody ProductSaveReqBody reqBody) {
        Product product = productService.createProduct(reqBody.name, reqBody.price);

        return new RsData<>(
                "201-1",
                "%d번 글이 성공적으로 등록되었습니다".formatted(product.getId()),
                new ProductDto(product)
        );
    }

    @GetMapping
    @Transactional
    public List<ProductDto> list() {
        List<Product> productList = productService.findAll();

        List<ProductDto> productDtoList = productList.stream()
                .map(ProductDto::new)
                .toList();

        return productDtoList;
    }

    @GetMapping("/{id}")
    public ProductDto detail(@PathVariable int id) {
        Product product = productService.findById(id).get();

        return new ProductDto(product);
    }

}
