import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  LocalShipping,
  Payment,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'CONFIRMED':
      return 'info';
    case 'SHIPPED':
      return 'primary';
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isNewOrder = queryParams.get('success') === 'true';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
        setError('Order not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button component={RouterLink} to="/orders" startIcon={<ArrowBack />} variant="contained">
          Back to My Orders
        </Button>
      </Container>
    );
  }

  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {isNewOrder && (
        <Alert
          icon={<CheckCircle fontSize="inherit" />}
          severity="success"
          sx={{ mb: 4, borderRadius: 2 }}
        >
          <strong>Order placed successfully!</strong> Your order has been placed with Cash on Delivery. We'll prepare it for shipment shortly.
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button component={RouterLink} to="/orders" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
            Back to Orders
          </Button>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Order #{order.id}
            </Typography>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Placed on {formattedDate}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Ordered Items Table */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Items in this Order
            </Typography>

            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Book</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={item.bookImageUrl || DEFAULT_COVER}
                            alt={item.bookTitle}
                            sx={{ width: 50, height: 65, objectFit: 'cover', borderRadius: 1 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_COVER;
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {item.bookTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              By {item.bookAuthor}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        ${Number(item.subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ width: 260 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                      FREE
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Total (COD):
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Shipping & Payment Meta */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Delivery Information
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <LocationOn sx={{ color: '#2563eb', mt: 0.3 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    DELIVERY ADDRESS
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {order.deliveryAddress}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Phone sx={{ color: '#2563eb', mt: 0.3 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    PHONE NUMBER
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {order.phoneNumber}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Payment sx={{ color: '#f59e0b', mt: 0.3 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    PAYMENT METHOD
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                    Cash on Delivery (COD)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Please prepare exact cash for the courier
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;
