import api from './api';

export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  getBooksByCategory: async (categoryId) => {
    const response = await api.get(`/books/category/${categoryId}`);
    return response.data;
  },

  searchBooks: async (params) => {
    // params can be { keyword, title, author }
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/books/search?${query}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};
