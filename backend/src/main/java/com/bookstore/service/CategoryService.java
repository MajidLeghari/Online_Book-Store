package com.bookstore.service;

import com.bookstore.dto.CategoryRequest;
import com.bookstore.dto.CategoryResponse;
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
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public CategoryService(CategoryRepository categoryRepository, BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String newName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw new BadRequestException("Category already exists with name: " + newName);
        }

        category.setName(newName);
        category.setDescription(request.getDescription());

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        long bookCount = bookRepository.countByCategoryId(id);
        if (bookCount > 0) {
            throw new BadRequestException("Cannot delete category because it contains " + bookCount + " book(s). Please reassign or delete the books first.");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        long count = bookRepository.countByCategoryId(category.getId());
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .bookCount((int) count)
                .build();
    }
}
