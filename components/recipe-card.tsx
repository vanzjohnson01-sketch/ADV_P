"use client"

interface Recipe {
  id: string
  name: string
  ingredients: string
  instructions: string
}

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
}: {
  recipe: Recipe
  onEdit: () => void
  onDelete: () => void
}) {
  const ingredientList = recipe.ingredients
    .split("\n")
    .filter((i) => i.trim())
    .slice(0, 3)

  return (
    <div className="relative p-6 rounded-xl border border-border shadow-md hover:shadow-xl transition-all bg-card group overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent group-hover:h-2 transition-all"></div>

      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold line-clamp-2 text-foreground flex-1">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {recipe.name}
          </span>
        </h3>
        <div className="flex gap-1 ml-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-muted/50">
        <p className="text-xs font-bold mb-2 text-primary">INGREDIENTS</p>
        <ul className="text-sm space-y-1 text-foreground">
          {ingredientList.map((ing, idx) => (
            <li key={idx} className="truncate">
              • {ing.trim()}
            </li>
          ))}
        </ul>
        {recipe.ingredients.split("\n").filter((i) => i.trim()).length > 3 && (
          <p className="text-xs mt-2 text-secondary font-medium">
            +{recipe.ingredients.split("\n").filter((i) => i.trim()).length - 3} more
          </p>
        )}
      </div>

      <p className="text-sm line-clamp-3 mb-4 text-muted-foreground">{recipe.instructions}</p>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-2 rounded-lg font-medium hover:bg-destructive/10 transition text-sm border-2 border-destructive text-destructive"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
