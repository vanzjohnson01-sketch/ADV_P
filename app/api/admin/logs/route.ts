import { type NextRequest, NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export async function GET(req: NextRequest) {
  let connection: any = null
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    const action = req.nextUrl.searchParams.get("action")

    connection = await getConnection()

    let query =
      "SELECT l.id, l.user_id, l.action, l.details, l.created_at, u.username FROM logs l LEFT JOIN users u ON l.user_id = u.id WHERE 1=1"
    const params: any[] = []

    if (userId) {
      query += " AND l.user_id = ?"
      params.push(userId)
    }

    if (action) {
      query += " AND l.action = ?"
      params.push(action)
    }

    query += " ORDER BY l.created_at DESC LIMIT 500"

    const [logs]: any = await connection.execute(query, params)

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
