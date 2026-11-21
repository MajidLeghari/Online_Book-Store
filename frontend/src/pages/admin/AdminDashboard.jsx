import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  MenuBook,
  Category,
  ReceiptLong,
  People,
  AttachMoney,
  WarningAmber,
  Add,
  ArrowForward,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
        setError('Unable to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AdminNav />
        <LoadingSpinner message="Loading dashboard metrics..." />
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 32, color: '#10b981' }} />,
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ReceiptLong sx={{ fontSize: 32, color: '#2563eb' }} />,
      bgColor: 'rgba(37, 99, 235, 0.08)',
      borderColor: 'rgba(37, 99, 235, 0.2)',
    },
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      icon: <MenuBook sx={{ fontSize: 32, color: '#0f172a' }} />,
      bgColor: 'rgba(15, 23, 42, 0.08)',
      borderColor: 'rgba(15, 23, 42, 0.2)',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories || 0,
      icon: <Category sx={{ fontSize: 32, color: '#8b5cf6' }} />,
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    {
      title: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      icon: <People sx={{ fontSize: 32, color: '#06b6d4' }} />,
      bgColor: 'rgba(6, 182, 212, 0.08)',
      borderColor: 'rgba(6, 182, 212, 0.2)',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockBooksCount || 0,
      icon: <WarningAmber sx={{ fontSize: 32, color: '#f59e0b' }} />,
      bgColor: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Admin Management Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor store statistics, inventory, orders, and customer accounts
        </Typography>
      </Box>

      <AdminNav />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {stats?.lowStockBooksCount > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Inventory Notice:</strong> You have {stats.lowStockBooksCount} book(s) with 5 or fewer copies remaining in stock.{' '}
          <Button component={RouterLink} to="/admin/books" size="small" color="inherit">
            Manage Books
          </Button>
        </Alert>
      )}

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${card.borderColor}`,
                backgroundColor: '#ffffff',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    backgroundColor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick Operations Section */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
          Quick Management Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/admin/books/add"
              variant="contained"
              fullWidth
              startIcon={<Add />}
              sx={{ py: 1.5, backgroundColor: '#0f172a', fontWeight: 700 }}
            >
              Add New Book
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/admin/books"
              variant="outlined"
              fullWidth
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Review Inventory
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/admin/orders"
              variant="outlined"
              fullWidth
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Process Orders
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/admin/categories"
              variant="outlined"
              fullWidth
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Categories
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
