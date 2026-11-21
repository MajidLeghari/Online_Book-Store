import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { MenuBook as BookIcon } from '@mui/icons-material';
import BookCard from './BookCard';

const BookGrid = ({ books = [], onResetFilters }) => {
  if (!books || books.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          border: '1px dashed #cbd5e1',
          my: 4,
        }}
      >
        <BookIcon sx={{ fontSize: 56, color: '#94a3b8', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          No Books Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
          We could not find any books matching your criteria. Try adjusting your search keywords or selecting another category.
        </Typography>
        {onResetFilters && (
          <Button variant="outlined" onClick={onResetFilters} sx={{ borderRadius: 2 }}>
            Reset Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookGrid;
