"use client"

import { useState, useEffect } from "react"
import RecipeCard from "./recipe-card"

interface Recipe {
  id: string
  name: string
  ingredients: string
  instructions: string
  userId: string
}

export default function RecipeList({
  userId,
  onEdit,
  onRecipeDeleted,
}: {
  userId: string
  onEdit: (recipe: Recipe) => void
  onRecipeDeleted: () => void
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/recipes?userId=${userId}`)
        if (!response.ok) throw new Error("Failed to fetch recipes")
        const data = await response.json()
        setRecipes(data)
      } catch (err) {
        setError("Failed to load recipes")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    try {
      const response = await fetch(`/api/recipes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete recipe")
      setRecipes(recipes.filter((r) => r.id !== id))
      onRecipeDeleted()
    } catch (err) {
      setError("Failed to delete recipe")
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading your delicious recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12 text-destructive font-semibold">{error}</div>
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-foreground mb-2">No recipes yet</p>
        <p className="text-muted-foreground">Create your first recipe to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onEdit={() => onEdit(recipe)}
          onDelete={() => handleDelete(recipe.id)}
        />
      ))}
    </div>
  )
}
