"use client"

export default function HeroBanner() {
  return (
    <div className="relative h-80 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden">
      <img
        src="/delicious-food-cooking-ingredients-colorful-vibran.jpg"
        alt="Recipe Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/60"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">Delicious Recipes</h2>
        <p className="text-xl text-white/90 drop-shadow-md max-w-2xl">
          Create, organize, and share your favorite recipes in one beautiful place
        </p>
      </div>
    </div>
  )
}
