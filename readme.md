# 🛒 E-Commerce Platform

A modern, full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB. This platform features a responsive customer store, comprehensive admin dashboard, and robust RESTful API with JWT authentication.

![E-Commerce Platform](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## ✨ Features

### 🛍️ Customer Features

- **Product Catalog**: Browse products by categories (Men, Women, Kids)
- **Product Search & Filter**: Advanced filtering and search capabilities
- **Shopping Cart**: Add, remove, and manage cart items with real-time updates
- **User Authentication**: Secure login and registration with JWT tokens
- **Product Details**: Detailed product information with multiple images
- **Wishlist**: Save favorite products for later
- **Order History**: Track past purchases and order status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Cart Updates**: Persistent cart across sessions

### 🔧 Admin Features

- **Product Management**: Add, edit, and delete products with bulk operations
- **Image Upload**: Multi-image upload with preview and optimization
- **Inventory Management**: Track product stock, pricing, and availability
- **User Management**: Monitor registered users and activity
- **Order Management**: Process orders, update status, and track deliveries
- **Dashboard Analytics**: Sales metrics, revenue charts, and product insights
- **Protected Routes**: Role-based access control for admin features
- **Responsive Admin Panel**: Mobile-friendly admin interface

### 🚀 Technical Features

- **RESTful API**: Well-structured backend endpoints with proper HTTP methods
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **File Upload**: Image handling with Multer and validation
- **Database Integration**: MongoDB with Mongoose ODM and indexing
- **CORS Support**: Cross-origin resource sharing configuration
- **Environment Configuration**: Secure environment variables management
- **Error Handling**: Comprehensive error handling and logging
- **Input Validation**: Server-side data validation and sanitization
- **Rate Limiting**: API protection against abuse
- **Security Middleware**: Helmet, bcrypt password hashing

## 🏗️ Project Structure

```
📦 E-Commerce Platform
├── 🎨 frontend/          # React.js customer application
│   ├── src/
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Main application pages
│   │   ├── Context/      # React context for state management
│   │   └── Assets/       # Static assets and images
│   ├── public/          # Public assets
│   └── package.json
├── ⚙️ backend/           # Node.js & Express.js API
│   ├── controllers/      # Business logic controllers
│   ├── models/          # MongoDB data models
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware functions
│   ├── config/          # Database configuration
│   ├── upload/          # Uploaded files storage
│   ├── .env             # Environment variables (create this)
│   └── package.json
├── 🔐 admin/             # React.js admin dashboard
│   ├── src/
│   │   ├── Components/   # Admin-specific components
│   │   ├── Pages/        # Admin dashboard pages
│   │   └── lib/          # Utility libraries
│   ├── public/          # Public assets
│   └── package.json
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
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
- **Dotenv** - Environment variable management
- **Cookie Parser** - Cookie parsing middleware
- **Nodemon** - Development server auto-restart

### Admin Panel

- **React.js 18.3.1** - Admin interface
- **Vite** - Build tool and development server
- **React Router DOM** - Navigation
- **Axios** - API communication

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended
- **npm** or **yarn** package manager
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/hardik18-hk19/e-commerce.git
   cd e-commerce
   ```

2. **Backend Setup** 🔧

   ```bash
   cd backend
   npm install

   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret

   npm run dev
   ```

3. **Frontend Setup** 🎨

   ```bash
   cd ../frontend
   npm install

   # Create .env file for frontend
   echo "REACT_APP_BACKEND_URL=http://localhost:4000" > .env

   npm start
   ```

4. **Admin Panel Setup** ⚙️

   ```bash
   cd ../admin
   npm install

   # Create .env.local file for admin panel
   echo "VITE_BACKEND_URL=http://localhost:4000" > .env.local

   npm run dev
   ```

### 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Panel**: http://localhost:5173

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/logout` - User logout and token invalidation
- `GET /api/auth/profile` - Get authenticated user profile

### Products

- `GET /api/products/getallproducts` - Get all products with pagination
- `GET /api/products/:id` - Get single product details
- `POST /api/products/addproduct` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product details (Admin only)
- `DELETE /api/products/removeproduct` - Delete product (Admin only)
- `GET /api/products/newcollection` - Get featured/new products
- `GET /api/products/popularinwomen` - Get popular women's products

### Cart Management

- `POST /api/products/addtocart` - Add item to user cart
- `POST /api/products/removefromcart` - Remove item from cart
- `GET /api/products/getcart` - Get user's cart items

### File Upload

- `POST /api/upload/image` - Upload product images with validation

### Admin Routes

- `GET /api/admin/users` - Get all registered users
- `GET /api/admin/stats` - Get dashboard statistics

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
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_KEY=mongodb://localhost:27017/ecommerce
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Optional: External Services
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
```

**Frontend (.env)**

```env
REACT_APP_BACKEND_URL=http://localhost:4000
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

**Admin Panel (.env.local)**

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000/api
```

**Important Security Notes:**

- 🔐 Use a strong JWT secret (minimum 32 characters)
- 🛡️ For production, use MongoDB Atlas or secure database hosting
- 🚫 Never commit `.env` files to version control
- 🔑 Use environment-specific configurations for different deployments
- 📧 Configure SMTP for email notifications (optional)

### Database Models

- **User Model**: User authentication, profile data, and cart information
- **Product Model**: Product details, pricing, inventory, and categories
- **Order Model**: Order tracking, delivery information, and payment status (coming soon)

### Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with token expiration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured cross-origin resource sharing
- **Rate Limiting**: API endpoint protection against abuse
- **Environment Variables**: Sensitive data stored securely

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Issues

**❌ Backend not starting:**

- ✅ Ensure MongoDB is running (local) or connection string is correct (cloud)
- ✅ Check if `.env` file exists in `backend/` directory
- ✅ Verify all required environment variables are set
- ✅ Run `npm install` in backend directory
- ✅ Check if port 4000 is available

**❌ Database connection errors:**

```bash
# Check MongoDB status (local installation)
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
net start MongoDB                  # Windows

# Test connection string
mongosh "your_connection_string"
```

#### Frontend Issues

**❌ Frontend connection errors:**

- ✅ Verify backend is running on port 4000
- ✅ Check CORS configuration in backend
- ✅ Ensure API endpoints are correct in frontend code
- ✅ Check browser console for detailed error messages

**❌ Login/Authentication issues:**

- ✅ Check JWT secret in backend `.env`
- ✅ Verify token storage in browser localStorage
- ✅ Check network tab for API response errors

#### Admin Panel Issues

**❌ Admin panel not loading:**

- ✅ Confirm Vite dev server is running
- ✅ Check if port 5173 is available
- ✅ Verify React Router configuration
- ✅ Check admin credentials in backend `.env`

**❌ File upload issues:**

- ✅ Check if `upload/images/` directory exists in backend
- ✅ Verify Multer configuration
- ✅ Ensure proper file permissions
- ✅ Check file size limits (default: 10MB)

### Port Conflicts

If default ports are in use, you can change them:

```bash
# Backend: Modify PORT in .env file
PORT=5000

# Frontend: Set custom port
PORT=3001 npm start
# or
npm start -- --port 3001

# Admin: Use custom port
npm run dev -- --port 5174
```

### Performance Optimization

- 🚀 **Database Indexing**: Ensure proper indexes on frequently queried fields
- 🖼️ **Image Optimization**: Compress images before upload
- 📦 **Bundle Size**: Use React DevTools Profiler to identify large components
- 🔄 **Caching**: Implement Redis for session storage (production)
- 📊 **Monitoring**: Use tools like Morgan for request logging

## 🤝 Contributing

We welcome contributions to improve this e-commerce platform! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/e-commerce.git
   cd e-commerce
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

### Development Guidelines

- 📝 **Code Style**: Follow existing code patterns and formatting
- 🧪 **Testing**: Add tests for new features
- 📖 **Documentation**: Update README and comments as needed
- 🔧 **Commits**: Use clear, descriptive commit messages

### Types of Contributions

- 🐛 **Bug Fixes**: Fix existing issues
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve documentation
- 🎨 **UI/UX**: Enhance user interface and experience
- ⚡ **Performance**: Optimize code performance
- 🔒 **Security**: Improve security measures

### Submitting Changes

1. **Commit your changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
2. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
3. **Open a Pull Request** with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Testing instructions

### Code of Conduct

- 🤝 Be respectful and inclusive
- 📝 Provide constructive feedback
- 🎯 Focus on the project goals
- 🚀 Help others learn and grow

## � Future Enhancements

### Planned Features

- 🛒 **Order Management System**: Complete order tracking and management
- 💳 **Payment Integration**: Stripe/PayPal payment gateway
- 📧 **Email Notifications**: Order confirmations and updates
- 🔍 **Advanced Search**: Elasticsearch integration
- 📱 **Mobile App**: React Native mobile application
- 🌐 **Multi-language**: i18n internationalization support
- ☁️ **Cloud Storage**: AWS S3 for image storage
- 📊 **Analytics Dashboard**: Advanced sales analytics
- 🎁 **Coupon System**: Discount codes and promotions
- ⭐ **Product Reviews**: Customer rating and review system

### Architecture Improvements

- 🏗️ **Microservices**: Convert to microservices architecture
- 🔄 **Caching**: Redis implementation for better performance
- 🐳 **Docker**: Containerization for easy deployment
- ☁️ **Cloud Deployment**: AWS/Azure deployment guides
- 🔐 **OAuth**: Social media login integration
- 📱 **PWA**: Progressive Web App features

## �📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

### License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ❌ **Liability** - Use at your own risk
- ❌ **Warranty** - No warranty provided

## 👨‍💻 Author & Contact

**Hardik** - Full Stack Developer

- 🐙 **GitHub**: [@hardik18-hk19](https://github.com/hardik18-hk19)
- 💼 **LinkedIn**: [Connect with me](https://linkedin.com/in/hardik18-hk19)
- 📧 **Email**: [your.email@example.com](mailto:your.email@example.com)
- 🌐 **Portfolio**: [Your Portfolio Website](https://your-portfolio.com)

## 🙏 Acknowledgments

- 🙏 **React.js Community** for excellent documentation and support
- 🍃 **MongoDB** for providing robust database solutions
- ⚡ **Express.js** for simplifying backend development
- 🎨 **UI/UX Inspiration** from modern e-commerce platforms
- 👥 **Open Source Community** for continuous learning and improvement
- 📚 **Stack Overflow** for problem-solving assistance
- 🎯 **All Contributors** who helped improve this project

## 📈 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/hardik18-hk19/e-commerce)
![GitHub last commit](https://img.shields.io/github/last-commit/hardik18-hk19/e-commerce)
![GitHub issues](https://img.shields.io/github/issues/hardik18-hk19/e-commerce)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hardik18-hk19/e-commerce)

---

<div align="center">
  <h3>⭐ Star this repository if you found it helpful! ⭐</h3>
  <p>Your support motivates continued development and improvements!</p>
  
  <p>
    <img src="https://img.shields.io/github/stars/hardik18-hk19/e-commerce?style=social" alt="GitHub stars">
    <img src="https://img.shields.io/github/forks/hardik18-hk19/e-commerce?style=social" alt="GitHub forks">
    <img src="https://img.shields.io/github/watchers/hardik18-hk19/e-commerce?style=social" alt="GitHub watchers">
  </p>
  
  <p>
    <strong>🚀 Happy Coding! 🚀</strong>
  </p>
</div>
