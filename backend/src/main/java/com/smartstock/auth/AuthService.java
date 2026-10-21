package com.smartstock.auth;

import com.smartstock.user.Role;
import com.smartstock.user.User;
import com.smartstock.user.UserRepository;
import com.smartstock.user.UserResponse;
import com.smartstock.supplier.Supplier;
import com.smartstock.supplier.SupplierRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SupplierRepository supplierRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            SupplierRepository supplierRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.supplierRepository = supplierRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.STAFF;
        String userName = request.getName() != null ? request.getName() : "User";

        User user = new User(
                userName,
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);

        return new AuthResponse(jwtToken, UserResponse.fromEntity(savedUser));
    }

    @Transactional
    public SupplierRegisterResponse registerSupplier(SupplierRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        // 1. Create the User with role SUPPLIER
        User user = new User(
                request.getCompanyName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.SUPPLIER
        );
        User savedUser = userRepository.save(user);

        Supplier supplier = new Supplier();
        supplier.setName(request.getCompanyName());
        supplier.setContactPerson(request.getContactPerson());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress("N/A");
        supplier.setLeadTimeDays(7);
        supplier.setAssociationStatus("REGISTERED");
        supplier.setUser(savedUser);
        
        Supplier savedSupplier = supplierRepository.save(supplier);
        
        return new SupplierRegisterResponse("Supplier registration successful. Your supplier profile has been created. The company must associate your supplier account before you can receive orders.", savedSupplier.getId(), savedSupplier.getName(), savedSupplier.getAssociationStatus());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, UserResponse.fromEntity(user));
    }
}
