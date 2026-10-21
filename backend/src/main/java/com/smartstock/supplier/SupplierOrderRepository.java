package com.smartstock.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierOrderRepository extends JpaRepository<SupplierOrder, Long> {
    List<SupplierOrder> findBySupplierId(Long supplierId);
    List<SupplierOrder> findBySupplierIdAndStatus(Long supplierId, SupplierOrder.OrderStatus status);
    List<SupplierOrder> findByProductId(Long productId);
}
