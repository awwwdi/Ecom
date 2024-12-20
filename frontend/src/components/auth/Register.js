import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await api.post('/api/auth/register', registerData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register; 