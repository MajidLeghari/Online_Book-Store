import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, Divider } from '@mui/material';
import { MenuBook as BookIcon, LocalShipping, Security, SupportAgent } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#0f172a', color: '#94a3b8', pt: 6, pb: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        {/* Features bar */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <LocalShipping sx={{ fontSize: 36, color: '#38bdf8' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                  Cash On Delivery
                </Typography>
                <Typography variant="body2">Pay securely at your doorstep upon delivery.</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Security sx={{ fontSize: 36, color: '#38bdf8' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                  Verified Editions
                </Typography>
                <Typography variant="body2">Guaranteed quality across all book categories.</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <SupportAgent sx={{ fontSize: 36, color: '#38bdf8' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                  Customer Support
                </Typography>
                <Typography variant="body2">Fast response for all inquiries and order updates.</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

        {/* Links section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <BookIcon sx={{ color: '#38bdf8', fontSize: 26 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                Online BookStore
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 380, lineHeight: 1.7 }}>
              Your neighborhood digital bookstore offering a curated selection of literature, programming guides,
              science textbooks, and personal development volumes.
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Explore
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link component={RouterLink} to="/books" color="inherit" underline="hover">
                All Books
              </Link>
              <Link component={RouterLink} to="/cart" color="inherit" underline="hover">
                Shopping Cart
              </Link>
              <Link component={RouterLink} to="/orders" color="inherit" underline="hover">
                My Orders
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Delivery & Payment
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              We currently offer <strong>Cash On Delivery (COD)</strong> for a hassle-free, trusted shopping experience.
            </Typography>
            <Typography variant="caption" color="#64748b">
              Standard delivery takes 2-4 business days.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="#64748b">
            © {new Date().getFullYear()} Online BookStore. All rights reserved.
          </Typography>
          <Typography variant="body2" color="#64748b">
            Spring Boot 3 + React + MySQL
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
