package com.smartstock.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        if (request.getRole() == Role.SUPPLIER) {
            throw new IllegalArgumentException("Suppliers must register via the supplier registration portal");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );

        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, String name, String roleStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        if (name != null && !name.isBlank()) {
            user.setName(name.trim());
        }
        if (roleStr != null && !roleStr.isBlank()) {
            Role newRole = Role.valueOf(roleStr.toUpperCase());
            // Protect existing SUPPLIER accounts from having their role changed here
            if (user.getRole() == Role.SUPPLIER && newRole != Role.SUPPLIER) {
                throw new IllegalArgumentException("Supplier accounts must be managed through the supplier portal");
            }
            // SUPPLIER role can't be assigned to non-supplier accounts via the admin user panel
            if (newRole == Role.SUPPLIER && user.getRole() != Role.SUPPLIER) {
                throw new IllegalArgumentException("Use the supplier registration portal to create supplier accounts");
            }
            user.setRole(newRole);
        }
        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        user.setEnabled(!user.isEnabled());
        return UserResponse.fromEntity(userRepository.save(user));
    }
}
