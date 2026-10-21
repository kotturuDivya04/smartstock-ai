package com.smartstock.prediction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DemandPredictionRepository extends JpaRepository<DemandPrediction, Long> {
    List<DemandPrediction> findByProductIdOrderByPredictionDateDesc(Long productId);

    Optional<DemandPrediction> findFirstByProductIdOrderByPredictionDateDesc(Long productId);
}
