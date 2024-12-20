const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Validate required fields
    if (!items || !shippingAddress || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order with user ID from auth middleware
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending'
    });

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    await order.save();
    
    // Populate product details in response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price imageUrl');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name price imageUrl');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'name price imageUrl');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Error updating order status' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(400).json({ error: 'Error cancelling order' });
  }
}; 