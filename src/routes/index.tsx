import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="font-heading text-6xl text-val-red tracking-wider mb-4">
        VCT Fantasy League
      </h1>
      <p className="text-val-text-secondary text-lg max-w-xl text-center">
        Build your dream Valorant Champions Tour roster. Draft pro players,
        earn points from real match performance, and compete on the leaderboard.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="bg-val-red hover:bg-val-accent-hover text-val-text-primary font-ui font-semibold px-6 py-3 clip-angular transition-colors">
          Get Started
        </button>
        <button className="border border-val-border hover:border-val-text-secondary text-val-text-primary font-ui font-semibold px-6 py-3 clip-angular transition-colors">
          Learn More
        </button>
      </div>
    </div>
  )
}
