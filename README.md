# 🛒 E-Commerce Platform

Full-stack microservices-based e-commerce platform built with modern technologies. This monorepo contains all microservices for the complete e-commerce solution.

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Services](#services)
- [Team Workflow](#team-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Team Members](#team-members)
- [License](#license)

---

## 🎯 Overview

A comprehensive e-commerce platform featuring:

- ✅ **User Authentication & Authorization** - JWT-based secure authentication
- ✅ **Email Verification** - 6-digit OTP verification system
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **Admin Dashboard** - Complete admin panel for management
- 🚧 **Product Catalog** - Coming soon
- 🚧 **Shopping Cart** - Coming soon
- 🚧 **Order Management** - Coming soon
- 🚧 **Payment Integration** - Coming soon

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│            Port 3000 - User Interface                │
└───────────────────┬─────────────────────────────────┘
                    │
                    │ HTTP/REST API
                    ↓
┌─────────────────────────────────────────────────────┐
│              API Gateway (Future)                    │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
┌───────────┐ ┌──────────┐ ┌──────────┐
│   Auth    │ │ Product  │ │  Order   │
│  Service  │ │ Service  │ │ Service  │
│ Port 8080 │ │Port 8081 │ │Port 8082 │
└─────┬─────┘ └────┬─────┘ └────┬─────┘
      │            │            │
      └────────────┼────────────┘
                   ↓
        ┌──────────────────┐
        │  MySQL Database  │
        │    Port 3306     │
        └──────────────────┘
```

---

## 🛠️ Tech Stack

### **Backend**
- **Java 17** - Programming language
- **Spring Boot 3.1.5** - Backend framework
- **Spring Security 6.1.5** - Authentication & authorization
- **MySQL 8.0** - Relational database
- **Hibernate/JPA** - ORM framework
- **JWT (io.jsonwebtoken 0.12.3)** - Token-based authentication
- **JavaMail** - Email service
- **Maven** - Build tool

### **Frontend**
- **React 18.2.0** - UI library
- **React Router 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **CSS3** - Styling with glassmorphism effects

### **DevOps & Tools**
- **Git & GitHub** - Version control
- **MySQL Workbench** - Database management
- **Postman** - API testing
- **VS Code / IntelliJ IDEA** - IDEs

---

## 📁 Project Structure

```
E-commerce-site/
├── .gitignore                      # Root gitignore
├── README.md                       # This file
└── services/
    ├── auth-service/               # Authentication microservice
    │   ├── .gitignore
    │   ├── README.md
    │   ├── database/
    │   │   └── schema.sql          # Database schema
    │   ├── backend-app/
    │   │   ├── pom.xml
    │   │   └── src/
    │   │       ├── main/
    │   │       │   ├── java/
    │   │       │   │   └── com/ninehub/authentication/
    │   │       │   │       ├── controller/    # REST endpoints
    │   │       │   │       ├── service/       # Business logic
    │   │       │   │       ├── entity/        # Database models
    │   │       │   │       ├── repository/    # Data access
    │   │       │   │       ├── security/      # Security config
    │   │       │   │       └── dto/           # Data transfer objects
    │   │       │   └── resources/
    │   │       │       ├── application.properties.template
    │   │       │       └── templates/         # Email templates
    │   │       └── test/
    │   └── frontend-react/
    │       ├── package.json
    │       ├── public/
    │       └── src/
    │           ├── components/      # Reusable components
    │           ├── pages/           # Page components
    │           ├── services/        # API calls
    │           └── App.js           # Main application
    │
    ├── product-service/            # Coming soon
    ├── order-service/              # Coming soon
    └── payment-service/            # Coming soon
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### **Required Software**

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Java JDK** | 17+ | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) | Backend runtime |
| **Maven** | 3.6+ | [Apache Maven](https://maven.apache.org/download.cgi) | Build tool |
| **Node.js** | 16+ | [Node.js](https://nodejs.org/) | Frontend runtime |
| **MySQL** | 8.0+ | [MySQL](https://dev.mysql.com/downloads/mysql/) | Database |
| **Git** | Latest | [Git](https://git-scm.com/downloads) | Version control |

### **Recommended Software**

- **MySQL Workbench** - Database GUI
- **Postman** - API testing
- **VS Code** or **IntelliJ IDEA** - Code editor
- **GitHub Desktop** (optional) - Git GUI

### **Verify Installation**

```bash
# Check Java version
java -version
# Should show: java version "17.x.x"

# Check Maven version
mvn -version
# Should show: Apache Maven 3.x.x

# Check Node.js version
node -v
# Should show: v16.x.x or higher

# Check npm version
npm -v
# Should show: 8.x.x or higher

# Check MySQL
mysql --version
# Should show: mysql Ver 8.0.x

# Check Git
git --version
# Should show: git version 2.x.x
```

---

## 🚀 Getting Started

### **1. Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/ruchita0405/E-commerce-site.git

# Navigate to project directory
cd E-commerce-site

# Switch to development branch
git checkout dev

# Verify you're on the correct branch
git branch
# Should show: * dev
```

---

### **2. Database Setup**

#### **Step 1: Start MySQL Server**

**Windows:**
- Open **Services** (Win + R → type `services.msc`)
- Find **MySQL80** service
- Right-click → **Start**

**Mac:**
```bash
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
```

#### **Step 2: Create Database**

```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL root password
```

```sql
-- Create database
CREATE DATABASE ecommerce_auth;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

#### **Step 3: Import Database Schema**

```bash
# Import schema
mysql -u root -p ecommerce_auth < services/auth-service/database/schema.sql

# Verify tables were created
mysql -u root -p ecommerce_auth -e "SHOW TABLES;"
```

**Expected output:**
```
+---------------------------+
| Tables_in_ecommerce_auth  |
+---------------------------+
| jwt                       |
| refresh-token             |
| role                      |
| users                     |
| validation                |
+---------------------------+
```

---

### **3. Backend Configuration**

#### **Step 1: Navigate to Backend**

```bash
cd services/auth-service/backend-app/src/main/resources
```

#### **Step 2: Create Configuration File**

```bash
# Windows
copy application.properties.template application.properties

# Mac/Linux
cp application.properties.template application.properties
```

#### **Step 3: Configure Database Credentials**

Open `application.properties` in your text editor and update:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_auth
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

#### **Step 4: Generate JWT Secret**

**Option 1 - Online Tool:**
- Visit: https://generate-secret.vercel.app/64
- Copy the generated secret

**Option 2 - PowerShell (Windows):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

**Option 3 - Terminal (Mac/Linux):**
```bash
openssl rand -base64 64
```

**Update in `application.properties`:**
```properties
jwt.secret=PASTE_YOUR_GENERATED_SECRET_HERE
```

#### **Step 5: Configure Email Service**

**Gmail Setup:**

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update Configuration:**
```properties
spring.mail.username=your.email@gmail.com
spring.mail.password=abcdefghijklmnop
# Note: Remove spaces from the 16-character password
```

**⚠️ CRITICAL: Use App Password, NOT your regular Gmail password!**

---

### **4. Start Backend Server**

```bash
# Navigate to backend directory
cd services/auth-service/backend-app

# Clean and install dependencies
mvn clean install

# Start the server
mvn spring-boot:run
```

**Expected output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)

...
Started AuthenticationApplication in 4.5 seconds
```

**Backend is now running on:** http://localhost:8080

---

### **5. Frontend Setup**

**Open a NEW terminal window** (keep backend running)

```bash
# Navigate to frontend directory
cd services/auth-service/frontend-react

# Install dependencies
npm install

# Start development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend-react in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Frontend will automatically open in your browser at:** http://localhost:3000

---

### **6. Verify Installation**

#### **Test Backend API:**

Open your browser and visit:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Health Check:** http://localhost:8080/actuator/health (if enabled)

#### **Test Frontend:**

1. Open http://localhost:3000
2. Click "Register" in navigation
3. Fill in registration form
4. Check your email for activation code
5. Enter activation code
6. Login with credentials
7. Access dashboard

#### **Test Complete Flow:**

```bash
# Test registration endpoint
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected response:**
```json
{
  "message": "Registration successful! Please check your email for the activation code.",
  "email": "test@example.com"
}
```

---

## 🔐 Default Credentials

### **Admin Account**

After database setup, you can login with:

- **Email:** `admin@techstore.com`
- **Password:** `admin123`
- **Role:** ADMIN

**⚠️ IMPORTANT: Change this password immediately in production!**

**To change admin password:**

```sql
-- Connect to MySQL
mysql -u root -p ecommerce_auth

-- Generate new BCrypt hash (use online tool: https://bcrypt-generator.com/)
-- Then update:
UPDATE users 
SET password = 'NEW_BCRYPT_HASH_HERE' 
WHERE email = 'admin@techstore.com';
```

---

## 🎯 Services

### **1. Authentication Service** ✅ (Active)

**Purpose:** User authentication, authorization, and account management

**Features:**
- User registration with email verification
- JWT-based authentication
- Refresh token mechanism
- Password encryption with BCrypt
- Role-based access control (USER, ADMIN)
- Email activation with 6-digit OTP
- Admin dashboard
- Password reset functionality

**Endpoints:**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ No | Register new user |
| POST | `/activate` | ❌ No | Activate account with OTP |
| POST | `/login` | ❌ No | Login and get JWT tokens |
| POST | `/refresh/token` | ✅ Yes | Refresh access token |
| POST | `/signout` | ✅ Yes | Logout user |
| POST | `/password/update` | ✅ Yes | Change password |
| POST | `/password/new` | ✅ Yes | Reset password |
| GET | `/admin/*` | ✅ Admin | Admin-only endpoints |

**Ports:**
- Backend: 8080
- Frontend: 3000

**Database:**
- Name: `ecommerce_auth`
- Tables: `users`, `role`, `jwt`, `refresh-token`, `validation`

**Documentation:**
- Detailed README: `services/auth-service/README.md`
- Swagger UI: http://localhost:8080/swagger-ui.html

---

### **2. Product Service** 🚧 (Coming Soon)

**Purpose:** Product catalog management

**Planned Features:**
- Product CRUD operations
- Category management
- Product search and filtering
- Image upload
- Inventory management
- Product reviews and ratings

**Port:** 8081

---

### **3. Order Service** 🚧 (Coming Soon)

**Purpose:** Order processing and management

**Planned Features:**
- Shopping cart
- Order creation and tracking
- Order history
- Order status management
- Invoice generation

**Port:** 8082

---

### **4. Payment Service** 🚧 (Coming Soon)

**Purpose:** Payment processing

**Planned Features:**
- Multiple payment gateways
- Payment verification
- Refund processing
- Transaction history

**Port:** 8083

---

## 👥 Team Workflow

### **Branch Strategy**

```
main (production)
  ↑
  └── dev (active development) ← DEFAULT BRANCH
       ↑
       ├── feature/user-profile
       ├── feature/product-catalog
       ├── feature/shopping-cart
       └── bugfix/login-issue
```

### **Daily Workflow**

#### **1. Start of Day**

```bash
# Make sure you're on dev branch
git checkout dev

# Get latest changes
git pull origin dev

# Verify you have latest code
git log --oneline -5
```

#### **2. Working on a New Feature**

```bash
# Create feature branch from dev
git checkout dev
git checkout -b feature/add-user-profile

# Make your changes
# ... edit files ...

# Check what changed
git status
git diff

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add user profile page with edit functionality"

# Push feature branch to GitHub
git push origin feature/add-user-profile
```

#### **3. Create Pull Request**

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Set base: `dev` ← compare: `feature/add-user-profile`
4. Add title and description
5. Request review from team member
6. Click "Create pull request"

#### **4. After PR is Approved and Merged**

```bash
# Switch back to dev
git checkout dev

# Get latest (includes your merged feature)
git pull origin dev

# Delete local feature branch
git branch -d feature/add-user-profile

# Delete remote feature branch
git push origin --delete feature/add-user-profile
```

### **Commit Message Guidelines**

**Format:**
```
<type>: <subject>

<body> (optional)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify authentication logic"
```

---

## 🐛 Troubleshooting

### **Backend Won't Start**

#### **Issue: Port 8080 already in use**

**Error:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solution:**
```bash
# Windows - Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9

# OR change port in application.properties
server.port=8081
```

---

#### **Issue: Cannot connect to database**

**Error:**
```
Communications link failure
```

**Solutions:**

1. **Check MySQL is running:**
```bash
# Windows
services.msc → MySQL80 → Start

# Mac/Linux
sudo systemctl status mysql
```

2. **Verify database exists:**
```sql
mysql -u root -p
SHOW DATABASES;
```

3. **Check credentials in `application.properties`:**
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_CORRECT_PASSWORD
```

---

#### **Issue: Email not sending**

**Error:**
```
AuthenticationFailedException: 535-5.7.8 Username and Password not accepted
```

**Solutions:**

1. **Use Gmail App Password (NOT regular password):**
   - Go to https://myaccount.google.com/apppasswords
   - Generate new 16-character password
   - Use this in `application.properties`

2. **Enable 2-Factor Authentication:**
   - Required for App Passwords
   - https://myaccount.google.com/security

3. **Allow less secure apps (not recommended):**
   - Only if App Password doesn't work
   - https://myaccount.google.com/lesssecureapps

---

### **Frontend Issues**

#### **Issue: npm install fails**

**Error:**
```
npm ERR! code ENOENT
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

#### **Issue: Blank page after npm start**

**Solutions:**

1. **Check browser console (F12):**
   - Look for errors
   - Common: CORS issues or API connection problems

2. **Verify backend is running:**
   - Check http://localhost:8080/swagger-ui.html

3. **Clear browser cache:**
   - Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)

---

### **Authentication Issues**

#### **Issue: Login says "Invalid credentials" with correct password**

**Solutions:**

1. **Check user is activated:**
```sql
mysql -u root -p ecommerce_auth
SELECT email, is_actif, role_id FROM users WHERE email = 'your@email.com';
-- is_actif should be 1 (TRUE)
```

2. **Reset password:**
```sql
-- Generate new hash at: https://bcrypt-generator.com/
UPDATE users 
SET password = 'NEW_BCRYPT_HASH' 
WHERE email = 'your@email.com';
```

3. **Check role assignment:**
```sql
-- For admin access, role_id should be 2
UPDATE users 
SET role_id = 2 
WHERE email = 'your@email.com';
```

---

#### **Issue: Can't access admin page**

**Solutions:**

1. **Check localStorage:**
   - Open browser console (F12)
   - Type: `localStorage.getItem('role')`
   - Should show: `"ADMIN"` or `"ROLE_ADMIN"`

2. **Clear localStorage and login again:**
```javascript
localStorage.clear();
location.reload();
```

3. **Verify database role:**
```sql
SELECT u.email, r.role_type 
FROM users u 
JOIN role r ON u.role_id = r.id 
WHERE u.email = 'your@email.com';
-- role_type should be 'ADMIN'
```

---

### **Database Issues**

#### **Issue: Table doesn't exist**

**Error:**
```
Table 'ecommerce_auth.users' doesn't exist
```

**Solution:**
```bash
# Re-import schema
mysql -u root -p ecommerce_auth < services/auth-service/database/schema.sql

# Verify tables
mysql -u root -p ecommerce_auth -e "SHOW TABLES;"
```

---

#### **Issue: Duplicate entry error**

**Error:**
```
Duplicate entry 'user@example.com' for key 'users.email'
```

**Solution:**
```sql
-- Check existing user
SELECT * FROM users WHERE email = 'user@example.com';

-- Delete if needed
DELETE FROM users WHERE email = 'user@example.com';
```

---

### **Git Issues**

#### **Issue: Merge conflicts**

**Solution:**
```bash
# Check which files have conflicts
git status

# For each conflicted file, edit and choose correct version
# Then:
git add <resolved-file>

# Complete merge
git commit -m "Resolve merge conflicts"
```

---

#### **Issue: Accidentally committed sensitive files**

**Solution:**
```bash
# Remove from git but keep locally
git rm --cached services/auth-service/backend-app/src/main/resources/application.properties

# Commit removal
git commit -m "Remove sensitive configuration file"

# Push
git push origin dev

# IMPORTANT: Change all exposed passwords immediately!
```

---

### **Common Error Messages**

| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE` | Port already in use | Kill process or change port |
| `Connection refused` | Service not running | Start MySQL/Backend |
| `Bad credentials` | Wrong password or user not activated | Check database, verify activation |
| `CORS error` | Backend not allowing frontend | Check CORS configuration |
| `404 Not Found` | Wrong API endpoint | Verify URL in frontend |
| `500 Internal Server Error` | Backend exception | Check backend logs |
| `JWT expired` | Token expired | Refresh token or login again |

---

## 🤝 Contributing

### **Code Standards**

#### **Java (Backend)**
- Follow **Google Java Style Guide**
- Use **Lombok** annotations to reduce boilerplate
- Write **JavaDoc** for public methods
- Use **meaningful variable names**

**Example:**
```java
/**
 * Registers a new user with email verification
 * 
 * @param registerDto User registration data
 * @return ResponseEntity with registration status
 */
@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerDto) {
    // Implementation
}
```

#### **JavaScript/React (Frontend)**
- Follow **Airbnb JavaScript Style Guide**
- Use **functional components** with hooks
- Write **PropTypes** for components
- Use **destructuring** for cleaner code

**Example:**
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data
  }, [userId]);
  
  return <div>{/* UI */}</div>;
};

UserProfile.propTypes = {
  userId: PropTypes.number.isRequired
};

export default UserProfile;
```

### **Testing**

#### **Backend Testing**
```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserServiceTest
```

#### **Frontend Testing**
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### **Pull Request Checklist**

Before creating a PR, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log() statements in production code
- [ ] No commented-out code
- [ ] Updated documentation if needed
- [ ] No sensitive data (passwords, API keys)
- [ ] Meaningful commit messages
- [ ] Feature tested locally
- [ ] No merge conflicts with dev branch

---

## 👨‍💻 Team Members

| Name | Role | GitHub | Responsibilities |
|------|------|--------|------------------|
| [Member 1] | Team Lead | @username1 | Architecture, Code Review |
| [Member 2] | Backend Dev | @username2 | Auth Service, APIs |
| [Member 3] | Frontend Dev | @username3 | UI/UX, React Components |
| [Member 4] | Full Stack | @username4 | Integration, Testing |

---

## 📞 Support & Contact

### **Having Issues?**

1. **Check Troubleshooting section** above
2. **Search existing GitHub Issues**
3. **Create new issue** with details:
   - What you tried
   - Error messages
   - Screenshots
   - Your environment (OS, versions)

### **Need Help?**

- **GitHub Issues:** https://github.com/ruchita0405/E-commerce-site/issues
- **Team Chat:** [Your communication platform]
- **Documentation:** See individual service READMEs

---

## 📄 License

This project is developed as an educational project. All rights reserved.

---

## 🎯 Roadmap

### **Phase 1: Foundation** ✅ (Completed)
- [x] Project setup and structure
- [x] Authentication service
- [x] Email verification
- [x] Admin dashboard
- [x] JWT implementation

### **Phase 2: Core Features** 🚧 (In Progress)
- [ ] Product catalog service
- [ ] Shopping cart functionality
- [ ] Order management system
- [ ] Search and filtering
- [ ] Product reviews

### **Phase 3: Advanced Features** 📋 (Planned)
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Recommendation engine
- [ ] Mobile app (React Native)

### **Phase 4: Optimization** 📋 (Planned)
- [ ] Performance optimization
- [ ] Caching implementation
- [ ] Load balancing
- [ ] Deployment automation
- [ ] Monitoring and logging

---

## 🔗 Quick Links

- **Repository:** https://github.com/ruchita0405/E-commerce-site
- **Issues:** https://github.com/ruchita0405/E-commerce-site/issues
- **Projects:** https://github.com/ruchita0405/E-commerce-site/projects
- **Wiki:** https://github.com/ruchita0405/E-commerce-site/wiki (if enabled)

---

## ⚡ Quick Commands Reference

```bash
# Clone and setup
git clone https://github.com/ruchita0405/E-commerce-site.git
cd E-commerce-site
git checkout dev

# Database
mysql -u root -p ecommerce_auth < services/auth-service/database/schema.sql

# Backend
cd services/auth-service/backend-app
mvn spring-boot:run

# Frontend (new terminal)
cd services/auth-service/frontend-react
npm install && npm start

# Git workflow
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

---

**Made with ❤️ by Team [Your Team Name]**

**Last Updated:** December 2024

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- MySQL Documentation
- Stack Overflow Community
- GitHub Community

---

**Happy Coding! 🚀**
