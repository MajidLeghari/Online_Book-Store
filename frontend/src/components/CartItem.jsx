import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  ButtonGroup,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1 || newQty > item.availableStock) return;
    try {
      setUpdating(true);
      await onUpdateQuantity(item.id, newQty);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUpdating(true);
      await onRemove(item.id);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        {/* Cover image */}
        <Box
          component={RouterLink}
          to={`/books/${item.bookId}`}
          sx={{
            width: { xs: 80, sm: 90 },
            height: { xs: 110, sm: 120 },
            flexShrink: 0,
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
          }}
        >
          <img
            src={item.bookImageUrl || DEFAULT_COVER}
            alt={item.bookTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_COVER;
            }}
          />
        </Box>

        {/* Book details */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            component={RouterLink}
            to={`/books/${item.bookId}`}
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              textDecoration: 'none',
              '&:hover': { color: '#2563eb' },
            }}
          >
            {item.bookTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            By {item.bookAuthor}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
            Unit Price: ${Number(item.bookPrice).toFixed(2)}
          </Typography>

          {item.availableStock < item.quantity && (
            <Alert severity="warning" sx={{ py: 0, mt: 1, fontSize: 12 }}>
              Only {item.availableStock} in stock. Please adjust quantity.
            </Alert>
          )}
        </Box>

        {/* Quantity Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: 2 }}>
            <Button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || updating}
              sx={{ px: 1, borderColor: '#cbd5e1' }}
              aria-label="Decrease quantity"
            >
              <RemoveIcon fontSize="small" />
            </Button>
            <Button
              disabled
              sx={{
                px: 2,
                color: '#0f172a !important',
                fontWeight: 700,
                borderColor: '#cbd5e1',
                cursor: 'default',
              }}
            >
              {item.quantity}
            </Button>
            <Button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.availableStock || updating}
              sx={{ px: 1, borderColor: '#cbd5e1' }}
              aria-label="Increase quantity"
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>

          {/* Subtotal */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>
            ${Number(item.subtotal).toFixed(2)}
          </Typography>

          {/* Remove Button */}
          <IconButton
            onClick={handleRemove}
            disabled={updating}
            color="error"
            size="small"
            aria-label="Remove item"
            sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default CartItem;
