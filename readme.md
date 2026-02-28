# 🛒 E-Commerce Platform

A modern, full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB. This platform features a responsive customer store, comprehensive admin dashboard, robust RESTful API with JWT authentication, and automated CI/CD pipelines using GitHub Actions.

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 CI/CD & Deployment](#-cicd--deployment)
- [🏗️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🌐 Application URLs](#-application-urls)
- [📡 API Endpoints](#-api-endpoints)
- [📱 Screenshots](#-screenshots)
- [🔧 Configuration](#-configuration)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [🚀 Future Enhancements](#-future-enhancements)
- [🔥 Workflow Status](#-workflow-status)
- [📝 License](#-license)
- [👨‍💻 Author & Contact](#-author--contact)
- [🙏 Acknowledgments](#-acknowledgments)
- [📊 Quick Reference](#-quick-reference)

![E-Commerce Platform](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-black)

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

## 🚀 CI/CD & Deployment

This project uses **GitHub Actions** for automated testing, building, and deployment. Every push to the `master` branch triggers automated workflows that ensure code quality and deploy to production.

### 🔄 GitHub Actions Workflows

#### 1. **Backend CI/CD** (`.github/workflows/backend.yml`)

Automates backend testing and deployment to Render.

**Triggers:**

- Push to `master` branch (when `backend/**` files change)
- Pull requests to `master` (affecting backend)
- Manual workflow dispatch

**Workflow Steps:**

1. **Test Job:**
   - Code checkout
   - Node.js 20.x setup with npm cache
   - Dependency installation (`npm ci`)
   - Syntax validation (`node -c server.js`)
   - Run tests (if configured)
   - Build verification

2. **Deploy Job** (only on `master` push):
   - Triggers Render deploy hook
   - Waits for deployment completion (2-5 minutes)
   - Health check with retry logic (20 attempts)
   - Deployment summary in GitHub Actions UI

**Deployment Platform:** 🔵 Render
**Production URL:** https://e-commerce-t8ov.onrender.com

#### 2. **Frontend CI/CD** (`.github/workflows/frontend.yml`)

Automates frontend testing and deployment to Vercel.

**Triggers:**

- Push to `master` branch (when `frontend/**` files change)
- Pull requests to `master` (affecting frontend)
- Manual workflow dispatch

**Workflow Steps:**

1. **Test Job:**
   - Code checkout
   - Node.js 20.x setup with npm cache
   - Install dependencies
   - Run tests (`npm test`)
   - Build application (`npm run build`)
   - Upload build artifacts

2. **Deploy Job** (only on `master` push):
   - Install and build with production environment variables
   - Deploy to Vercel using Vercel CLI
   - Verify deployment with health check
   - Generate deployment summary

**Deployment Platform:** ▲ Vercel
**Production URL:** https://e-commerce.hardik-agarwa18.xyz

#### 3. **Admin CI/CD** (`.github/workflows/admin.yml`)

Automates admin panel testing and deployment to Vercel.

**Triggers:**

- Push to `master` branch (when `admin/**` files change)
- Pull requests to `master` (affecting admin)
- Manual workflow dispatch

**Workflow Steps:**

1. **Test Job:**
   - Code checkout
   - Node.js 20.x setup with npm cache
   - Install dependencies (`npm ci`)
   - Run ESLint code quality checks
   - Build application with Vite
   - Upload build artifacts

2. **Deploy Job** (only on `master` push):
   - Build optimized production bundle
   - Deploy to Vercel with admin project configuration
   - Verify deployment availability
   - Generate deployment summary

**Deployment Platform:** ▲ Vercel
**Production URL:** https://admin-ecommerce.hardik-agarwal18.xyz

#### 4. **Health Check** (`.github/workflows/health-check.yml`)

Monitors all deployed services for availability and performance.

**Triggers:**

- Scheduled: Every 6 hours (`0 */6 * * *`)
- After CI/CD pipeline completion
- Manual workflow dispatch

**Checks Performed:**

- Backend API health and response time
- Frontend availability and response time
- Admin panel availability and response time
- HTTP status code validation
- Generates comprehensive health report
- Fails if any service returns non-2xx/3xx status

**Report Format:**

```
================================================
           HEALTH CHECK RESULTS
================================================

🔧 Backend:   HTTP 200  (0.234s)
🌐 Frontend:  HTTP 200  (0.156s)
👨‍💼 Admin:     HTTP 200  (0.189s)

Time: 2026-02-28 12:00:00 UTC
================================================
```

### 🔐 Required GitHub Secrets

Configure these secrets in: **Repository Settings → Secrets and variables → Actions**

#### Backend Deployment (2 secrets)

| Secret Name          | Description               | Example Value                              |
| -------------------- | ------------------------- | ------------------------------------------ |
| `RENDER_DEPLOY_HOOK` | Render deployment webhook | `https://api.render.com/deploy/srv-xxx...` |
| `BACKEND_URL`        | Backend production URL    | `https://e-commerce-t8ov.onrender.com`     |

#### Frontend Deployment (5 secrets)

| Secret Name                  | Description                  | Example Value                            |
| ---------------------------- | ---------------------------- | ---------------------------------------- |
| `VERCEL_TOKEN`               | Vercel authentication token  | `ABC123...`                              |
| `VERCEL_ORG_ID`              | Vercel organization ID       | `team_xxx...`                            |
| `VERCEL_FRONTEND_PROJECT_ID` | Frontend project ID          | `prj_xxx...`                             |
| `REACT_APP_BACKEND_URL`      | Backend API URL for frontend | `https://e-commerce-t8ov.onrender.com`   |
| `FRONTEND_URL`               | Frontend production URL      | `https://e-commerce.hardik-agarwa18.xyz` |

#### Admin Deployment (3 secrets)

| Secret Name               | Description               | Example Value                                  |
| ------------------------- | ------------------------- | ---------------------------------------------- |
| `VERCEL_ADMIN_PROJECT_ID` | Admin project ID          | `prj_xxx...`                                   |
| `VITE_BACKEND_URL`        | Backend API URL for admin | `https://e-commerce-t8ov.onrender.com`         |
| `ADMIN_URL`               | Admin production URL      | `https://admin-ecommerce.hardik-agarwal18.xyz` |

**Total Required Secrets:** 11

### 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Backend    │  │   Frontend   │  │    Admin     │     │
│  │  (Node.js)   │  │   (React)    │  │   (React)    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │ Push to master   │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions CI/CD                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Backend      │  │ Frontend     │  │ Admin        │     │
│  │ Workflow     │  │ Workflow     │  │ Workflow     │     │
│  │              │  │              │  │              │     │
│  │ • Checkout   │  │ • Checkout   │  │ • Checkout   │     │
│  │ • Test       │  │ • Test       │  │ • ESLint     │     │
│  │ • Build      │  │ • Build      │  │ • Build      │     │
│  │ • Deploy     │  │ • Deploy     │  │ • Deploy     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Production Deployment                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Render     │  │   Vercel     │  │   Vercel     │     │
│  │              │  │              │  │              │     │
│  │   Backend    │  │   Frontend   │  │    Admin     │     │
│  │              │  │              │  │              │     │
│  │   API Server │  │   React App  │  │   Dashboard  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ☁️ Cloud Hosting    ▲ Edge Network   ▲ Edge Network      │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │   Health Check     │
                   │   Every 6 hours    │
                   │   • Availability   │
                   │   • Response Time  │
                   │   • Status Codes   │
                   └────────────────────┘
```

### 🎯 How to Deploy

#### Automatic Deployment

1. Make changes to your code
2. Commit and push to `master` branch
3. GitHub Actions automatically:
   - Runs tests
   - Builds the application
   - Deploys to production
   - Verifies deployment

#### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select the workflow (Backend/Frontend/Admin)
3. Click **Run workflow**
4. Select `master` branch
5. Click **Run workflow** button

#### Monitor Deployments

- **GitHub Actions Tab**: View workflow runs and logs
- **Render Dashboard**: Monitor backend server status
- **Vercel Dashboard**: Monitor frontend and admin deployments
- **Health Checks**: Automated every 6 hours

### 📈 Deployment Features

- ✅ **Automated Testing**: Code quality checks before deployment
- ✅ **Build Verification**: Ensures successful builds
- ✅ **Rollback Support**: Easy rollback via Vercel/Render dashboards
- ✅ **Environment Variables**: Secure secret management
- ✅ **Health Monitoring**: Automated health checks
- ✅ **Deployment Summaries**: Detailed reports in GitHub Actions
- ✅ **Artifact Storage**: Build artifacts stored for debugging
- ✅ **Path-based Triggers**: Only deploys when relevant files change
- ✅ **Pull Request Previews**: Test builds for pull requests

## 🏗️ Project Structure

```
📦 E-Commerce Platform
├── 🎨 frontend/          # React.js customer application
│   ├── src/
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Main application pages
│   │   ├── Context/      # React context for state management
│   │   ├── Assets/       # Static assets and images
│   │   └── lib/          # Utility libraries (axios)
│   ├── public/          # Public assets
│   └── package.json
├── ⚙️ backend/           # Node.js & Express.js API
│   ├── controllers/      # Business logic controllers
│   │   ├── AuthControllers.js
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   ├── AdminController.js
│   │   ├── AddressController.js
│   │   ├── WishlistController.js
│   │   ├── AnalyticsController.js
│   │   └── UploadController.js
│   ├── models/          # MongoDB data models
│   │   ├── UserModel.js
│   │   ├── ProductModel.js
│   │   ├── CartModel.js
│   │   ├── OrderModel.js
│   │   ├── WishListModel.js
│   │   ├── AddressModel.js
│   │   ├── ReviewsModel.js
│   │   ├── PromoCodeModel.js
│   │   └── GiftCardModel.js
│   ├── routes/          # API route definitions
│   │   ├── AuthRoutes.js
│   │   ├── ProductRoutes.js
│   │   ├── CartRoutes.js
│   │   ├── AdminRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── AnalyticsRoutes.js
│   │   └── UploadRoutes.js
│   ├── middleware/      # Custom middleware functions
│   │   ├── auth.js         # Authentication middleware
│   │   ├── admin.js        # Admin authorization
│   │   ├── multer.js       # File upload configuration
│   │   └── rateLimiter.js  # Rate limiting
│   ├── config/          # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   └── cloudinary.js   # Cloudinary setup
│   ├── schemas/         # JSON schema definitions
│   ├── scripts/         # Utility scripts
│   ├── uml-diagrams/    # Database diagrams & documentation
│   ├── upload/          # Uploaded files storage
│   │   └── images/      # Product images
│   ├── utils/           # Helper utilities
│   │   └── cloudinaryHelper.js
│   ├── .env             # Environment variables (create this)
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   └── package.json
├── 🔐 admin/             # React.js admin dashboard
│   ├── src/
│   │   ├── Components/   # Admin-specific components
│   │   │   ├── AddProduct/
│   │   │   ├── ListProduct/
│   │   │   ├── Auth/
│   │   │   ├── Navbar/
│   │   │   └── Sidebar/
│   │   ├── Pages/        # Admin dashboard pages
│   │   │   └── Admin/
│   │   ├── assets/       # Static data and images
│   │   └── lib/          # Utility libraries
│   ├── public/          # Public assets
│   ├── eslint.config.js # ESLint configuration
│   ├── vite.config.js   # Vite configuration
│   └── package.json
├── 📄 docs/              # Project documentation
│   ├── ADMIN_UI_DESIGN.md        # Admin panel design docs
│   ├── DEPLOYMENT_GUIDE.md       # Deployment instructions
│   ├── DEVELOPMENT_ROADMAP.md    # Future development plans
│   ├── FEATURE_STATUS.md         # Feature implementation status
│   ├── RESPONSIVE_DESIGN.md      # Responsive design guidelines
│   └── SECRETS_REFERENCE.md      # Environment variables guide
├── 🔄 .github/           # GitHub configuration
│   └── workflows/        # GitHub Actions CI/CD
│       ├── backend.yml       # Backend deployment workflow
│       ├── frontend.yml      # Frontend deployment workflow
│       ├── admin.yml         # Admin deployment workflow
│       └── health-check.yml  # Health monitoring workflow
├── .gitignore           # Git ignore rules
└── README.md            # This file - Project documentation
```

## 🛠️ Tech Stack

### Frontend

- **React.js 18.3.1** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

### Backend

- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web application framework
- **MongoDB 6.8.0** - NoSQL database
- **Mongoose 8.6.0** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - JSON Web Tokens for authentication
- **Bcrypt 6.0.0** - Password hashing
- **Multer 1.4.5-lts.1** - File upload handling
- **Cloudinary 1.41.3** - Image storage and optimization
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 16.6.1** - Environment variable management
- **Cookie Parser 1.4.7** - Cookie parsing middleware
- **Express Rate Limit 8.0.1** - API rate limiting
- **Morgan 1.10.1** - HTTP request logger
- **Nodemon 3.1.10** - Development server auto-restart (dev dependency)

### Admin Panel

- **React.js 18.3.1** - Admin interface framework
- **Vite 5.4.1** - Build tool and development server
- **React Router DOM 6.26.2** - Navigation and routing
- **Axios 1.10.0** - API communication
- **ESLint 9.9.0** - Code quality and linting
- **@vitejs/plugin-react 4.3.1** - Vite React plugin

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

#### Development (Local)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Admin Panel**: http://localhost:5173

#### Production (Live)

- **Frontend**: https://e-commerce.hardik-agarwa18.xyz _(Hosted on Vercel)_
- **Backend API**: https://e-commerce-t8ov.onrender.com _(Hosted on Render)_
- **Admin Panel**: https://admin-ecommerce.hardik-agarwal18.xyz _(Hosted on Vercel)_

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
# Use a strong random string (minimum 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Get credentials from: https://cloudinary.com/console

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100  # Maximum requests per window

# Optional: SMTP for Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
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
- **Cart Model**: Shopping cart with product references
- **Wishlist Model**: Saved products for users
- **Order Model**: Order tracking, delivery information, and payment status
- **Address Model**: User shipping and billing addresses
- **Reviews Model**: Product reviews and ratings
- **PromoCode Model**: Discount codes and promotions
- **GiftCard Model**: Gift card management

### 📚 Additional Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[FEATURE_STATUS.md](docs/FEATURE_STATUS.md)** - Detailed feature implementation status (2486 lines)
  - Complete API endpoints reference
  - Implementation progress tracking
  - Database models documentation
  - 40% completion status with detailed notes

- **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Deployment setup guide
  - GitHub Actions configuration
  - Secrets management
  - Platform-specific instructions
  - Quick setup scripts

- **[DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md)** - Future development plans
  - Planned features
  - Enhancement priorities
  - Technical improvements

- **[RESPONSIVE_DESIGN.md](docs/RESPONSIVE_DESIGN.md)** - Responsive design guidelines
  - Mobile-first approach
  - Breakpoint specifications
  - CSS best practices

- **[ADMIN_UI_DESIGN.md](docs/ADMIN_UI_DESIGN.md)** - Admin panel design documentation
  - UI/UX specifications
  - Component guidelines
  - Admin features overview

- **[SECRETS_REFERENCE.md](docs/SECRETS_REFERENCE.md)** - Environment variables reference
  - Complete secrets list
  - Configuration examples
  - Security best practices

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
- 🔄 **CI/CD**: Ensure all GitHub Actions workflows pass
- ✅ **Code Quality**: Run ESLint for admin panel changes
- 🎯 **Pull Requests**: Create PRs against the `master` branch

### GitHub Actions & CI/CD

When you create a pull request:

- ✅ Automated tests will run
- ✅ Build verification will be performed
- ✅ Code quality checks will be executed
- ✅ You'll see workflow status in the PR

**Note:** Deployment to production only happens on merge to `master`

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
- ☁️ **Cloud Deployment**: AWS/Azure deployment options
- 🔐 **OAuth**: Social media login integration
- 📱 **PWA**: Progressive Web App features
- 🔍 **Monitoring**: Application performance monitoring (APM)
- 📊 **Logging**: Centralized logging system (ELK stack)
- 🚀 **CDN**: Content delivery network integration
- 🔒 **Security**: Enhanced security measures (OWASP)

### CI/CD Enhancements

- 🧪 **Automated Testing**: Unit and integration tests
- 📦 **Dependency Scanning**: Automated security vulnerability checks
- 🎨 **Code Coverage**: Test coverage reporting
- 🚦 **Staging Environment**: Pre-production testing environment
- 📊 **Performance Testing**: Load and stress testing
- 🔄 **Blue-Green Deployment**: Zero-downtime deployments
- 📝 **Changelog Generation**: Automated changelog from commits

## 🔥 Workflow Status

Check the current status of all GitHub Actions workflows:

[![Backend CI/CD](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/backend.yml/badge.svg)](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/backend.yml)
[![Frontend CI/CD](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/frontend.yml/badge.svg)](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/frontend.yml)
[![Admin CI/CD](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/admin.yml/badge.svg)](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/admin.yml)
[![Health Check](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/health-check.yml/badge.svg)](https://github.com/hardik-agarwal18/e-commerce/actions/workflows/health-check.yml)

**Click on any badge to view detailed workflow status and logs.**

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

## 📊 Quick Reference

### 🔗 Important Links

| Resource                | URL/Location                                           |
| ----------------------- | ------------------------------------------------------ |
| **Production Frontend** | https://e-commerce.hardik-agarwa18.xyz                 |
| **Production Admin**    | https://admin-ecommerce.hardik-agarwal18.xyz           |
| **Production API**      | https://e-commerce-t8ov.onrender.com                   |
| **GitHub Actions**      | https://github.com/hardik-agarwal18/e-commerce/actions |
| **Issues Tracker**      | https://github.com/hardik-agarwal18/e-commerce/issues  |
| **Feature Status**      | [docs/FEATURE_STATUS.md](docs/FEATURE_STATUS.md)       |
| **Deployment Guide**    | [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)   |

### 📋 GitHub Actions Workflows Summary

| Workflow           | File                                 | Triggers                         | Deployment |
| ------------------ | ------------------------------------ | -------------------------------- | ---------- |
| **Backend CI/CD**  | `.github/workflows/backend.yml`      | Push to `master` (backend/\*\*)  | Render     |
| **Frontend CI/CD** | `.github/workflows/frontend.yml`     | Push to `master` (frontend/\*\*) | Vercel     |
| **Admin CI/CD**    | `.github/workflows/admin.yml`        | Push to `master` (admin/\*\*)    | Vercel     |
| **Health Check**   | `.github/workflows/health-check.yml` | Every 6 hours + Manual           | N/A        |

### 🔐 Required Secrets Checklist

**Copy this to ensure all secrets are configured:**

```markdown
Backend Deployment:

- [ ] RENDER_DEPLOY_HOOK
- [ ] BACKEND_URL

Frontend Deployment:

- [ ] VERCEL_TOKEN
- [ ] VERCEL_ORG_ID
- [ ] VERCEL_FRONTEND_PROJECT_ID
- [ ] REACT_APP_BACKEND_URL
- [ ] FRONTEND_URL

Admin Deployment:

- [ ] VERCEL_ADMIN_PROJECT_ID
- [ ] VITE_BACKEND_URL
- [ ] ADMIN_URL

Total: 11 secrets required
```

### 🚀 Common Commands

#### Development

```bash
# Start backend server
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Start admin panel
cd admin && npm run dev

# Run ESLint (Admin)
cd admin && npm run lint
```

#### Testing & Building

```bash
# Build frontend
cd frontend && npm run build

# Build admin
cd admin && npm run build

# Run frontend tests
cd frontend && npm test
```

#### Deployment

```bash
# Trigger manual deployment
# Go to: GitHub → Actions → Select workflow → Run workflow

# Check deployment health
curl https://e-commerce-t8ov.onrender.com
curl https://e-commerce.hardik-agarwa18.xyz
curl https://admin-ecommerce.hardik-agarwal18.xyz
```

### 🔍 Monitoring & Debugging

| Task                   | Command/Location                                                        |
| ---------------------- | ----------------------------------------------------------------------- |
| **View workflow logs** | GitHub → Actions → Select workflow run                                  |
| **Backend logs**       | Render Dashboard → Logs tab                                             |
| **Frontend logs**      | Vercel Dashboard → Deployments → View logs                              |
| **Admin logs**         | Vercel Dashboard → Deployments → View logs                              |
| **API endpoint test**  | `curl https://e-commerce-t8ov.onrender.com/api/products/getallproducts` |
| **Check MongoDB**      | MongoDB Atlas → Cluster → Metrics                                       |

### 📞 Support & Resources

| Resource            | Link                                                    |
| ------------------- | ------------------------------------------------------- |
| **GitHub Issues**   | Report bugs and request features                        |
| **Documentation**   | See `docs/` folder                                      |
| **Feature Status**  | 40% complete - See FEATURE_STATUS.md                    |
| **Deployment Help** | See DEPLOYMENT_GUIDE.md                                 |
| **Email Support**   | [your.email@example.com](mailto:your.email@example.com) |

### 🎯 Development Workflow

1. **Clone repository**

   ```bash
   git clone https://github.com/hardik18-hk19/e-commerce.git
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes and test locally**

   ```bash
   # Test your changes
   npm run dev  # or npm start
   ```

4. **Commit and push**

   ```bash
   git add .
   git commit -m "Add: My awesome feature"
   git push origin feature/my-feature
   ```

5. **Create Pull Request**
   - GitHub will automatically run tests
   - Wait for workflow checks to pass
   - Request review if needed

6. **Merge to master**
   - Automatic deployment will trigger
   - Monitor deployment in GitHub Actions
   - Verify on production URLs

### 🛠️ Technology Stack Summary

| Layer              | Technologies                                           |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | React 18.3.1, React Router 6.24.1, Axios 1.10.0        |
| **Admin**          | React 18.3.1, Vite 5.4.1, React Router 6.26.2          |
| **Backend**        | Node.js, Express 4.19.2, MongoDB 6.8.0, Mongoose 8.6.0 |
| **Authentication** | JWT 9.0.2, Bcrypt 6.0.0                                |
| **File Storage**   | Cloudinary 1.41.3, Multer 1.4.5                        |
| **CI/CD**          | GitHub Actions                                         |
| **Deployment**     | Vercel (Frontend/Admin), Render (Backend)              |
| **Monitoring**     | GitHub Actions Health Checks                           |

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
