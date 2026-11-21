import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { Visibility, ShoppingBagOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setError('Could not retrieve your order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          My Order History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and review all your purchases
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #cbd5e1',
          }}
        >
          <ShoppingBagOutlined sx={{ fontSize: 52, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any book orders so far.
          </Typography>
          <Button component={RouterLink} to="/books" variant="contained">
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const totalItemCount = order.orderItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                const formattedDate = order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A';

                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{order.id}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{totalItemCount} copy(ies)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>${Number(order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={order.paymentMethod || 'COD'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={RouterLink}
                        to={`/orders/${order.id}`}
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        sx={{ textTransform: 'none' }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyOrders;
