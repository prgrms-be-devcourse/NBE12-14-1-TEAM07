package com.back.nbe12141team07;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Nbe12141Team07Application {

    public static void main(String[] args) {
        SpringApplication.run(Nbe12141Team07Application.class, args);
    }

}
