package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookImageUrl;
    private Double bookPrice;
    private Integer quantity;
    private Double subtotal;
    private Integer availableStock;
}
