package com.bookstore.config;

import com.bookstore.entity.Category;
import com.bookstore.entity.User;
import com.bookstore.enums.Role;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@bookstore.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@bookstore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (categoryRepository.count() == 0) {
            categoryRepository.save(Category.builder().name("General Fiction").description("Fiction and narrative stories").build());
            categoryRepository.save(Category.builder().name("Science & Technology").description("Engineering and science books").build());
            categoryRepository.save(Category.builder().name("History").description("Historical studies and memoirs").build());
        }
    }
}
