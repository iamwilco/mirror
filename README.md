# Intersect Mirror

Independent transparency index for **Intersect MBO** — the Wyoming nonprofit corporation that administers Cardano's treasury and coordinates off-chain governance.

**Not affiliated with Intersect, IOG, EMURGO, or the Cardano Foundation.**

## What This Is

Intersect manages ₳263M+ in Cardano treasury funds, employs 31 people, and coordinates governance across 7 advisory committees. This platform tracks what they disclose and what they don't.

Every claim is sourced. Every data point is tagged as **verified**, **partial**, or **missing**. Analysis is clearly labelled.

## Live Pages

| Page | What It Shows |
|------|---------------|
| **Dashboard** (`/`) | Transparency score, key numbers at a glance, biggest gaps |
| **History** (`/history`) | Timeline from Wyoming incorporation (Jul 2023) to present |
| **Power Map** (`/hierarchy`) | Who holds binding authority vs advisory-only roles, elected vs appointed |
| **Accountability** (`/accountability`) | Conflict of interest map, committee scorecard, budget-per-voter, founding entity footprint |
| **Budget** (`/budget`) | ₳263.6M breakdown, 39 treasury proposals, vendor concentration (IOG 49.3%), Sankey flow |
| **People** (`/members`) | Directory with elected/appointed/hired badges, salary gap flags |
| **Elections** (`/elections`) | Per-candidate vote counts, turnout analysis (19.4%), competitiveness index |
| **Governance** (`/governance`) | DRep participation (68% abstain), CF delegation power, influence network, chain split incident |
| **Sources** (`/sources`) | 40+ sources, 54 verified facts, enrichment opportunities |
| **Contribute** (`/contribute`) | Community data submission form |

## Key Findings

- **Committee authority is ambiguous** — bylaws (Article 5) grant delegated board authority with exceptions, but Intersect describes committees as advisory
- **IOG receives 49.3%** (₳130.1M) of the total approved 2025 budget and holds an appointed board seat
- **28 of 39 vendor amounts are undisclosed** — only 4 proposals have confirmed ADA amounts
- **No staff salary data** has been disclosed (committee stipends and programme budgets are public)
- **Board meeting minutes** are published at board.docs.intersectmbo.org but vary in depth and detail
- **19 of 31 staff members** are not publicly named
- **~20% election turnout** — 293 of 1,510 eligible members voted in the last committee election
- **Founding entities (IOG, EMURGO, CF)** held 2 of 4 board seats (blocking power) until Sep 2025 expansion; CF-affiliated people (democratically elected) sit on 4+ committees

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **TailwindCSS 4** (dark theme)
- **Recharts** (Sankey diagrams) + **react-force-graph-2d** (influence network)
- **Supabase** (optional, for community submissions)
- **Jest + React Testing Library** (tests)

## Repo Structure

```
.
├── apps/web/                   # Next.js app
│   ├── src/app/                # Pages (App Router)
│   │   ├── page.tsx            # Dashboard
│   │   ├── history/            # Intersect timeline
│   │   ├── hierarchy/          # Power Map
│   │   ├── accountability/     # Conflicts, scorecard, metrics
│   │   ├── budget/             # Treasury analysis
│   │   ├── members/            # People directory
│   │   ├── elections/          # Vote results
│   │   ├── governance/         # DRep stats, CF delegation
│   │   ├── sources/            # Knowledge base
│   │   └── contribute/         # Submit data form
│   ├── src/components/         # Shared components
│   ├── src/data/               # JSON datasets (all sourced)
│   └── src/lib/                # Supabase client
├── data/                       # Raw research data
├── system/                     # Architecture docs
└── README.md
```

## Data Sources

All data is sourced from:

- Intersect official website, docs, and weekly updates (#94–#104)
- Intersect bylaws (Wyoming Nonprofit Corporation Act)
- Committee election results (Oct 2024, Sep/Oct 2025)
- Sundae Treasury Portal (39 on-chain proposals)
- Budget Committee documentation
- Cardano Foundation governance blog
- CExplorer governance analysis
- Community research (Lido Nation, Cardano Forum)

Full source catalog with 40+ entries: see `/sources` page.

## Setup

```bash
cd apps/web
npm install
npm run dev
```

Visit http://localhost:3000

### Environment (optional)

Create `apps/web/.env.local` for Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Scripts

```bash
npm run dev       # Local development
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Lint
npm test          # Unit tests
```

## Contributing

- Every claim must have a source
- Use factual language — no speculation or assumptions
- Flag gaps explicitly rather than guessing
- Use Conventional Commits (`feat:`, `fix:`, `docs:`)
- Submit evidence via `/contribute` or open a PR

## License

TBD
