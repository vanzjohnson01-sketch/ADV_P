import { type NextRequest, NextResponse } from "next/server"

const users: { id: string; username: string; password: string }[] = [
  {
    id: "demo",
    username: "demo",
    password: "demo123",
  },
]

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    if (users.some((u) => u.username === username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username,
      password,
    }

    users.push(newUser)

    return NextResponse.json({ userId: newUser.id })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
