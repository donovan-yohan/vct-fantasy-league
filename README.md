# VCT Fantasy League

Fantasy league for the Valorant Champions Tour. Draft pro players, earn points from real match performance, and compete on the leaderboard.

**Live:** https://vct-fantasy-league.vercel.app

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework with SSR
- [TanStack Router](https://tanstack.com/router) — type-safe file-based routing
- [TanStack Query](https://tanstack.com/query) — async state management and caching
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [Vite](https://vite.dev/) — build tooling
- [Nitro](https://nitro.build/) — server engine (Vercel preset)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server on http://localhost:3000
npm run dev

# Type check
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  routes/          # File-based routes (TanStack Router)
    __root.tsx     # Root layout with head content
    index.tsx      # Home page
  models/          # Data models
    player.ts      # Player stats and scoring
    team.ts        # Team rosters
    match.ts       # Match results
    tournament.ts  # Tournament structure
  services/
    api/           # API client layer
      client.ts    # HTTP client
      endpoints.ts # API endpoint definitions
      queries.ts   # TanStack Query hooks
      mappers.ts   # Response data mappers
      cache.ts     # Query cache configuration
      types.ts     # API type definitions
    tournament/    # Tournament logic
      tracker.ts   # Live match tracking
      season.ts    # Season management
      types.ts     # Tournament types
  styles/
    app.css        # Global styles and Tailwind config
```

## Deployment

Deployed to Vercel with the Nitro preset. Pushes to `main` trigger automatic deployments.

```bash
# Manual deploy
npm run build
npx vercel deploy --prebuilt --prod
```

## License

MIT
