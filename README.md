<div align="center">

# 🌿 EcoMart - E-Commerce Platform

### *Sustainable Shopping Made Simple*

![EcoMart Banner](./docs/banner.png)

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About

**EcoMart** is a full-stack e-commerce platform built with a **microservices architecture** that specializes in eco-friendly and sustainable products. The project demonstrates modern web development practices including JWT authentication, email verification, real-time cart management, and responsive UI design.

### 🎯 Project Goals

- Demonstrate microservices architecture with clear separation of concerns
- Implement secure authentication with JWT tokens and email verification
- Build responsive, animated user interfaces with modern CSS frameworks
- Showcase integration of SQL and NoSQL databases
- Create production-ready, scalable code following industry best practices

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ User registration with email validation
- ✅ OTP-based email verification (6-digit code, 10-minute expiry)
- ✅ JWT token authentication with 24-hour expiration
- ✅ Password hashing with BCrypt (10 rounds)
- ✅ Role-based access control (Customer/Admin)
- ✅ Secure session management (stateless)

### 🛒 E-Commerce Functionality
- ✅ Product catalog with category filtering
- ✅ Advanced search functionality
- ✅ Shopping cart with real-time updates
- ✅ Stock management and validation
- ✅ Order placement and tracking
- ✅ Email order confirmations with HTML templates

### 👨‍💼 Admin Features
- ✅ User management dashboard
- ✅ Product CRUD operations
- ✅ Stock updates and monitoring
- ✅ Order management
- ✅ User role assignment and management

### 🎨 User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ DaisyUI component library
- ✅ Loading states and skeleton screens
- ✅ Error handling with user-friendly messages
- ✅ Form validation (client & server-side)

---

## 🏗️ Architecture

### Microservices Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  Auth Frontend   │         │  Main Frontend   │        │
│  │  (React - 3000)  │         │ (React - 5173)   │        │
│  └────────┬─────────┘         └────────┬─────────┘        │
│           │                             │                   │
└───────────┼─────────────────────────────┼───────────────────┘
            │                             │
            │         API CALLS           │
            │                             │
┌───────────┼─────────────────────────────┼───────────────────┐
│           │     BACKEND SERVICES        │                   │
├───────────┼─────────────────────────────┼───────────────────┤
│           │                             │                   │
│  ┌────────▼─────────┐    ┌──────────────▼────────┐        │
│  │  Auth Service    │    │  Checkout Service     │        │
│  │  Spring Boot     │    │  Spring Boot          │        │
│  │  Port: 8080      │    │  Port: 8082           │        │
│  │  + JWT           │    │  + Email Service      │        │
│  │  + OTP           │    │  + Stock Management   │        │
│  └────────┬─────────┘    └──────────┬────────────┘        │
│           │                          │                      │
│           │              ┌───────────▼────────┐            │
│           │              │  Homepage Service  │            │
│           │              │  Node.js/Express   │            │
│           │              │  Port: 3001        │            │
│           │              │  + Cart API        │            │
│           │              │  + Products API    │            │
│           │              └───────────┬────────┘            │
│           │                          │                      │
└───────────┼──────────────────────────┼──────────────────────┘
            │                          │
            │     DATABASE LAYER       │
            │                          │
┌───────────┼──────────────────────────┼──────────────────────┐
│           │                          │                       │
│  ┌────────▼─────────┐    ┌──────────▼────────────┐        │
│  │  MySQL Database  │    │  MongoDB Atlas        │        │
│  │  (User Auth)     │    │  (Products, Cart,     │        │
│  │  Port: 3306      │    │   Orders)             │        │
│  └──────────────────┘    └───────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Service Responsibilities

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| **Auth Service** | 8080 | Spring Boot + MySQL | User authentication, JWT generation, OTP verification |
| **Checkout Service** | 8082 | Spring Boot + MongoDB | Product management, stock updates, order emails |
| **Homepage Service** | 3001 | Node.js + MongoDB | Product catalog, cart operations, order processing |
| **Auth Frontend** | 3000 | React | Login, registration, OTP verification, admin panel |
| **Main Frontend** | 5173 | React + Vite | Product browsing, cart, checkout, order history |

---

## 🛠️ Tech Stack

