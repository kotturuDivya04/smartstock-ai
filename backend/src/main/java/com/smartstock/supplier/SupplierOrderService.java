package com.smartstock.supplier;

import com.smartstock.inventory.Inventory;
import com.smartstock.inventory.InventoryRepository;
import com.smartstock.product.Product;
import com.smartstock.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierOrderService {
    
    private final SupplierOrderRepository supplierOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;

    public SupplierOrderService(SupplierOrderRepository supplierOrderRepository, 
                                ProductRepository productRepository,
                                SupplierRepository supplierRepository,
                                InventoryRepository inventoryRepository) {
        this.supplierOrderRepository = supplierOrderRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public SupplierOrderResponse createOrder(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
            
        Supplier supplier = product.getSupplier();
        if (supplier == null) {
            throw new RuntimeException("Product has no associated supplier");
        }
        
        // Handle legacy database rows where associationStatus might be null
        String status = supplier.getAssociationStatus();
        if (status != null && !"ASSOCIATED".equals(status)) {
            throw new RuntimeException("Supplier is not actively associated with the company");
        }

        SupplierOrder order = new SupplierOrder();
        order.setProduct(product);
        order.setSupplier(supplier);
        order.setQuantity(quantity);
        order.setStatus(SupplierOrder.OrderStatus.PENDING);
            
        return SupplierOrderResponse.fromEntity(supplierOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<SupplierOrderResponse> getAllOrders() {
        return supplierOrderRepository.findAll().stream()
                .map(SupplierOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierOrderResponse> getOrdersForSupplier(Long supplierId) {
        return supplierOrderRepository.findBySupplierId(supplierId).stream()
                .map(SupplierOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /** Used by SUPPLIER role — finds orders for the supplier linked to the given user email */
    @Transactional(readOnly = true)
    public List<SupplierOrderResponse> getOrdersByUserEmail(String email) {
        Supplier supplier = supplierRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supplier profile not found for user: " + email));
        return supplierOrderRepository.findBySupplierId(supplier.getId()).stream()
                .map(SupplierOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierOrderResponse updateOrderStatus(Long orderId, SupplierOrder.OrderStatus newStatus, String userEmail) {
        SupplierOrder order = supplierOrderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        // Suppliers can only update their own orders
        Supplier callerSupplier = null;
        if (userEmail != null) {
            callerSupplier = supplierRepository.findByEmail(userEmail).orElse(null);
            if (callerSupplier != null && !callerSupplier.getId().equals(order.getSupplier().getId())) {
                throw new RuntimeException("Unauthorized: you can only update your own orders");
            }
        }

        // Enforce valid transitions
        SupplierOrder.OrderStatus current = order.getStatus();
        boolean valid = switch (current) {
            case PENDING -> newStatus == SupplierOrder.OrderStatus.ACCEPTED || newStatus == SupplierOrder.OrderStatus.REJECTED;
            case ACCEPTED -> newStatus == SupplierOrder.OrderStatus.PROCESSING;
            case PROCESSING -> newStatus == SupplierOrder.OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == SupplierOrder.OrderStatus.DELIVERED;
            default -> false; // REJECTED, DELIVERED are terminal
        };
        // Admins/Managers can also view/trigger any forward transition
        if (!valid && callerSupplier != null) {
            throw new RuntimeException("Invalid status transition: " + current + " -> " + newStatus);
        }

        order.setStatus(newStatus);
        SupplierOrder savedOrder = supplierOrderRepository.save(order);
        
        // If DELIVERED, update product inventory
        if (newStatus == SupplierOrder.OrderStatus.DELIVERED) {
            Inventory inventory = inventoryRepository.findByProductId(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found for product"));
            inventory.setCurrentStock(inventory.getCurrentStock() + order.getQuantity());
            inventory.setLastRestockedAt(java.time.LocalDateTime.now());
            inventoryRepository.save(inventory);
        }

        return SupplierOrderResponse.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public boolean hasActiveOrder(Long productId) {
        return supplierOrderRepository.findAll().stream()
            .anyMatch(o -> o.getProduct().getId().equals(productId) && o.getStatus() != SupplierOrder.OrderStatus.DELIVERED && o.getStatus() != SupplierOrder.OrderStatus.REJECTED);
    }

    /** Backward-compat method used by controller — delegates to secured version with null email (admin path) */
    @Transactional
    public SupplierOrderResponse updateOrderStatus(Long orderId, SupplierOrder.OrderStatus newStatus) {
        return updateOrderStatus(orderId, newStatus, null);
    }
}
