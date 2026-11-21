-- ========================================================
-- Online Book Store - MySQL Database Schema & Seed Data
-- ========================================================

CREATE DATABASE IF NOT EXISTS `bookstore_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bookstore_db`;

-- Drop tables in order of foreign key dependencies
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Books Table
CREATE TABLE `books` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(1000) DEFAULT NULL,
  `category_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_book_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Carts Table
CREATE TABLE `carts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Cart Items Table
CREATE TABLE `cart_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cart_id` BIGINT NOT NULL,
  `book_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Orders Table
CREATE TABLE `orders` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `shipping_address` TEXT NOT NULL,
  `phone_number` VARCHAR(50) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Order Items Table
CREATE TABLE `order_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `book_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_order` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- Seed Initial Data
-- ========================================================

-- Default Admin Account (password: admin123)
-- BCrypt: $2a$10$wT0X1K7Cq.eM2O8B1F87I.8WJ5H7B0A2iM9E8M3Z1b6N5P4S2X1L
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`) VALUES
(1, 'admin@bookstore.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWGyWm', 'System Admin', 'ROLE_ADMIN');

-- Categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Technology', 'Software engineering, programming, and architecture'),
(2, 'Fiction', 'Novels, drama, and narrative fiction'),
(3, 'Self-Help', 'Personal productivity, habit building, and psychology'),
(4, 'Business', 'Startups, economics, management, and entrepreneurship');

-- Sample Books
INSERT INTO `books` (`id`, `title`, `author`, `description`, `price`, `stock`, `image_url`, `category_id`) VALUES
(1, 'Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship with best practices for writing clean, readable code.', 39.99, 25, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80', 1),
(2, 'Spring Boot in Action', 'Craig Walls', 'Comprehensive guide to developing enterprise-ready Java microservices and web applications with Spring Boot.', 44.95, 18, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 1),
(3, 'Atomic Habits', 'James Clear', 'An easy and proven way to build good habits and break bad ones through tiny behavioral changes.', 21.50, 40, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', 3),
(4, 'The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'Classic insights and actionable advice for software developers on craftsmanship and career growth.', 49.99, 15, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 1),
(5, 'The Great Gatsby', 'F. Scott Fitzgerald', 'A timeless classic portrait of the Jazz Age, romantic obsession, and the American Dream.', 14.99, 30, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80', 2),
(6, 'Zero to One', 'Peter Thiel', 'Notes on startups, and how to build the future by creating innovative, monopoly businesses.', 27.00, 20, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', 4);
