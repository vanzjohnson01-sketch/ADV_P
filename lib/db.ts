import mysql from "mysql2/promise"

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "recipe_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function getConnection() {
  return await pool.getConnection()
}

export async function initializeDatabase() {
  const connection = await getConnection()

  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

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

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  } finally {
    connection.release()
  }
}

export async function logAction(userId: string | null, action: string, details?: string) {
  const connection = await getConnection()

  try {
    const logId = `log_${Date.now()}`
    await connection.execute(
      `INSERT INTO logs (id, user_id, action, details) VALUES (?, ?, ?, ?)`,
      [logId, userId, action, details || null]
    )
  } catch (error) {
    console.error("Error logging action:", error)
  } finally {
    connection.release()
  }
}

export default pool
