import { type NextRequest, NextResponse } from "next/server"

const sampleRecipes = [
  {
    id: "sample_1",
    userId: "demo",
    name: "Classic Chocolate Chip Cookies",
    ingredients:
      "2 1/4 cups all-purpose flour\n1 tsp baking soda\n1 tsp salt\n1 cup butter, softened\n3/4 cup granulated sugar\n3/4 cup packed brown sugar\n2 large eggs\n2 tsp vanilla extract\n2 cups chocolate chips",
    instructions:
      "1. Preheat oven to 375°F.\n2. Combine flour, baking soda and salt in small bowl.\n3. Beat butter and sugars until creamy.\n4. Add eggs and vanilla to butter mixture and beat well.\n5. Gradually beat in flour mixture.\n6. Stir in chocolate chips.\n7. Drop rounded tablespoons onto ungreased baking sheets.\n8. Bake for 9-11 minutes or until golden brown.\n9. Cool on baking sheets for 2 minutes.",
  },
  {
    id: "sample_2",
    userId: "demo",
    name: "Homemade Margherita Pizza",
    ingredients:
      "1 lb fresh mozzarella cheese\n4 large tomatoes\n1/2 cup fresh basil\n3 tbsp olive oil\n2 cloves garlic, minced\n1 pizza dough\nSalt and black pepper to taste",
    instructions:
      "1. Preheat oven to 475°F.\n2. Stretch pizza dough onto prepared baking sheet.\n3. Drizzle with olive oil and rub with minced garlic.\n4. Spread sauce made from tomatoes evenly.\n5. Tear mozzarella and distribute over sauce.\n6. Bake for 12-15 minutes until crust is golden.\n7. Top with fresh basil after baking.\n8. Drizzle with extra virgin olive oil before serving.",
  },
  {
    id: "sample_3",
    userId: "demo",
    name: "Grilled Salmon with Lemon Dill",
    ingredients:
      "4 salmon fillets (6 oz each)\n4 tbsp butter\n2 lemons\n3 tbsp fresh dill\n4 cloves garlic, minced\nSalt and pepper to taste\nOlive oil",
    instructions:
      "1. Preheat grill to medium-high heat.\n2. Pat salmon dry and brush with olive oil.\n3. Season with salt and pepper.\n4. Mix butter, garlic, lemon zest, and dill in small bowl.\n5. Grill salmon for 4-5 minutes per side.\n6. Top each fillet with herb butter.\n7. Finish with fresh lemon juice.\n8. Serve immediately while warm.",
  },
  {
    id: "sample_4",
    userId: "demo",
    name: "Creamy Pasta Carbonara",
    ingredients:
      "1 lb spaghetti\n6 oz pancetta, diced\n4 large egg yolks\n1 cup Parmesan cheese, grated\n2 cloves garlic\nBlack pepper to taste\nSalt for pasta water",
    instructions:
      "1. Bring large pot of salted water to boil.\n2. Cook spaghetti until al dente.\n3. Meanwhile, cook pancetta until crispy.\n4. Whisk together egg yolks and Parmesan.\n5. Drain pasta, reserving 1 cup pasta water.\n6. Toss hot pasta with pancetta and fat.\n7. Remove from heat and add egg mixture, tossing quickly.\n8. Add pasta water as needed for creamy consistency.\n9. Season with black pepper and serve.",
  },
  {
    id: "sample_5",
    userId: "demo",
    name: "Thai Green Curry",
    ingredients:
      "2 tbsp Thai green curry paste\n1 can coconut milk\n1 lb chicken breast, sliced\n2 cups vegetables (bell peppers, zucchini)\n3 tbsp fish sauce\n2 tbsp palm sugar\n10 fresh basil leaves\n2 Thai chilies\nGarlic and onion",
    instructions:
      "1. Heat coconut oil in large pan over medium-high heat.\n2. Add curry paste and cook for 1-2 minutes.\n3. Add half the coconut milk and stir well.\n4. Add chicken and cook until done.\n5. Add remaining coconut milk and vegetables.\n6. Simmer for 10-15 minutes.\n7. Season with fish sauce and palm sugar.\n8. Stir in fresh basil just before serving.\n9. Garnish with Thai chilies.",
  },
  {
    id: "sample_6",
    userId: "demo",
    name: "Homemade Chocolate Brownies",
    ingredients:
      "1/2 cup butter\n1 cup sugar\n2 large eggs\n1/3 cup cocoa powder\n1/2 cup flour\n1/4 tsp salt\n1/4 tsp baking powder\n1 tsp vanilla extract\n1/2 cup chocolate chips",
    instructions:
      "1. Preheat oven to 350°F.\n2. Melt butter and mix with sugar.\n3. Beat in eggs one at a time.\n4. Add vanilla extract.\n5. Mix cocoa, flour, salt, and baking powder together.\n6. Combine wet and dry ingredients.\n7. Fold in chocolate chips.\n8. Spread in greased baking pan.\n9. Bake for 25-30 minutes.\n10. Cool completely before cutting.",
  },
]

const recipes: {
  id: string
  userId: string
  name: string
  ingredients: string
  instructions: string
}[] = [...sampleRecipes]

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, name, ingredients, instructions } = await req.json()
    const id = params.id

    if (!userId || !name || !ingredients || !instructions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const recipeIndex = recipes.findIndex((r) => r.id === id && r.userId === userId)

    if (recipeIndex === -1) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    recipes[recipeIndex] = {
      id,
      userId,
      name,
      ingredients,
      instructions,
    }

    return NextResponse.json(recipes[recipeIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const index = recipes.findIndex((r) => r.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    recipes.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
