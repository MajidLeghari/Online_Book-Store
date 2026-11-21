import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  MenuBook,
  ArrowForward,
  LocalShipping,
  CheckCircle,
  Payment,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import BookGrid from '../components/BookGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [booksData, categoriesData] = await Promise.all([
          bookService.getAllBooks(),
          categoryService.getAllCategories(),
        ]);
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#0f172a',
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Cash on Delivery Available"
                icon={<Payment sx={{ color: '#38bdf8 !important' }} />}
                sx={{
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  mb: 3,
                  fontWeight: 600,
                  fontSize: 13,
                }}
                variant="outlined"
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                  lineHeight: 1.15,
                  mb: 2.5,
                  letterSpacing: '-0.02em',
                }}
              >
                Discover Books That <br />
                <span style={{ color: '#38bdf8' }}>Inspire & Transform</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#94a3b8',
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: 540,
                }}
              >
                Explore thousands of curated titles across literature, programming, history, and personal growth with simple and reliable Cash on Delivery.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/books"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#2563eb',
                    px: 4,
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#1d4ed8' },
                  }}
                >
                  Browse Catalog
                </Button>
                <Button
                  component={RouterLink}
                  to="/books"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  View Categories
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  p: 2,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                  alt="Bookstore showcase"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    display: 'block',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-around">
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CheckCircle sx={{ color: '#10b981', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    100% Authentic Editions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Verified publishers & original prints
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LocalShipping sx={{ color: '#2563eb', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Fast Nationwide Shipping
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dispatched within 24 business hours
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Payment sx={{ color: '#f59e0b', fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Cash on Delivery (COD)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Inspect your package then pay
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Shop by Category
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find exactly what you want to read next
            </Typography>
          </Box>
          <Button component={RouterLink} to="/books" endIcon={<ArrowForward />}>
            All Books
          </Button>
        </Box>

        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                  },
                }}
                onClick={() => navigate(`/books?category=${cat.id}`)}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <MenuBook sx={{ color: '#2563eb', mb: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 17, mb: 0.5 }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.4 }}>
                    {cat.description || 'Browse curated volumes.'}
                  </Typography>
                  {cat.bookCount !== undefined && (
                    <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: '#2563eb', fontWeight: 600 }}>
                      {cat.bookCount} {cat.bookCount === 1 ? 'Book' : 'Books'} Available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Books Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Featured Books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Handpicked selections from our online shelves
            </Typography>
          </Box>
          <Button component={RouterLink} to="/books" endIcon={<ArrowForward />}>
            View All ({books.length})
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner message="Loading bookstore catalog..." />
        ) : (
          <BookGrid books={books.slice(0, 8)} />
        )}
      </Container>
    </Box>
  );
};

export default Home;
