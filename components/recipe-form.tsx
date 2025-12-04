"use client"

import type React from "react"

import { useState } from "react"

interface Recipe {
  id?: string
  name: string
  ingredients: string
  instructions: string
}

export default function RecipeForm({
  userId,
  recipe,
  onSave,
  onCancel,
}: {
  userId: string
  recipe?: Recipe
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Recipe>(recipe || { name: "", ingredients: "", instructions: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const endpoint = recipe ? `/api/recipes/${recipe.id}` : "/api/recipes"
      const method = recipe ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      if (!response.ok) throw new Error("Failed to save recipe")
      onSave()
    } catch (err) {
      setError("Failed to save recipe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {recipe ? "Edit Recipe" : "Add New Recipe"}
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Recipe Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            placeholder="e.g., Chocolate Chip Cookies"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Ingredients *</label>
          <textarea
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition h-32 resize-none"
            placeholder="Enter ingredients, one per line&#10;e.g.&#10;2 cups flour&#10;1 cup sugar"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Instructions *</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition h-32 resize-none"
            placeholder="Enter cooking instructions step by step"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Recipe"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg font-bold hover:bg-muted transition border-2 border-muted text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
