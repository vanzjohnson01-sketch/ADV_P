#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this after setting up .env.local with your MySQL credentials
 * Usage: node scripts/init-db.js
 */

import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "recipe_manager",
}

async function initializeDatabase() {
  let connection

  try {
    console.log("🔗 Connecting to MySQL...")

    // First connect without database to create it
    const tempConnection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
    })

    // Create database if it doesn't exist
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``)
    console.log(`✅ Database "${config.database}" ready`)
    tempConnection.end()

    // Now connect to the actual database
    connection = await mysql.createConnection(config)

    console.log("📝 Creating tables...")

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("✅ Users table created")

    // Create recipes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        ingredients LONGTEXT NOT NULL,
        instructions LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("✅ Recipes table created")

    // Create logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    console.log("✅ Logs table created")

    console.log("\n✨ Database initialized successfully!")
    console.log("\nYou can now run: npm run dev")
  } catch (error) {
    console.error("❌ Error initializing database:")
    console.error(error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initializeDatabase()
