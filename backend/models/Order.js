const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Virtual for order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD${this._id.toString().slice(-6).toUpperCase()}`;
});

// Ensure virtuals are included in JSON output
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;