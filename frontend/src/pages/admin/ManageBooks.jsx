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
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import AdminNav from '../../components/AdminNav';
import LoadingSpinner from '../../components/LoadingSpinner';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const ManageBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, book: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books', err);
      setToast({ open: true, message: 'Could not fetch books list.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.book) return;
    try {
      await bookService.deleteBook(deleteDialog.book.id);
      setToast({
        open: true,
        message: `Deleted "${deleteDialog.book.title}" successfully.`,
        severity: 'success',
      });
      setDeleteDialog({ open: false, book: null });
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete book.';
      setToast({ open: true, message: msg, severity: 'error' });
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.categoryName && b.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminNav />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Book Inventory ({books.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage pricing, stock levels, and catalog listings
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            size="small"
            placeholder="Filter books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 240 } }}
          />
          <Button
            component={RouterLink}
            to="/admin/books/add"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#0f172a', fontWeight: 700, flexShrink: 0 }}
          >
            Add Book
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading book inventory..." />
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
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Book</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No books match your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => {
                  const isLow = book.stock <= 5;
                  const isOut = book.stock <= 0;
                  return (
                    <TableRow key={book.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={book.imageUrl || DEFAULT_COVER}
                            alt={book.title}
                            sx={{ width: 44, height: 58, objectFit: 'cover', borderRadius: 1 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_COVER;
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {book.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              By {book.author}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={book.categoryName || 'General'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>${Number(book.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={isOut ? '0 (Out of stock)' : `${book.stock} units`}
                          color={isOut ? 'error' : isLow ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                            aria-label="Edit book"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, book })}
                            aria-label="Delete book"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, book: null })}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>"{deleteDialog.book?.title}"</strong>? This will remove the book from the storefront.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, book: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageBooks;
