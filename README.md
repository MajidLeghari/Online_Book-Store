# 📚 Online Book Store — Full-Stack Monorepo

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v5-007FFF.svg)](https://mui.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8%2F9-4479A1.svg)](https://www.mysql.com/)
[![SQLite / Turso](https://img.shields.io/badge/SQLite%20%2F%20Turso-Ready-00D492.svg)](https://turso.tech/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black.svg)](https://vercel.com/)

A complete, beginner-friendly, and production-ready **Online Book Store** web application built with **Java 21 Spring Boot**, **React.js (Vite + Material UI)**, and **MySQL / SQLite (Turso)**.

All three tiers—**Frontend**, **Backend**, and **Database** (with both MySQL schema and a portable SQLite database ready for Turso)—are maintained together in this single unified monorepo repository.

---

## 📑 Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [Project Features](#2-project-features)
3. [Technology Stack](#3-technology-stack)
4. [Deploying to Vercel (Single Unified Project)](#4-deploying-to-vercel-single-unified-project)
5. [Database Setup (MySQL & Turso / SQLite)](#5-database-setup-mysql--turso--sqlite)
6. [Local Development Startup](#6-local-development-startup)
7. [Default Accounts & Credentials](#7-default-accounts--credentials)
8. [REST API Documentation](#8-rest-api-documentation)
9. [Postman Collection & Testing](#9-postman-collection--testing)
10. [Docker Compose Full-Stack Startup](#10-docker-compose-full-stack-startup)

---

## 1. Monorepo Structure

```text
Online_Book-Store/
├── frontend/                     # React 19 + Vite + Material UI Single Page App
│   ├── src/                      # Components, Pages, Context, Services
│   ├── public/                   # Static assets & favicon
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   └── vercel.json               # Frontend-specific Vercel routing
│
├── backend/                      # Spring Boot 3.4.x (Java 21) REST API
│   ├── src/main/java/com/bookstore/
│   │   ├── config/               # Security & Web MVC configurations
│   │   ├── controller/           # REST API Controllers
│   │   ├── dto/                  # Request & Response DTOs
│   │   ├── entity/               # JPA Hibernate Entities
│   │   ├── enums/                # Role & OrderStatus enums
│   │   ├── exception/            # Global Exception Handling
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   └── service/              # Business Logic Services
│   ├── src/main/resources/
│   │   └── application.properties # Server port (8081) & DB configuration
│   ├── pom.xml                   # Maven dependencies & build plugins
│   └── Dockerfile                # Production multi-stage Docker build
│
├── database/                     # Database schemas, seeds & portable files
│   ├── schema.sql                # Complete MySQL 8/9 DDL & seed data
│   ├── bookstore_db.sqlite       # Ready-to-upload SQLite database file for Turso
│   ├── export_to_sqlite.py       # Python script to export MySQL -> SQLite anytime
│   └── README.md                 # Database setup & Turso guide
│
├── .gitignore                    # Maintained gitignore for Node, Maven, IDE & SQLite
├── docker-compose.yml            # Multi-container local orchestration
├── package.json                  # Root monorepo scripts & workspaces
├── vercel.json                   # Root Vercel deployment configuration
├── DEPLOYMENT.md                 # Cloud deployment instructions
├── Postman_Collection.json       # Postman test collection
└── README.md                     # Comprehensive project documentation
```

---

## 2. Project Features

### 🛒 Customer Features
- **Registration & Login**: Secure JWT-based authentication with BCrypt password hashing.
- **Book Browsing**: Responsive catalog cards with covers, pricing, and stock status.
- **Search & Filter**: Search by title or author keywords; filter books by category chips.
- **Book Details**: Detailed description, author, category, price, and real-time inventory count.
- **Shopping Cart**: Add to cart, adjust quantities (with stock limits), remove items, or clear cart.
- **Cash on Delivery (COD) Checkout**: Enter delivery address and contact phone number.
- **Order Tracking**: View past order history and detailed itemized receipts.

### 🛡️ Administrator Features
- **Admin Dashboard**: Real-time KPI summary (Total Revenue, Orders, Catalog Size, Customers).
- **Inventory Management**: Add books with category selection, edit pricing/stock, delete books.
- **Category Management**: Create, edit, and delete categories (with safety checks).
- **Order Management**: Review all customer orders and advance status (`PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED` → `CANCELLED`).
  - *Automated Stock Safeguard*: Cancelling an order automatically restores book stock.
- **Customer Directory**: View all registered customers.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, JavaScript, Material UI (MUI v5), React Router DOM v6, Axios |
| **Backend** | Java 21, Spring Boot 3.4.x, Spring Security 6 (Stateless JWT), Spring Data JPA, Hibernate, Jakarta Validation, Lombok |
| **Database** | MySQL 8/9, SQLite / Turso (libSQL-compatible cloud database) |
| **DevOps & Tools** | Vercel, Docker, Docker Compose, Maven, Postman, Git |

---

## 4. Deploying to Vercel (Single Unified Project)

This repository is pre-configured with a root `vercel.json` and root `package.json` so you can connect this entire repository to Vercel as **one single project**.

### Step-by-Step Vercel Deployment:

1. Push your repository to GitHub: `https://github.com/MajidLeghari/Online_Book-Store`.
2. Go to **[vercel.com](https://vercel.com)** and log in.
3. Click **Add New...** → **Project**.
4. Select your **`Online_Book-Store`** repository and click **Import**.
5. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (Vercel automatically detects this).
   - **Root Directory**: Leave as `./` (or select `frontend`).
   - **Build Command**: `cd frontend && npm install && npm run build` (Pre-configured in `vercel.json`).
   - **Output Directory**: `frontend/dist` (Pre-configured in `vercel.json`).
6. **Environment Variables**:
   Under **Environment Variables**, add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: The public URL of your backend API (e.g., `https://your-backend.up.railway.app/api`).
7. Click **Deploy**! 🚀
   - Vercel will build the frontend and serve it with automatic SPA routing (no 404s on browser reload).

---

## 5. Database Setup (MySQL & Turso / SQLite)

### Option A: Local MySQL (Standard)
1. Ensure MySQL is running on port `3306`.
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS bookstore_db;
   ```
3. Spring Boot Hibernate will auto-create all tables on first startup (`spring.jpa.hibernate.ddl-auto=update`), or you can run `database/schema.sql`.

### Option B: Turso Cloud Database (Portable SQLite)
A ready-to-upload SQLite file is included in this repository at:
```text
database/bookstore_db.sqlite
```
To upload it to Turso in seconds:
```bash
# 1. Install Turso CLI
winget install turso

# 2. Login to Turso
turso auth login

# 3. Create cloud database directly from the file
turso db create bookstore-db --from-file database/bookstore_db.sqlite

# 4. View your database URL & generate token
turso db show bookstore-db --url
turso db tokens create bookstore-db
```

---

## 6. Local Development Startup

### 1. Start the Spring Boot Backend (Port 8081)
Open a terminal in the `backend/` folder:
```bash
cd backend
mvn spring-boot:run
```
Or run the packaged JAR:
```bash
java -jar target/bookstore-0.0.1-SNAPSHOT.jar
```
Backend will start on: `http://localhost:8081`

### 2. Start the React Frontend (Port 5173)
Open a separate terminal in the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on: `http://localhost:5173`

Open **Chrome** and navigate to: **`http://localhost:5173`**

---

## 7. Default Accounts & Credentials

### Administrator Account (Pre-seeded):
- **Email:** `admin@bookstore.com`
- **Password:** `admin123`
- **Role:** `ROLE_ADMIN`
- **Capabilities:** Access to Admin Dashboard, Catalog Editor, Categories, Orders, and Customers.

### Creating a Customer Account:
- Click **Register** on `http://localhost:5173/register`.
- Register with your name, email, and password.
- Customer accounts are automatically granted `ROLE_USER`.

---

## 8. REST API Documentation

Base URL: `http://localhost:8081/api`

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **Auth** | POST | `/api/auth/register` | Public | Register customer & get JWT token |
| **Auth** | POST | `/api/auth/login` | Public | Login & receive JWT token |
| **Categories** | GET | `/api/categories` | Public | List all categories with book counts |
| **Categories** | POST | `/api/categories` | Admin | Create category |
| **Categories** | PUT | `/api/categories/{id}` | Admin | Update category |
| **Categories** | DELETE | `/api/categories/{id}` | Admin | Delete category (blocked if books attached) |
| **Books** | GET | `/api/books` | Public | List all books |
| **Books** | GET | `/api/books/{id}` | Public | Get single book details |
| **Books** | GET | `/api/books/search?keyword=...` | Public | Search books by title or author |
| **Books** | GET | `/api/books/category/{categoryId}` | Public | Filter books by category |
| **Books** | POST | `/api/books` | Admin | Create book |
| **Books** | PUT | `/api/books/{id}` | Admin | Update book |
| **Books** | DELETE | `/api/books/{id}` | Admin | Delete book |
| **Cart** | GET | `/api/cart` | Authenticated | View current customer's cart |
| **Cart** | POST | `/api/cart/add/{bookId}?quantity=1` | Authenticated | Add book to cart with stock validation |
| **Cart** | PUT | `/api/cart/update/{itemId}` | Authenticated | Update item quantity in cart |
| **Cart** | DELETE | `/api/cart/remove/{itemId}` | Authenticated | Remove item from cart |
| **Cart** | DELETE | `/api/cart/clear` | Authenticated | Clear cart |
| **Orders** | POST | `/api/orders/checkout` | Authenticated | Place COD order & deduct inventory |
| **Orders** | GET | `/api/orders/my-orders` | Authenticated | View authenticated customer's order history |
| **Orders** | GET | `/api/orders/{id}` | Authenticated | View order invoice |
| **Admin** | GET | `/api/admin/stats` | Admin | Summary statistics (revenue, orders, stock) |
| **Admin** | GET | `/api/admin/orders` | Admin | View all customer orders |
| **Admin** | PUT | `/api/admin/orders/{id}/status` | Admin | Update order status & restore stock on cancel |
| **Admin** | GET | `/api/admin/customers` | Admin | View all registered customers |

---

## 9. Postman Collection & Testing

A complete Postman collection is included in the project root:
```text
Postman_Collection.json
```
1. Open Postman → Click **Import** → Choose `Postman_Collection.json`.
2. Run the **Auth > Login Admin** request to authenticate.
3. The JWT token will automatically authenticate subsequent requests.

### Automated JUnit Tests:
Run the backend test suite:
```bash
cd backend
mvn test
```
All integration tests pass (`BUILD SUCCESS`), testing the complete end-to-end e-commerce flow.

---

## 10. Docker Compose Full-Stack Startup

To launch the complete application stack (MySQL + Spring Boot + React) locally with Docker:
```bash
docker compose up --build
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8066/api`
- **MySQL Database:** `localhost:3306`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
