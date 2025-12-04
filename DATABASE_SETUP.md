# Recipe Manager - Database Setup

This is a guide to set up the Recipe Manager with a MySQL database.

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Recipes Table
\`\`\`sql
CREATE TABLE recipes (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  ingredients LONGTEXT NOT NULL,
  instructions LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
\`\`\`

## Current Status

The app uses mock data (in-memory storage). To connect to MySQL:

1. Install MySQL driver: \`npm install mysql2\`
2. Update API routes in \`app/api/\` to use real database queries
3. Create a \`.env.local\` file with your database connection string:
   \`\`\`
   DATABASE_URL=mysql://user:password@localhost:3306/recipe_manager
   \`\`\`

## Files to Update

- \`app/api/auth/login/route.ts\` - Query users table
- \`app/api/auth/signup/route.ts\` - Insert into users table
- \`app/api/recipes/route.ts\` - Query/create recipes
- \`app/api/recipes/[id]/route.ts\` - Update/delete recipes
\`\`\`
