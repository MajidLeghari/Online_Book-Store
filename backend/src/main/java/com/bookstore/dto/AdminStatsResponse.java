package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalBooks;
    private long totalCategories;
    private long totalOrders;
    private long totalCustomers;
    private double totalRevenue;
    private long lowStockBooksCount;
}
