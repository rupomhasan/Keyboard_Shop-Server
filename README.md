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

- **Node.js** >= 16.x
- **npm** >= 8.x or **yarn**
- **MongoDB** >= 5.x (or a MongoDB Atlas account for cloud DB)
