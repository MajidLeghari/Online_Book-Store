package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookImageUrl;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}
