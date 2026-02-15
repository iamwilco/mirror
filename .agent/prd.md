# Intersect Mirror - Product Requirements Document (PRD)

**Project Name:** Intersect Mirror  
**Version:** 1.0 (Draft)  
**Date:** February 15, 2026  
**Status:** In Progress

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

### Phase 2 Features (After MVP)
- Member Directory + Paid Positions (with salary ranges if available)
- Quarterly Financial Reports tracker
- Results & Impact KPI dashboard
- Decision log (How decisions are made inside committees)
- Community contribution system (Submit data with proof)
- Historical budget comparison (2025 vs 2026)

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
2. On-chain Treasury Withdrawals (CardanoScan / Gov.tools)
3. Intersect official docs & quarterly reports
4. Intersect website + GitBook

**Secondary:**
- Cardano Forum threads
- Intersect Town Halls / AMAs
- Community submissions (with strict verification)

## 6. Tech Stack Recommendation

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
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

## 10. Next Steps

1. Finalize PRD + get agreement
2. Create detailed data model / database schema
3. Build design system (UI components)
4. Collect & structure initial data manually
5. Build MVP Hero Dashboard

---

**Approval Needed:**
- Project Name → Intersect Mirror ?
- Core Concept (Transparency Meter + Network Graph) ?
- MVP Scope OK?

Let me know what you think.

Would you like me to now create:

1. **task.json** (for your agents)
2. Recommended folder structure (`/system`, `/task`, `/data`, etc.)
3. Database schema draft?

Or do you want to refine this PRD first?

Just tell me what to focus on next.