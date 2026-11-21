import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import {
  Payment,
  LocalShipping,
  CheckCircle,
  ArrowBack,
  Lock,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const { cart, totalAmount, totalItems, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your cart is empty. Please add items before attempting checkout.
        </Alert>
        <Button component={RouterLink} to="/books" variant="contained">
          Browse Books
        </Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.deliveryAddress.trim() || !formData.phoneNumber.trim()) {
      setError('Please provide both delivery address and phone number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const placedOrder = await orderService.checkout({
        deliveryAddress: formData.deliveryAddress.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      });

      // Refresh cart context (should now be empty)
      await refreshCart();

      // Navigate to order confirmation
      navigate(`/orders/${placedOrder.id}?success=true`);
    } catch (err) {
      console.error('Checkout failed', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please review your cart and details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 3 }}>
        <Button component={RouterLink} to="/cart" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Return to Cart
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Checkout
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your delivery details to complete your order
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Checkout Form */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              1. Customer Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  value={user?.name || ''}
                  disabled
                  helperText="Registered name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  helperText="Order confirmation sent here"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              2. Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Complete Delivery Address"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Street name, House/Apartment number, City, Postal Code"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Contact Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  helperText="Courier will call before delivery"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              3. Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value="COD">
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    value="COD"
                    control={<Radio color="primary" checked />}
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Cash on Delivery (COD)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Pay directly with cash when your parcel is delivered to your doorstep.
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Order Review Sidebar */}
        <Grid item xs={12} md={5}>
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
              Items in Order ({totalItems})
            </Typography>

            <Box sx={{ maxHeight: 240, overflowY: 'auto', pr: 1, mb: 2 }}>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <Box sx={{ pr: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.bookTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity} × ${Number(item.bookPrice).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ${Number(item.subtotal).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${Number(totalAmount).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping Fee
                </Typography>
                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                  FREE
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Total Due (COD)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                ${Number(totalAmount).toFixed(2)}
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              onClick={handlePlaceOrder}
              startIcon={<Lock />}
              sx={{
                py: 1.5,
                backgroundColor: '#10b981',
                fontWeight: 700,
                fontSize: 16,
                '&:hover': { backgroundColor: '#059669' },
              }}
            >
              {loading ? 'Placing Order...' : 'Place Order (COD)'}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              By clicking "Place Order", you agree to receive this shipment with Cash On Delivery.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
