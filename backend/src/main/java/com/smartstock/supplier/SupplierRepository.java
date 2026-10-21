package com.smartstock.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByEmail(String email);
    Optional<Supplier> findByUserId(Long userId);
    List<Supplier> findByAssociationStatus(String associationStatus);
}
