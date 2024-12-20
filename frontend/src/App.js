import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OrderHistory from './components/OrderHistory';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 