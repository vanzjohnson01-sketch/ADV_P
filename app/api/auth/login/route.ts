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
    
    // Query database for user
    const [rows]: any = await connection.execute(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    )

    if (rows.length === 0) {
      await logAction(null, "LOGIN_FAILED", `Failed login attempt for username: ${username}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = rows[0]
    await logAction(user.id, "LOGIN_SUCCESS", `User logged in`)

    return NextResponse.json({ userId: user.id })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
