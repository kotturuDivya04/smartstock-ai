package com.smartstock.sales;

import com.smartstock.inventory.InventoryService;
import com.smartstock.inventory.StockAdjustmentRequest;
import com.smartstock.product.Product;
import com.smartstock.product.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductService productService;
    private final InventoryService inventoryService;

    public SaleService(SaleRepository saleRepository, ProductService productService, InventoryService inventoryService) {
        this.saleRepository = saleRepository;
        this.productService = productService;
        this.inventoryService = inventoryService;
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getAllSales() {
        return saleRepository.findAll().stream()
                .map(SaleResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesByProduct(Long productId) {
        return saleRepository.findByProductId(productId).stream()
                .map(SaleResponse::fromEntity)
                .toList();
    }

    @Transactional
    public SaleResponse recordSale(SaleRequest request) {
        Product product = productService.getProductEntityById(request.getProductId());

        BigDecimal unitPrice = request.getUnitPrice() != null ? request.getUnitPrice() : product.getUnitPrice();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        // Deduct inventory
        StockAdjustmentRequest stockRequest = new StockAdjustmentRequest();
        stockRequest.setProductId(product.getId());
        stockRequest.setQuantityDelta(-request.getQuantity());
        stockRequest.setReason("Sale recorded");
        inventoryService.adjustStock(stockRequest);

        Sale sale = new Sale(
                product,
                request.getQuantity(),
                unitPrice,
                totalAmount,
                request.getSaleDate() != null ? request.getSaleDate() : LocalDateTime.now(),
                request.getCustomerReference()
        );

        return SaleResponse.fromEntity(saleRepository.save(sale));
    }
}
