package com.ggnetworks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GgnetworksBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GgnetworksBackendApplication.class, args);
    }
}