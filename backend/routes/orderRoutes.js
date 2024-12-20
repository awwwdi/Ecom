const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// All routes require authentication
router.use(auth);

// User routes
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.post('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', admin, orderController.getAllOrders);
router.patch('/:id/status', admin, orderController.updateOrderStatus);

module.exports = router; 