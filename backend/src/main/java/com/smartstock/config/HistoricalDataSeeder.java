package com.smartstock.config;

import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.sales.Sale;
import com.smartstock.sales.SaleItem;
import com.smartstock.sales.SaleRepository;
import com.smartstock.user.User;
import com.smartstock.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Generates 90 days of historical sales data for ML training.
 * Runs after the initial DataSeeder.
 */
@Component
@Order(2)
public class HistoricalDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(HistoricalDataSeeder.class);

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public HistoricalDataSeeder(SaleRepository saleRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        long currentSalesCount = saleRepository.count();
        if (currentSalesCount > 50) {
            log.info("[ML DATA SEEDER] Sufficient historical sales data exists ({} records). Skipping.", currentSalesCount);
            return;
        }

        log.info("[ML DATA SEEDER] Generating 90 days of historical sales data for ML training...");

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            log.warn("[ML DATA SEEDER] No products found. Skipping ML data generation.");
            return;
        }

        User staff = userRepository.findByEmail("staff@smartstock.ai").orElse(null);
        if (staff == null) {
            log.warn("[ML DATA SEEDER] Staff user not found. Skipping ML data generation.");
            return;
        }

        Random random = new Random(42); // fixed seed for reproducibility
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(90);
        
        List<Sale> allSales = new ArrayList<>();

        for (Product p : products) {
            // Assign a pattern based on product ID
            int patternType = (int) (p.getId() % 6);
            
            for (int day = 0; day < 90; day++) {
                LocalDateTime saleDate = startDate.plusDays(day);
                int dayOfWeek = saleDate.getDayOfWeek().getValue(); // 1 = Monday, 7 = Sunday
                
                int baseVolume = 10;
                double multiplier = 1.0;
                
                switch (patternType) {
                    case 0: // Stable demand
                        multiplier = 1.0 + (random.nextDouble() * 0.2 - 0.1);
                        break;
                    case 1: // Gradually increasing
                        multiplier = 0.5 + (day / 90.0) * 1.5;
                        break;
                    case 2: // Gradually decreasing
                        multiplier = 2.0 - (day / 90.0) * 1.5;
                        break;
                    case 3: // Weekend-heavy
                        multiplier = (dayOfWeek == 6 || dayOfWeek == 7) ? 2.5 : 0.5;
                        break;
                    case 4: // Occasional spikes
                        multiplier = (random.nextDouble() > 0.9) ? 4.0 : 0.8;
                        break;
                    case 5: // Low-volume demand
                        baseVolume = 2;
                        multiplier = 1.0 + (random.nextDouble() * 0.5);
                        break;
                }
                
                // Add some noise
                multiplier += (random.nextDouble() * 0.4 - 0.2);
                if (multiplier < 0) multiplier = 0;

                int dailyQuantity = (int) Math.round(baseVolume * multiplier);
                
                if (dailyQuantity > 0) {
                    BigDecimal unitPrice = p.getUnitPrice();
                    BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(dailyQuantity));
                    
                    Sale sale = new Sale(staff, total, saleDate, "HIST-" + p.getId() + "-" + day);
                    sale.setProduct(p);
                    sale.setQuantity(dailyQuantity);
                    sale.addItem(new SaleItem(sale, p, dailyQuantity, unitPrice));
                    allSales.add(sale);
                }
            }
        }

        saleRepository.saveAll(allSales);
        log.info("[ML DATA SEEDER] Successfully generated {} historical sales records.", allSales.size());
    }
}
