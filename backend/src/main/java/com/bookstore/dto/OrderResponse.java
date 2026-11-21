package com.bookstore.dto;

import com.bookstore.enums.OrderStatus;
import com.bookstore.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private String deliveryAddress;
    private String phoneNumber;
    @Builder.Default
    private List<OrderItemResponse> orderItems = new ArrayList<>();
}
