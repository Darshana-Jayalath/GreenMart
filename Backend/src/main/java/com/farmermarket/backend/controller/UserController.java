package com.farmermarket.backend.controller;

import com.farmermarket.backend.model.User;
import com.farmermarket.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Registration
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if(user.getRole() == null || (!user.getRole().equals("farmer") && !user.getRole().equals("buyer"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be 'farmer' or 'buyer'");
        }

        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        return userRepository.save(user);
    }

    // Login
    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if(existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            return existingUser.get();
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
    }

    // Get user details by email
    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // Update user details
    @PutMapping("/update/{email}")
    public User updateUser(@PathVariable String email, @RequestBody User updatedUser) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());

        return userRepository.save(user);
    }
}
