package com.bookstore.service;

import com.bookstore.dto.CheckoutRequest;
import com.bookstore.dto.OrderItemResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.dto.OrderStatusUpdateRequest;
import com.bookstore.entity.*;
import com.bookstore.enums.OrderStatus;
import com.bookstore.enums.PaymentMethod;
import com.bookstore.enums.Role;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        BookRepository bookRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse checkout(String userEmail, CheckoutRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart not found for user"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Add books before checkout.");
        }

        // Validate stock and calculate total amount
        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.COD)
                .deliveryAddress(request.getDeliveryAddress().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();

            if (cartItem.getQuantity() > book.getStock()) {
                throw new BadRequestException("Insufficient stock for book '" + book.getTitle() + "'. Available: " + book.getStock() + ", in cart: " + cartItem.getQuantity());
            }

            // Deduct inventory stock
            book.setStock(book.getStock() - cartItem.getQuantity());
            bookRepository.save(book);

            double itemTotal = book.getPrice() * cartItem.getQuantity();
            totalAmount += itemTotal;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .price(book.getPrice()) // Snapshot purchase price
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after checkout
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Prevent customer from viewing another customer's order
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You are not authorized to view this order");
        }

        return mapToOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        if (currentStatus == newStatus) {
            return mapToOrderResponse(order);
        }

        // Business validation: delivered orders cannot be cancelled
        if (currentStatus == OrderStatus.DELIVERED && newStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Delivered orders cannot be cancelled");
        }

        // Business validation: cancelled orders cannot be modified
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cancelled orders cannot be modified");
        }

        // Handle stock restoration if order is cancelled
        if (newStatus == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getOrderItems()) {
                Book book = item.getBook();
                book.setStock(book.getStock() + item.getQuantity());
                bookRepository.save(book);
            }
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }

    public OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                double subtotal = item.getPrice() * item.getQuantity();
                itemResponses.add(OrderItemResponse.builder()
                        .id(item.getId())
                        .bookId(item.getBook().getId())
                        .bookTitle(item.getBook().getTitle())
                        .bookAuthor(item.getBook().getAuthor())
                        .bookImageUrl(item.getBook().getImageUrl())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(Math.round(subtotal * 100.0) / 100.0)
                        .build());
            }
        }

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(order.getDeliveryAddress())
                .phoneNumber(order.getPhoneNumber())
                .orderItems(itemResponses)
                .build();
    }
}
