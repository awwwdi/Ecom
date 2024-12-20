import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Box,
  Paper,
  TextField,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Error loading product details');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      setError('Not enough stock available');
      return;
    }
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl
    }));
    setSuccess('Added to cart successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
      setSuccess('Review submitted successfully');
    } catch (error) {
      setError('Error submitting review');
    }
  };

  if (!product) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.reviews.length} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Category: {product.category}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Stock: {product.stock} units
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => handleQuantityChange(-1)}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 2 }}>{quantity}</Typography>
            <IconButton onClick={() => handleQuantityChange(1)}>
              <AddIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{ ml: 2 }}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Customer Reviews
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {user && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(e, newValue) => setReviewRating(newValue)}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    label="Your Review"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <List>
            {product.reviews.map((review, index) => (
              <React.Fragment key={review._id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography
                          variant="caption"
                          sx={{ ml: 1 }}
                        >
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={review.comment}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 