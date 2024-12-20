import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Box,
  Divider,
  Paper,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../../store/slices/cartSlice';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, delta, currentQuantity) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        InputProps={{ readOnly: true }}
                        sx={{ width: '60px', mx: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Shipping</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    Free
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" align="right">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mt: 3 }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 