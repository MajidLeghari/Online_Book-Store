import React from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as BooksIcon,
  Category as CategoryIcon,
  ReceiptLong as OrdersIcon,
  People as CustomersIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin') return 0;
    if (path.startsWith('/admin/books/add')) return 2;
    if (path.startsWith('/admin/books')) return 1;
    if (path.startsWith('/admin/categories')) return 3;
    if (path.startsWith('/admin/orders')) return 4;
    if (path.startsWith('/admin/customers')) return 5;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/admin');
        break;
      case 1:
        navigate('/admin/books');
        break;
      case 2:
        navigate('/admin/books/add');
        break;
      case 3:
        navigate('/admin/categories');
        break;
      case 4:
        navigate('/admin/orders');
        break;
      case 5:
        navigate('/admin/customers');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={getActiveTab()}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 14,
              minHeight: 52,
            },
          }}
        >
          <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Overview" />
          <Tab icon={<BooksIcon fontSize="small" />} iconPosition="start" label="Manage Books" />
          <Tab icon={<AddIcon fontSize="small" />} iconPosition="start" label="Add Book" />
          <Tab icon={<CategoryIcon fontSize="small" />} iconPosition="start" label="Manage Categories" />
          <Tab icon={<OrdersIcon fontSize="small" />} iconPosition="start" label="Manage Orders" />
          <Tab icon={<CustomersIcon fontSize="small" />} iconPosition="start" label="Manage Customers" />
        </Tabs>
      </Box>
    </Paper>
  );
};

export default AdminNav;
