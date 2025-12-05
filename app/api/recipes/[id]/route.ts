import { type NextRequest, NextResponse } from "next/server"
import { getConnection, logAction } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  let connection: any = null
  try {
    const { userId, name, ingredients, instructions } = await req.json()
    const id = params.id

    if (!userId || !name || !ingredients || !instructions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    connection = await getConnection()

    // Check if recipe exists and belongs to user
    const [existing]: any = await connection.execute(
      "SELECT id FROM recipes WHERE id = ? AND user_id = ?",
      [id, userId]
    )

    if (existing.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Update recipe
    await connection.execute(
      "UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ? AND user_id = ?",
      [name, ingredients, instructions, id, userId]
    )

    await logAction(userId, "RECIPE_UPDATED", `Updated recipe: ${name}`)

    const [updated]: any = await connection.execute(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  let connection: any = null
  try {
    const id = params.id
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    connection = await getConnection()

    // Check if recipe exists and belongs to user
    const [existing]: any = await connection.execute(
      "SELECT name FROM recipes WHERE id = ? AND user_id = ?",
      [id, userId]
    )

    if (existing.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const recipeName = existing[0].name

    // Delete recipe
    await connection.execute(
      "DELETE FROM recipes WHERE id = ? AND user_id = ?",
      [id, userId]
    )

    await logAction(userId, "RECIPE_DELETED", `Deleted recipe: ${recipeName}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) connection.release()
  }
}
