"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/* ── Rich gap definitions ──────────────────────── */

interface RichGap {
  id: number;
  label: string;
  severity: "high" | "medium" | "low";
  category: string;
  whyItMatters: string;
  whatResolvesIt: string;
  relatedLinks?: { label: string; href: string }[];
  baseVotes: number;
}

const RICH_GAPS: RichGap[] = [
  {
    id: 0,
    label: "No salary ranges disclosed for any paid role",
    severity: "high",
    category: "People & Compensation",
    whyItMatters: "Without salary transparency, members cannot assess if community treasury funds are being spent proportionally. Comparable DAOs (Uniswap Foundation, ENS) publish compensation bands.",
    whatResolvesIt: "Publish salary bands or total compensation per role tier. Anonymous submissions of offer letters or contracts also help.",
    relatedLinks: [{ label: "People detail", href: "/transparency/people-compensation" }],
    baseVotes: 68,
  },
  {
    id: 1,
    label: "₳263M budget vs ₳180M itemized — ₳83M gap unexplained",
    severity: "high",
    category: "Budget & Money Flow",
    whyItMatters: "~31% of the proposed treasury withdrawal has no public line-item breakdown. This is the single largest transparency gap by ADA value.",
    whatResolvesIt: "Publish full work package breakdown for the remaining ₳83M. Budget Committee meeting notes may contain partial data.",
    relatedLinks: [
      { label: "Budget detail", href: "/transparency/budget-money-flow" },
      { label: "Budget Committee notes", href: "https://budgetcommittee.docs.intersectmbo.org/committee-meeting-notes/2025-meeting-notes/budget-committee-weekly-meetings" },
    ],
    baseVotes: 55,
  },
  {
    id: 2,
    label: "Board meeting minutes not public",
    severity: "high",
    category: "Governance & Decisions",
    whyItMatters: "The board makes the highest-level strategic decisions (ED appointment, budget direction) but publishes no minutes. Members who elected 2 of 4 board seats have no visibility into how their representatives vote.",
    whatResolvesIt: "Publish board meeting summaries or full minutes. Even redacted versions would improve accountability.",
    relatedLinks: [{ label: "Hierarchy", href: "/hierarchy" }],
    baseVotes: 52,
  },
  {
    id: 3,
    label: "50% of board seats are founding-entity appointed (IOG, EMURGO)",
    severity: "high",
    category: "Governance & Decisions",
    whyItMatters: "Members elect only 2 of 4 board directors. IOG and EMURGO retain appointed seats, giving founding entities potential veto-level influence over a body marketed as 'community-governed'.",
    whatResolvesIt: "Transition to majority member-elected board with a confirmed timeline. Disclose any formal or informal veto powers.",
    relatedLinks: [{ label: "Hierarchy", href: "/hierarchy" }],
    baseVotes: 48,
  },
  {
    id: 4,
    label: "Team page returns 404 — full staff roster unavailable",
    severity: "high",
    category: "People & Compensation",
    whyItMatters: "No way to know who works at Intersect, what they do, or how many staff are funded. Basic accountability requires knowing who is being paid.",
    whatResolvesIt: "Fix the team page. Alternatively, publish an org chart or staff directory. Community-gathered intel can fill the gap.",
    baseVotes: 45,
  },
  {
    id: 5,
    label: "Election turnout critically low (19.4% Oct 2025)",
    severity: "high",
    category: "Governance & Decisions",
    whyItMatters: "Committee members govern ₳243M+ in budgets but were elected by <20% of eligible voters. This undermines governance legitimacy. 293 voters out of 1,800 paid members.",
    whatResolvesIt: "Improve election outreach, simplify voting process, publish post-election analyses. Consider minimum turnout thresholds.",
    relatedLinks: [{ label: "Election data", href: "/transparency/governance-decisions" }],
    baseVotes: 42,
  },
  {
    id: 6,
    label: "No per-member vote tallies for committee decisions",
    severity: "medium",
    category: "Governance & Decisions",
    whyItMatters: "We know election results but not how committee members vote on proposals, budget items, or governance actions. Individual accountability is impossible without roll-call votes.",
    whatResolvesIt: "Publish roll-call votes for committee decisions. Meeting minutes should record who voted for/against each motion.",
    baseVotes: 38,
  },
  {
    id: 7,
    label: "Vendor selection process undocumented",
    severity: "medium",
    category: "Procurement & Contracts",
    whyItMatters: "No public RFP process, no vendor list, no contract values. Community cannot verify that contractors are selected fairly or that costs are market-rate.",
    whatResolvesIt: "Publish vendor list, contract ranges, and procurement criteria. Even aggregate data (# of vendors, total spend by category) would help.",
    relatedLinks: [{ label: "Procurement detail", href: "/transparency/procurement-contracts" }],
    baseVotes: 35,
  },
  {
    id: 8,
    label: "ED appointed by partially-appointed board — no member input",
    severity: "medium",
    category: "People & Compensation",
    whyItMatters: "The Executive Director runs day-to-day operations and controls staff hiring, but was appointed by a board that is 50% entity-appointed. Members had no say in this critical hire.",
    whatResolvesIt: "Publish ED selection criteria and process. Consider member ratification for future ED appointments.",
    relatedLinks: [{ label: "Hierarchy", href: "/hierarchy" }],
    baseVotes: 33,
  },
  {
    id: 9,
    label: "No secretaries or admin staff named across committees",
    severity: "medium",
    category: "Governance & Decisions",
    whyItMatters: "Secretaries control meeting agendas, minutes, and information flow. Without knowing who they are, we can't assess whether committee processes are captured or influenced.",
    whatResolvesIt: "Name all committee secretaries and support staff. Publish their roles and affiliations.",
    baseVotes: 28,
  },
  {
    id: 10,
    label: "Committee meeting minutes inconsistently published",
    severity: "medium",
    category: "Governance & Decisions",
    whyItMatters: "Only OSC has public YouTube recordings. Other committees publish partial or no minutes. Budget Committee has some meeting notes; others are dark.",
    whatResolvesIt: "Standardize public minutes across all 7 committees. Record and publish meetings, or at minimum publish written summaries.",
    baseVotes: 26,
  },
  {
    id: 11,
    label: "Working group deliverables not systematically tracked",
    severity: "low",
    category: "Results & Deliverables",
    whyItMatters: "WGs are created ad-hoc with no standard reporting. Hard to know what they produced, whether on time, or if resources were well spent.",
    whatResolvesIt: "Create a WG tracker with milestones, deliverables, and completion status.",
    relatedLinks: [{ label: "Deliverables detail", href: "/transparency/results-deliverables" }],
    baseVotes: 18,
  },
  {
    id: 12,
    label: "Founding entity influence not quantified",
    severity: "low",
    category: "Organizational Relationships",
    whyItMatters: "IOG and EMURGO have board seats, staff overlap, and historical influence, but the extent of their operational control is undocumented.",
    whatResolvesIt: "Map all founding-entity touchpoints: board seats, staff, contracts, advisory roles. Quantify voting weight.",
    relatedLinks: [{ label: "Network graph", href: "/#network" }],
    baseVotes: 15,
  },
];

