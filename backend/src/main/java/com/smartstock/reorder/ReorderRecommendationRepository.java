package com.smartstock.reorder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReorderRecommendationRepository extends JpaRepository<ReorderRecommendation, Long> {
    List<ReorderRecommendation> findByProductId(Long productId);
    List<ReorderRecommendation> findByStatus(String status);
    List<ReorderRecommendation> findByStatusAndCreatedAtBefore(String status, java.time.LocalDateTime cutoff);
}
