package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getPrice() <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }
        if (request.getStock() < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        Book book = Book.builder()
                .title(request.getTitle().trim())
                .author(request.getAuthor().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .category(category)
                .build();

        Book savedBook = bookRepository.save(book);
        return mapToResponse(savedBook);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return mapToResponse(book);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (request.getPrice() <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }
        if (request.getStock() < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStock(request.getStock());
        book.setImageUrl(request.getImageUrl());
        book.setCategory(category);

        Book updatedBook = bookRepository.save(book);
        return mapToResponse(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> searchBooks(String title, String author, String keyword) {
        List<Book> books;
        if (keyword != null && !keyword.trim().isEmpty()) {
            books = bookRepository.searchByKeyword(keyword.trim());
        } else if (title != null && !title.trim().isEmpty()) {
            books = bookRepository.findByTitleContainingIgnoreCase(title.trim());
        } else if (author != null && !author.trim().isEmpty()) {
            books = bookRepository.findByAuthorContainingIgnoreCase(author.trim());
        } else {
            books = bookRepository.findAll();
        }

        return books.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }

        return bookRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookResponse mapToResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .price(book.getPrice())
                .stock(book.getStock())
                .imageUrl(book.getImageUrl())
                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())
                .build();
    }
}
