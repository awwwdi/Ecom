const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes
router.post('/', auth, admin, productController.createProduct);
router.put('/:id', auth, admin, productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);
router.post('/:id/reviews', auth, productController.addReview);

module.exports = router; 