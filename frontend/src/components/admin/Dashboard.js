import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Tab,
  Tabs,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (tabValue) {
        case 0:
          const productsResponse = await axios.get('/api/products');
          setProducts(productsResponse.data.products);
          break;
        case 1:
          const ordersResponse = await axios.get('/api/orders');
          setOrders(ordersResponse.data);
          break;
        case 2:
          const usersResponse = await axios.get('/api/users');
          setUsers(usersResponse.data);
          break;
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductFormChange = (event) => {
    const { name, value } = event.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSubmit = async () => {
    try {
      if (selectedProduct) {
        await axios.put(`/api/products/${selectedProduct._id}`, productForm);
        setSuccess('Product updated successfully');
      } else {
        await axios.post('/api/products', productForm);
        setSuccess('Product created successfully');
      }
      setOpenProductDialog(false);
      fetchData();
    } catch (error) {
      setError('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setSuccess('Product deleted successfully');
      fetchData();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
    setOpenProductDialog(true);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status });
      setSuccess('Order status updated successfully');
      fetchData();
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const renderDashboardCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">
              {products.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">
              {orders.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">
              {users.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {renderDashboardCards()}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Products" />
            <Tab label="Orders" />
            <Tab label="Users" />
          </Tabs>
        </Box>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedProduct(null);
                setProductForm({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  stock: '',
                  imageUrl: ''
                });
                setOpenProductDialog(true);
              }}
            >
              Add Product
            </Button>
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditProduct(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteProduct(product._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleUpdateOrderStatus(order._id, 'processing')}
                      >
                        Mark Processing
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                      >
                        Mark Shipped
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={productForm.name}
                onChange={handleProductFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={productForm.description}
                onChange={handleProductFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={productForm.price}
                onChange={handleProductFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock"
                name="stock"
                value={productForm.stock}
                onChange={handleProductFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={productForm.category}
                onChange={handleProductFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={productForm.imageUrl}
                onChange={handleProductFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button onClick={handleProductSubmit} variant="contained">
            {selectedProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 