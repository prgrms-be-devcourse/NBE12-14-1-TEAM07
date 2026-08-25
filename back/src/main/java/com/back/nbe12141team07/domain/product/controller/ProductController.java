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


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    record ProductSaveReqBody(
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


    // DELETE /api/products/{id} - 상품 삭제
    @DeleteMapping("/{id}")
    @Transactional
// 반환할 데이터가 없으므로 Void로 지정
    public RsData<Void> delete(@PathVariable int id) {
        productService.deleteProduct(id);

        // RsData의 2개짜리 생성자를 사용하면 데이터는 null로
        return new RsData<>(
                "200-1",
                "%d번 상품이 삭제되었습니다".formatted(id)
        );
    }
}