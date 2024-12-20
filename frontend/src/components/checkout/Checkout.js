import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../../services/api';
import { clearCart } from '../../store/slices/cartSlice';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    saveAddress: false
  });
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    saveCard: false
  });

  const cart = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleShippingChange = (event) => {
    const { name, value, checked } = event.target;
    setShippingData(prev => ({
      ...prev,
      [name]: name === 'saveAddress' ? checked : value
    }));
  };

  const handlePaymentChange = (event) => {
    const { name, value, checked } = event.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'saveCard' ? checked : value
    }));
  };

  const validateShippingData = () => {
    const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'country'];
    return required.every(field => shippingData[field].trim());
  };

  const validatePaymentData = () => {
    const required = ['cardName', 'cardNumber', 'expDate', 'cvv'];
    return required.every(field => paymentData[field].trim());
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) {
        localStorage.setItem('redirectUrl', '/checkout');
        navigate('/login');
        return;
      }

      const orderData = {
        items: cart.items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          address1: shippingData.address1,
          address2: shippingData.address2,
          city: shippingData.city,
          state: shippingData.state,
          zip: shippingData.zip,
          country: shippingData.country
        },
        totalAmount: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        paymentStatus: 'completed'
      };

      const response = await api.post('/orders', orderData);
      console.log('Order created:', response.data);
      
      dispatch(clearCart());
      setActiveStep(activeStep + 1);
    } catch (err) {
      console.error('Order error:', err);
      if (err.response?.status === 401) {
        localStorage.setItem('redirectUrl', '/checkout');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First name"
                name="firstName"
                value={shippingData.firstName}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last name"
                name="lastName"
                value={shippingData.lastName}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address line 1"
                name="address1"
                value={shippingData.address1}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address line 2"
                name="address2"
                value={shippingData.address2}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingData.city}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province/Region"
                name="state"
                value={shippingData.state}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip / Postal code"
                name="zip"
                value={shippingData.zip}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={shippingData.country}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="saveAddress"
                    checked={shippingData.saveAddress}
                    onChange={handleShippingChange}
                  />
                }
                label="Save this address for future orders"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name on card"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Card number"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Expiry date"
                name="expDate"
                placeholder="MM/YY"
                value={paymentData.expDate}
                onChange={handlePaymentChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CVV"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handlePaymentChange}
                  />
                }
                label="Save this card for future purchases"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order summary
            </Typography>
            {cart.items.map((item) => (
              <Box key={item.id} sx={{ py: 1 }}>
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  ${cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return validateShippingData();
      case 1:
        return validatePaymentData();
      case 2:
        return true;
      default:
        return false;
    }
  };

  if (activeStep === steps.length) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Thank you for your order!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Your order has been placed successfully. We'll send you an email confirmation with tracking details.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          View Orders
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading || !isStepValid(activeStep)}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              activeStep === steps.length - 1 ? 'Place order' : 'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 