package com.bookstore.service;

import com.bookstore.dto.CartItemResponse;
import com.bookstore.dto.CartItemUpdateRequest;
import com.bookstore.dto.CartResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartItemRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       BookRepository bookRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCartForUser(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public CartResponse getCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCartForUser(user);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(String userEmail, Long bookId, int quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCartForUser(user);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        if (book.getStock() <= 0) {
            throw new BadRequestException("Book '" + book.getTitle() + "' is out of stock");
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), book.getId())
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            if (newQuantity > book.getStock()) {
                throw new BadRequestException("Cannot add more. Requested quantity (" + newQuantity + ") exceeds available stock (" + book.getStock() + ")");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            if (quantity > book.getStock()) {
                throw new BadRequestException("Requested quantity (" + quantity + ") exceeds available stock (" + book.getStock() + ")");
            }
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
        }

        // Reload updated cart
        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(String userEmail, Long itemId, CartItemUpdateRequest request) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCartForUser(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        // Security check: ensure item belongs to user's cart
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to this cart item");
        }

        Book book = item.getBook();
        if (request.getQuantity() > book.getStock()) {
            throw new BadRequestException("Requested quantity (" + request.getQuantity() + ") exceeds available stock (" + book.getStock() + ")");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public CartResponse removeCartItem(String userEmail, Long itemId) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCartForUser(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to this cart item");
        }

        cartItemRepository.delete(item);

        Cart updatedCart = cartRepository.findById(cart.getId()).orElse(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        Cart cart = getOrCreateCartForUser(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = new ArrayList<>();
        double totalAmount = 0.0;
        int totalItems = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                double subtotal = item.getBook().getPrice() * item.getQuantity();
                totalAmount += subtotal;
                totalItems += item.getQuantity();

                itemResponses.add(CartItemResponse.builder()
                        .id(item.getId())
                        .bookId(item.getBook().getId())
                        .bookTitle(item.getBook().getTitle())
                        .bookAuthor(item.getBook().getAuthor())
                        .bookImageUrl(item.getBook().getImageUrl())
                        .bookPrice(item.getBook().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(Math.round(subtotal * 100.0) / 100.0)
                        .availableStock(item.getBook().getStock())
                        .build());
            }
        }

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalAmount(Math.round(totalAmount * 100.0) / 100.0)
                .totalItems(totalItems)
                .build();
    }
}
