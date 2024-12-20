const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    const { category, sort, page = 1, limit = 10 } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query)
      .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const count = await Product.countDocuments(query);

    console.log('Found products:', products);
    console.log('Total count:', count);

    const response = {
      products: products || [],
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      totalProducts: count
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create product (admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    product.reviews.push(review);
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 