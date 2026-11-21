import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  ShoppingCartOutlined,
  ArrowForward,
  DeleteSweep,
  ShoppingBagOutlined,
  LocalShipping,
  Payment,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const { cart, loading, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner message="Loading your shopping cart..." />;
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Box
          sx={{
            p: 6,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            border: '1px dashed #cbd5e1',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420, mx: 'auto' }}>
            Looks like you haven't added any books to your shopping cart yet. Start exploring our shelves today!
          </Typography>
          <Button
            component={RouterLink}
            to="/books"
            variant="contained"
            size="large"
            startIcon={<ShoppingBagOutlined />}
            sx={{
              backgroundColor: '#0f172a',
              px: 4,
              py: 1.2,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#1e293b' },
            }}
          >
            Explore Books
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Shopping Cart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>

        <Button
          variant="text"
          color="error"
          size="small"
          startIcon={<DeleteSweep />}
          onClick={clearCart}
          sx={{ fontWeight: 600 }}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </Paper>
        </Grid>

        {/* Order Summary Box */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              position: 'sticky',
              top: 90,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              Order Summary
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({totalItems} items)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${Number(totalAmount).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Shipping
                </Typography>
                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                  FREE
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Cash On Delivery
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Total Amount
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ${Number(totalAmount).toFixed(2)}
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/checkout"
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                backgroundColor: '#2563eb',
                fontWeight: 700,
                fontSize: 16,
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              Proceed to Checkout
            </Button>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Payment fontSize="small" sx={{ color: '#2563eb' }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Cash on Delivery Only
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block">
                No advance payment required. Pay when your parcel arrives at your address.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
