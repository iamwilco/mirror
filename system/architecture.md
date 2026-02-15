# Intersect Mirror — Architecture

## Overview
Intersect Mirror is a public transparency platform for Intersect MBO. The system is a data-first, read-heavy web app with curated datasets, visualizations, and a transparency scoring model.

## Core Components
- **Frontend (Next.js 15 + React 19)**
  - App Router pages under `/src/app`
  - Visualization components under `/src/components`
  - TailwindCSS styling (dark mode first)
- **Data Layer (Supabase/Postgres)**
  - Stores budgets, people, relationships, and transparency scores
  - Read-only access for MVP (no auth required)
- **Seed Data (JSON)**
  - `/data/initial-budget.json`
  - `/data/network-nodes.json`

## Data Flow
1. Seed data curated locally (JSON files).
2. Seeded into Supabase tables.
3. Frontend fetches from Supabase and renders charts/tables.

## Pages (MVP)
- `/` — Transparency Meter + summary
- `/budget` — Sankey + budget table
- `/network` — Influence graph
- `/about` — Methodology and sources

## Non-Goals (MVP)
- Authentication
- User submissions
- Write access from UI
