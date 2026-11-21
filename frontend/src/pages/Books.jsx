import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam ? Number(categoryParam) : null);
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(Number(categoryParam));
    } else {
      setSelectedCategory(null);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [categoryParam, searchParam]);

  // Fetch books whenever filters change
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        let data = [];

        if (searchTerm && searchTerm.trim() !== '') {
          data = await bookService.searchBooks({ keyword: searchTerm.trim() });
          // If category is also selected, filter in memory
          if (selectedCategory) {
            data = data.filter((b) => b.categoryId === selectedCategory);
          }
        } else if (selectedCategory) {
          data = await bookService.getBooksByCategory(selectedCategory);
        } else {
          data = await bookService.getAllBooks();
        }

        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch books', err);
        setError('Unable to load books right now. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, searchTerm]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const newParams = new URLSearchParams(searchParams);
    if (term) {
      newParams.set('search', term);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setSearchParams({});
  };

  const currentCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">All Books</Typography>
        {currentCategoryName && <Typography color="text.primary">{currentCategoryName}</Typography>}
      </Breadcrumbs>

      {/* Header and Search */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {currentCategoryName ? currentCategoryName : 'Browse All Books'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {books.length} {books.length === 1 ? 'book' : 'books'}
              {searchTerm ? ` for "${searchTerm}"` : ''}
            </Typography>
          </Box>

          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </Stack>

        {/* Category Pills */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner message="Loading books..." />
      ) : (
        <BookGrid books={books} onResetFilters={handleResetFilters} />
      )}
    </Container>
  );
};

export default Books;
