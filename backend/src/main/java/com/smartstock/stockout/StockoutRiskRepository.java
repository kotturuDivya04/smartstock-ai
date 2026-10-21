package com.smartstock.stockout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockoutRiskRepository extends JpaRepository<StockoutRisk, Long> {
    List<StockoutRisk> findByProductId(Long productId);
}
