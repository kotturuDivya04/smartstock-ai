package com.smartstock.config;

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

/**
 * Ensures a demo SUPPLIER account exists for NovaTech Supplies Pvt. Ltd.
 * Runs after DataSeeder (Order=3). If the supplier exists but has no user or
 * the password is unknown, resets to a known demo password.
 */
@Component
@Order(3)
public class DemoSupplierSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoSupplierSeeder.class);
    private static final String DEMO_EMAIL = "supplier@smartstock.ai";
    private static final String DEMO_PASSWORD = "Supplier123!";

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoSupplierSeeder(SupplierRepository supplierRepository,
                              UserRepository userRepository,
                              PasswordEncoder passwordEncoder) {
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Check if demo supplier user already exists
        if (userRepository.findByEmail(DEMO_EMAIL).isPresent()) {
            log.info("[DEMO SUPPLIER] Demo supplier account already exists ({})", DEMO_EMAIL);
            return;
        }

        // Find NovaTech supplier
        Supplier novaTech = supplierRepository.findByEmail("arjun@novatechsupplies.com").orElse(null);
        if (novaTech == null) {
            // NovaTech doesn't exist yet — nothing to link
            log.info("[DEMO SUPPLIER] NovaTech supplier not found, skipping demo supplier seeding.");
            return;
        }

        // Create a SUPPLIER user and link it to NovaTech
        User supplierUser = new User(
                novaTech.getName(),
                DEMO_EMAIL,
                passwordEncoder.encode(DEMO_PASSWORD),
                Role.SUPPLIER
        );
        supplierUser = userRepository.save(supplierUser);

        // Link the user to the supplier entity (if not already linked)
        if (novaTech.getUser() == null) {
            novaTech.setUser(supplierUser);
            supplierRepository.save(novaTech);
        }

        log.info("[DEMO SUPPLIER] Created demo supplier account: {} (linked to {})",
                DEMO_EMAIL, novaTech.getName());
    }
}
