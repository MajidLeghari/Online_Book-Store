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
  Avatar,
  TextField,
  InputAdornment,
  Stack,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, People as CustomersIcon } from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import AdminNav from '../../components/AdminNav';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getAllCustomersAdmin();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers', err);
        setError('Unable to load customer list.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminNav />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Registered Customers ({customers.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View customer directories and registered credentials
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 260 } }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner message="Loading customer directory..." />
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
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Account Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No registered customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((cust) => (
                  <TableRow key={cust.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{cust.id}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: '#2563eb' }}>
                          {cust.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {cust.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{cust.email}</TableCell>
                    <TableCell>
                      <Chip label={cust.role} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell align="right">
                      <Chip label="Active" size="small" color="success" sx={{ fontWeight: 600 }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageCustomers;
