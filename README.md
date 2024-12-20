# MERN E-commerce Application

A full-stack e-commerce application built using the MERN (MongoDB, Express, React, Node.js) stack. This project features user authentication, product management, and order processing, providing a seamless shopping experience.

## Features

- User authentication (sign up, login, logout)
- Product listing and management
- Shopping cart functionality
- Order processing
- Responsive design using Material-UI
- State management with Redux

## Technologies Used

- **Frontend**: React, Redux, Material-UI, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Environment Variables**: dotenv

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed or access to a MongoDB Atlas account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mern-ecommerce.git
   cd mern-ecommerce
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the `backend` directory and add your MongoDB URI:
     ```
     MONGODB_URI=your_mongodb_uri
     PORT=5000
     ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

6. Start the frontend application:
   ```bash
   npm start
   ```

### Usage

- Access the application in your browser at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various e-commerce platforms and tutorials.
- Thanks to the open-source community for their contributions.
