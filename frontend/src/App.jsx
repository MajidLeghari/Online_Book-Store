import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Customer Pages
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import AddBook from './pages/admin/AddBook';
import EditBook from './pages/admin/EditBook';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Customer Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cart />} />

                  {/* Protected Customer Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/books"
                    element={
                      <AdminRoute>
                        <ManageBooks />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/books/add"
                    element={
                      <AdminRoute>
                        <AddBook />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/books/edit/:id"
                    element={
                      <AdminRoute>
                        <EditBook />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        <ManageCategories />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <ManageOrders />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminRoute>
                        <ManageCustomers />
                      </AdminRoute>
                    }
                  />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
