import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { AddShoppingCart, Visibility } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const isOutOfStock = !book.stock || book.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=cart');
      return;
    }

    try {
      setAdding(true);
      await addToCart(book.id, 1);
      setToast({
        open: true,
        message: `Added "${book.title}" to cart!`,
        severity: 'success',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not add book to cart';
      setToast({
        open: true,
        message: errMsg,
        severity: 'error',
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px -10px rgba(15, 23, 42, 0.15)',
            borderColor: '#cbd5e1',
          },
        }}
      >
        <Box
          component={RouterLink}
          to={`/books/${book.id}`}
          sx={{
            textDecoration: 'none',
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
          }}
        >
          <CardMedia
            component="img"
            height="220"
            image={book.imageUrl || DEFAULT_COVER}
            alt={book.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_COVER;
            }}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.04)' },
            }}
          />
          {book.categoryName && (
            <Chip
              label={book.categoryName}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: 'white',
                fontWeight: 600,
                fontSize: 11,
                backdropFilter: 'blur(4px)',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {book.author}
          </Typography>

          <Typography
            component={RouterLink}
            to={`/books/${book.id}`}
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              textDecoration: 'none',
              mt: 0.5,
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 42,
              '&:hover': { color: '#2563eb' },
            }}
          >
            {book.title}
          </Typography>

          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ${Number(book.price).toFixed(2)}
              </Typography>

              {isOutOfStock ? (
                <Chip label="Out of Stock" size="small" color="error" variant="outlined" sx={{ height: 22 }} />
              ) : (
                <Chip
                  label={book.stock <= 5 ? `Only ${book.stock} left` : 'In Stock'}
                  size="small"
                  color={book.stock <= 5 ? 'warning' : 'success'}
                  variant="outlined"
                  sx={{ height: 22, fontWeight: 500 }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                disabled={isOutOfStock || adding}
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: '#0f172a',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                {adding ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button
                component={RouterLink}
                to={`/books/${book.id}`}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 40,
                  px: 1,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                }}
                aria-label="View book details"
              >
                <Visibility fontSize="small" />
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

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
    </>
  );
};

export default BookCard;
