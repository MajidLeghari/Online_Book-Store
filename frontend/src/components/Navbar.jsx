import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  ShoppingCart as CartIcon,
  AccountCircle,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ReceiptLong as OrdersIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  LibraryBooks as BooksIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#0f172a' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 70 }}>
            {/* Logo and Brand */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                textDecoration: 'none',
                color: 'white',
              }}
            >
              <BookIcon sx={{ color: '#38bdf8', fontSize: 32 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '.05rem',
                  color: 'white',
                }}
              >
                BOOK<span style={{ color: '#38bdf8' }}>STORE</span>
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/"
                sx={{ color: '#e2e8f0', '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/books"
                sx={{ color: '#e2e8f0', '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } }}
              >
                All Books
              </Button>

              {isAdmin && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: '#fbbf24',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    '&:hover': {
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      borderColor: '#fbbf24',
                    },
                  }}
                >
                  Admin Panel
                </Button>
              )}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Cart Icon */}
              <IconButton
                component={RouterLink}
                to="/cart"
                sx={{ color: '#e2e8f0', '&:hover': { color: 'white' } }}
                aria-label="Shopping Cart"
              >
                <Badge badgeContent={totalItems} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>

              {/* User authentication states */}
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ p: 0.5, border: '2px solid rgba(255,255,255,0.2)' }}
                    aria-label="User Account"
                  >
                    <Avatar
                      sx={{
                        bgcolor: isAdmin ? '#f59e0b' : '#2563eb',
                        width: 34,
                        height: 34,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: { width: 220, mt: 1.5, borderRadius: 2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {user?.email}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'inline-block',
                          mt: 0.5,
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          bgcolor: isAdmin ? '#fef3c7' : '#dbeafe',
                          color: isAdmin ? '#b45309' : '#1e40af',
                          fontWeight: 600,
                          fontSize: 10,
                        }}
                      >
                        {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>
                      <ListItemIcon>
                        <OrdersIcon fontSize="small" />
                      </ListItemIcon>
                      My Orders
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
                    sx={{ color: '#e2e8f0', '&:hover': { color: 'white' } }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      backgroundColor: '#2563eb',
                      '&:hover': { backgroundColor: '#1d4ed8' },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}

              {/* Mobile Drawer Trigger */}
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                onClick={toggleDrawer(true)}
                aria-label="Open navigation drawer"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={toggleDrawer(false)}>
          <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon sx={{ color: '#0f172a' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Online BookStore
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/books">
                <ListItemIcon>
                  <BooksIcon />
                </ListItemIcon>
                <ListItemText primary="All Books" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/cart">
                <ListItemIcon>
                  <CartIcon />
                </ListItemIcon>
                <ListItemText primary={`Cart (${totalItems})`} />
              </ListItemButton>
            </ListItem>

            {isAuthenticated ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/orders">
                    <ListItemIcon>
                      <OrdersIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Orders" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/profile">
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                {isAdmin && (
                  <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/admin">
                      <ListItemIcon>
                        <DashboardIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Admin Dashboard" />
                    </ListItemButton>
                  </ListItem>
                )}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/login">
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/register">
                    <ListItemIcon>
                      <RegisterIcon />
                    </ListItemIcon>
                    <ListItemText primary="Register" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
