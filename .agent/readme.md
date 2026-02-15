# 📚 Intersect Mirror Agent Documentation Index

> **For AI Agents:** Read this file first to understand available documentation and when to reference each resource.

This folder contains all the documentation needed for AI agents to effectively assist with development on the Intersect Mirror project. Use this index to quickly navigate to the relevant documentation for your current task.

---

## 🗺️ Quick Navigation

| Folder | Purpose | When to Read |
|--------|---------|--------------|
| [`/system`](./system/) | Architecture, schemas, data models | **First**, for any architectural decisions or understanding system design |
| [`/tasks`](./tasks/) | PRDs, task breakdowns, implementation plans | When implementing features or checking task progress |
| [`/SOPs`](./SOPs/) | Standard Operating Procedures | When encountering known issues or following established patterns |
| [`/skills`](./skills/) | Agent skills and reusable playbooks | When a task matches a supported skill |
| [`/workflows`](./workflows/) | Step-by-step development workflows | When executing specific development tasks |

---

## 📁 Folder Details

### `/system` — Architecture & Schemas

**The source of truth for major architectural decisions.**

Read these files to understand:
- Overall system architecture and component relationships
- Database schemas (Supabase tables)
- API/data fetching patterns
- Transparency scoring logic

Files:
- `architecture.md` — System overview, component diagram, data flow
- `database-schema.md` — Supabase tables: budgets, people, relationships, transparency_scores
- `data-sources.md` — Primary/secondary data sources and verification levels

---

### `/tasks` — PRD & Task Management

**Product requirements and implementation task tracking.**

Key files:
- `task.json` — Current task breakdown with phases, subtasks, and status
- `prd.md` — Product Requirements Document for Intersect Mirror

Before implementing a feature:
1. Check `task.json` for assigned tasks and dependencies
2. Reference `prd.md` for requirements and scope
3. Update task status as work progresses

---

### `/SOPs` — Standard Operating Procedures

**Learnings from resolved issues and best practices.**

When an issue is resolved or a complex integration succeeds:
1. Document the step-by-step solution
2. Include common pitfalls and how to avoid them
3. Reference related code or configuration

**To create a new SOP**, ask the agent:
> "Generate SOP for [task/integration name]"

---

### `/skills` — Agent Skills

**Reusable, task-specific playbooks.**

Use these when a task matches a supported skill:

| Skill | Description |
|-------|-------------|
| `recharts-usage` | Creating charts with Recharts (RadialBar, Sankey, Bar) |
| `react-force-graph` | Building force-directed network graphs |
| `supabase-queries` | Fetching and mutating data in Supabase |
| `tailwind-design-system` | Styling components with Tailwind (dark mode first) |
| `git-commit-formatter` | Conventional commit formatting |

---

### `/workflows` — Development Workflows

**Step-by-step guides for common development tasks.**

Available workflows:

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `build.md` | Build the Next.js app | `/build` |
| `test.md` | Run test suites | `/test` |
| `frontend.md` | Frontend development patterns | `/frontend` |
| `database.md` | Supabase schema changes | `/database` |
| `deploy.md` | Deploy to Vercel | `/deploy` |
| `update-doc.md` | Update documentation | `/update-doc` |

---

## 🏗️ Project Overview

**Intersect Mirror** is a public transparency platform for **Intersect MBO**, designed to make budget, governance, and organizational data radically transparent for the Cardano community.

### Core Features (MVP)

| Feature | Description |
|---------|-------------|
| **Transparency Meter** | Radial gauge showing overall transparency score (0-100%) |
| **Budget Overview** | 2025 budget breakdown with Sankey diagram |
| **Network Graph** | Force-directed graph of people, orgs, and influence |
| **Transparency Table** | Sortable table with category status and sources |

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | TailwindCSS (dark mode first) |
| **Charts** | Recharts (RadialBar, Sankey, Bar) |
| **Network Graph** | react-force-graph |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |

### Project Structure

```
intersect-mirror/
├── .agent/              # Agent documentation (you are here)
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   │   ├── TransparencyMeter.tsx
│   │   ├── BudgetSankey.tsx
│   │   ├── InfluenceGraph.tsx
│   │   └── TransparencyTable.tsx
│   ├── lib/             # Utilities, Supabase client
│   └── types/           # TypeScript interfaces
├── data/                # Seed data (JSON)
├── public/              # Static assets
└── docs/                # Additional documentation
```

---

## ⚡ Quick Commands

```bash
npm install
npm run dev      # Development
npm run build    # Production build
npm test         # Run tests
```

---

## 🔐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

See `.env.example` for full list.

---

## 📊 Transparency Scoring

Categories & Weights (from PRD):

| Category | Weight |
|----------|--------|
| Budget & Money Flow | 30% |
| Governance & Decision Process | 20% |
| People & Compensation | 20% |
| Results & Deliverables | 15% |
| Procurement & Contracts | 10% |
| Organizational Relationships | 5% |

Scoring logic:
- **100%** = Fully verified (on-chain or official report)
- **50%** = Partial information available
- **0%** = No public information