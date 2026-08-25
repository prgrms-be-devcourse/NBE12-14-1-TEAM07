package com.back.nbe12141team07.domain.product.controller;

import com.back.nbe12141team07.domain.product.dto.ProductDto;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.service.ProductService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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

    record productModifyReqBody(
            @NotBlank(message = "원두 이름을 입력해주세요.")
            @Size(min = 2, max = 50)
            String name,

            @NotBlank(message = "가겨을 입력해주세요.")
            @Positive(message = "가격은 0보다 커야 합니다.")
            int price
    ) {
    }

    @PatchMapping("{id}")
    @Transactional
    public ResponseEntity<?> modifyProduct(
        @PathVariable int id,
        @RequestBody @Valid productModifyReqBody modifyBody
    ) {
        Product product = productService.modifyProduct(id, modifyBody.name, modifyBody.price);

        if(product == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ProductDto(product));
    }

}
