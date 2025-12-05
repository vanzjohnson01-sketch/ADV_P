# Recipe Manager - Database Setup

This guide will help you set up the Recipe Manager with a MySQL database.

## Prerequisites

1. **MySQL Server** installed and running
   - Windows: Download from [mysql.com](https://www.mysql.com/downloads/)
   - Or use services like Amazon RDS, Google Cloud SQL, or DigitalOcean Managed MySQL

2. **Node.js** and **npm** (already installed)

## Quick Setup Steps

### 1. Create `.env.local` File

Create a `.env.local` file in the root directory with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=recipe_manager
DB_PORT=3306
```

### 2. Install MySQL Package

The `mysql2` package has been added to `package.json`. Install it:

```bash
npm install
```

### 3. Create Database (One-time)

Using MySQL Client or Workbench:

```sql
CREATE DATABASE recipe_manager;
USE recipe_manager;
```

### 4. Tables Auto-Created

When your app first runs, the following tables will be automatically created:

#### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Recipes Table
```sql
CREATE TABLE IF NOT EXISTS recipes (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  ingredients LONGTEXT NOT NULL,
  instructions LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Logs Table (For Activity Tracking)
```sql
CREATE TABLE IF NOT EXISTS logs (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create new user

### Recipes
- `GET /api/recipes?userId=<id>` - Get all recipes for user
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]?userId=<id>` - Delete recipe

### Admin (View All Users & Logs)
- `GET /api/admin/users` - View all registered users
- `GET /api/admin/logs` - View all activity logs
- `GET /api/admin/logs?userId=<id>` - View logs for specific user
- `GET /api/admin/logs?action=LOGIN_SUCCESS` - Filter logs by action

## Actions Logged
- `SIGNUP` - User registration
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `RECIPE_CREATED` - Recipe created
- `RECIPE_UPDATED` - Recipe updated
- `RECIPE_DELETED` - Recipe deleted

## Running the App

```bash
npm run dev
```

Visit `http://localhost:3000` to start using the app.

## Troubleshooting

### "Connection refused" error
- Ensure MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env.local`
- Verify the database `recipe_manager` exists

### "User ID required" error
- Make sure you're logged in
- Check that userId is properly stored in localStorage

### "Recipe not found" error
- Ensure you're logged in with the correct user account
- Verify the recipe belongs to your account

