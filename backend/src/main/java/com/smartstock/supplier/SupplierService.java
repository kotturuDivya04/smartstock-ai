package com.smartstock.supplier;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(SupplierResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));
        return SupplierResponse.fromEntity(supplier);
    }

    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier supplier = new Supplier(
                request.getName(),
                request.getContactEmail(),
                request.getContactPhone(),
                request.getLeadTimeDays(),
                request.getAddress()
        );
        return SupplierResponse.fromEntity(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));

        supplier.setName(request.getName());
        supplier.setContactEmail(request.getContactEmail());
        supplier.setContactPhone(request.getContactPhone());
        if (request.getLeadTimeDays() != null) {
            supplier.setLeadTimeDays(request.getLeadTimeDays());
        }
        supplier.setAddress(request.getAddress());

        return SupplierResponse.fromEntity(supplierRepository.save(supplier));
    }
    
    @Transactional
    public SupplierResponse updateAssociationStatus(Long id, String status) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + id));
        supplier.setAssociationStatus(status);
        return SupplierResponse.fromEntity(supplierRepository.save(supplier));
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new IllegalArgumentException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }
}
