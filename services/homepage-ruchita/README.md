
## 🗂️ Final Directory Structure

```
ecommerce-platform/
│
├── gateway/
│   └── spring-cloud-gateway/          # Port 8080
│       └── application.yml            # Routes all services
│
├── microservices/
│   ├── product-service/               # Node.js - Port 3002
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── .env
│   │   └── server.js
│   │
│   ├── auth-service/                  # Spring Boot - Port 8081
│   │   ├── src/main/
│   │   └── application.properties
│   │
│   └── cart-service/                  # Spring Boot - Port 8082
│       ├── src/main/
│       └── application.properties
│
├── microfrontends/
│   ├── homepage-mfe/                  # React - Port 3001
│   │   ├── src/
│   │   └── .env
│   │
│   ├── auth-mfe/                      # React - Port 3000
│   │   ├── src/
│   │   └── .env
│   │
│   └── cart-mfe/                      # React - Port 3003
│       ├── src/
│       └── .env
│
├── shared/                            # Shared code
│   ├── utils/
│   │   └── eventBus.js
│   └── middleware/
│       ├── jwtAuth.js
│       └── serviceAuth.js
│
├── docs/                              # Documentation
├── scripts/                           # Helper scripts
└── docker-compose.yml                 # Run everything
```

---

## 🔄 Integration and Migration Steps

### Phase 1: Setup Structure (30 minutes)

```bash
# 1. Create monorepo
mkdir ecommerce-platform
cd ecommerce-platform

# 2. Create directories
mkdir -p gateway/spring-cloud-gateway
mkdir -p microservices/{product-service,cart-service,auth-service}
mkdir -p microfrontends/{homepage-mfe,cart-mfe,auth-mfe}
mkdir -p shared/{utils,middleware}
mkdir -p docs scripts

# 3. Move your existing project
cp -r /path/to/your/backend/* microservices/product-service/
cp -r /path/to/your/frontend/* microfrontends/homepage-mfe/
```

---

### Phase 2: Integrate Teammates' Code (1 hour)

```bash
# 4. Clone Auth service (Ruchita's dev branch)
git clone -b dev https://github.com/ruchita0405/E-commerce-site.git temp-auth
cp -r temp-auth/backend/* microservices/auth-service/
cp -r temp-auth/frontend/* microfrontends/auth-mfe/
rm -rf temp-auth

# 5. Clone Cart service (Kartar's kartar branch)
git clone -b kartar https://github.com/ruchita0405/E-commerce-site.git temp-cart
cp -r temp-cart/backend/* microservices/cart-service/
cp -r temp-cart/frontend/* microfrontends/cart-mfe/
rm -rf temp-cart
```

---

### Phase 3: Configure Services (1-2 hours)

**Critical: Sync JWT_SECRET across ALL services!**

```bash
# Generate shared secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: abc123def456...

# Use SAME secret in:
# - microservices/product-service/.env
# - microservices/auth-service/.../application.properties
# - microservices/cart-service/.../application.properties
# - gateway/spring-cloud-gateway/.../application.yml
```

