import { type NextRequest, NextResponse } from "next/server"
import { getConnection, logAction } from "@/lib/db"

export async function POST(req: NextRequest) {
  let connection: any = null
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    connection = await getConnection()

    // Check if username already exists
    const [existing]: any = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    )

    if (existing.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create new user
    const userId = `user_${Date.now()}`
    await connection.execute(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [userId, username, password]
    )

    await logAction(userId, "SIGNUP", `User created with username: ${username}`)

    return NextResponse.json({ userId }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
