package com.lms.controller;

import com.lms.security.JwtUtil;
import com.lms.service.AuthService;
import com.lms.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        User user = authService.authenticateUser(email, password);
        if (user != null) {
            String token = jwtUtil.generateToken(email);
            Map<String, Object> userInfo = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRoles() // or extract role names if needed
            );
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userInfo
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        try {
            authService.registerUser(
                registrationData.get("email"),
                registrationData.get("password"),
                registrationData.get("role")
            );
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (jwtUtil.validateToken(token)) {
            Claims claims = jwtUtil.getClaimsFromToken(token);
            return ResponseEntity.ok().body(claims);
        }
        return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Invalid Token");
    }
}
