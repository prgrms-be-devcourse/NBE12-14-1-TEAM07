package com.back.nbe12141team07.domain.product.controller;

import com.back.nbe12141team07.domain.product.dto.ProductDto;
import com.back.nbe12141team07.domain.product.entity.Product;
import com.back.nbe12141team07.domain.product.service.ProductService;
import com.back.nbe12141team07.global.jpa.entity.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@Tag(name = "Product API")
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
    @Operation(summary = "상품 등록")
    @Transactional
    public RsData<ProductDto> save(@Valid @RequestBody ProductSaveReqBody reqBody) {
        Product product = productService.createProduct(reqBody.name, reqBody.price);

        return new RsData<>(
                "201-1",
                "%d번 상품이 성공적으로 등록되었습니다".formatted(product.getId()),
                new ProductDto(product)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "상품 단건 조회")
    public ProductDto detail(@PathVariable int id) {
        Product product = productService.findById(id);

        return new ProductDto(product);
    }

    @GetMapping
    @Operation(summary = "상품 다건 조회")
    @Transactional
    public List<ProductDto> list() {
        List<Product> productList = productService.findAll();

        List<ProductDto> productDtoList = productList.stream()
                .map(ProductDto::new)
                .toList();

        return productDtoList;
    }

    record productModifyReqBody(
            @NotBlank(message = "원두 이름을 입력해주세요.")
            @Size(min = 2, max = 50)
            String name,

            @Positive(message = "가격은 0보다 커야 합니다.")
            int price
    ) {
    }

    @PatchMapping("{id}")
    @Operation(summary = "상품 수정")
    @Transactional
    public RsData<ProductDto> modifyProduct(
        @PathVariable int id,
        @RequestBody @Valid productModifyReqBody modifyBody
    ) {

        Product product = productService.modifyProduct(id, modifyBody.name, modifyBody.price);

        return new RsData<>(
                "200-1"
                ,"%d번 상품이 수정되었습니다",
                new ProductDto(product)
        );
    }

    // DELETE /api/products/{id} - 상품 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제")
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
