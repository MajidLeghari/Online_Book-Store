import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import LoadingSpinner from '../../components/LoadingSpinner';

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

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders', err);
      setToast({ open: true, message: 'Could not load orders list.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatusAdmin(orderId, newStatus);
      setToast({
        open: true,
        message: `Order #${orderId} status updated to ${newStatus}.`,
        severity: 'success',
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
      const msg = err.response?.data?.message || 'Failed to update order status.';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminNav />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Customer Orders Management ({orders.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review placed orders, shipping addresses, and advance order fulfillment statuses
        </Typography>
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading orders..." />
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
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Delivery Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total (COD)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Inspect
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No customer orders received yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const formattedDate = order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A';

                  const isCancelled = order.status === 'CANCELLED';

                  return (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>#{order.id}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {order.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                          Phone: {order.phoneNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {order.deliveryAddress}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={order.status}
                            disabled={isCancelled}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            sx={{
                              fontSize: 13,
                              fontWeight: 700,
                              borderRadius: 2,
                            }}
                          >
                            {ORDER_STATUSES.map((st) => (
                              <MenuItem key={st} value={st} disabled={isCancelled}>
                                <Chip
                                  label={st}
                                  size="small"
                                  color={getStatusColor(st)}
                                  sx={{ fontWeight: 700, fontSize: 11, height: 20 }}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setSelectedOrder(order)}
                          aria-label="View order items"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order Item Inspection Dialog */}
      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Order Summary: #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  CUSTOMER
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {selectedOrder.userName} ({selectedOrder.userEmail})
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  SHIPPING ADDRESS & PHONE
                </Typography>
                <Typography variant="body2">{selectedOrder.deliveryAddress}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Phone: {selectedOrder.phoneNumber}
                </Typography>
              </Box>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Purchased Books
              </Typography>
              {selectedOrder.orderItems?.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.bookTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ${Number(item.subtotal).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Total (Cash On Delivery):
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ${Number(selectedOrder.totalAmount).toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageOrders;
