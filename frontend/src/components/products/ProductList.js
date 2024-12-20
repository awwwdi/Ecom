import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products...');
        const response = await api.get('/products');
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }

        if (!response.data.products) {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response format - missing products array');
        }

        if (!Array.isArray(response.data.products)) {
          console.error('Products is not an array:', response.data.products);
          throw new Error('Invalid response format - products is not an array');
        }

        setProducts(response.data.products);
        setError(null);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        setError(
          err.response?.data?.error || 
          err.message || 
          'Failed to fetch products. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mt: 4 }}>
          No products available at the moment.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>
      
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description ? `${product.description.substring(0, 100)}...` : 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${(product.price || 0).toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList; 