/* ── Category grouping ─────────────────────────── */

const CATEGORIES = [...new Set(RICH_GAPS.map(g => g.category))];

const SEV_STYLES = {
  high: { dot: "bg-rose-500", text: "text-rose-300", border: "border-rose-500/30 bg-rose-500/5" },
  medium: { dot: "bg-amber-400", text: "text-amber-300", border: "border-amber-500/30 bg-amber-500/5" },
  low: { dot: "bg-sky-400", text: "text-sky-300", border: "border-sky-500/30 bg-sky-500/5" },
};

const STORAGE_KEY = "mirror:gaps:votes";

/* ── Component ─────────────────────────────────── */

export default function GapsDashboard() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const [votes, setVotes] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  });
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [serverVotes, setServerVotes] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadVotes = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("gap_votes")
        .select("gap_id", { count: "exact" });
      if (error || !data) return;
      const counts = data.reduce<Record<number, number>>((acc, row) => {
        const id = row.gap_id as number;
        acc[id] = (acc[id] ?? 0) + 1;
        return acc;
      }, {});
      setServerVotes(counts);
    };
    loadVotes();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  }, [votes]);

  const handleVote = async (gap: RichGap) => {
    setPendingId(gap.id);
    setVotes((prev) => ({ ...prev, [gap.id]: (prev[gap.id] ?? 0) + 1 }));
    if (supabase) {
      await supabase.from("gap_votes").insert({ gap_id: gap.id, gap_label: gap.label });
    }
    setPendingId(null);
  };

  const filtered = useMemo(() => {
    const list = filterCat ? RICH_GAPS.filter(g => g.category === filterCat) : RICH_GAPS;
    return [...list].sort((a, b) => {
      const aV = a.baseVotes + (serverVotes[a.id] ?? 0) + (votes[a.id] ?? 0);
      const bV = b.baseVotes + (serverVotes[b.id] ?? 0) + (votes[b.id] ?? 0);
      return bV - aV;
    });
  }, [filterCat, serverVotes, votes]);

  const total = RICH_GAPS.length;
  const highCount = RICH_GAPS.filter(g => g.severity === "high").length;
  const debtPercent = Math.round((total / (total + 3)) * 100);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Transparency Debt</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Gaps that need community action</h3>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            {total} identified gaps across {CATEGORIES.length} categories. {highCount} are high-severity.
            Click any gap to see <strong className="text-white/80">why it matters</strong> and <strong className="text-white/80">what would resolve it</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Debt Meter</p>
          <p className="mt-2 text-3xl font-semibold text-white">{debtPercent}%</p>
          <p className="text-xs text-white/50">{total} unresolved gaps</p>
        </div>
      </div>

      {/* Debt bar */}
      <div className="mt-6 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-[linear-gradient(90deg,#f87171,#facc15)]" style={{ width: `${debtPercent}%` }} />
      </div>

      {/* Category filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterCat(null)}
          className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-wider transition ${
            !filterCat ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-white/50 hover:border-white/30"
          }`}
        >
          All ({total})
        </button>
        {CATEGORIES.map(cat => {
          const count = RICH_GAPS.filter(g => g.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(filterCat === cat ? null : cat)}
              className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-wider transition ${
                filterCat === cat ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Gap list */}
      <div className="mt-6 space-y-3">
        {filtered.map((gap) => {
          const boostedVotes = gap.baseVotes + (serverVotes[gap.id] ?? 0) + (votes[gap.id] ?? 0);
          const isOpen = expandedId === gap.id;
          const sev = SEV_STYLES[gap.severity];

          return (
            <div key={gap.id} className={`rounded-2xl border transition-all ${isOpen ? sev.border : "border-white/10 bg-black/30"}`}>
              {/* Collapsed row */}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : gap.id)}
                className="flex w-full flex-wrap items-center gap-4 px-4 py-3.5 text-left sm:flex-nowrap"
              >
                <span className={`shrink-0 transition-transform text-white/40 ${isOpen ? "rotate-90" : ""}`}>&#9654;</span>
                <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${sev.dot}`} />
                <div className="flex-1">
                  <p className="text-sm text-white/80">{gap.label}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">
                    <span className={`uppercase tracking-wider ${sev.text}`}>{gap.severity}</span>
                    <span className="mx-1.5">·</span>
                    {gap.category}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tabular-nums text-white/60">
                  {boostedVotes} votes
                </span>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-white/5 px-5 pb-5 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-rose-300/70">Why It Matters</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">{gap.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/70">What Would Resolve It</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">{gap.whatResolvesIt}</p>
                    </div>
                  </div>

                  {/* Related links */}
                  {gap.relatedLinks && gap.relatedLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {gap.relatedLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/60 transition hover:border-white/30 hover:text-white/80"
                        >
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVote(gap)}
                      className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[11px] uppercase tracking-wider text-emerald-200 transition hover:border-emerald-300"
                      disabled={pendingId === gap.id}
                    >
                      {pendingId === gap.id ? "Voting..." : `Upvote (${boostedVotes})`}
                    </button>
                    <a
                      className="rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-wider text-white/80 transition hover:border-white/50"
                      href="#contribute"
                    >
                      Submit Evidence
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
