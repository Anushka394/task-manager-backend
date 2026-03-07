package com.anushka.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.anushka.taskmanager.dto.LoginRequest;
import com.anushka.taskmanager.dto.RegisterRequest;
import com.anushka.taskmanager.model.User;
import com.anushka.taskmanager.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    private final BCryptPasswordEncoder legacyBcrypt = new BCryptPasswordEncoder();

    public User register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        
        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!isPasswordValid(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    private boolean isPasswordValid(String rawPassword, String storedPassword) {
        if (storedPassword == null || storedPassword.isBlank()) {
            return false;
        }

        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return legacyBcrypt.matches(rawPassword, storedPassword);
        }

        return passwordEncoder.matches(rawPassword, storedPassword);
    }
}
