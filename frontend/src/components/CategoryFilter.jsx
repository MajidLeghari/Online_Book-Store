import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

const CategoryFilter = ({ categories = [], selectedCategoryId, onSelectCategory }) => {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', py: 1, '::-webkit-scrollbar': { display: 'none' } }}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All Categories"
          onClick={() => onSelectCategory(null)}
          color={selectedCategoryId === null ? 'primary' : 'default'}
          variant={selectedCategoryId === null ? 'filled' : 'outlined'}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 1,
            cursor: 'pointer',
            borderColor: '#cbd5e1',
            ...(selectedCategoryId === null
              ? { backgroundColor: '#0f172a', color: 'white' }
              : { backgroundColor: '#ffffff', color: '#475569', '&:hover': { backgroundColor: '#f1f5f9' } }),
          }}
        />

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <Chip
              key={cat.id}
              label={cat.bookCount !== undefined ? `${cat.name} (${cat.bookCount})` : cat.name}
              onClick={() => onSelectCategory(cat.id)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 1,
                cursor: 'pointer',
                borderColor: '#cbd5e1',
                ...(isSelected
                  ? { backgroundColor: '#0f172a', color: 'white' }
                  : { backgroundColor: '#ffffff', color: '#475569', '&:hover': { backgroundColor: '#f1f5f9' } }),
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default CategoryFilter;
