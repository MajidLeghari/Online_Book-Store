package com.bookstore.controller;

import com.bookstore.dto.CartItemUpdateRequest;
import com.bookstore.dto.CartResponse;
import com.bookstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCart(userDetails.getUsername()));
    }

    @PostMapping("/add/{bookId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "1") int quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.addToCart(userDetails.getUsername(), bookId, quantity));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(userDetails.getUsername(), itemId, request));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.removeCartItem(userDetails.getUsername(), itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}
