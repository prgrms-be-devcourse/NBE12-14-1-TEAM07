package com.back.nbe12141team07.global.springDoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Grids&Circles Server", version = "beta", description = "Grids&Circles API 문서입니다."))
public class SpringDoc {

    @Bean
    public GroupedOpenApi groupApiAll() {
        return GroupedOpenApi.builder()
                .group("api-all")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public GroupedOpenApi groupOrders() {
        return GroupedOpenApi.builder()
                .group("orders")
                .pathsToMatch("/api/orders/**")
                .build();
    }

    @Bean
    public GroupedOpenApi groupProducts() {
        return GroupedOpenApi.builder()
                .group("products")
                .pathsToMatch("/api/products/**")
                .build();
    }
}