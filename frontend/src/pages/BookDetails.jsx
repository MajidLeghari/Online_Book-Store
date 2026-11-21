import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
  Alert,
  Snackbar,
  ButtonGroup,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  AddShoppingCart,
  LocalShipping,
  Payment,
  VerifiedUser,
  ArrowBack,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (err) {
        console.error('Failed to load book', err);
        setError('Book not found or unable to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=cart');
      return;
    }

    try {
      setAdding(true);
      await addToCart(book.id, quantity);
      setToast({
        open: true,
        message: `Successfully added ${quantity} copy(ies) of "${book.title}" to cart!`,
        severity: 'success',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add to cart';
      setToast({
        open: true,
        message: errMsg,
        severity: 'error',
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading book details..." />;
  }

  if (error || !book) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Book not found'}
        </Alert>
        <Button component={RouterLink} to="/books" startIcon={<ArrowBack />} variant="contained">
          Back to Books
        </Button>
      </Container>
    );
  }

  const isOutOfStock = !book.stock || book.stock <= 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/books" underline="hover" color="inherit">
          Books
        </Link>
        {book.categoryName && (
          <Link
            component={RouterLink}
            to={`/books?category=${book.categoryId}`}
            underline="hover"
            color="inherit"
          >
            {book.categoryName}
          </Link>
        )}
        <Typography color="text.primary" noWrap sx={{ maxWidth: 300 }}>
          {book.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={5}>
        {/* Book Cover Image */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 3,
              p: 2,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Box
              component="img"
              src={book.imageUrl || DEFAULT_COVER}
              alt={book.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_COVER;
              }}
              sx={{
                width: '100%',
                maxHeight: 460,
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </Box>
        </Grid>

        {/* Book Meta & Order Actions */}
        <Grid item xs={12} md={7}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {book.categoryName && (
                <Chip
                  label={book.categoryName}
                  color="primary"
                  size="small"
                  sx={{ backgroundColor: '#0f172a', fontWeight: 600 }}
                />
              )}
              {isOutOfStock ? (
                <Chip label="Out of Stock" color="error" size="small" />
              ) : (
                <Chip
                  label={book.stock <= 5 ? `Low Stock (${book.stock} remaining)` : `In Stock (${book.stock} available)`}
                  color={book.stock <= 5 ? 'warning' : 'success'}
                  size="small"
                />
              )}
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, lineHeight: 1.2 }}>
              {book.title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              By <strong>{book.author}</strong>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ${Number(book.price).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Inclusive of all taxes)
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              About This Book
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, mb: 4, whiteSpace: 'pre-line' }}>
              {book.description || 'No description available for this book.'}
            </Typography>

            {/* Quantity Selector & Add to Cart */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems={{ sm: 'center' }}>
              <ButtonGroup variant="outlined" size="large" sx={{ borderRadius: 2 }}>
                <Button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  sx={{ px: 2, borderColor: '#cbd5e1' }}
                  aria-label="Decrease quantity"
                >
                  <RemoveIcon />
                </Button>
                <Button
                  disabled
                  sx={{
                    px: 3,
                    color: '#0f172a !important',
                    fontWeight: 700,
                    fontSize: 16,
                    borderColor: '#cbd5e1',
                  }}
                >
                  {quantity}
                </Button>
                <Button
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  disabled={quantity >= book.stock || isOutOfStock}
                  sx={{ px: 2, borderColor: '#cbd5e1' }}
                  aria-label="Increase quantity"
                >
                  <AddIcon />
                </Button>
              </ButtonGroup>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                disabled={isOutOfStock || adding}
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: '#0f172a',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  fontSize: 16,
                  fontWeight: 700,
                  flexGrow: 1,
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                {adding ? 'Adding...' : isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart`}
              </Button>
            </Stack>

            {/* Payment & Delivery Assurance Box */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: '#f8fafc',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Payment sx={{ color: '#2563eb' }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        Payment Method
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cash On Delivery (COD)
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalShipping sx={{ color: '#2563eb' }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        Estimated Delivery
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 - 4 business days
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedUser sx={{ color: '#2563eb' }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        Authentic Guarantee
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Direct from publishers
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetails;
