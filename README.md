# MERN E-Commerce Platform

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Register/Login)
- Product catalog with categories
- Product search and filtering
- Shopping cart functionality
- Secure checkout process
- Order history and tracking
- Admin dashboard
- Product management
- Order management
- User management
- Responsive design

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material-UI for UI components
- Axios for API calls
- React Router for routing

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd mern-ecommerce
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Auth Routes
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Product Routes
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Order Routes
- POST /api/orders - Create order
- GET /api/orders/my-orders - Get user orders
- GET /api/orders/:id - Get single order
- GET /api/orders - Get all orders (admin)
- PATCH /api/orders/:id/status - Update order status (admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 