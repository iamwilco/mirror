# Intersect Mirror - Product Requirements Document (PRD)

**Project Name:** Intersect Mirror  
**Version:** 1.0  
**Date:** February 17, 2026  
**Status:** MVP Complete

## 1. Vision & Purpose

**Intersect Mirror** is a public, independent, and highly visual transparency platform for **Intersect MBO**.

The goal is to make Intersect’s budget, structure, people, money flow, decision-making process, and results **radically transparent** for the entire Cardano community — while holding Intersect accountable to their own stated values (radical transparency, community-driven governance, openness).

We will expose what is public, clearly mark what is hidden, and let the community help fill the gaps.

## 2. Core Objectives

1. Show **exactly how much money** Intersect manages (~₳263M+ in 2025 budget)
2. Clearly visualize **Transparent vs Hidden** data
3. Create an engaging **Transparency Score** system
4. Map the **power & influence network** (Intersect + founding entities)
5. Make complex governance understandable through great design & diagrams

## 3. Key Features (Prioritized)

### Phase 1 - MVP (Highest Priority)

**1. Hero Dashboard - Transparency Meter (Main Eye Catcher)**
- Large central **Transparency Score** (0–100%)
- Breakdown by major categories:
  - Budget Flow & Money Tracking
  - People, Salaries & Paid Positions
  - Committees & Decision Making
  - Results & Deliverables
  - Procurement & Contracts
  - Influence & Relationships
- Visual style: Clean radial gauge + segmented bars
- "Data Points Verified" counter (e.g. 87 / 142)
- Call-to-action: “Help Increase Transparency”

**2. 2025 Budget Overview**
- Total Budget: ₳263.6 Million ADA
- Intersect Ops Funding: ₳20 Million
- Sankey Diagram: Treasury → CDH → Committees → Work Packages
- Current status (Approved / Withdrawn / Spent)

**3. Network & Influence Graph**
- Force-directed graph showing relationships:
  - Intersect Board Members
  - Committee Chairs + Members
  - Connections to Cardano Foundation, IOG, Emurgo, Midnight Foundation
  - Current Executive Director (Jack Briggs)
  - Highlight overlapping roles / potential influence

**4. Data Transparency Table**
Clean table showing:
- Category | Status | Transparency Level | Last Updated | Source | Notes
- Color coding: Green (High), Yellow (Medium), Red (Low)

### Phase 2 Features (Post-MVP)

**1. Transparency Breakdown Detail View (enhance-002)** ✅
- Clickable drill-down from Hero Meter category bars
- Detail page per category showing:
  - Sub-data points (e.g., "Board Members: Verified 4/10", "Salaries: Missing")
  - Evidence table: Item | Status | Source Link | Verified By | Notes/Gaps
  - Mini-pie chart for category score distribution
  - "Transparency Debts" list (red badges for missing info)
  - CTA: "Submit Update" linking to community form
- Subtle gamification: users "unlock" higher scores by contributing facts

**2. Verification Workflow Tags (enhance-003)** ✅
- "Verified by Community" badges on evidence table items
- Schema support for `verifiedBy` field across all tables
- Placeholder badge on detail view headers

**3. Member Directory + Paid Positions (enhance-004)** ✅
- Searchable roster with dynamic affiliation filters
- Salary-missing flags (red badges)
- Wired to Supabase `people` table

**4. Historical Budget Comparison (enhance-005)** ✅
- 2025 vs 2026 toggle on budget section
- Separate Sankey datasets per year
- 2026 figures are placeholders pending official releases

**5. Data Integration (data-001)** ✅
- Expanded network graph with all known people/orgs
- Seeded Supabase with people, committees, relationships
- Graph relationships include board, executive, founding, and enterprise links

**Upcoming:**
- Quarterly Financial Reports tracker
- Results & Impact KPI dashboard
- Decision log (committee decision-making process)
- On-chain treasury withdrawal tracking (via gov.tools)
- Score recalculation engine (dynamic based on verified data points)
- Additional people: Kavinda Kariyapperuma, Yuri Kuriyama, Rafael Cardoso, Georg Link
- Additional committees: OSC, GMC, Budget, Oversight, MCC, Parameter

