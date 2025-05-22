package com.lms.util;

import com.lms.entity.Role;
import com.lms.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Define the roles to initialize
        List<String> roles = Arrays.asList("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_STUDENT");

        // Loop through and save roles if not already present
        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                System.out.println("Initialized role: " + roleName);
            }
        }
    }
}
