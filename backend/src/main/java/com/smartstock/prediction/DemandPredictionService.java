package com.smartstock.prediction;

import com.smartstock.product.Product;
import com.smartstock.product.ProductService;
import com.smartstock.sales.SaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for predicting product demand.
 * Prepared for Tribuo Java ML regression integration.
 */
@Service
public class DemandPredictionService {

    private static final Logger log = LoggerFactory.getLogger(DemandPredictionService.class);

    private final DemandPredictionRepository predictionRepository;
    private final ProductService productService;
    private final SaleRepository saleRepository;
    private final TribuoDemandPredictor tribuoDemandPredictor;

    public DemandPredictionService(
            DemandPredictionRepository predictionRepository,
            ProductService productService,
            SaleRepository saleRepository,
            TribuoDemandPredictor tribuoDemandPredictor
    ) {
        this.predictionRepository = predictionRepository;
        this.productService = productService;
        this.saleRepository = saleRepository;
        this.tribuoDemandPredictor = tribuoDemandPredictor;
    }

    @Transactional(readOnly = true)
    public List<PredictionResponse> getPredictionsByProduct(Long productId) {
        return predictionRepository.findByProductIdOrderByPredictionDateDesc(productId).stream()
                .map(PredictionResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<PredictionResponse> getLatestPrediction(Long productId) {
        return predictionRepository.findFirstByProductIdOrderByPredictionDateDesc(productId)
                .map(PredictionResponse::fromEntity);
    }

    @Transactional
    public PredictionResponse generatePrediction(Long productId, Integer forecastDays) {
        int days = (forecastDays != null && forecastDays > 0) ? forecastDays : 7;
        Product product = productService.getProductEntityById(productId);

        // Clear legacy demo predictions if needed
        predictionRepository.deleteAll(predictionRepository.findByProductIdOrderByPredictionDateDesc(productId));

        // Use Tribuo ML for prediction
        double predictedDemand = tribuoDemandPredictor.predictNext7DaysDemand(product);
        if (days != 7) {
            predictedDemand = (predictedDemand / 7.0) * days;
        }
        
        predictedDemand = Math.round(predictedDemand * 100.0) / 100.0;

        DemandPrediction prediction = new DemandPrediction(
                product,
                LocalDateTime.now(),
                days,
                predictedDemand,
                "Tribuo-CART-v1.0"
        );

        return PredictionResponse.fromEntity(predictionRepository.save(prediction));
    }

    /**
     * Extension hook for Tribuo ML Regression model training.
     * When Tribuo models are trained on historical sales features (lags, day of week, seasonality),
     * this method will consume the Tribuo Trainer and Dataset.
     */
    public void trainTribuoModel(Long productId) {
        log.info("Tribuo ML training hook prepared for productId: {}. Ready for Tribuo Regression Trainer.", productId);
    }
}
