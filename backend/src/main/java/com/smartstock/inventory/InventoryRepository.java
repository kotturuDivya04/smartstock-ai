package com.smartstock.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.product.minimumStock")
    List<Inventory> findLowStockInventories();
}
