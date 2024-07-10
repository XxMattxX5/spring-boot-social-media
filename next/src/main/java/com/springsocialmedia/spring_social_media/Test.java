package com.springsocialmedia.spring_social_media;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {
    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
