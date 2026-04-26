package com.shorex.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.shorex.entity.AdminUser;
import com.shorex.repository.AdminUserRepository;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    

    @Override
    public void run(String... args) {
    	System.out.println("AdminSeeder is running...");
        if (adminUserRepository.findByUsernameAndActiveTrue("SahilAnu").isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername("SahilAnu");
            admin.setPassword(passwordEncoder.encode("997@SahilAnu"));
            admin.setActive(true);
            adminUserRepository.save(admin);

            System.out.println("Default admin created successfully");
        }
    }
}