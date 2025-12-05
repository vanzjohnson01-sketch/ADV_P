# 🚀 Recipe Manager - MySQL Setup Guide

## Step 1: Set Up MySQL

### Option A: Local MySQL Installation (Windows)
1. Download MySQL from [mysql.com](https://www.mysql.com/downloads/)
2. Install MySQL Server 8.0 or later
3. During installation, set root password (remember this!)
4. Ensure MySQL Service is running (Services app on Windows)

### Option B: Cloud MySQL
- **Amazon RDS**: AWS managed MySQL
- **Google Cloud SQL**: Google's managed MySQL
- **DigitalOcean Managed Database**: Budget-friendly option
- **Heroku ClearDB**: Easy integration

## Step 2: Configure Environment

1. Open `.env.local` in the project root
2. Update with your MySQL credentials:

```env
DB_HOST=localhost        # Change if using cloud MySQL
DB_USER=root            # Your MySQL username
DB_PASSWORD=mypassword  # Your MySQL password
DB_NAME=recipe_manager
DB_PORT=3306
```

**Examples:**
- Local: `DB_HOST=localhost`
- AWS RDS: `DB_HOST=your-db.c9akciq32.us-east-1.rds.amazonaws.com`
- DigitalOcean: `DB_HOST=your-db-mysql.h.bitnami.com`

## Step 3: Initialize Database Tables

Run the initialization script:

```bash
npm install              # Install mysql2 (if not done already)
npm run init-db          # Create database and tables
```

Expected output:
```
🔗 Connecting to MySQL...
✅ Database "recipe_manager" ready
📝 Creating tables...
✅ Users table created
✅ Recipes table created
✅ Logs table created
✨ Database initialized successfully!
```

## Step 4: Start the App

```bash
npm run dev
```

Visit `http://localhost:3000` and test by:
1. Creating a new account (signup)
2. Logging in
3. Creating a recipe
4. Viewing all users: `http://localhost:3000/api/admin/users`
5. Viewing logs: `http://localhost:3000/api/admin/logs`

## 🎯 Key Features Implemented

### Database Operations
✅ **Create**: Signup users, create recipes
✅ **Insert**: Automatically store data in MySQL
✅ **Read**: View recipes, recipes, and logs
✅ **Update**: Edit existing recipes
✅ **Delete**: Remove recipes with proper logging

### Admin Features
✅ See all users registered
✅ View activity logs with timestamps
✅ Filter logs by user or action
✅ Track login failures and successes

### Data Logging
- **SIGNUP**: User registration
- **LOGIN_SUCCESS**: Successful login
- **LOGIN_FAILED**: Failed login attempts
- **RECIPE_CREATED**: New recipe added
- **RECIPE_UPDATED**: Recipe modified
- **RECIPE_DELETED**: Recipe removed

## 📋 Useful API Endpoints

### View All Users
```
GET http://localhost:3000/api/admin/users
```

### View All Activity Logs
```
GET http://localhost:3000/api/admin/logs
```

### View User's Activity
```
GET http://localhost:3000/api/admin/logs?userId=user_123
```

### View Login Logs
```
GET http://localhost:3000/api/admin/logs?action=LOGIN_SUCCESS
```

## ❌ Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
**Solution**: MySQL is not running
- Windows: Start MySQL Service from Services app
- Or run: `mysql -u root -p` in terminal

### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Wrong password
- Check `.env.local` DB_PASSWORD value
- Reset MySQL root password if forgotten

### Error: "Unknown database 'recipe_manager'"
**Solution**: Run initialization script
```bash
npm run init-db
```

### Data not appearing in database
**Solution**: Check `.env.local` is correct
```bash
# Test connection
mysql -h localhost -u root -p -e "SELECT VERSION();"
```

## 🔐 Security Notes

⚠️ **Important for Production:**
- Never commit `.env.local` to Git
- Use strong passwords (not "password" or "123456")
- Consider using environment variables for passwords
- Implement password hashing for user passwords
- Add authentication middleware for `/api/admin/*` routes

## 📚 Files Created/Modified

- ✅ `lib/db.ts` - Database connection pooling
- ✅ `app/api/auth/login/route.ts` - Updated to use MySQL
- ✅ `app/api/auth/signup/route.ts` - Updated to use MySQL
- ✅ `app/api/recipes/route.ts` - Updated to use MySQL
- ✅ `app/api/recipes/[id]/route.ts` - Updated to use MySQL
- ✅ `app/api/admin/users/route.ts` - New endpoint
- ✅ `app/api/admin/logs/route.ts` - New endpoint
- ✅ `.env.local` - Environment variables
- ✅ `.env.example` - Template for reference
- ✅ `scripts/init-db.js` - Database initialization
- ✅ `DATABASE_SETUP.md` - Setup documentation
