"use client"

import { useState } from "react"
import RecipeCard from "./recipe-card"

interface Recipe {
  id: string
  name: string
  ingredients: string
  instructions: string
  userId: string
}

export default function RandomRecipe({
  userId,
  onEdit,
}: {
  userId: string
  onEdit: (recipe: Recipe) => void
}) {
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getRandomRecipe = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/recipes?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch recipes")
      const recipes = await response.json()

      if (recipes.length === 0) {
        setError("No recipes available. Create one first!")
        setRandomRecipe(null)
        return
      }

      const random = recipes[Math.floor(Math.random() * recipes.length)]
      setRandomRecipe(random)
    } catch (err) {
      setError("Failed to load random recipe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <button
        onClick={getRandomRecipe}
        disabled={loading}
        className="px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-accent to-destructive hover:opacity-90 transition shadow-md disabled:opacity-50"
      >
        {loading ? "Loading..." : "🎲 Get Random Recipe"}
      </button>

      {error && <p className="text-destructive mt-4 font-medium">{error}</p>}

      {randomRecipe && (
        <div className="mt-6 max-w-sm">
          <p className="text-sm text-muted-foreground mb-3 font-semibold">Your Random Pick:</p>
          <RecipeCard
            recipe={randomRecipe}
            onEdit={() => onEdit(randomRecipe)}
            onDelete={() => setRandomRecipe(null)}
          />
        </div>
      )}
    </div>
  )
}
