"use client";

import electionsData from "@/data/elections-2025.json";
import hierarchyData from "@/data/hierarchy.json";
import inputData from "@/data/input.json";
import meetingData from "@/data/meeting-archives.json";
import treasuryData from "@/data/treasury-proposals.json";
import budgetData from "@/data/budget-2025.json";

/* ─── Types ─── */
interface Conflict {
  entity: string;
  roles: string[];
  concern: string;
  source: string;
  severity: "high" | "medium" | "low";
}

interface CommitteeElectionResult {
  committee: string;
  seats_elected: number;
  candidates: Array<{
    name: string;
    votes: number;
    elected: boolean;
    bio: string;
  }>;
}

/* ─── Constants ─── */
const CONFLICTS: Conflict[] = [
  {
    entity: "Sundae Labs",
    roles: [
      "Built treasury smart contracts for Intersect",
      "Sits on Oversight Committee that monitors those same contracts",
    ],
    concern:
      "The entity that built the financial infrastructure also oversees it",
    source:
      "treasury-proposals.json — smart_contract_framework.oversight_committee",
    severity: "high",
  },
  {
    entity: "IOG (Input Output Global)",
    roles: [
      "Receives ₳130.1M (49.3% of total budget)",
      "Holds appointed board seat via Gerard Moroney (COO)",
    ],
    concern:
      "The largest budget recipient has a seat on the governing board",
    source: "treasury-proposals.json, hierarchy.json",
    severity: "high",
  },
  {
    entity: "EMURGO",
    roles: [
      "Founding seed funder with appointed board seat (Nikhil Joshi, COO)",
      "Enterprise member",
    ],
    concern: "Seed funder retains board-level influence",
    source: "hierarchy.json, Intersect bylaws",
    severity: "medium",
  },
  {
    entity: "Samuel Leathers",
    roles: [
      "Paid Intersect staff (Special Technical Advisor)",
      "Elected Product Committee Chair (168 votes)",
    ],
    concern: "Paid employee also chairs an advisory committee",
    source: "people.json, elections-2025.json",
    severity: "medium",
  },
  {
    entity: "Cardano Foundation",
    roles: [
      "Nicolas Cerny (CF Governance Lead) — Budget Committee, 176 votes",
      "Megan Dyamond (CF Legal Counsel) — Civics Committee",
      "Giorgio Zinetti (CF CTO) — Product Committee, 137 votes",
      "Alexandre Maaza (CF Sustainability Lead) — Product Committee, 51 votes",
      "Arnaud (CF) — Open Source Committee member",
    ],
    concern: "5 CF-affiliated people sit across 4 different committees",
    source: "elections-2025.json, input.json",
    severity: "high",
  },
];

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-rose-500/20", text: "text-rose-300", label: "High" },
  medium: { bg: "bg-amber-500/20", text: "text-amber-300", label: "Medium" },
  low: { bg: "bg-white/10", text: "text-white/60", label: "Low" },
};

/* ─── Derived data ─── */

// Election results
const electionResults: CommitteeElectionResult[] = electionsData.results;
const totalVoters = electionsData.election.total_voters; // 293
const eligibleVoters = electionsData.election.eligible_voters; // 1510
const totalBudget = budgetData.total_proposed_ada; // 263507044

// Committee budgets from hierarchy children (standing committees)
const standingCommittees =
  hierarchyData.hierarchy.children.find(
    (c: { name: string }) => c.name === "Standing Committees"
  ) as { children?: Array<{ name: string; budget_ada?: number; chair?: string; elected_members?: Array<{ name: string; votes?: number }> }> } | undefined;

const committeeChildren = standingCommittees?.children ?? [];

// Meeting data
const meetings = meetingData.meetings;

// Input data committees
const inputCommittees = inputData.committees;

// Budget per voter
const budgetPerVoter = Math.round(totalBudget / totalVoters);
const budgetPerEligible = Math.round(totalBudget / eligibleVoters);

/* Build committee transparency scorecard */
interface CommitteeScore {
  name: string;
  hasMinutes: boolean;
  hasRecordings: boolean;
  chairIdentified: boolean;
  budgetKnown: boolean;
  transparency: string;
  budgetAda: number | null;
}