**Update all .env and application.properties files:**
- Set correct ports (3002, 8081, 8082, 8080)
- Add JWT_SECRET (SAME everywhere!)
- Add service keys
- Add CORS origins
- Point frontends to Gateway (http://localhost:8080/api)

---

### Phase 4: Setup API Gateway (30 minutes)

Create Spring Cloud Gateway using provided pom.xml and application.yml

**Routes:**
- `/api/auth/**` → Auth Service (8081)
- `/api/products/**` → Product Service (3002)
- `/api/categories/**` → Product Service (3002)
- `/api/cart/**` → Cart Service (8082)
- `/api/orders/**` → Cart Service (8082)

---

### Phase 5: Test Everything (30 minutes)

```bash
# Start all services
# Terminal 1-3: Backends
cd microservices/product-service && npm run dev
cd microservices/auth-service && mvn spring-boot:run
cd microservices/cart-service && mvn spring-boot:run

# Terminal 4: Gateway
cd gateway/spring-cloud-gateway && mvn spring-boot:run

# Terminal 5-7: Frontends
cd microfrontends/homepage-mfe && npm start
cd microfrontends/auth-mfe && npm start
cd microfrontends/cart-mfe && npm start

# Test
curl http://localhost:8080/api/products  # Through gateway
```

---

## 🔑 Critical Configuration

### Shared JWT Secret

```env
# MUST BE IDENTICAL IN ALL SERVICES

# Product Service (.env)
JWT_SECRET=abc123def456ghi789

# Auth Service (application.properties)
jwt.secret=abc123def456ghi789

# Cart Service (application.properties)
jwt.secret=abc123def456ghi789

# Gateway (application.yml)
jwt.secret: abc123def456ghi789
```

### Service Ports

| Service | Port | Type |
|---------|------|------|
| API Gateway | 8080 | Spring Boot |
| Auth Service | 8081 | Spring Boot |
| Product Service | 3002 | Node.js |
| Cart Service | 8082 | Spring Boot |
| Auth MFE | 3000 | React |
| Homepage MFE | 3001 | React |
| Cart MFE | 3003 | React |

### Database Ports

| Database | Port | Used By |
|----------|------|---------|
| MongoDB | 27017 | Product Service |
| PostgreSQL | 5432 | Auth & Cart Services |

---


# 🌐 Frontend Setup

## Initialise
    cd home-mf
    npm init


## Install 

    npm install


## Install main dependencies
    
    npm install axios@^1.13.2 daisyui@^5.5.5 react@^19.2.0 react-dom@^19.2.0 react-router-dom@^7.9.6


## Install development tools
    
    npm install -D @eslint/js@^9.39.1 @originjs/vite-plugin-federation@^1.4.1 @types/react@^19.2.5 @types/react-dom@^19.2.3 @vitejs/plugin-react@^5.1.1 autoprefixer@^10.4.22 concurrently@^9.2.1 eslint@^9.39.1 eslint-plugin-react-hooks@^7.0.1 eslint-plugin-react-refresh@^0.4.24 globals@^16.5.0 postcss@^8.5.6 tailwindcss@^3.4.18 vite@^7.2.4


## Start the frontend
    npm run dev





# 🛠 Backend Setup

## Initialize 

    cd home-ms
    npm init

## Install node modules

    npm install


## Install backend dependencies
These libraries power the backend API, authentication, validation, and database:
    
    npm install bcryptjs@^2.4.3 cors@^2.8.5 dotenv@^16.0.3 express@^4.18.2 express-mongo-sanitize@^2.2.0 express-rate-limit@^7.5.1 helmet@^7.1.0 joi@^17.11.0 jsonwebtoken@^9.0.2 mongoose@^8.0.3


## Install Nodemon for auto-restart during development
    
    npm install -D nodemon@^3.0.2


## Environment Setup
Copy .env.example → .env, then fill in the values.

## To generate a secure JWT secret, run:
    
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"


## Paste the generated key into your .env file like:

JWT_SECRET=your_super_secret_string


## (Optional) Seed the database
If your project includes seed data, run:
(Note: run all the seed files if any problem faced)

    npm run script/seed.js
    or
    node script/seed.js


## Start the backend server
    
    npm run dev


Your backend API should now be live. 🚀

# Project Structure Guide

## 📁 Recommended Folder Structure

```
ecomart-homepage/
│
├── public/
│   ├── index.html
│   └── assets/
│       └── images/
│           ├── eco-detergents.jpg
│           ├── bamboo-products.jpg
│           └── ...
│
├── src/
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation with cart & profile
│   │   ├── HeroBanner.jsx  # Hero section
│   │   ├── CategorySection.jsx
│   │   ├── FeaturedProducts.jsx
│   │   ├── ServiceStrips.jsx
│   │   └── Footer.jsx
|   |   ├── CategiryCarousel.jsx
│   │   └── CategorySection.jsx
|   |   ├── ProductCarousel.jsx
│   │   └── ProductByCategorySection.jsx
│   │
│   ├── pages/              # Page components
│   │   ├── Homepage.jsx    # Standalone version
|   │   └── CartPage.jsx # Backend integrated version
|   |   ├── LoginPage.jsx
|   |   ├── ProductDetails.jsx
│   │
│   ├── services/           # API and external services
│   │   └── api.js         # Centralized API calls
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useApi.js      # Data fetching hooks
│   │
│   │
│   │
│   ├── App.js            # Main App component
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎯 File Purposes

### Components Directory
Each component is self-contained and reusable:

```
components/Navbar.jsx
├── Handles: Navigation, Search, Cart, Profile
├── Props: brandName, cartItems, userProfile, handlers
└── State: Search query

components/CategorySection.jsx
├── Handles: Category display and navigation
├── Props: categories, onCategoryClick, isLoading
└── Features: Loading states, click handling

components/FeaturedProducts.jsx
├── Handles: Product display and cart actions
├── Props: products, onAddToCart, onProductClick
└── Features: Discounts, ratings, stock status
```

### Pages Directory
Main page compositions:

```
pages/Homepage.jsx
├── Uses: All components
├── State: Local state management
├── Data: Default/mock data
└── Purpose: Works without backend

pages/HomepageWithBackend.jsx
├── Uses: All components + hooks
├── State: API-driven state
├── Data: From backend API
└── Purpose: Production with backend
```

### Services Directory
API communication layer:

```
services/api.js
├── API_BASE_URL configuration
├── Authentication handling
├── Request/response processing
└── All API endpoint methods
```

### Hooks Directory
Reusable React hooks:

```
hooks/useApi.js
├── useFetch: Generic data fetching
├── useCategories: Category data
├── useFeaturedProducts: Product data
├── useCart: Cart management
├── useAuth: User authentication
└── useSearch: Search functionality
```

## 🔄 Data Flow

### Standalone Mode (Homepage.jsx)
```
User Action
    ↓
Component Handler (onClick, onChange)
    ↓
Update Local State
    ↓
Re-render Component
    ↓
Display Updated UI
```

### Backend Mode (HomepageWithBackend.jsx)
```
Component Mount
    ↓
Custom Hook (useCategories, useProducts)
    ↓
API Service Call (api.js)
    ↓
Backend API Request
    ↓
Response Processing
    ↓
Update State
    ↓
Re-render with Data

User Action (Add to Cart)
    ↓
Component Handler
    ↓
Custom Hook Method (addToCart)
    ↓
API Service Call
    ↓
Backend Update
    ↓
Refetch Data
    ↓
Update UI
```

## 🎨 Component Hierarchy

```
App.js
└── Homepage (or HomepageWithBackend)
    ├── Navbar
    │   ├── Search Input
    │   ├── Cart Dropdown
    │   └── Profile Dropdown
    ├── HeroBanner
    │   └── CTA Button
    ├── CategorySection
    │   └── Category Cards (map)
    ├── FeaturedProducts
    │   └── Product Cards (map)
    │       ├── Product Image
    │       ├── Product Details
    │       └── Add to Cart Button
    ├── ServiceStrips
    │   └── Service Items (map)
    └── Footer
        ├── Brand Info
        ├── Category Links
        ├── Company Links
        └── Support Links
```
