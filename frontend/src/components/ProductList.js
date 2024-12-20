import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const categories = [
    'Electronics', 'Fashion', 'Books', 'Home & Kitchen', 
    'Sports', 'Beauty', 'Toys'
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(category && { category }),
        ...(sort && { sort })
      });

      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={handleCategoryChange} label="Category">
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} onChange={handleSortChange} label="Sort By">
            <MenuItem value="">Latest</MenuItem>
            <MenuItem value="price">Price: Low to High</MenuItem>
            <MenuItem value="-price">Price: High to Low</MenuItem>
            <MenuItem value="-rating">Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.name}
                </Typography>
                <Typography color="text.secondary" noWrap>
                  {product.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
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

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList; 