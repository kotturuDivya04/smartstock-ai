package com.smartstock.config;

import com.smartstock.inventory.Inventory;
import com.smartstock.inventory.InventoryRepository;
import com.smartstock.prediction.DemandPrediction;
import com.smartstock.prediction.DemandPredictionRepository;
import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import com.smartstock.reorder.ReorderRecommendation;
import com.smartstock.reorder.ReorderRecommendationRepository;
import com.smartstock.sales.Sale;
import com.smartstock.sales.SaleItem;
import com.smartstock.sales.SaleRepository;
import com.smartstock.stockout.StockoutRisk;
import com.smartstock.stockout.StockoutRiskRepository;
import com.smartstock.supplier.Supplier;
import com.smartstock.supplier.SupplierRepository;
import com.smartstock.user.Role;
import com.smartstock.user.User;
import com.smartstock.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Idempotent Development Demo Data Seeder for SmartStock AI.
 */
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final SaleRepository saleRepository;
    private final DemandPredictionRepository predictionRepository;
    private final StockoutRiskRepository stockoutRiskRepository;
    private final ReorderRecommendationRepository reorderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            SaleRepository saleRepository,
            DemandPredictionRepository predictionRepository,
            StockoutRiskRepository stockoutRiskRepository,
            ReorderRecommendationRepository reorderRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.saleRepository = saleRepository;
        this.predictionRepository = predictionRepository;
        this.stockoutRiskRepository = stockoutRiskRepository;
        this.reorderRepository = reorderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("[DEMO DATA] Data already present in database. Skipping data seeding.");
            return;
        }

        log.info("[DEMO DATA] Seeding initial development demo data...");

        // 1. Seed Users (3 Users: ADMIN, MANAGER, STAFF)
        User admin = userRepository.save(new User("System Admin", "admin@smartstock.ai", passwordEncoder.encode("Admin123!"), Role.ADMIN));
        User manager = userRepository.save(new User("Inventory Manager", "manager@smartstock.ai", passwordEncoder.encode("Manager123!"), Role.MANAGER));
        User staff = userRepository.save(new User("Floor Staff", "staff@smartstock.ai", passwordEncoder.encode("Staff123!"), Role.STAFF));
        log.info("[DEMO DATA] Seeded 3 users (ADMIN, MANAGER, STAFF)");

        // 2. Seed Suppliers (5 Suppliers)
        List<Supplier> suppliers = new ArrayList<>();
        suppliers.add(new Supplier("TechLogistics Inc", "contact@techlogistics.com", "+1-555-0192", 5, "100 Innovation Way, San Jose, CA"));
        suppliers.add(new Supplier("Global Electronics Co", "sales@globalelectronics.com", "+1-555-0144", 7, "450 Commerce Blvd, Austin, TX"));
        suppliers.add(new Supplier("Apex Components", "orders@apexcomp.com", "+1-555-0188", 3, "78 Industrial Park, Chicago, IL"));
        suppliers.add(new Supplier("Vanguard Supply Chain", "info@vanguard.com", "+1-555-0177", 10, "90 Gateway Dr, Seattle, WA"));
        suppliers.add(new Supplier("Prime Distribution", "support@primedist.com", "+1-555-0122", 4, "12 Distribution Way, Atlanta, GA"));
        suppliers = supplierRepository.saveAll(suppliers);
        log.info("[DEMO DATA] Seeded 5 suppliers");

        // 3. Seed Products (8 Products)
        List<Product> products = new ArrayList<>();
        products.add(new Product("Smart Hub Pro", "SKU-HUB-001", "Electronics", "IoT Home Automation Controller", new BigDecimal("149.99"), new BigDecimal("85.00"), 15, 200, suppliers.get(0)));
        products.add(new Product("Wireless Sensor Node", "SKU-SNS-002", "Sensors", "Multi-spectrum Temperature/Humidity Sensor", new BigDecimal("39.99"), new BigDecimal("18.50"), 25, 400, suppliers.get(2)));
        products.add(new Product("HD Industrial Gateway", "SKU-GTW-003", "Networking", "Ruggedized Enterprise Gateway", new BigDecimal("499.00"), new BigDecimal("290.00"), 5, 50, suppliers.get(1)));
        products.add(new Product("LiFePO4 Battery Pack 12V", "SKU-BAT-004", "Power", "Rechargeable Energy Storage Module", new BigDecimal("199.50"), new BigDecimal("110.00"), 10, 150, suppliers.get(3)));
        products.add(new Product("Optic Fiber Transceiver 10G", "SKU-OPT-005", "Networking", "SFP+ Optical Transceiver Module", new BigDecimal("75.00"), new BigDecimal("35.00"), 30, 500, suppliers.get(2)));
        products.add(new Product("Compact Thermal Imager", "SKU-THM-006", "Instruments", "Handheld IR Infrared Camera", new BigDecimal("349.00"), new BigDecimal("210.00"), 8, 80, suppliers.get(4)));
        products.add(new Product("Smart Power Meter", "SKU-PWR-007", "Power", "DIN Rail Energy Monitor", new BigDecimal("89.90"), new BigDecimal("45.00"), 20, 300, suppliers.get(0)));
        products.add(new Product("Bluetooth Beacon Tag", "SKU-BCN-008", "Sensors", "BLE Asset Tracking Tag", new BigDecimal("19.99"), new BigDecimal("7.20"), 50, 1000, suppliers.get(4)));
        products = productRepository.saveAll(products);
        log.info("[DEMO DATA] Seeded 8 products");

        // 4. Seed Inventory Records for all products
        int[] stocks = { 45, 12, 3, 85, 210, 6, 120, 4 }; // Product 2 & 5 low stock / stockout risk
        List<Inventory> inventories = new ArrayList<>();
        for (int i = 0; i < products.size(); i++) {
            inventories.add(new Inventory(products.get(i), stocks[i], 2, "Warehouse Bay " + (i + 1)));
        }
        inventoryRepository.saveAll(inventories);
        log.info("[DEMO DATA] Seeded inventory records for 8 products");

        // 5. Seed Sales & SaleItems
        Sale sale1 = new Sale(staff, new BigDecimal("429.97"), LocalDateTime.now().minusDays(5), "CUST-1001");
        sale1.addItem(new SaleItem(sale1, products.get(0), 2, new BigDecimal("149.99")));
        sale1.addItem(new SaleItem(sale1, products.get(1), 3, new BigDecimal("39.99")));
        saleRepository.save(sale1);

        Sale sale2 = new Sale(manager, new BigDecimal("998.00"), LocalDateTime.now().minusDays(2), "CUST-1002");
        sale2.addItem(new SaleItem(sale2, products.get(2), 2, new BigDecimal("499.00")));
        saleRepository.save(sale2);

        Sale sale3 = new Sale(staff, new BigDecimal("399.00"), LocalDateTime.now().minusDays(1), "CUST-1003");
        sale3.addItem(new SaleItem(sale3, products.get(3), 2, new BigDecimal("199.50")));
        saleRepository.save(sale3);
        log.info("[DEMO DATA] Seeded sales and sale items");

        // 6. Seed Demand Prediction Records
        // predictionRepository.save(new DemandPrediction(products.get(0), LocalDateTime.now(), 30, 48.0, "v1.0-baseline"));
        // predictionRepository.save(new DemandPrediction(products.get(2), LocalDateTime.now(), 30, 15.0, "v1.0-baseline"));
        // predictionRepository.save(new DemandPrediction(products.get(5), LocalDateTime.now(), 30, 18.0, "v1.0-baseline"));
        // log.info("[DEMO DATA] Seeded demand prediction records");

        // 7. Seed Stockout Risk Records
        // stockoutRiskRepository.save(new StockoutRisk(products.get(2), "CRITICAL", 3.2, "Urgent order required: Stock (3 units) below lead time threshold (7 days)"));
        // stockoutRiskRepository.save(new StockoutRisk(products.get(5), "HIGH", 6.0, "Reorder recommended: Stock (6 units) below minimum stock level (8 units)"));
        // stockoutRiskRepository.save(new StockoutRisk(products.get(7), "CRITICAL", 1.5, "Emergency reorder: Stock (4 units) rapidly depleting"));
        // log.info("[DEMO DATA] Seeded stockout risk records");

        // 8. Seed Reorder Recommendation Records
        // reorderRepository.save(new ReorderRecommendation(products.get(2), 47, "CRITICAL", "PENDING"));
        // reorderRepository.save(new ReorderRecommendation(products.get(5), 74, "HIGH", "PENDING"));
        // reorderRepository.save(new ReorderRecommendation(products.get(7), 996, "CRITICAL", "APPROVED"));
        // log.info("[DEMO DATA] Seeded reorder recommendation records");

        log.info("[DEMO DATA] Demo data seeding completed successfully!");
    }
}
