package com.smartstock.prediction;

import com.smartstock.product.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/predictions")
public class DemandPredictionController {

    private final DemandPredictionService predictionService;
    private final ProductRepository productRepository;

    public DemandPredictionController(DemandPredictionService predictionService, ProductRepository productRepository) {
        this.predictionService = predictionService;
        this.productRepository = productRepository;
    }

    @PostMapping("/generate-all")
    public ResponseEntity<List<PredictionResponse>> generateAllPredictions() {
        List<PredictionResponse> results = productRepository.findAll().stream()
                .map(p -> predictionService.generatePrediction(p.getId(), 7))
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PredictionResponse>> getPredictionsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(predictionService.getPredictionsByProduct(productId));
    }

    @GetMapping("/product/{productId}/latest")
    public ResponseEntity<PredictionResponse> getLatestPrediction(@PathVariable Long productId) {
        return predictionService.getLatestPrediction(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate/{productId}")
    public ResponseEntity<PredictionResponse> generatePrediction(
            @PathVariable Long productId,
            @RequestParam(required = false, defaultValue = "7") Integer forecastDays
    ) {
        return ResponseEntity.ok(predictionService.generatePrediction(productId, forecastDays));
    }
}
