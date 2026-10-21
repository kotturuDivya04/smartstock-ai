package com.smartstock.product;

import com.smartstock.supplier.Supplier;
import com.smartstock.supplier.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU already exists: " + request.getSku());
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + request.getSupplierId()));
        }

        Product product = new Product(
                request.getSku(),
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getUnitPrice(),
                request.getCostPrice(),
                request.getMinStockLevel(),
                request.getMaxStockLevel(),
                supplier
        );

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU already exists: " + request.getSku());
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + request.getSupplierId()));
        }

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setUnitPrice(request.getUnitPrice());
        product.setCostPrice(request.getCostPrice());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setMaxStockLevel(request.getMaxStockLevel());
        product.setSupplier(supplier);

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
