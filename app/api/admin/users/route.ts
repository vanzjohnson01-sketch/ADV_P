import { type NextRequest, NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export async function GET(req: NextRequest) {
  let connection: any = null
  try {
    connection = await getConnection()

    const [users]: any = await connection.execute(
      "SELECT id, username, created_at FROM users ORDER BY created_at DESC"
    )

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
