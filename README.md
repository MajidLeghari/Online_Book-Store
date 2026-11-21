# Online Book Store - Full-Stack E-Commerce Web Application

A complete, beginner-friendly, and production-ready online book store built with **Java 21**, **Spring Boot 3.4.x**, **MySQL 8/9**, and **React.js (Vite + Material UI)**.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [MySQL Database Setup](#mysql-database-setup)
5. [Backend Startup Instructions](#backend-startup-instructions)
6. [Frontend Startup Instructions](#frontend-startup-instructions)
7. [Default Accounts & Credentials](#default-accounts--credentials)
8. [API Endpoint Documentation](#api-endpoint-documentation)
9. [Testing with Postman & JUnit](#testing-with-postman--junit)
10. [System Architecture & Design Decisions](#system-architecture--design-decisions)
11. [Monorepo & Cloud Deployment (Vercel & Docker)](#11-monorepo--cloud-deployment-vercel--docker)

---

## 1. Project Overview

The **Online Book Store** provides a streamlined shopping experience with **Cash on Delivery (COD)** payment:

### Customer Capabilities:
- **Authentication:** Register a new customer account or log in securely.
- **Book Browsing:** View complete book catalog with cover images, prices, and stock indicators.
- **Search & Filters:** Search books by title or author, and filter by category chips.
- **Book Details:** Inspect book summaries, real-time stock availability, and authentic publishing details.
- **Shopping Cart:** Add books to cart, increment/decrement quantities with stock limits, or remove items.
- **Secure Checkout:** Enter delivery address and contact phone number with Cash on Delivery.
- **Order Tracking:** Track past order history and view itemized order receipts.

### Administrator Capabilities:
- **Admin Dashboard:** Real-time metrics for total revenue, total orders, catalog size, customer count, and low stock warnings.
- **Book Inventory Management:** Add new books with category selection, edit pricing/stock, and delete books.
- **Category Management:** Create, update, and manage book classifications.
- **Order Fulfillment:** Review all customer orders and update status (`PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED` → `CANCELLED`).
  - *Automated Stock Safeguard:* If an order is cancelled, book stock is automatically restored to inventory.
- **Customer Directory:** View registered customers and account details.

---

## 2. Technology Stack

### Backend:
- **Language:** Java 21 / 23
- **Framework:** Spring Boot 3.4.3
- **Data Access:** Spring Data JPA, Hibernate ORM
- **Security:** Spring Security 6 with stateless JSON Web Token (JWT) authentication
- **Database:** MySQL 8 / 9
- **Build Tool:** Apache Maven
- **Validation:** Jakarta Validation (`@Valid`, `@NotBlank`, `@Positive`, `@Min`)
- **JSON Processing:** Jackson & JJWT 0.12.6

### Frontend:
- **Framework:** React 19 (JavaScript)
- **Tooling:** Vite (ultra-fast build and hot-module replacement)
- **UI Component Library:** Material UI (MUI v5 / Emotion)
- **Navigation:** React Router DOM v6
- **HTTP Client:** Axios with JWT interceptors
- **Styling:** Modern navy and ocean blue aesthetic with responsive cards and clean typography

---

## 3. Prerequisites

Ensure you have the following installed on your machine:
- **Java Development Kit (JDK):** Version 21 or later (`java -version`)
- **Apache Maven:** Version 3.8+ (`mvn -v`)
- **Node.js:** Version 18+ and npm (`node -v`, `npm -v`)
- **MySQL Server:** Version 8.0+ or 9.x (`mysql --version`)

---

## 4. MySQL Database Setup

1. Start your local MySQL service.
2. Open your terminal or MySQL Workbench and log in as root:
   ```sql
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Verify application properties in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=${DB_USERNAME:root}
   spring.datasource.password=${DB_PASSWORD:Port3405@.Af}
   ```
   *Tip:* You can override database credentials by setting environment variables `DB_USERNAME` and `DB_PASSWORD`.

---

## 5. Backend Startup Instructions

### Option A: Run using Maven
Open a terminal in the `backend` directory:
```bash
cd backend
mvn spring-boot:run
```

### Option B: Run pre-built JAR
```bash
cd backend
java -jar target/bookstore-0.0.1-SNAPSHOT.jar
```

The Spring Boot backend will start on:
```
http://localhost:8080
```

On first startup, the database tables (`users`, `categories`, `books`, `carts`, `cart_items`, `orders`, `order_items`) are automatically generated and the default administrator account is initialized.

---

## 6. Frontend Startup Instructions

Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

The Vite development server will start on:
```
http://localhost:5173
```

Visit `http://localhost:5173` in your browser to access the bookstore!

---

## 7. Default Accounts & Credentials

### Administrator Account (Pre-seeded):
- **Email:** `admin@bookstore.com`
- **Password:** `admin123`
- **Role:** `ROLE_ADMIN`
- **Access:** Complete access to Admin Dashboard, Book Inventory, Category Editor, and Order Management.

### Creating a Customer Account:
- Navigate to `http://localhost:5173/register`
- Fill in your Name, Email, and Password (min 6 characters)
- Public registration automatically assigns `ROLE_USER` for security.

---

## 8. API Endpoint Documentation

Base URL: `http://localhost:8080/api`

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register customer account & generate JWT |
| POST | `/api/auth/login` | Public | Authenticate user & return JWT token |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | Public | List all categories with book counts |
| GET | `/api/categories/{id}` | Public | Get category by ID |
| POST | `/api/categories` | Admin | Create a new category |
| PUT | `/api/categories/{id}` | Admin | Update category name/description |
| DELETE | `/api/categories/{id}` | Admin | Delete category (prevented if books exist) |

### Books (`/api/books`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/books` | Public | Retrieve all books in catalog |
| GET | `/api/books/{id}` | Public | Get single book details |
| GET | `/api/books/search?keyword=...` | Public | Search books by title, author, or keyword |
| GET | `/api/books/category/{categoryId}` | Public | Filter books by category |
| POST | `/api/books` | Admin | Create new book entry |
| PUT | `/api/books/{id}` | Admin | Update book metadata, price, stock |
| DELETE | `/api/books/{id}` | Admin | Delete book from catalog |

### Shopping Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cart` | Authenticated | Get current authenticated customer's cart |
| POST | `/api/cart/add/{bookId}?quantity=1` | Authenticated | Add book to cart with stock validation |
| PUT | `/api/cart/update/{itemId}` | Authenticated | Update item quantity in cart |
| DELETE | `/api/cart/remove/{itemId}` | Authenticated | Remove specific item from cart |
| DELETE | `/api/cart/clear` | Authenticated | Empty the customer's cart |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders/checkout` | Authenticated | Place order from cart with COD payment |
| GET | `/api/orders/my-orders` | Authenticated | View current customer's order history |
| GET | `/api/orders/{id}` | Authenticated | View detailed order receipt |

### Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Get revenue, order, book, customer metrics |
| GET | `/api/admin/orders` | Admin | Retrieve all customer orders |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update status (PENDING, CONFIRMED, etc.) |
| GET | `/api/admin/customers` | Admin | List all registered customer accounts |

---

## 9. Testing with Postman & JUnit

### Postman Collection:
A ready-to-import Postman collection is located at:
`Postman_Collection.json`

To test:
1. Open Postman.
2. Click **Import** and select `Postman_Collection.json`.
3. Run the **Login Admin** request to obtain the JWT token.
4. Set the `token` collection variable and run any authenticated endpoint.

### Automated Integration Tests:
Run the backend test suite:
```bash
cd backend
mvn test
```
All unit and integration tests run against the database to test:
- User registration and login
- Category creation and querying
- Book creation, filtering, and keyword search
- Cart additions, quantity updates, and backend pricing calculations
- Checkout transactions, stock deductions, and cart clearing
- Order status updates and stock restoration on cancellation

---

## 10. System Architecture & Design Decisions

- **Layered Architecture:** Follows the clean, standard `Controller → Service → Repository → Database` pattern without unnecessary complexity.
- **DTO Encapsulation:** Entities are never exposed directly to the REST API, eliminating recursive JSON serialization loops and protecting internal database schemas.
- **Backend Price Calculation:** All monetary calculations and subtotals are performed strictly on the backend to prevent frontend tampering.
- **Transactional Consistency:** `@Transactional` safeguards checkout operations: if stock is insufficient for any item in the cart, the entire transaction rolls back.
- **Cash on Delivery (COD):** Streamlined and risk-free checkout flow designed specifically for simple e-commerce operations.

---

## 11. Monorepo & Cloud Deployment (Vercel & Docker)

### Monorepo Structure
```text
.
├── backend/            # Spring Boot 3.4 (Java 21) REST API
├── frontend/           # React 19 (Vite + MUI) SPA
├── database/           # MySQL 8/9 schema & seed data
├── docker-compose.yml  # Local multi-container orchestration
├── package.json        # Monorepo workspaces & root scripts
├── vercel.json         # Vercel SPA deployment configuration
└── DEPLOYMENT.md       # Detailed step-by-step deployment guide
```

### Root Monorepo Commands
From the project root:
- **Build Frontend**: `npm run build`
- **Start Frontend Dev**: `npm run dev`
- **Build Backend**: `npm run backend:build`
- **Start Full Stack with Docker**: `docker compose up --build`

### Hosting on Vercel
1. Import this repository into **Vercel**.
2. Vercel will automatically detect `vercel.json` and build the frontend from `frontend/dist`.
3. Set the environment variable `VITE_API_BASE_URL` to your production backend URL.
4. For details on hosting the Spring Boot backend and MySQL database, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

