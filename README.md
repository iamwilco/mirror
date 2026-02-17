# Intersect Mirror

Intersect Mirror is a public, independent transparency platform for **Intersect MBO**. It visualizes budgets, governance, people, and influence networks to help the Cardano community track what is public, what is missing, and where to contribute verified sources.

## What’s Included
- **Transparency Meter** with category breakdown and drill‑down detail views
- **Budget Overview** with Sankey diagrams + 2025/2026 comparison toggle
- **Influence Graph** showing relationships between people and orgs
- **Transparency Table** summarizing status and sources
- **Member Directory** with filters and salary‑missing flags
- **Community Submission Form** for data tips

## Tech Stack
- **Next.js 16** (App Router) + **React 19**
- **TypeScript** + **TailwindCSS 4**
- **Recharts** + **react-force-graph-2d**
- **Supabase** (Postgres) for persistence
- **Jest + React Testing Library** for tests

## Repo Structure
```
.
├── apps/
│   └── web/              # Next.js app
├── data/                 # Research inputs + raw datasets
├── src/                  # Shared types
├── system/               # Architecture + schema docs
├── CHANGELOG.md
└── README.md
```

## Setup
### 1) Install dependencies
```
cd apps/web
npm install
```

### 2) Configure environment
Create `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3) Run the app
```
npm run dev
```
Visit http://localhost:3000

## Supabase Seeding (optional)
After creating tables (`people`, `committees`, `relationships`), seed data:
```
cd apps/web
node scripts/seed-supabase.js
```

## Scripts (apps/web)
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run start` — start prod server
- `npm run lint` — lint
- `npm test` — unit tests

## Data Sources
Research inputs live in:
- `data/input.json` (raw notes)
- `apps/web/src/data/input.json` (app-local seed data)
- `apps/web/src/data/network-nodes.json` (graph nodes/edges)

## Contributing
- Keep sources factual and verifiable
- Use Conventional Commits (`feat:`, `fix:`, `docs:`)
- Avoid speculation; flag gaps explicitly

## License
TBD
