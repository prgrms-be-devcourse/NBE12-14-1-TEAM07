package com.back.nbe12141team07.domain.home.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
public class HomeController {

    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public String home() throws UnknownHostException {

        InetAddress localhost = InetAddress.getLocalHost();

        return """
                <h1>Welcome to Rest1</h1>
                <p>Server IP Address: %s</p>
                <p>Server Host Name: %s</p>
                <div>
                    <a href="swagger-ui/index.html">API 문서로 이동</a>
                </div>
                """.formatted(localhost.getHostAddress(), localhost.getHostName());
    }

    @GetMapping(value="test/fetchData", produces = MediaType.TEXT_HTML_VALUE)
    public String testFetch() {

        return """
                <script>
                    console.clear();
                    
                    fetch("http://localhost:8080/api/order")
                    .then(response => response.json())
                    .then(data => console.log(data))
                    
                    fetch("http://localhost:8080/api/product")
                    .then(response => response.json())
                    .then(data => console.log(data))
                    
                </script>
                """;
    }
}