package com.bookstore;

import com.bookstore.dto.*;
import com.bookstore.enums.OrderStatus;
import com.bookstore.enums.Role;
import com.bookstore.service.AuthService;
import com.bookstore.service.BookService;
import com.bookstore.service.CartService;
import com.bookstore.service.CategoryService;
import com.bookstore.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BookStoreIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BookService bookService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Test
    void testCompleteECommerceFlow() {
        long timestamp = System.currentTimeMillis();
        String customerEmail = "customer_" + timestamp + "@example.com";

        // 1. Customer Registration & Login
        RegisterRequest registerReq = RegisterRequest.builder()
                .name("Integration Test Customer")
                .email(customerEmail)
                .password("password123")
                .build();

        AuthResponse registerRes = authService.register(registerReq);
        assertNotNull(registerRes.getToken());
        assertEquals(customerEmail, registerRes.getEmail());
        assertEquals(Role.ROLE_USER.name(), registerRes.getRole());

        LoginRequest loginReq = LoginRequest.builder()
                .email(customerEmail)
                .password("password123")
                .build();

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
        assertEquals("Integration Test Customer", loginRes.getName());

        // 2. Category Creation & Retrieval
        CategoryRequest catReq = CategoryRequest.builder()
                .name("Test Category " + timestamp)
                .description("Automated testing category")
                .build();

        CategoryResponse catRes = categoryService.createCategory(catReq);
        assertNotNull(catRes.getId());
        Long categoryId = catRes.getId();

        CategoryResponse fetchedCat = categoryService.getCategoryById(categoryId);
        assertEquals("Test Category " + timestamp, fetchedCat.getName());

        // 3. Book Creation & Search
        BookRequest bookReq = BookRequest.builder()
                .title("Testing Distributed Architectures " + timestamp)
                .author("Dr. Alan Stone")
                .description("Comprehensive guide for automated test scenarios.")
                .price(29.99)
                .stock(10)
                .imageUrl("https://example.com/test-book.jpg")
                .categoryId(categoryId)
                .build();

        BookResponse bookRes = bookService.createBook(bookReq);
        assertNotNull(bookRes.getId());
        Long bookId = bookRes.getId();
        assertEquals(10, bookRes.getStock());

        List<BookResponse> searchResults = bookService.searchBooks(null, null, "Distributed");
        assertFalse(searchResults.isEmpty());
        assertTrue(searchResults.stream().anyMatch(b -> b.getId().equals(bookId)));

        List<BookResponse> categoryBooks = bookService.getBooksByCategory(categoryId);
        assertEquals(1, categoryBooks.size());

        // 4. Shopping Cart Operations
        CartResponse cart = cartService.addToCart(customerEmail, bookId, 2);
        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getTotalItems());
        assertEquals(59.98, cart.getTotalAmount());

        Long itemId = cart.getItems().get(0).getId();

        CartItemUpdateRequest updateReq = new CartItemUpdateRequest(3);
        cart = cartService.updateCartItemQuantity(customerEmail, itemId, updateReq);
        assertEquals(3, cart.getTotalItems());
        assertEquals(89.97, cart.getTotalAmount());

        // 5. Checkout & Stock Reduction
        CheckoutRequest checkoutReq = CheckoutRequest.builder()
                .deliveryAddress("789 Test Boulevard, Suite 100")
                .phoneNumber("+1-555-0188")
                .build();

        OrderResponse order = orderService.checkout(customerEmail, checkoutReq);
        assertNotNull(order.getId());
        Long orderId = order.getId();
        assertEquals(OrderStatus.PENDING, order.getStatus());
        assertEquals(89.97, order.getTotalAmount());

        // Verify cart is now empty
        CartResponse emptyCart = cartService.getCart(customerEmail);
        assertEquals(0, emptyCart.getTotalItems());

        // Verify stock deducted from 10 to 7
        BookResponse bookAfterCheckout = bookService.getBookById(bookId);
        assertEquals(7, bookAfterCheckout.getStock());

        // 6. Admin Order Status Workflow & Stock Restoration
        OrderStatusUpdateRequest confirmReq = new OrderStatusUpdateRequest(OrderStatus.CONFIRMED);
        OrderResponse confirmedOrder = orderService.updateOrderStatus(orderId, confirmReq);
        assertEquals(OrderStatus.CONFIRMED, confirmedOrder.getStatus());

        OrderStatusUpdateRequest cancelReq = new OrderStatusUpdateRequest(OrderStatus.CANCELLED);
        OrderResponse cancelledOrder = orderService.updateOrderStatus(orderId, cancelReq);
        assertEquals(OrderStatus.CANCELLED, cancelledOrder.getStatus());

        // Verify stock restored from 7 back to 10
        BookResponse bookAfterCancel = bookService.getBookById(bookId);
        assertEquals(10, bookAfterCancel.getStock());
    }
}
