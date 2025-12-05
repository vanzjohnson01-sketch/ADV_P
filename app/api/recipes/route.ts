import { type NextRequest, NextResponse } from "next/server"
import { getConnection, logAction } from "@/lib/db"

export async function GET(req: NextRequest) {
  let connection: any = null
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    connection = await getConnection()
    const [recipes]: any = await connection.execute(
      "SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    )

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function POST(req: NextRequest) {
  let connection: any = null
  try {
    const { userId, name, ingredients, instructions } = await req.json()

    if (!userId || !name || !ingredients || !instructions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    connection = await getConnection()
    const recipeId = `recipe_${Date.now()}`

    await connection.execute(
      "INSERT INTO recipes (id, user_id, name, ingredients, instructions) VALUES (?, ?, ?, ?, ?)",
      [recipeId, userId, name, ingredients, instructions]
    )

    await logAction(userId, "RECIPE_CREATED", `Created recipe: ${name}`)

    const [newRecipe]: any = await connection.execute(
      "SELECT * FROM recipes WHERE id = ?",
      [recipeId]
    )

    return NextResponse.json(newRecipe[0], { status: 201 })
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
