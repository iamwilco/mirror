# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-17

### Added

#### Core MVP Features
- **Transparency Meter** — Radial gauge with animated score display, category breakdown bars, Supabase-ready data fetching, and "Data Points Verified" counter
- **Budget Sankey** — Interactive Sankey diagram showing ₳263.6M treasury flow from source to work packages, with status table and source citations
- **Influence Graph** — Force-directed 2D network visualization mapping Intersect leadership, committees, and founding entities using `react-force-graph-2d`
- **Transparency Table** — Category-level visibility table with status badges (Verified/Partial/Missing), level indicators, update dates, sources, and notes
- **About/Methodology Page** — Documentation of scoring methodology, data sources, and verification criteria

#### UI Shell & Layout
- Dark-mode-first design with emerald/teal accent palette
- Responsive header with navigation and "Contribute Data" call-to-action
- Footer navigation linking Dashboard, Budget, Network, and About sections
- Modern card-based section layout with glassmorphism effects

#### Community Features
- **Community Submission Form** — React Hook Form-powered intake form for data tips, budget anomalies, and document leads with category selection, source links, and consent checkbox

#### Testing & QA
- Jest + React Testing Library setup with `next/jest` configuration
- Basic component test for TransparencyMeter

#### Infrastructure
- Next.js 15 + React 19 + TypeScript + TailwindCSS 4 stack
- Supabase client initialization (env-var driven)
- Vercel GitHub auto-deploy integration
- Project documentation: PRD, task.json, progress tracking, architecture docs, database schema, data sources

### Fixed
- Replaced `react-force-graph` with `react-force-graph-2d` to avoid AFRAME runtime error in SSR/dev

## [0.2.0] - 2026-02-17

### Added
- **Transparency Detail Views** — Drill-down pages for each transparency category with mini-pie charts showing verified/partial/missing status distribution
- **Evidence Table** — Sub-item listings with status badges, sources, and notes for each category
- **Transparency Gaps** — Red-highlighted sections showing missing data points per category
- **Clickable Meter Bars** — Category breakdown bars in TransparencyMeter now link to detail pages
- **RTL Tests** — 7 test cases for TransparencyDetail component
- **Verified-By Tags** — Evidence table now supports community verifier badges per item
- **Verification Placeholder Badge** — Detail view header displays community verification status
- **Member Directory Page** — Searchable roster with affiliation filters and salary-missing flags
- **Historical Budget Toggle** — 2025 vs 2026 budget comparison with placeholder 2026 dataset
- **Network Data Expansion** — Added additional people/org nodes and links in Influence Graph dataset

### Changed
- TransparencyMeter "Contribute Data" button now links to submission form section
- Updated task.json with Phase 2 task structure (enhance-002 through enhance-005, data-001)
- Copied input.json research data to apps/web/src/data for component access
- Added verified_by support to schema draft + shared types
- Member directory now pulls from Supabase people table
- Budget Sankey now supports year-specific datasets
- Supabase relationships now include additional graph links from network-nodes.json

### Technical Notes
- Recharts `ResponsiveContainer` warns about container size in JSDOM/static build — non-breaking, app renders correctly in browser
- All components use `"use client"` directive for client-side interactivity

## [0.3.0] - 2026-02-19

### Added

#### Data Enrichment — 4 New Data Files
- **budget-2025.json** — Per-committee budget breakdown: ₳263.5M across 6 budget buckets (Core, Research, Governance Support, Growth & Marketing, Innovation, Intersect Ops), 8 committee allocations, treasury withdrawal schedule with NCL constraints
- **elections-2025.json** — Q4 2025 committee election results: 36 elected members across 8 committees, 293 voters (19.4% turnout), 5,182 ballots, 98 candidates, per-candidate vote counts and bios. Audited by Dquadrant
- **governance-stats.json** — DRep participation (6.23B ADA delegated, 68% to Abstain), CF delegation strategy (360M ADA to 18 DReps), constitution ratification (Dec 2024 Buenos Aires), governance milestones, treasury stats (~1.7B ADA)
- **meeting-archives.json** — Committee meeting recordings and minutes: OSC YouTube recordings, TSC/ISC/CBC written minutes, transparency gap analysis (5 of 10 committees have no public archives)

#### Committee Member Enrichment
- **8 of 9 committees** now have named elected members (was 3 with placeholders)
- **48 named committee members** with vote counts, affiliations, and bios extracted from official election results
- Per-committee `budget_ada` and `source_url` fields added to all committees in input.json

#### Knowledge Base Expansion
- **33 sources** in sources.json (was 22) — added election results, budget docs, CExplorer governance analysis, CF governance blog, OSC YouTube, TSC docs, budget committee minutes, Dquadrant audit, constitution pages, budget spreadsheet
- **40 verified facts** (was 20) — added budget breakdowns, DRep delegation stats, election turnout, constitution ratification, CF delegation strategy, meeting archive coverage, Net Change Limit, Plomin Hard Fork
- All 8 enrichment opportunities marked as completed with result summaries

### Changed
- **/sources page** — New coverage cards for Budget Allocations (₳263.5M), Elected Members (36), DRep Delegation (₳6.2B), Governance stats; enrichment items now show ✓ done status with result descriptions; on-chain card shows integrated vs pending data
- **data_coverage_summary** — Updated to reflect: 8/9 committees with known members, 48 named members, 8 budget entries, election stats, governance stats, meeting archive coverage
