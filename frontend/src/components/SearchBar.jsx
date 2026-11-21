import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search by title or author...' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
      <Paper
        elevation={0}
        sx={{
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          border: '1.5px solid #e2e8f0',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s',
          '&:focus-within': {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.12)',
          },
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: 15 }}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'search books' }}
        />
        {searchTerm && (
          <IconButton size="small" onClick={handleClear} sx={{ p: '6px', color: '#94a3b8' }} aria-label="clear search">
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton type="submit" sx={{ p: '8px', color: '#0f172a' }} aria-label="submit search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;
