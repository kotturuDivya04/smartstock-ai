package com.smartstock.supplier;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier-orders")
public class SupplierOrderController {

    private final SupplierOrderService supplierOrderService;

    public SupplierOrderController(SupplierOrderService supplierOrderService) {
        this.supplierOrderService = supplierOrderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<SupplierOrderResponse>> getAllOrders() {
        return ResponseEntity.ok(supplierOrderService.getAllOrders());
    }

    /** Supplier: get my own orders via JWT principal email */
    @GetMapping("/my")
    @PreAuthorize("hasRole('SUPPLIER')")
    public ResponseEntity<List<SupplierOrderResponse>> getMyOrders(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(supplierOrderService.getOrdersByUserEmail(principal.getUsername()));
    }

    @GetMapping("/supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<SupplierOrderResponse>> getOrdersForSupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(supplierOrderService.getOrdersForSupplier(supplierId));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPLIER')")
    public ResponseEntity<SupplierOrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam SupplierOrder.OrderStatus status,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(supplierOrderService.updateOrderStatus(orderId, status, principal.getUsername()));
    }
}

