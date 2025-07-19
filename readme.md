# 🛒 E-Commerce Platform

A full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB. This platform includes a customer-facing store, admin dashboard, and robust backend API.

![E-Commerce Platform](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)

## ✨ Features

### 🛍️ Customer Features

- **Product Catalog**: Browse products by categories (Men, Women, Kids)
- **Product Search & Filter**: Advanced filtering and search capabilities
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Secure login and registration
- **Product Details**: Detailed product information with multiple images
- **Responsive Design**: Optimized for all device sizes

### 🔧 Admin Features

- **Product Management**: Add, edit, and delete products
- **Image Upload**: Multi-image upload for products
- **Inventory Management**: Track product stock and availability
- **User Management**: Monitor registered users
- **Dashboard Analytics**: Sales and product insights

### 🚀 Technical Features

- **RESTful API**: Well-structured backend endpoints
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Image handling with Multer
- **Database Integration**: MongoDB with Mongoose ODM
- **CORS Support**: Cross-origin resource sharing
- **Environment Configuration**: Secure environment variables

## 🏗️ Project Structure

```
📦 E-Commerce Platform
├── 🎨 frontend/          # React.js customer application
│   ├── src/
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Main application pages
│   │   ├── Context/      # React context for state management
│   │   └── Assets/       # Static assets and images
│   └── package.json
├── ⚙️ backend/           # Node.js & Express.js API
│   ├── controllers/      # Business logic controllers
│   ├── models/          # MongoDB data models
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware functions
│   ├── config/          # Database configuration
│   └── package.json
└── 🔐 admin/             # React.js admin dashboard
    ├── src/
    │   ├── Components/   # Admin-specific components
    │   ├── Pages/        # Admin dashboard pages
    │   └── lib/          # Utility libraries
    └── package.json
```

## 🛠️ Tech Stack

### Frontend

- **React.js 18.3.1** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Admin Panel

- **React.js 18.3.1** - Admin interface
- **Vite** - Build tool and development server
- **React Router DOM** - Navigation
- **Axios** - API communication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hardik18-hk19/e-commerce.git
   cd e-commerce
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file with the following variables:
   # PORT=4000
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret_key

   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Admin Panel Setup**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

### 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Panel**: http://localhost:5173

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### File Upload

- `POST /api/upload` - Upload product images

## 📱 Screenshots

### Customer Interface

- **Homepage**: Hero section with featured products
- **Product Catalog**: Category-wise product listing
- **Product Details**: Comprehensive product information
- **Shopping Cart**: Cart management and checkout

### Admin Dashboard

- **Product Management**: Add/edit products with image upload
- **User Management**: View registered users
- **Analytics**: Sales and inventory insights

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Database Models

- **User Model**: User authentication and profile data
- **Product Model**: Product information, pricing, and inventory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hardik** - [@hardik18-hk19](https://github.com/hardik18-hk19)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB for robust database solutions
- Express.js for simplifying backend development
- All contributors who helped improve this project

---

<p align="center">
  <strong>⭐ Star this repository if you found it helpful! ⭐</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/hardik18-hk19/e-commerce?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/hardik18-hk19/e-commerce?style=social" alt="GitHub forks">
</p>