function buildScorecard(): CommitteeScore[] {
  const scorecards: CommitteeScore[] = [];

  // Use committee names from election results + hierarchy as the canonical list
  const committeeNames = [
    "Technical Steering Committee (TSC)",
    "Open Source Committee (OSC)",
    "Civics Committee (CCC)",
    "Budget Committee (CBC)",
    "Growth & Marketing Committee (GMC)",
    "Membership & Community Committee (MCC)",
    "Product Committee (CPC)",
  ];

  for (const name of committeeNames) {
    // Find meeting entry (fuzzy match)
    const meetingEntry = meetings.find((m) => {
      const mn = m.committee.toLowerCase();
      const cn = name.toLowerCase();
      // Match on key words
      if (cn.includes("technical") && mn.includes("technical")) return true;
      if (cn.includes("open source") && mn.includes("open source")) return true;
      if (cn.includes("civics") && mn.includes("civics")) return true;
      if (cn.includes("budget") && mn.includes("budget")) return true;
      if (cn.includes("growth") && mn.includes("growth")) return true;
      if (cn.includes("membership") && mn.includes("membership")) return true;
      if (cn.includes("product") && mn.includes("product")) return true;
      return false;
    });

    // Find in hierarchy
    const hierEntry = committeeChildren.find((c) => {
      const hn = c.name.toLowerCase();
      const cn = name.toLowerCase();
      if (cn.includes("technical") && hn.includes("technical")) return true;
      if (cn.includes("open source") && hn.includes("open source")) return true;
      if (cn.includes("civics") && hn.includes("civics")) return true;
      if (cn.includes("budget") && hn.includes("budget")) return true;
      if (cn.includes("growth") && hn.includes("growth")) return true;
      if (cn.includes("membership") && hn.includes("membership")) return true;
      if (cn.includes("product") && hn.includes("product")) return true;
      return false;
    });

    // Find in input.json
    const inputEntry = inputCommittees.find((c) => {
      const iName = c.name.toLowerCase();
      const cn = name.toLowerCase();
      if (cn.includes("technical") && iName.includes("technical")) return true;
      if (cn.includes("open source") && iName.includes("open source"))
        return true;
      if (cn.includes("civics") && iName.includes("civics")) return true;
      if (cn.includes("budget") && iName.includes("budget")) return true;
      if (cn.includes("growth") && iName.includes("growth")) return true;
      if (cn.includes("membership") && iName.includes("membership"))
        return true;
      if (cn.includes("product") && iName.includes("product")) return true;
      return false;
    });

    const hasMinutes = meetingEntry?.minutes_url != null;
    const hasRecordings = meetingEntry?.has_recordings === true;
    const chairIdentified =
      (hierEntry && "chair" in hierEntry && !!hierEntry.chair) || false;
    const budgetAda =
      hierEntry?.budget_ada ??
      (inputEntry && "budget_ada" in inputEntry
        ? (inputEntry as { budget_ada?: number }).budget_ada ?? null
        : null);
    const budgetKnown = budgetAda != null && budgetAda > 0;
    const transparency =
      (inputEntry && "transparency" in inputEntry
        ? (inputEntry as { transparency?: string }).transparency
        : undefined) ?? "unknown";

    scorecards.push({
      name,
      hasMinutes,
      hasRecordings,
      chairIdentified,
      budgetKnown,
      transparency,
      budgetAda: budgetAda ?? null,
    });
  }

  return scorecards;
}

const scorecard = buildScorecard();
const committeesWithMinutes = scorecard.filter((c) => c.hasMinutes).length;
const committeesWithRecordings = scorecard.filter(
  (c) => c.hasRecordings
).length;
const recordingNames = scorecard
  .filter((c) => c.hasRecordings)
  .map((c) => c.name);

/* Budget per vote computation */
interface BudgetPerVote {
  committee: string;
  budgetAda: number;
  lowestWinnerVotes: number;
  lowestWinnerName: string;
  budgetPerVote: number;
  highestWinnerVotes: number;
  highestWinnerName: string;
}

