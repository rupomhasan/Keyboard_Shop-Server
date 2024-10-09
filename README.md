# Assignment 4 - Backend Server

## Overview

This is the backend service for **Assignment 4**, developed using **Node.js** and **TypeScript**. It provides a RESTful API for handling authentication, data storage, and validation using technologies like **Express**, **MongoDB**, **JWT**, and **Zod**. The API is designed to be secure, scalable, and efficient.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **File Uploads:** Multer with Cloudinary
- **Email:** Nodemailer for email communication
- **Password Hashing:** bcryptjs

## Features

- **User Authentication:** Secure login and signup using JWT tokens.
- **File Upload:** Upload images using Multer with Cloudinary integration.
- **API Security:** Cookie parsing and CORS middleware to secure endpoints.
- **Data Validation:** Zod for schema-based validation.
- **Email Notifications:** Nodemailer integration for sending emails.
- **Database Management:** MongoDB with Mongoose for database interactions.

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**
- **npm** 
- **MongoDB**

### API Endpoints:

## User
* POST /api/user/signup              - Register a new user.
* GET  /api/user/                    - Get all users (Admin only).
* GET  /api/user/:id                 - Get details of a user by ID (Admin only).
* GET  /api/user/my-profile           - Get the profile of the logged-in user (Admin, Customer).
* DELETE /api/user/:id                - Delete a user by ID (Admin only).

## Products
* GET  /api/products/                 - Get all products.
* GET  /api/products/:productId       - Get details of a product by ID.
* POST /api/products/                 - Create a new product (Admin only).
* PATCH /api/products/:productId      - Update a product by ID (Admin only).
* DELETE /api/products/:productId     - Delete a product by ID (Admin only).

## Order
* GET  /api/order/my-order            - Get all orders for the logged-in customer.
* POST /api/order/create-order        - Create a new order (Customer only).
* PATCH /api/order/:id                - Update an order by ID (Admin only).
* DELETE /api/order/:id               - Delete an order by ID (Admin only).
* GET  /api/order                     - Get all orders (Admin only).
* PATCH /api/order/cancel-my-order/:id - Cancel an order by ID (Admin, Customer).

## Brand
* GET  /api/brand/                    - Get all brands.
* GET  /api/brand/:id                 - Get details of a brand by ID.
* DELETE /api/brand/:id               - Delete a brand by ID (Admin only).
* POST /api/brand/                    - Create a new brand (Admin only).

## Review 
* GET  /api/reviews/product_review/:productId - Get reviews for a specific product.
* GET  /api/reviews/                  - Get all reviews.
* GET  /api/reviews/my_review         - Get reviews by the logged-in user (Admin, Customer).
* PATCH /api/reviews/update_reviews/:id - Update a review by ID (Customer only).
* DELETE /api/reviews/:id             - Delete a review by ID (Admin, Customer).
* POST /api/reviews/                  - Create a new review (Customer only).

## Authentication
* GET  /api/auth/login                - Login a user (Admin, Customer).
* POST /api/auth/access-token        - Generate an access token (Admin, Customer).


### Technologies Used
* Node.js           - JavaScript runtime for server-side development.
* Express.js        - Web application framework for Node.js.
* TypeScript        - Superset of JavaScript for type safety.
* MongoDB           - NoSQL database for storing user, product, and order data.
* Mongoose          - ODM library for MongoDB and Node.js.
* Bcrypt            - For password hashing.
* JSON Web Tokens (JWT) - For secure authentication.
* Zod               - For input validation.
* ESLint            - For maintaining code quality.
* Prettier          - Code formatted.



### Key Points:
- This README includes instructions on installation, running, environment variables, API endpoints, and deployment.
- The folder structure reflects how you've organized the project for clarity.
- It includes additional details for authentication, file upload, and emailing features.


Live Demo [Backend Server](https://mechanical-keyboard-shop-server-chi.vercel.app/)
  