## 4. Transparency Scoring System (Core Mechanic)

Categories & Weights (suggested):

- Budget & Money Flow          → 30%
- Governance & Decision Process → 20%
- People & Compensation         → 20%
- Results & Deliverables        → 15%
- Procurement & Contracts       → 10%
- Organizational Relationships  → 5%

Scoring logic:
- 100% = Fully verified on-chain or official report
- 50% = Partial information available
- 0% = No public information

## 5. Data Sources (Priority Order)

**Primary (Most Reliable):**
1. Official Intersect Budget Proposal (₳263.6M)
2. On-chain Treasury Withdrawals — [CardanoScan](https://cardanoscan.io) / [Gov.tools](https://gov.tools)
3. Intersect official docs & quarterly reports
4. Intersect website + GitBook
5. Intersect Weekly Updates (#93–#98 for 2026 progress)

**Secondary:**
- Cardano Forum threads
- Intersect Town Halls / AMAs
- Community submissions (with strict verification)
- Intersect X/Twitter posts (elections, membership announcements)

## 6. Tech Stack Recommendation

- **Frontend**: Next.js 16 + TypeScript + TailwindCSS 4
- **Charts & Diagrams**: Recharts + react-force-graph (for network graph)
- **Database**: Supabase (Postgres) or Firebase
- **Authentication**: Optional (Cardano wallet sign-in later)
- **Hosting**: Vercel
- **Design**: Clean, dark/light mode, modern Cardano aesthetic

## 7. Design & Tone Requirements

- Extremely professional & neutral tone
- No memes, no sarcasm in UI
- High data-ink ratio
- Excellent mobile responsiveness
- Dark mode first (preferred by crypto users)

## 8. MVP Scope (First 4-6 Weeks)

Must-have for launch:
1. Hero Transparency Meter
2. 2025 Budget breakdown + Sankey
3. Basic Network Graph (manual data first)
4. Transparency table
5. About / Methodology page

Nice-to-have:
- Community submission form
- More detailed network connections

## 9. Risks & Challenges

- Hard to get accurate salary & internal org chart data
- Balancing "gamification" without becoming unprofessional
- Keeping data updated long-term
- Maintaining neutrality & avoiding FUD perception

**Success Metric**:
- At least 5,000+ unique visitors in first 3 months
- Community starts contributing verified data
- Intersect is forced to release more information due to public pressure

## 10. Implementation Status

### MVP Completed ✅
- [x] Hero Transparency Meter with animated score and category breakdown
- [x] 2025 Budget Sankey diagram with status table
- [x] Network & Influence Graph (force-directed 2D)
- [x] Transparency Table with status indicators
- [x] About/Methodology page
- [x] Community submission form (Phase 2 feature delivered early)

### Infrastructure ✅
- [x] Next.js 15 + React 19 + TypeScript + TailwindCSS 4
- [x] Supabase client ready (env-var driven)
- [x] Jest + RTL testing setup
- [x] Vercel GitHub auto-deploy

### Phase 2 Completed ✅
- [x] Transparency Breakdown Detail View (enhance-002)
- [x] Verification Workflow Tags (enhance-003)
- [x] Member Directory + Paid Positions (enhance-004)
- [x] Historical Budget Comparison (enhance-005)
- [x] Data Integration — expanded graph + Supabase seeding (data-001)

### Score Targets (Post Data Integration)
- **People & Compensation**: ~50% (roles verified, salaries missing)
- **Organizational Relationships**: ~70% (clear founder links documented)
- **Governance & Decisions**: ~55% (committees partially documented)
- **Budget & Money Flow**: ~68% (proposal verified, granular spend missing)

### Next Phase (Phase 3)
- [ ] Quarterly Financial Reports tracker
- [ ] Results & Impact KPI dashboard
- [ ] Decision log (committee process)
- [ ] On-chain treasury withdrawal tracking
- [ ] Dynamic score recalculation engine

---

**Project Repository:** [github.com/iamwilco/mirror](https://github.com/iamwilco/mirror)  
**Live URL:** Deployed via Vercel (auto-deploy on push)