import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const cart = useSelector(state => state.cart);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            E-Commerce Store
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <IconButton
                  color="inherit"
                  component={RouterLink}
                  to="/cart"
                  size="large"
                >
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  size="large"
                >
                  <PersonIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  {user.isAdmin && (
                    <MenuItem component={RouterLink} to="/admin">
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                  )}
                  
                  <MenuItem component={RouterLink} to="/orders">
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    Order History
                  </MenuItem>

                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 