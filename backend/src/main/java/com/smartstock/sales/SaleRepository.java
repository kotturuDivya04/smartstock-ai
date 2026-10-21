package com.smartstock.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByProductId(Long productId);

    List<Sale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Sale> findByProductIdAndSaleDateBetween(Long productId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sale s WHERE s.product.id = :productId AND s.saleDate >= :since")
    Integer sumQuantityByProductSince(@Param("productId") Long productId, @Param("since") LocalDateTime since);
}