### **Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Java](https://img.shields.io/badge/Java-17-orange?logo=java) | 17 | Programming Language |
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen?logo=springboot) | 3.1.5 | Backend Framework |
| ![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x-green?logo=springsecurity) | 6.x | Security & Authentication |
| ![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js) | 18.x | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express) | 4.x | Web Framework |
| ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql) | 8.0 | Relational Database |
| ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb) | 6.x | NoSQL Database |
| ![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens) | - | Token Authentication |
| ![BCrypt](https://img.shields.io/badge/BCrypt-Hashing-red) | - | Password Encryption |

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-18.2-blue?logo=react) | 18.2 | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-4.x-purple?logo=vite) | 4.x | Build Tool & Dev Server |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-cyan?logo=tailwindcss) | 3.x | CSS Framework |
| ![DaisyUI](https://img.shields.io/badge/DaisyUI-3.x-5A0EF8?logo=daisyui) | 3.x | Component Library |
| ![Axios](https://img.shields.io/badge/Axios-1.x-purple?logo=axios) | 1.x | HTTP Client |
| ![React Router](https://img.shields.io/badge/React%20Router-6.x-red?logo=reactrouter) | 6.x | Client-side Routing |

### **Development Tools**

- **Maven** - Build automation for Java projects
- **npm** - Package manager for JavaScript
- **Git** - Version control system
- **Postman** - API testing and documentation
- **VS Code** - Primary code editor
- **MySQL Workbench** - Database management
- **MongoDB Compass** - MongoDB GUI

### **Email Service**

- **JavaMailSender** - Spring Boot email integration
- **Gmail SMTP** - Email delivery service
- **HTML Templates** - Rich email formatting

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### **Required Software**

- **Java Development Kit (JDK)** 17 or higher
```bash
  java -version
  # Expected: java version "17.0.x" or higher
```

- **Node.js** 18.x or higher & npm
```bash
  node --version  # Should be v18.x or higher
  npm --version   # Should be 9.x or higher
```

- **MySQL** 8.0 or higher
```bash
  mysql --version
  # Expected: mysql Ver 8.0.x
```

- **Maven** 3.8 or higher
```bash
  mvn --version
  # Expected: Apache Maven 3.8.x or higher
```

- **Git**
```bash
  git --version
  # Expected: git version 2.x.x
```

### **Required Accounts**

- **MongoDB Atlas Account** (Free tier available)
  - Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
  - Create a free M0 cluster

- **Gmail Account** with App Password
  - Enable 2-Step Verification
  - Generate App Password for SMTP access

---

## 🚀 Installation

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/ecomart.git
cd ecomart
```

### **Step 2: Setup MySQL Database**
```bash
# Login to MySQL
mysql -u root -p

# Execute the following SQL commands
```
```sql
-- Create database
CREATE DATABASE ecommerce_auth;

-- Optional: Create dedicated user
CREATE USER 'ecomart_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ecommerce_auth.* TO 'ecomart_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### **Step 3: Setup MongoDB Atlas**

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster (512 MB storage)
   - Choose a cloud provider and region (closest to you)

2. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Grant "Atlas admin" or "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP address

4. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

### **Step 4: Setup Gmail App Password**

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification" → Enable it

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "EcoMart Application"
   - Click "Generate"
   - **Save the 16-character password** (format: xxxx xxxx xxxx xxxx)

3. **Important Notes**
   - Remove spaces from app password when using in config
   - Never share this password
   - You can revoke and regenerate anytime

---

## ⚙️ Configuration

### **Step 1: Create Configuration Files**

Navigate to each service directory and create configuration files from examples:
```bash
# Auth Service
cd ecommerce-backend/src/main/resources
cp application.properties.example application.properties

# Checkout Service
cd ../../../ecommerce-backendcheckout/src/main/resources
cp application.properties.example application.properties

# Homepage Service
cd ../../../homepage-service
cp .env.example .env
```

### **Step 2: Configure Auth Service**

**File:** `ecommerce-backend/src/main/resources/application.properties`
```properties
# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
spring.application.name=ecommerce-backend
server.port=8080

# ==========================================
# MYSQL DATABASE CONFIGURATION
# ==========================================
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_auth?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# MySQL Driver
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ==========================================
# JPA/HIBERNATE CONFIGURATION
# ==========================================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# ==========================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ==========================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email Timeouts
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# ==========================================
# JWT CONFIGURATION
# ==========================================
# Generate a strong secret key (minimum 256 bits)
# You can use: openssl rand -base64 64
jwt.secret=CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY_MIN_256_BITS
jwt.expiration=86400000
# 86400000 ms = 24 hours

# ==========================================
# CORS CONFIGURATION
# ==========================================
cors.allowed.origins=http://localhost:3000,http://localhost:5173
cors.allowed.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true

# ==========================================
# LOGGING CONFIGURATION
# ==========================================
logging.level.root=INFO
logging.level.com.backend.ecommerce_backend=DEBUG
logging.level.org.springframework.web=DEBUG

# Log file
logging.file.name=logs/ecommerce-backend.log

# ==========================================
# ACTUATOR (Health Check)
# ==========================================
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always

# ==========================================
# ERROR HANDLING
# ==========================================
server.error.include-message=always
server.error.include-binding-errors=always
```

**Replace these placeholders:**
- `YOUR_MYSQL_PASSWORD` → Your MySQL root password
- `YOUR_EMAIL@gmail.com` → Your Gmail address
- `YOUR_16_DIGIT_APP_PASSWORD` → Gmail app password (remove spaces)
- `CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY_MIN_256_BITS` → Generate using: `openssl rand -base64 64`

### **Step 3: Configure Checkout Service**

**File:** `ecommerce-backendcheckout/src/main/resources/application.properties`
```properties
# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
spring.application.name=ecommerce-backend-checkout
server.port=8082

# ==========================================
# MONGODB ATLAS CONFIGURATION
# ==========================================
# Format: mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE
spring.data.mongodb.uri=mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_MONGODB_PASSWORD@YOUR_CLUSTER.mongodb.net/ecomart?retryWrites=true&w=majority&connectTimeoutMS=2000&socketTimeoutMS=2000&serverSelectionTimeoutMS=2000

# Explicit database name
spring.data.mongodb.database=ecomart

# Disable auto-index creation for faster startup
spring.data.mongodb.auto-index-creation=false

# ==========================================
# EMAIL CONFIGURATION (Gmail SMTP)
# ==========================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email Timeouts
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# ==========================================
# LOGGING CONFIGURATION
# ==========================================
logging.level.root=INFO
logging.level.org.mongodb.driver=ERROR
logging.level.org.springframework.data.mongodb=ERROR

# ==========================================
# CORS CONFIGURATION
# ==========================================
cors.allowed.origins=http://localhost:3000,http://localhost:5173
```

**Replace these placeholders:**
- `YOUR_MONGODB_USERNAME` → MongoDB Atlas username
- `YOUR_MONGODB_PASSWORD` → MongoDB Atlas password (URL encode special characters)
- `YOUR_CLUSTER` → Your cluster name (e.g., cluster0.xxxxx)
- `YOUR_EMAIL@gmail.com` → Your Gmail address
- `YOUR_16_DIGIT_APP_PASSWORD` → Gmail app password

**Note:** If your MongoDB password contains special characters, URL encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

### **Step 4: Configure Homepage Service**

**File:** `homepage-service/.env`
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_MONGODB_PASSWORD@YOUR_CLUSTER.mongodb.net/ecomart?retryWrites=true&w=majority

# JWT Configuration
# Must match the secret in Auth Service
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY_MIN_256_BITS

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Email Configuration (Optional - for Node.js email service)
GMAIL_USER=YOUR_EMAIL@gmail.com
GMAIL_PASSWORD=YOUR_16_DIGIT_APP_PASSWORD
```

**Replace these placeholders:**
- `YOUR_MONGODB_USERNAME` → Same as checkout service
- `YOUR_MONGODB_PASSWORD` → Same as checkout service
- `YOUR_CLUSTER` → Same as checkout service
- `CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY_MIN_256_BITS` → **Same secret as Auth Service**
- `YOUR_EMAIL@gmail.com` → Your Gmail address
- `YOUR_16_DIGIT_APP_PASSWORD` → Gmail app password

### **Step 5: Configure Frontend Applications**

**Auth Frontend - File:** `ecommerce-frontend/src/config.js`
```javascript
// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  verifyOtp: '/auth/verify-otp',
  resendOtp: '/auth/resend-otp'
};

// Admin Endpoints
export const ADMIN_ENDPOINTS = {
  users: '/admin/users',
  updateRole: '/admin/users/:id/role',
  deleteUser: '/admin/users/:id'
};
```

**Main Frontend - File:** `homepage-service/frontend/src/config.js`
```javascript
// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api';
export const AUTH_API_URL = 'http://localhost:8080/api';
export const CHECKOUT_API_URL = 'http://localhost:8082/api';

// Product Endpoints
export const PRODUCT_ENDPOINTS = {
  getAll: '/products',
  getById: '/products/:id',
  getFeatured: '/products/featured',
  getByCategory: '/products/category/:categoryId'
};

// Cart Endpoints
export const CART_ENDPOINTS = {
  getCart: '/cart/:userId',
  addItem: '/cart/:userId/items',
  updateItem: '/cart/:userId/items/:itemId',
  removeItem: '/cart/:userId/items/:itemId',
  clearCart: '/cart/:userId'
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  create: '/orders',
  getUserOrders: '/orders/user/:userId'
};

// Email Endpoints
export const EMAIL_ENDPOINTS = {
  sendOrderEmail: '/email/send-order-email'
};
```

---

## 🎮 Running the Application

### **Important: Start Services in Order**

Services must be started in the following order to ensure proper initialization:

1. **MySQL** (should already be running)
2. **Auth Service** (Port 8080)
3. **Checkout Service** (Port 8082)
4. **Homepage Service** (Port 3001)
5. **Auth Frontend** (Port 3000)
6. **Main Frontend** (Port 5173)

### **Terminal 1: Auth Service**
```bash
cd ecommerce-backend

# Clean and install dependencies
mvn clean install

# Run the service
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

2024-12-06 10:30:00.000  INFO 12345 --- [main] Started EcommerceBackendApplication in 3.5 seconds
✅ Auth Service running on http://localhost:8080
```

**Health Check:**
```bash
curl http://localhost:8080/api/auth/health
# Expected: "Auth Service is running!"
```

### **Terminal 2: Checkout Service**
```bash
cd ecommerce-backendcheckout

# Clean and install dependencies
mvn clean install

# Run the service
mvn spring-boot:run
```

**Expected Output:**
```
2024-12-06 10:31:00.000  INFO 12346 --- [main] Started EcommerceBackendcheckoutApplication in 2.1 seconds
✅ MongoDB configured with 2-second timeouts
✅ Checkout Service running on http://localhost:8082
```

**Health Check:**
```bash
curl http://localhost:8082/api/products
# Expected: [] (empty array or list of products)
```

### **Terminal 3: Homepage Service**
```bash
cd homepage-service

# Install dependencies (first time only)
npm install

# Start the service
npm start
```

**Expected Output:**
```
> homepage-service@1.0.0 start
> node server.js

✅ Server is running on port 3001
✅ MongoDB connected successfully
✅ Database: ecomart
```

**Health Check:**
```bash
curl http://localhost:3001/api/products
# Expected: JSON array of products
```

### **Terminal 4: Auth Frontend**
```bash
cd ecommerce-frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ecommerce-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Verify:**
Open browser: http://localhost:3000

### **Terminal 5: Main Frontend**
```bash
cd homepage-service/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v4.5.0  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h to show help
```

**Verify:**
Open browser: http://localhost:5173

---

## ✅ Verify All Services

### **Quick Check - Open These URLs:**

| Service | URL | Expected Result |
|---------|-----|----------------|
| Auth Service | http://localhost:8080/api/auth/health | "Auth Service is running!" |
| Checkout Service | http://localhost:8082/api/products | Empty array `[]` or product list |
| Homepage Service | http://localhost:3001/api/products | Product list JSON |
| Auth Frontend | http://localhost:3000 | Login/Register page |
| Main Frontend | http://localhost:5173 | EcoMart homepage |

### **Test the Complete Flow:**

1. **Register a new user** (http://localhost:3000/register)
   - Enter name, email, password
   - Check email for OTP

2. **Verify OTP** (http://localhost:3000/verify-otp)
   - Enter the 6-digit code from email
   - Account should be activated

3. **Login** (http://localhost:3000/login)
   - Use registered email and password
   - Should receive JWT token

4. **Browse Products** (http://localhost:5173)
   - View product catalog
   - Add items to cart

5. **Checkout** (http://localhost:5173/cart)
   - Proceed to checkout
   - Fill shipping details
   - Place order
   - Check email for confirmation

---

## 📚 API Documentation

### **Base URLs**
```
Auth Service:     http://localhost:8080/api
Checkout Service: http://localhost:8082/api
Homepage Service: http://localhost:3001/api
```

### **Authentication Endpoints**

#### **1. Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for OTP."
}
```

#### **2. Verify OTP**
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Account activated successfully. You can now login."
}
```

#### **3. Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "userId": 1
  }
}
```

#### **4. Resend OTP**
```http
POST /auth/resend-otp?email=john@example.com
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "OTP sent successfully. Please check your email."
}
```

### **Product Endpoints**

#### **1. Get All Products**
```http
GET /products
```

**Response: 200 OK**
```json
[
  {
    "_id": "123",
    "name": "Bamboo Toothbrush",
    "description": "Eco-friendly bamboo toothbrush with soft bristles",
    "price": 199,
    "compareAtPrice": 299,
    "stockQuantity": 100,
    "categoryId": "cat123",
    "categoryName": "Personal Care",
    "image": "https://example.com/image.jpg",
    "featured": true,
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-01T10:00:00Z"
  }
]
```

#### **2. Get Product by ID**
```http
GET /products/{productId}
```

#### **3. Get Featured Products**
```http
GET /products/featured?limit=10
```

#### **4. Create Product (Admin)**
```http
POST /products
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Reusable Water Bottle",
  "description": "Stainless steel water bottle",
  "price": 599,
  "compareAtPrice": 799,
  "stockQuantity": 50,
  "categoryId": "cat456",
  "categoryName": "Kitchen",
  "image": "https://example.com/bottle.jpg",
  "featured": false
}
```

#### **5. Update Stock**
```http
PATCH /products/{productId}/stock
Content-Type: application/json

{
  "stockQuantity": 45
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": {
    "_id": "123",
    "stockQuantity": 45
  }
}
```

### **Cart Endpoints**

#### **1. Get User Cart**
```http
GET /cart/{userId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "userId": "1",
  "items": [
    {
      "_id": "item123",
      "productId": "prod456",
      "name": "Bamboo Toothbrush",
      "price": 199,
      "quantity": 2,
      "image": "https://example.com/image.jpg",
      "categoryName": "Personal Care",
      "stockQuantity": 98
    }
  ],
  "createdAt": "2024-12-06T10:00:00Z",
  "updatedAt": "2024-12-06T10:30:00Z"
}
```

#### **2. Add to Cart**
```http
POST /cart/{userId}/items
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "productId": "prod456",
  "quantity": 2
}
```

#### **3. Update Cart Item**
```http
PUT /cart/{userId}/items/{itemId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### **4. Remove from Cart**
```http
DELETE /cart/{userId}/items/{itemId}
Authorization: Bearer {jwt_token}
```

#### **5. Clear Cart**
```http
DELETE /cart/{userId}
Authorization: Bearer {jwt_token}
```

### **Order Endpoints**

#### **1. Create Order**
```http
POST /orders
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "userId": "1",
  "customerName": "John Doe",
  "email": "john@example.com",
  "items": [
    {
      "productId": "prod456",
      "name": "Bamboo Toothbrush",
      "price": 199,
      "quantity": 2
    }
  ],
  "totalAmount": 398,
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": 1234567890,
    "status": "PENDING",
    "createdAt": "2024-12-06T10:30:00Z"
  }
}
```

#### **2. Get User Orders**
```http
GET /orders/user/{userId}
Authorization: Bearer {jwt_token}
```

### **Email Endpoints**

#### **Send Order Confirmation Email**
```http
POST /email/send-order-email
Content-Type: application/json

{
  "to": "customer@example.com",
  "customerName": "John Doe",
  "orderId": 1234567890,
  "totalAmount": 398,
  "items": [
    {
      "name": "Bamboo Toothbrush",
      "quantity": 2,
      "price": 199
    }
  ]
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Order email sent successfully!"
}
```

### **Admin Endpoints**

#### **1. Get All Users**
```http
GET /admin/users
Authorization: Bearer {admin_jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2024-12-01T10:00:00"
    }
  ]
}
```

#### **2. Update User Role**
```http
PUT /admin/users/{userId}/role?role=ADMIN
Authorization: Bearer {admin_jwt_token}
```

#### **3. Delete User**
```http
DELETE /admin/users/{userId}
Authorization: Bearer {admin_jwt_token}
```

### **Error Responses**

**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

---

## 🗄️ Database Schema

### **MySQL - Users Table**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    is_active BOOLEAN DEFAULT FALSE,
    otp VARCHAR(6),
    otp_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGINT | Primary key, auto-increment |
| `name` | VARCHAR(255) | User's full name |
| `email` | VARCHAR(255) | Unique email address (login identifier) |
| `password` | VARCHAR(255) | BCrypt hashed password (60 chars) |
| `role` | VARCHAR(50) | User role: CUSTOMER or ADMIN |
| `is_active` | BOOLEAN | Account activation status |
| `otp` | VARCHAR(6) | 6-digit OTP for email verification |
| `otp_expiry` | DATETIME | OTP expiration timestamp (10 minutes) |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### **MongoDB - Products Collection**
```javascript
{
  _id: ObjectId("..."),
  name: String,              // Product name
  description: String,       // Product description
  price: Number,            // Current price
  compareAtPrice: Number,   // Original price (for discount display)
  stockQuantity: Number,    // Available quantity
  categoryId: String,       // Category reference ID
  categoryName: String,     // Category name (denormalized)
  image: String,           // Product image URL
  featured: Boolean,       // Featured product flag
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

**Indexes:**
```javascript
db.products.createIndex({ name: "text" });
db.products.createIndex({ categoryId: 1 });
db.products.createIndex({ featured: 1 });
db.products.createIndex({ price: 1 });
```

### **MongoDB - Categories Collection**
```javascript
{
  _id: ObjectId("..."),
  name: String,            // Category name
  description: String,     // Category description
  image: String,          // Category image URL
  featured: Boolean,      // Featured category flag
  createdAt: Date,
  updatedAt: Date
}
```

### **MongoDB - Cart Collection**
```javascript
{
  _id: ObjectId("..."),
  userId: String,          // User ID reference
  items: [
    {
      _id: String,         // Cart item ID
      productId: String,   // Product reference ID
      name: String,        // Product name (denormalized)
      price: Number,       // Product price (denormalized)
      quantity: Number,    // Quantity in cart
      image: String,       // Product image (denormalized)
      categoryName: String,// Category name (denormalized)
      stockQuantity: Number// Available stock (denormalized)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.carts.createIndex({ userId: 1 }, { unique: true });
```

### **MongoDB - Orders Collection**
```javascript
{
  _id: ObjectId("..."),
  orderId: Number,         // Unique order ID (timestamp-based)
  userId: String,          // User ID reference
  customerName: String,    // Customer name
  email: String,          // Customer email
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,     // Total order amount
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: String,          // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ orderId: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
```

---

## 📸 Screenshots

### **Homepage**
![Homepage](./docs/home.png)
*Modern, animated homepage with hero banner and product carousels*

### **Product Catalog**
![Products](./docs/products.png)
*Product grid with category filters and search functionality*

### **Product Details**
![Product Detail](./docs/product-detail.png)
*Detailed product view with add-to-cart functionality*

### **Shopping Cart**
![Cart](./docs/cart.png)
*Beautifully designed cart page with real-time price calculations*

### **Checkout Flow**
![Checkout](./docs/checkout.png)
*Streamlined checkout with address collection and order summary*

### **Authentication Pages**

<div align="center">
  <img src="./docs/login.png" width="45%" alt="Login Page" />
  <img src="./docs/register.png" width="45%" alt="Register Page" />
</div>

*Clean, modern authentication pages with form validation*

### **OTP Verification**
![OTP Verification](./docs/otp-email.png)
*Email verification with 6-digit OTP code*

### **Admin Dashboard**
![Admin](./docs/admin-dashboard.png)
*User management dashboard with role assignment*

### **Email Templates**

<div align="center">
  <img src="./docs/otp-email.png" width="45%" alt="OTP Email" />
  <img src="./docs/order-email.png" width="45%" alt="Order Email" />
</div>

*Professional HTML email templates for OTP and order confirmations*

### **Mobile Responsive Design**



*Fully responsive design optimized for mobile devices*

---

## 📁 Project Structure
```
ecomart/
│
├── ecommerce-backend/                 # Auth Service (Spring Boot - Port 8080)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/backend/ecommerce_backend/
│   │   │   │   ├── Config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── JwtConfig.java
│   │   │   │   ├── Controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── Model/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── VerifyOtpRequest.java
│   │   │   │   │   ├── LoginResponse.java
│   │   │   │   │   └── ApiResponse.java
│   │   │   │   ├── Repository/
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── Service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── EmailService.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   └── UserService.java
│   │   │   │   ├── Security/
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   └── Exception/
│   │   │   │       ├── UserAlreadyExistsException.java
│   │   │   │       ├── InvalidOtpException.java
│   │   │   │       └── GlobalExceptionHandler.java
│   │   │   └── resources/
│   │   │       ├── application.properties.example
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── ecommerce-backendcheckout/        # Checkout Service (Spring Boot - Port 8082)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/backend/ecommerce_backendcheckout/
│   │   │   │   ├── Config/
│   │   │   │   │   ├── MongoConfig.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── Controller/
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   └── EmailController.java
│   │   │   │   ├── Model/
│   │   │   │   │   ├── Product.java
│   │   │   │   │   └── OrderEmailRequest.java
│   │   │   │   ├── Repository/
│   │   │   │   │   └── ProductRepository.java
│   │   │   │   └── Service/
│   │   │   │       └── EmailService.java
│   │   │   └── resources/
│   │   │       ├── application.properties.example
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── homepage-service/                  # Homepage Service (Node.js - Port 3001)
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   ├── categories.routes.js
│   │   ├── cart.routes.js
│   │   └── orders.routes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   ├── .env.example
│   ├── .env
│   ├── server.js
│   ├── package.json
│   │
│   └── frontend/                      # Main Frontend (React + Vite - Port 5173)
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navbar.jsx
│       │   │   ├── HeroBanner.jsx
│       │   │   ├── CategoryCarousel.jsx
│       │   │   ├── ProductCarousel.jsx
│       │   │   ├── ProductCard.jsx
│       │   │   ├── CheckoutPopup.jsx
│       │   │   └── Footer.jsx
│       │   ├── pages/
│       │   │   ├── Homepage.jsx
│       │   │   ├── ProductsPage.jsx
│       │   │   ├── ProductDetailPage.jsx
│       │   │   ├── CartPage.jsx
│       │   │   └── OrdersPage.jsx
│       │   ├── context/
│       │   │   ├── AuthContext.jsx
│       │   │   └── CartContext.jsx
│       │   ├── hooks/
│       │   │   └── useApi.js
│       │   ├── utils/
│       │   │   └── helpers.js
│       │   ├── config.js
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── public/
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── ecommerce-frontend/                # Auth Frontend (React - Port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── config.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/                              # Documentation & Screenshots
│   ├── banner.png
│   ├── homepage.png
│   ├── products.png
│   ├── product-detail.png
│   ├── cart.png
│   ├── checkout.png
│   ├── login.png
│   ├── register.png
│   ├── otp-verify.png
│   ├── admin-dashboard.png
│   ├── otp-email.png
│   ├── order-email.png
│   ├── mobile-home.png
│   ├── mobile-products.png
│   ├── mobile-cart.png
│   ├── API_COLLECTION.json
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🧪 Testing

### **Backend Unit Tests**
```bash
# Auth Service tests
cd ecommerce-backend
mvn test

# Checkout Service tests
cd ecommerce-backendcheckout
mvn test

# Expected output:
# Tests run: X, Failures: 0, Errors: 0, Skipped: 0
```

### **API Testing with Postman**

1. **Import Collection**
   - Download: `docs/API_COLLECTION.json`
   - Open Postman → Import → Select file

2. **Set Environment Variables**
```
   AUTH_URL: http://localhost:8080
   CHECKOUT_URL: http://localhost:8082
   API_URL: http://localhost:3001
   JWT_TOKEN: (will be set after login)
```

3. **Run Collection**
   - Collection Runner → Select "EcoMart API"
   - Run all requests

### **Frontend Testing**
```bash
# Main frontend
cd homepage-service/frontend
npm test

# Auth frontend
cd ecommerce-frontend
npm test
```

### **Manual Testing Checklist**

- [ ] User registration with email validation
- [ ] OTP email delivery (check spam folder)
- [ ] OTP verification and account activation
- [ ] Login with JWT token generation
- [ ] Product browsing and search
- [ ] Add to cart functionality
- [ ] Cart quantity updates
- [ ] Remove from cart
- [ ] Checkout process
- [ ] Order email confirmation
- [ ] Stock update after purchase
- [ ] Admin user management
- [ ] Role-based access control

---

## 🚢 Deployment

### **Production Deployment Checklist**

#### **Security**
- [ ] Change all default passwords
- [ ] Generate strong JWT secret (min 256 bits)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Update CORS to production URLs only
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Setup error monitoring (Sentry)

#### **Database**
- [ ] Use managed database services (AWS RDS, MongoDB Atlas)
- [ ] Enable automated backups
- [ ] Setup read replicas for scaling
- [ ] Create database indexes
- [ ] Implement connection pooling

#### **Backend Services**
- [ ] Containerize with Docker
- [ ] Use production email service (SendGrid, AWS SES)
- [ ] Setup health check endpoints
- [ ] Configure logging aggregation
- [ ] Enable monitoring (Prometheus, Grafana)
- [ ] Setup CI/CD pipeline

#### **Frontend**
- [ ] Build optimized production bundle
- [ ] Enable code splitting
- [ ] Compress assets (images, JS, CSS)
- [ ] Setup CDN (CloudFront, Cloudflare)
- [ ] Configure caching headers
- [ ] Enable gzip compression

### **Deployment Platforms**

**Backend Services:**
- AWS EC2 / Google Cloud Compute
- Heroku
- DigitalOcean Droplets
- Railway
- Render

**Frontend:**
- Vercel (Recommended for React)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Databases:**
- AWS RDS (MySQL)
- MongoDB Atlas (already cloud-hosted)
- Google Cloud SQL

### **Docker Deployment**

**Dockerfile Example (Auth Service):**
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/ecommerce-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  auth-service:
    build: ./ecommerce-backend
    ports:
      - "8080:8080"
    environment:
      - MYSQL_URL=jdbc:mysql://mysql:3306/ecommerce_auth
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mysql

  checkout-service:
    build: ./ecommerce-backendcheckout
    ports:
      - "8082:8082"
    environment:
      - MONGODB_URI=${MONGODB_URI}

  homepage-service:
    build: ./homepage-service
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=ecommerce_auth
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

**Build and Run:**
```bash
docker-compose up -d
```

---

## 🔐 Security

### **Security Features Implemented**

✅ **Password Security**
- BCrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Password complexity validation

✅ **JWT Authentication**
- HS256 algorithm
- 24-hour token expiration
- Stateless authentication
- Token validation on every request

✅ **Email Verification**
- 6-digit OTP with 10-minute expiry
- Account activation required before login
- OTP regeneration available

✅ **CORS Protection**
- Whitelisted origins only
- Credentials allowed for authenticated requests
- Pre-flight request handling

✅ **SQL Injection Prevention**
- JPA/Hibernate parameterized queries
- No raw SQL queries

✅ **XSS Protection**
- React's built-in escaping
- Input sanitization

✅ **HTTPS Ready**
- SSL/TLS configuration available
- Redirect HTTP to HTTPS (production)

### **Security Best Practices**

❌ **Never Do:**
- Commit `.env` files to Git
- Store passwords in plain text
- Use default secrets in production
- Expose database ports publicly
- Log sensitive data (passwords, tokens)

✅ **Always Do:**
- Use environment variables for secrets
- Rotate credentials regularly
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting
- Enable audit logging
- Regular security audits

### **Environment Variables**

**Create `.env` files (never commit these):**

**.env (Auth Service)**
```env
DB_PASSWORD=your_secure_mysql_password
JWT_SECRET=your_generated_secret_key_min_256_bits
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_16_digit_app_password
```

**.env (Checkout Service)**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_16_digit_app_password
```

**.env (Homepage Service)**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=same_as_auth_service_secret
```

**Add to .gitignore:**
```gitignore
.env
.env.local
.env.production
*.env
**/application.properties
!application.properties.example
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### **How to Contribute**

1. **Fork the repository**
```bash
   git clone https://github.com/yourusername/ecomart.git
```

2. **Create a feature branch**
```bash
   git checkout -b feature/AmazingFeature
```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
```bash
   git commit -m 'Add some AmazingFeature'
```

5. **Push to your branch**
```bash
   git push origin feature/AmazingFeature
```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Request review

### **Code Style Guidelines**

**Java (Spring Boot):**
- Follow Google Java Style Guide
- Use meaningful variable names
- Add JavaDoc for public methods
- Keep methods under 50 lines

**JavaScript/React:**
- Use ESLint configuration
- Follow Airbnb React Style Guide
- Use functional components with hooks
- Prop-types or TypeScript for type safety

**Commit Messages:**
```
feat: Add user profile page
fix: Resolve cart quantity bug
docs: Update API documentation
style: Format code with prettier
refactor: Simplify authentication logic
test: Add unit tests for cart service
```

### **Reporting Issues**

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

---

## 📄 License

This project is licensed under the MIT License - see below for details:
```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Contact

**Your Name**

📧 Email: your.email@example.com  
🔗 LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)  
🌐 Portfolio: [yourportfolio.com](https://yourportfolio.com)  
🐙 GitHub: [@yourusername](https://github.com/yourusername)

**Project Link:** [https://github.com/yourusername/ecomart](https://github.com/yourusername/ecomart)

---

## 🙏 Acknowledgments

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI Components](https://daisyui.com/)
- [Heroicons](https://heroicons.com/) - Beautiful SVG icons
- [JWT.io](https://jwt.io/) - JWT documentation and debugger
- [Postman](https://www.postman.com/) - API testing platform

---

## 📊 Project Statistics

- **Total Lines of Code:** ~5,500+
- **Backend Services:** 3 (Auth, Checkout, Homepage)
- **Frontend Applications:** 2 (Auth UI, Main UI)
- **API Endpoints:** 25+
- **Database Tables/Collections:** 6
- **React Components:** 20+
- **Pages/Routes:** 15+
- **Technologies Used:** 12+
- **Development Duration:** [Your Timeline]

---

## 🎓 Learning Outcomes

This project demonstrates comprehensive knowledge of:

✅ **Microservices Architecture** - Designing and implementing distributed systems  
✅ **RESTful API Design** - Creating scalable, maintainable APIs  
✅ **JWT Authentication** - Implementing secure, stateless authentication  
✅ **Database Design** - Working with both SQL and NoSQL databases  
✅ **Frontend Development** - Building responsive, modern UIs with React  
✅ **State Management** - Using Context API for global state  
✅ **Email Integration** - SMTP configuration and HTML templates  
✅ **Security Best Practices** - Password hashing, CORS, input validation  
✅ **Version Control** - Git workflow and collaboration  
✅ **API Testing** - Using Postman for endpoint verification  
✅ **Responsive Design** - Mobile-first, cross-device compatibility  
✅ **Code Organization** - Separation of concerns, modularity  

---

## 🎯 Future Enhancements

Planned features for future releases:

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications with WebSockets
- [ ] Order tracking with status updates
- [ ] Admin analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Social authentication (Google, Facebook)
- [ ] Product recommendations engine
- [ ] Inventory management system
- [ ] Coupon and discount codes
- [ ] Invoice generation (PDF)
- [ ] Mobile app (React Native)

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ by Varad Jumbad, Ruchita Kamble, Kartar Singh Gothwal**

[⬆ Back to Top](#-ecomart---e-commerce-platform)

</div>
```

---

## ✅ FOLDER STRUCTURE

Your `docs/` folder should look like this:
```
docs/
├── banner.png
├── homepage.png
├── products.png
├── product-detail.png
├── cart.png
├── checkout.png
├── login.png
├── register.png
├── otp-verify.png
├── admin-dashboard.png
├── otp-email.png
├── order-email.png
├── mobile-home.png
├── mobile-products.png
├── mobile-cart.png
├── API_COLLECTION.json
├── DATABASE_SCHEMA.md
└── DEPLOYMENT.md
