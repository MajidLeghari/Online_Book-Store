import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  ReceiptLong,
  ShoppingBag,
  Logout,
  Dashboard,
  Email,
  BadgeOutlined,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
              fontWeight: 800,
              bgcolor: isAdmin ? '#f59e0b' : '#2563eb',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {user?.email}
            </Typography>
            <Chip
              label={isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
              color={isAdmin ? 'warning' : 'primary'}
              size="small"
              sx={{ fontWeight: 700, fontSize: 11 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Account Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Email sx={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    EMAIL ADDRESS
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <BadgeOutlined sx={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    ACCOUNT ROLE
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Quick Navigation
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            component={RouterLink}
            to="/orders"
            variant="outlined"
            startIcon={<ReceiptLong />}
            sx={{ flex: 1, py: 1.2 }}
          >
            My Orders
          </Button>
          <Button
            component={RouterLink}
            to="/books"
            variant="outlined"
            startIcon={<ShoppingBag />}
            sx={{ flex: 1, py: 1.2 }}
          >
            Browse Books
          </Button>
          {isAdmin && (
            <Button
              component={RouterLink}
              to="/admin"
              variant="outlined"
              color="warning"
              startIcon={<Dashboard />}
              sx={{ flex: 1, py: 1.2 }}
            >
              Admin Dashboard
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ flex: 1, py: 1.2 }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Profile;
