"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import RecipeList from "@/components/recipe-list"
import RecipeForm from "@/components/recipe-form"
import HeroBanner from "@/components/hero-banner"
import RandomRecipe from "@/components/random-recipe"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (id: string) => {
    setUserId(id)
    setIsLoggedIn(true)
    localStorage.setItem("userId", id)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserId(null)
    setShowForm(false)
    setEditingRecipe(null)
    localStorage.removeItem("userId")
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroBanner />

      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Recipe Manager</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg text-white font-medium bg-primary hover:bg-primary/90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <RecipeForm
            userId={userId!}
            recipe={editingRecipe}
            onSave={() => {
              setShowForm(false)
              setEditingRecipe(null)
              setRefreshKey((prev) => prev + 1)
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingRecipe(null)
            }}
          />
        )}

        {!showForm && (
          <>
            <div className="flex gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition shadow-md"
              >
                + Add New Recipe
              </button>
              <RandomRecipe
                userId={userId!}
                onEdit={(recipe) => {
                  setEditingRecipe(recipe)
                  setShowForm(true)
                }}
              />
            </div>

            <RecipeList
              key={refreshKey}
              userId={userId!}
              onEdit={(recipe) => {
                setEditingRecipe(recipe)
                setShowForm(true)
              }}
              onRecipeDeleted={() => {
                setRefreshKey((prev) => prev + 1)
              }}
            />
          </>
        )}
      </div>
    </main>
  )
}
