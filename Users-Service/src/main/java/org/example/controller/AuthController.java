package org.example.controller;

import org.example.dto.LoginRequest;
import org.example.dto.SignupRequest;
import org.example.dto.TokenResponse;
import org.example.entity.User;
import org.example.service.AuthService;
import org.example.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User(
                null,
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_USER"
        );

        try {
            userRepository.save(user);
            return ResponseEntity.status(201).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.authenticateAndGenerateToken(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new TokenResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials: " + e.getMessage());
        }
    }
}