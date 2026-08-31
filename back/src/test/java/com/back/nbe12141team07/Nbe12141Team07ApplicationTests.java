package com.back.nbe12141team07;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class Nbe12141Team07ApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void 상품_등록() throws Exception {

        String requestBody = """
                {
                    "name": "아이폰 17",
                    "price": 1000000
                }
                """;

        mockMvc.perform(
                post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        ).andExpect(
                status().isOk()
        );
    }
}