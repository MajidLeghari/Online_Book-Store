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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { categoryService } from '../../services/categoryService';
import AdminNav from '../../components/AdminNav';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [dialogError, setDialogError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, category: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      setToast({ open: true, message: 'Could not fetch categories.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setDialogError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setDialogError(null);
    setDialogOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setDialogError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        setToast({ open: true, message: 'Category updated successfully.', severity: 'success' });
      } else {
        await categoryService.createCategory({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        setToast({ open: true, message: 'Category created successfully.', severity: 'success' });
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category.';
      setDialogError(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.category) return;
    try {
      await categoryService.deleteCategory(deleteConfirm.category.id);
      setToast({ open: true, message: 'Category deleted.', severity: 'success' });
      setDeleteConfirm({ open: false, category: null });
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete category.';
      setToast({ open: true, message: msg, severity: 'error' });
      setDeleteConfirm({ open: false, category: null });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminNav />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Book Categories ({categories.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize catalog classifications and genres
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: '#0f172a', fontWeight: 700 }}
        >
          Add Category
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading categories..." />
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
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Books</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{cat.id}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{cat.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{cat.description || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${cat.bookCount || 0} books`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(cat)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm({ open: true, category: cat })}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveCategory}>
          <DialogContent>
            {dialogError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {dialogError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f172a', fontWeight: 700 }}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, category: null })}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Category</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete category <strong>"{deleteConfirm.category?.name}"</strong>?
          </Typography>
          {deleteConfirm.category?.bookCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category currently contains {deleteConfirm.category.bookCount} book(s). You must remove or reassign those books first before deleting.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirm({ open: false, category: null })}>Cancel</Button>
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

export default ManageCategories;
