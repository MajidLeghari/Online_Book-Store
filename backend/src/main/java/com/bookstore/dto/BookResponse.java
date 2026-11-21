package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String description;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
}
