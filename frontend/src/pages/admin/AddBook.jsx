import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Stack,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import AdminNav from '../../components/AdminNav';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

const AddBook = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim() || !formData.categoryId) {
      setError('Title, Author, and Category are required.');
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);

    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await bookService.createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        categoryId: Number(formData.categoryId),
        price: price,
        stock: stock,
        imageUrl: formData.imageUrl.trim() || DEFAULT_COVER,
        description: formData.description.trim(),
      });
      navigate('/admin/books');
    } catch (err) {
      console.error('Failed to add book', err);
      const msg = err.response?.data?.message || 'Failed to save book.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AdminNav />

      <Box sx={{ mb: 3 }}>
        <Button component={RouterLink} to="/admin/books" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Back to Books
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Add New Book
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter complete publication details to add a new title to the catalog
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              required
              fullWidth
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Practical Cloud Architecture"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              required
              fullWidth
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Author Name"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Dr. Jordan Lee"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              type="number"
              inputProps={{ step: '0.01', min: '0.01' }}
              label="Price ($)"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="29.99"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              required
              fullWidth
              type="number"
              inputProps={{ min: '0' }}
              label="Stock Quantity"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="20"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cover Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              helperText="Paste direct image link (JPEG/PNG/Unsplash). Defaults to generic cover if left empty."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Book Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Summary of the book, topics covered, target audience, and key highlights..."
            />
          </Grid>

          {/* Cover Preview */}
          {formData.imageUrl && (
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                IMAGE PREVIEW:
              </Typography>
              <Box
                component="img"
                src={formData.imageUrl}
                alt="Preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_COVER;
                }}
                sx={{ width: 100, height: 130, objectFit: 'cover', borderRadius: 2, border: '1px solid #cbd5e1' }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button component={RouterLink} to="/admin/books" variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<Save />}
                sx={{ backgroundColor: '#0f172a', fontWeight: 700, px: 4 }}
              >
                {loading ? 'Saving...' : 'Save Book'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddBook;
