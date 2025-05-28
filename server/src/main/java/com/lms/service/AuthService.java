package com.lms.service;

import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.repository.RoleRepository;
import com.lms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticateUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    public void registerUser(String email, String password, String name, String roleName) throws Exception {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered.");
        }

        // Fetch role by name
        Optional<Role> optionalRole = roleRepository.findByName(roleName);
        if (optionalRole.isEmpty()) {
            throw new Exception("Invalid role.");
        }

        Role role = optionalRole.get();

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRoles(Set.of(role));
        userRepository.save(user);
    }
}
