package com.smartstock.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "SmartStock AI Backend",
                "timestamp", LocalDateTime.now(),
                "system", "Intelligent Inventory & Demand Management System"
        ));
    }
}