function computeBudgetPerVote(): BudgetPerVote[] {
  const results: BudgetPerVote[] = [];

  // Map election committee names to budget amounts
  const budgetMap: Record<string, number> = {};
  for (const child of committeeChildren) {
    if (child.budget_ada) {
      const n = child.name.toLowerCase();
      if (n.includes("technical")) budgetMap["technical"] = child.budget_ada;
      if (n.includes("open source")) budgetMap["open source"] = child.budget_ada;
      if (n.includes("civics")) budgetMap["civics"] = child.budget_ada;
      if (n.includes("budget")) budgetMap["budget"] = child.budget_ada;
      if (n.includes("growth")) budgetMap["growth"] = child.budget_ada;
      if (n.includes("membership")) budgetMap["membership"] = child.budget_ada;
      if (n.includes("product")) budgetMap["product"] = child.budget_ada;
    }
  }

  for (const result of electionResults) {
    const cn = result.committee.toLowerCase();
    let key = "";
    if (cn.includes("steering") && cn.includes("intersect")) continue; // ISC doesn't have own budget
    if (cn.includes("technical")) key = "technical";
    else if (cn.includes("open source")) key = "open source";
    else if (cn.includes("civics")) key = "civics";
    else if (cn.includes("budget")) key = "budget";
    else if (cn.includes("growth")) key = "growth";
    else if (cn.includes("membership")) key = "membership";
    else if (cn.includes("product")) key = "product";

    const budget = budgetMap[key];
    if (!budget) continue;

    const elected = result.candidates.filter((c) => c.elected);
    if (elected.length === 0) continue;

    const sortedByVotes = [...elected].sort((a, b) => a.votes - b.votes);
    const lowest = sortedByVotes[0];
    const highest = sortedByVotes[sortedByVotes.length - 1];

    results.push({
      committee: result.committee,
      budgetAda: budget,
      lowestWinnerVotes: lowest.votes,
      lowestWinnerName: lowest.name,
      budgetPerVote: Math.round(budget / lowest.votes),
      highestWinnerVotes: highest.votes,
      highestWinnerName: highest.name,
    });
  }

  return results.sort((a, b) => b.budgetPerVote - a.budgetPerVote);
}

const budgetPerVoteData = computeBudgetPerVote();

/* Election competitiveness */
interface CompetitivenessData {
  committee: string;
  highestVotes: number;
  highestName: string;
  lowestVotes: number;
  lowestName: string;
  ratio: number;
  seats: number;
}

function computeCompetitiveness(): CompetitivenessData[] {
  const results: CompetitivenessData[] = [];
  for (const result of electionResults) {
    const elected = result.candidates.filter((c) => c.elected);
    if (elected.length < 2) continue;
    const sortedByVotes = [...elected].sort((a, b) => a.votes - b.votes);
    const lowest = sortedByVotes[0];
    const highest = sortedByVotes[sortedByVotes.length - 1];
    results.push({
      committee: result.committee,
      highestVotes: highest.votes,
      highestName: highest.name,
      lowestVotes: lowest.votes,
      lowestName: lowest.name,
      ratio: Math.round((lowest.votes / highest.votes) * 100),
      seats: result.seats_elected,
    });
  }
  return results.sort((a, b) => a.ratio - b.ratio);
}

const competitivenessData = computeCompetitiveness();

/* Founding entity footprint */
const cfMembers = [
  { name: "Nicolas Cerny", role: "CF Governance Lead", committee: "Budget Committee", votes: 176 },
  { name: "Megan Dyamond", role: "CF Legal Counsel", committee: "Civics Committee", votes: 45 },
  { name: "Giorgio Zinetti", role: "CF CTO", committee: "Product Committee", votes: 137 },
  { name: "Alexandre Maaza", role: "CF Sustainability Lead", committee: "Product Committee", votes: 51 },
  { name: "Arnaud", role: "CF", committee: "Open Source Committee", votes: null },
];

const cfCommittees = [...new Set(cfMembers.map((m) => m.committee))];
// IOG: 1 board seat. EMURGO: 1 board seat. CF: 5 committee seats across 4 committees
const totalFoundingPositions = 2 + cfMembers.length; // 2 board + 5 committee

/* ─── Helpers ─── */
function formatAda(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toLocaleString();
}

