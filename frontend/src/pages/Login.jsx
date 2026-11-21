import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import { LockOutlined, MenuBook as BookIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(isExpired ? 'Your session has expired. Please sign in again.' : null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await login(formData.email, formData.password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setError(null);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <BookIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your cart and orders
          </Typography>
        </Box>

        {error && (
          <Alert severity={isExpired ? 'warning' : 'error'} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            size="small"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            size="small"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              backgroundColor: '#0f172a',
              fontWeight: 700,
              fontSize: 15,
              '&:hover': { backgroundColor: '#1e293b' },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700, color: '#2563eb' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Quick Demo Logins Helper */}
        <Divider sx={{ my: 3 }}>
          <Chip label="Quick Test Accounts" size="small" />
        </Divider>

        <Stack spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleQuickFill('admin@bookstore.com', 'admin123')}
            sx={{ textTransform: 'none', justifyContent: 'space-between', borderColor: '#cbd5e1' }}
          >
            <span>Admin: admin@bookstore.com</span>
            <Chip label="Admin" size="small" color="warning" sx={{ height: 20, fontSize: 10 }} />
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleQuickFill('customer@example.com', 'customer123')}
            sx={{ textTransform: 'none', justifyContent: 'space-between', borderColor: '#cbd5e1' }}
          >
            <span>Customer Sample</span>
            <Chip label="User" size="small" color="primary" sx={{ height: 20, fontSize: 10 }} />
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
