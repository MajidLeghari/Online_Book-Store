package com.bookstore.controller;

import com.bookstore.dto.AdminStatsResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.dto.OrderStatusUpdateRequest;
import com.bookstore.dto.UserResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Order;
import com.bookstore.entity.User;
import com.bookstore.enums.OrderStatus;
import com.bookstore.enums.Role;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    public AdminController(OrderService orderService,
                           UserRepository userRepository,
                           BookRepository bookRepository,
                           CategoryRepository categoryRepository,
                           OrderRepository orderRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<UserResponse>> getAllCustomers() {
        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_USER)
                .collect(Collectors.toList());

        List<UserResponse> responses = customers.stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        long totalBooks = bookRepository.count();
        long totalCategories = categoryRepository.count();
        List<Order> orders = orderRepository.findAll();
        long totalOrders = orders.size();

        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_USER)
                .count();

        double totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long lowStockBooks = bookRepository.findAll().stream()
                .filter(b -> b.getStock() <= 5)
                .count();

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalBooks(totalBooks)
                .totalCategories(totalCategories)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalRevenue(Math.round(totalRevenue * 100.0) / 100.0)
                .lowStockBooksCount(lowStockBooks)
                .build();

        return ResponseEntity.ok(stats);
    }
}