function SeverityBadge({ severity }: { severity: string }) {
  const style = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.low;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function Check() {
  return (
    <svg
      className="h-4 w-4 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function XMark() {
  return (
    <svg
      className="h-4 w-4 text-rose-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
      {children}
    </p>
  );
}

/* ─── Main Page ─── */
export default function AccountabilityPage() {
  // Suppress unused import warnings
  void treasuryData;
  void inputData;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════════
            Section 1: Hero
        ═══════════════════════════════════════════════ */}
        <header className="mb-20">
          <SectionLabel>Intersect Mirror</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mt-3">
            Accountability Check
          </h1>
          <p className="mt-4 text-lg text-white/50 max-w-2xl">
            Cross-referencing Intersect&apos;s own data to find overlaps, gaps,
            and concentration
          </p>
          <div className="mt-6 rounded-[28px] bg-white/5 border border-white/10 p-6">
            <p className="text-white/50 text-sm leading-relaxed">
              Every finding below is computed from publicly available data. No
              assumptions — only documented facts and their sources.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.3em] text-white/40">
              <span>
                {electionsData.election.total_voters} voters /{" "}
                {electionsData.election.eligible_voters.toLocaleString()}{" "}
                eligible
              </span>
              <span className="text-white/20">|</span>
              <span>₳{formatAda(totalBudget)} total budget</span>
              <span className="text-white/20">|</span>
              <span>
                {treasuryData.meta.total_proposals} treasury proposals
              </span>
              <span className="text-white/20">|</span>
              <span>
                {electionResults.length} elected committees
              </span>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════
            Section 2: Conflict of Interest Map
        ═══════════════════════════════════════════════ */}
        <section className="mb-20">
          <SectionLabel>Conflict of Interest Map</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-1">
            Documented Dual Roles
          </h2>
          <p className="text-white/50 text-sm mb-8">
            People and organizations that hold multiple positions within
            Intersect&apos;s structure
          </p>

          <div className="grid gap-4">
            {CONFLICTS.map((conflict) => (
              <div
                key={conflict.entity}
                className={`rounded-2xl border p-6 ${
                  conflict.severity === "high"
                    ? "border-rose-500/20 bg-rose-500/5"
                    : conflict.severity === "medium"
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {conflict.entity}
                  </h3>
                  <SeverityBadge severity={conflict.severity} />
                </div>

                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    Roles Held
                  </p>
                  <ul className="space-y-1.5">
                    {conflict.roles.map((role, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-white/50"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-black/20 border border-white/10 p-4 mb-3">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-1">
                    Concern
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      conflict.severity === "high"
                        ? "text-rose-300"
                        : conflict.severity === "medium"
                        ? "text-amber-300"
                        : "text-white/70"
                    }`}
                  >
                    {conflict.concern}
                  </p>
                </div>

                <p className="text-[11px] text-white/30">
                  Source: {conflict.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            Section 3: Founding Entity Footprint
        ═══════════════════════════════════════════════ */}
        <section className="mb-20">
          <SectionLabel>Founding Entity Footprint</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-1">
            Founding Entity Presence Across Intersect
          </h2>
          <p className="text-white/50 text-sm mb-6">
            IOG, EMURGO, and Cardano Foundation — the three entities that
            created Intersect — currently have affiliated people in at least{" "}
            <span className="text-white font-semibold">
              {totalFoundingPositions} positions
            </span>{" "}
            across the board and{" "}
            <span className="text-white font-semibold">
              {cfCommittees.length} committees
            </span>
            .
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* IOG */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">
                IOG
              </h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400/50 shrink-0" />
                  <span>
                    <span className="text-white/70 font-medium">
                      Gerard Moroney
                    </span>{" "}
                    — Appointed Board seat (IOG COO)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400/50 shrink-0" />
                  <span>
                    Receives{" "}
                    <span className="text-rose-300 font-medium">
                      ₳130.1M (49.3% of budget)
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* EMURGO */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
              <h3 className="text-lg font-semibold text-violet-300 mb-3">
                EMURGO
              </h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400/50 shrink-0" />
                  <span>
                    <span className="text-white/70 font-medium">
                      Nikhil Joshi
                    </span>{" "}
                    — Appointed Board seat (EMURGO COO)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400/50 shrink-0" />
                  <span>Founding seed funder — 3-year appointed term</span>
                </li>
              </ul>
            </div>

            {/* CF */}
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
              <h3 className="text-lg font-semibold text-sky-300 mb-3">
                Cardano Foundation
              </h3>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-2">
                {cfMembers.length} committee members across {cfCommittees.length}{" "}
                committees
              </p>
              <ul className="space-y-1.5 text-sm text-white/50">
                {cfMembers.map((m) => (
                  <li key={m.name} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400/50 shrink-0" />
                    <span>
                      <span className="text-white/70 font-medium">
                        {m.name}
                      </span>{" "}
                      ({m.role}) — {m.committee}
                      {m.votes ? `, ${m.votes} votes` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            Section 4: Committee Accountability Scorecard
        ═══════════════════════════════════════════════ */}
        <section className="mb-20">
          <SectionLabel>Committee Transparency</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-1">
            How Transparent is Each Committee?
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {committeesWithMinutes} of {scorecard.length} committees publish
            meeting minutes.{" "}
            {committeesWithRecordings === 0
              ? "None have"
              : committeesWithRecordings === 1
              ? `Only ${recordingNames[0]} has`
              : `${committeesWithRecordings} have`}{" "}
            public recordings.
          </p>

          {/* Desktop table */}
          <div className="rounded-[28px] bg-white/5 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Committee
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Minutes
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Recordings
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Chair ID&apos;d
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Budget Known
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Transparency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scorecard.map((row, i) => (
                    <tr
                      key={row.name}
                      className={
                        i < scorecard.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }
                    >
                      <td className="px-5 py-3.5 text-white/70 font-medium">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex justify-center">
                          {row.hasMinutes ? <Check /> : <XMark />}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex justify-center">
                          {row.hasRecordings ? <Check /> : <XMark />}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex justify-center">
                          {row.chairIdentified ? <Check /> : <XMark />}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex justify-center">
                          {row.budgetKnown ? <Check /> : <XMark />}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                            row.transparency === "verified"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : row.transparency === "partial"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {row.transparency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            Section 5: Budget per Voter
        ═══════════════════════════════════════════════ */}
        <section className="mb-20">
          <SectionLabel>Budget Concentration</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-1">
            How Much Money Does Each Vote Control?
          </h2>
          <p className="text-white/50 text-sm mb-6">
            With {totalVoters} voters and ₳{formatAda(totalBudget)} in total
            budget, each voter effectively controls ₳
            {formatAda(budgetPerVoter)} in spending decisions. Per eligible
            member (of {eligibleVoters.toLocaleString()}): ₳
            {formatAda(budgetPerEligible)}.
          </p>

          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-1">
                Budget / Voter
              </p>
              <p className="text-2xl font-bold text-rose-300">
                ₳{formatAda(budgetPerVoter)}
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                {totalVoters} actual voters
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-1">
                Budget / Eligible
              </p>
              <p className="text-2xl font-bold text-amber-300">
                ₳{formatAda(budgetPerEligible)}
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                {eligibleVoters.toLocaleString()} eligible members
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-1">
                Voter Turnout
              </p>
              <p className="text-2xl font-bold text-white">
                {electionsData.election.turnout_percent}%
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                {totalVoters} of {eligibleVoters.toLocaleString()} voted
              </p>
            </div>
          </div>

          {/* Per-committee breakdown */}
          <div className="rounded-[28px] bg-white/5 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Committee
                    </th>
                    <th className="text-right px-4 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Budget
                    </th>
                    <th className="text-left px-4 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Lowest Winner
                    </th>
                    <th className="text-right px-4 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      Votes
                    </th>
                    <th className="text-right px-5 py-4 text-[11px] uppercase tracking-[0.3em] text-white/40 font-medium">
                      ₳ / Vote
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budgetPerVoteData.map((row, i) => (
                    <tr
                      key={row.committee}
                      className={
                        i < budgetPerVoteData.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }
                    >
                      <td className="px-5 py-3.5 text-white/70 font-medium">
                        {row.committee}
                      </td>
                      <td className="px-4 py-3.5 text-right text-white/50 tabular-nums">
                        ₳{formatAda(row.budgetAda)}
                      </td>
                      <td className="px-4 py-3.5 text-white/50">
                        {row.lowestWinnerName}
                      </td>
                      <td className="px-4 py-3.5 text-right text-white/50 tabular-nums">
                        {row.lowestWinnerVotes}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                        <span
                          className={
                            row.budgetPerVote > 500_000
                              ? "text-rose-300"
                              : row.budgetPerVote > 100_000
                              ? "text-amber-300"
                              : "text-emerald-300"
                          }
                        >
                          ₳{formatAda(row.budgetPerVote)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[11px] text-white/30 mt-3">
            &quot;₳/Vote&quot; = committee budget divided by the lowest vote
            count among elected members. This shows how few votes can control
            large budgets.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            Section 6: Election Competitiveness
        ═══════════════════════════════════════════════ */}
        <section className="mb-20">
          <SectionLabel>Election Quality</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-1">
            How Competitive Were the Elections?
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Comparing the highest and lowest vote counts among elected members
            in each committee. A lower ratio indicates a wider gap between top
            and bottom winners.
          </p>

          <div className="space-y-4">
            {competitivenessData.map((row) => (
              <div
                key={row.committee}
                className="rounded-2xl bg-white/5 border border-white/10 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white/80">
                    {row.committee}
                  </h3>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      row.ratio < 40
                        ? "text-rose-300"
                        : row.ratio < 60
                        ? "text-amber-300"
                        : row.ratio < 80
                        ? "text-white/70"
                        : "text-emerald-300"
                    }`}
                  >
                    {row.ratio}% ratio
                  </span>
                </div>

                {/* Bar visualization */}
                <div className="relative h-6 rounded-full bg-black/30 overflow-hidden mb-2">
                  {/* Highest */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white/15"
                    style={{ width: "100%" }}
                  />
                  {/* Lowest */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      row.ratio < 40
                        ? "bg-rose-500/40"
                        : row.ratio < 60
                        ? "bg-amber-500/40"
                        : "bg-emerald-500/40"
                    }`}
                    style={{ width: `${row.ratio}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-white/40">
                  <span>
                    Lowest: {row.lowestName} ({row.lowestVotes} votes)
                  </span>
                  <span>
                    Highest: {row.highestName} ({row.highestVotes} votes)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            Section 7: Key Takeaways
        ═══════════════════════════════════════════════ */}
        <section className="mb-16">
          <SectionLabel>Summary</SectionLabel>
          <h2 className="text-2xl font-bold text-white mt-1 mb-6">
            Key Takeaways
          </h2>

          <div className="rounded-[28px] bg-white/5 border border-white/10 p-8">
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">
                    IOG receives 49.3% of the total budget (₳130.1M)
                  </span>{" "}
                  while simultaneously holding an appointed board seat through
                  its COO Gerard Moroney. The largest budget recipient sits on
                  the governing body that oversees spending.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">
                    Sundae Labs built the treasury smart contracts and sits on
                    the Oversight Committee
                  </span>{" "}
                  that monitors those same contracts. The builder and the
                  overseer are the same entity.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">
                    Only {committeesWithMinutes} of {scorecard.length} committees
                    publish meeting minutes
                  </span>
                  , and only{" "}
                  {committeesWithRecordings === 1
                    ? `${recordingNames[0]} has`
                    : `${committeesWithRecordings} have`}{" "}
                  public recordings. The board publishes meeting minutes at
                  board.docs.intersectmbo.org (since Dec 2023), but they vary in
                  depth and detail.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">
                    {electionsData.election.turnout_percent}% voter turnout
                  </span>{" "}
                  means {totalVoters} people elected the committees that guide
                  ₳{formatAda(totalBudget)} in spending. Some committee members
                  won with as few as{" "}
                  {Math.min(
                    ...electionResults.flatMap((r) =>
                      r.candidates
                        .filter((c) => c.elected)
                        .map((c) => c.votes)
                    )
                  )}{" "}
                  votes.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">
                    IOG and EMURGO (as seed funders) plus CF-affiliated committee members
                  </span>{" "}
                  hold at least {totalFoundingPositions} positions across the
                  board and {cfCommittees.length} committees. Cardano Foundation
                  alone has {cfMembers.length} affiliated people on{" "}
                  {cfCommittees.length} different committees.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8 text-center">
          <p className="text-[11px] text-white/30">
            Data compiled from Intersect public sources, election results, and
            treasury records. Last updated:{" "}
            {electionsData.meta.compiled}.
          </p>
        </footer>
      </div>
    </div>
  );
}
