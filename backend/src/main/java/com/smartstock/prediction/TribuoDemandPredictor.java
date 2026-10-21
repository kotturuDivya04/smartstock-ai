package com.smartstock.prediction;

import com.smartstock.product.Product;
import com.smartstock.sales.Sale;
import com.smartstock.sales.SaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.tribuo.Dataset;
import org.tribuo.MutableDataset;
import org.tribuo.Prediction;
import org.tribuo.Trainer;
import org.tribuo.impl.ArrayExample;
import org.tribuo.provenance.SimpleDataSourceProvenance;
import org.tribuo.regression.RegressionFactory;
import org.tribuo.regression.Regressor;
import org.tribuo.regression.rtree.CARTRegressionTrainer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TribuoDemandPredictor {

    private static final Logger log = LoggerFactory.getLogger(TribuoDemandPredictor.class);
    private final SaleRepository saleRepository;

    public TribuoDemandPredictor(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public double predictNext7DaysDemand(Product product) {
        log.info("Training Tribuo CART Regression model for product: {}", product.getName());

        LocalDateTime nowTime = LocalDateTime.now();
        LocalDate today = nowTime.toLocalDate();
        LocalDate ninetyDaysAgo = today.minusDays(90);

        List<Sale> sales = saleRepository.findByProductIdAndSaleDateBetween(product.getId(), ninetyDaysAgo.atStartOfDay(), nowTime);

        // Aggregate daily sales continuously over 90 days
        Map<LocalDate, Integer> dailySales = sales.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getSaleDate().toLocalDate(),
                        Collectors.summingInt(Sale::getQuantity)
                ));

        RegressionFactory factory = new RegressionFactory();
        MutableDataset<Regressor> dataset = new MutableDataset<>(new SimpleDataSourceProvenance("sales-data", factory), factory);

        // Generate features (day 0 is 90 days ago)
        int totalDays = 90;
        for (int i = 14; i <= totalDays - 7; i++) {
            LocalDate currentDay = ninetyDaysAgo.plusDays(i);
            
            double sum3 = 0, sum7 = 0, sum14 = 0;
            for (int j = 1; j <= 14; j++) {
                LocalDate pastDay = currentDay.minusDays(j);
                int qty = dailySales.getOrDefault(pastDay, 0);
                if (j <= 3) sum3 += qty;
                if (j <= 7) sum7 += qty;
                sum14 += qty;
            }
            
            double avg3 = sum3 / 3.0;
            double avg7 = sum7 / 7.0;
            double avg14 = sum14 / 14.0;
            
            // Target: next 7 days sum
            double target7Days = 0;
            for (int k = 0; k < 7; k++) {
                LocalDate futureDay = currentDay.plusDays(k);
                target7Days += dailySales.getOrDefault(futureDay, 0);
            }

            ArrayExample<Regressor> example = new ArrayExample<>(new Regressor("DIM-0", target7Days));
            example.add("avg3", avg3);
            example.add("avg7", avg7);
            example.add("avg14", avg14);
            example.add("dayOfWeek", currentDay.getDayOfWeek().getValue());
            dataset.add(example);
        }

        if (dataset.size() < 5) {
             log.warn("Not enough continuous historical data for product {}. Falling back to basic average.", product.getId());
             return fallbackPrediction(sales);
        }

        Trainer<Regressor> trainer = new CARTRegressionTrainer(6); // max depth 6
        org.tribuo.Model<Regressor> model = trainer.train(dataset);

        // Predict for today
        double sum3 = 0, sum7 = 0, sum14 = 0;
        for (int j = 1; j <= 14; j++) {
            LocalDate pastDay = today.minusDays(j);
            int qty = dailySales.getOrDefault(pastDay, 0);
            if (j <= 3) sum3 += qty;
            if (j <= 7) sum7 += qty;
            sum14 += qty;
        }
        
        ArrayExample<Regressor> inferenceExample = new ArrayExample<>(new Regressor("DIM-0", Double.NaN));
        inferenceExample.add("avg3", sum3 / 3.0);
        inferenceExample.add("avg7", sum7 / 7.0);
        inferenceExample.add("avg14", sum14 / 14.0);
        inferenceExample.add("dayOfWeek", today.getDayOfWeek().getValue());

        Prediction<Regressor> prediction = model.predict(inferenceExample);
        double predictedValue = prediction.getOutput().getValues()[0];

        return Math.max(0, predictedValue);
    }

    private double fallbackPrediction(List<Sale> sales) {
        if (sales.isEmpty()) return 0;
        double sum = sales.stream().mapToInt(Sale::getQuantity).sum();
        
        // Find the range of days
        LocalDate minDate = sales.stream().map(s -> s.getSaleDate().toLocalDate()).min(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate maxDate = sales.stream().map(s -> s.getSaleDate().toLocalDate()).max(LocalDate::compareTo).orElse(LocalDate.now());
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(minDate, maxDate) + 1;
        if (daysBetween < 1) daysBetween = 1;

        double dailyAvg = sum / daysBetween;
        return dailyAvg * 7;
    }
}
