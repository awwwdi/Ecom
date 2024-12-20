const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'iPhone 13 Pro',
    description: 'Latest iPhone with pro camera system and A15 Bionic chip',
    price: 999.99,
    category: 'Electronics',
    subCategory: 'Smartphones',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 50,
    rating: 4.5,
    featured: true
  },
  {
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals with M1 Pro chip',
    price: 2499.99,
    category: 'Electronics',
    subCategory: 'Laptops',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 30,
    rating: 4.8,
    featured: true
  },
  {
    name: 'Nike Air Max',
    description: 'Comfortable running shoes with air cushioning',
    price: 129.99,
    category: 'Sports',
    subCategory: 'Footwear',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 100,
    rating: 4.3
  },
  {
    name: 'Samsung 4K Smart TV',
    description: '65-inch QLED display with smart features',
    price: 1299.99,
    category: 'Electronics',
    subCategory: 'TVs',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 25,
    rating: 4.6
  },
  {
    name: 'Leather Jacket',
    description: 'Classic leather jacket for men',
    price: 199.99,
    category: 'Fashion',
    subCategory: 'Men',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 45,
    rating: 4.2
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with noise cancellation',
    price: 159.99,
    category: 'Electronics',
    subCategory: 'Audio',
    imageUrl: 'https://picsum.photos/400/400',
    stock: 75,
    rating: 4.4
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();