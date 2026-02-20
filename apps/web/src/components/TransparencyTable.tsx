"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import inputData from "@/data/input.json";

/* ── Types ─────────────────────────────────────── */

interface SubItem {
  name: string;
  status: "verified" | "partial" | "missing";
  detail: string;
  source?: string;
  sourceUrl?: string;
}

interface CategoryRow {
  category: string;
  slug: string;
  verified: number;
  partial: number;
  missing: number;
  updated: string;
  sources: string[];
  gaps: string[];
  subItems: SubItem[];
  budget?: string;
}

/* ── Build real data from input.json ───────────── */

function buildCategories(): CategoryRow[] {
  const people = inputData.people ?? [];
  const committees = inputData.committees ?? [];
  const workingGroups = inputData.working_groups ?? [];
  const relationships = inputData.relationships ?? [];
  const count = (arr: { transparency?: string }[]) => {
    let v = 0, p = 0, m = 0;
    arr.forEach((item) => {
      if (item.transparency === "verified") v++;
      else if (item.transparency === "partial") p++;
      else m++;
    });
    return { v, p, m };
  };

  const committeeBudget = committees.reduce((sum, c) => {
    const b = (c as Record<string, unknown>).budget_ada;
    return sum + (typeof b === "number" ? b : 0);
  }, 0);

  const pc = count(people);
  const cc = count(committees);
  const wc = count(workingGroups);

  return [
    {
      category: "Budget & Money Flow",
      slug: "budget-money-flow",
      verified: 8,
      partial: 3,
      missing: 2,
      updated: "2026-02-20",
      sources: ["Intersect budget docs", "Sundae Treasury Portal", "Budget Committee meeting notes", "Intersect contract ledger"],
      gaps: [
        "IOG receives ~₳130M (49.3% of total) — concentration risk",
        "Individual contract amounts for 28+ non-IOG vendors not yet public",
        "Sundae Labs built treasury contracts AND sits on Oversight Committee — dual role",
        "6 proposals expired without funding — no post-mortem published",
        "Procurement process for vendor selection undocumented",
      ],
      budget: `₳264M approved (33 of 39 proposals) · ₳${(committeeBudget / 1e6).toFixed(1)}M across ${committees.length} committees`,
      subItems: [
        { name: "IOG — Core Development", status: "verified" as const, detail: "₳96.8M · 73.93% DRep support · Largest single allocation", source: "Intersect contract ledger", sourceUrl: "https://treasury.sundae.fi/instances/9e65e4ed7d6fd86fc4827d2b45da6d2c601fb920e8bfd794b8ecc619?projectState=Active" },
        { name: "IOG — Catalyst 2025", status: "verified" as const, detail: "₳64.3M · Community innovation fund", source: "Intersect contract ledger" },
        { name: "IOG — Research (IOR)", status: "partial" as const, detail: "₳26.8M · CF DRep abstained (lack of strategic clarity)", source: "Intersect contract ledger" },
        { name: "Intersect MBO Operations", status: "verified" as const, detail: "₳20M · Admin + staff costs", source: "Budget docs" },
        { name: "OSC — Paid Open Source", status: "verified" as const, detail: "₳5.9M · 50 projects, bounties, advocates", source: "Budget docs" },
        { name: "IOG — Catalyst Tech + Blockfrost", status: "verified" as const, detail: "₳6.5M combined", source: "Intersect contract ledger" },
        ...committees
          .filter(c => (c as Record<string, unknown>).budget_ada)
          .map(c => ({
            name: c.name,
            status: c.transparency as "verified" | "partial" | "missing",
            detail: `₳${(((c as Record<string, unknown>).budget_ada as number) / 1e6).toFixed(1)}M committee budget`,
            source: c.source,
            sourceUrl: (c as Record<string, unknown>).source_url as string | undefined,
          })),
        { name: "28+ Other Vendors", status: "partial" as const, detail: "₳108M combined — individual amounts not disclosed", source: "Sundae Treasury Portal" },
      ],
    },
    {
      category: "Governance & Decisions",
      slug: "governance-decisions",
      verified: cc.v,
      partial: cc.p,
      missing: cc.m,
      updated: "2026-02-17",
      sources: ["Election results Oct 2025", "Committee docs", "Intersect KB"],
      gaps: [
        "No per-member vote tallies for non-election decisions",
        "Committee decision rationale logs incomplete",
        "Board meeting minutes not public",
        "ISC composition mostly internal — only 2 elected seats",
      ],
      subItems: committees.map(c => ({
        name: c.name,
        status: c.transparency as "verified" | "partial" | "missing",
        detail: `${(c as Record<string, unknown>).members ? ((c as Record<string, unknown>).members as string[]).length : 0} members · ${c.elections}`,
        source: c.source,
        sourceUrl: (c as Record<string, unknown>).source_url as string | undefined,
      })),
    },
    {
      category: "People & Compensation",
      slug: "people-compensation",
      verified: pc.v,
      partial: pc.p,
      missing: pc.m,
      updated: "2026-02-17",
      sources: ["Intersect team page (404)", "LinkedIn", "X/Twitter updates"],
      gaps: [
        "No salary ranges disclosed for any role",
        "Team page returns 404 — full roster unavailable",
        "Stipend details for committee leads unclear",
        "ED hiring process not disclosed",
        "No public org chart",
      ],
      subItems: people.map(p => ({
        name: `${p.name} — ${p.role}`,
        status: p.transparency as "verified" | "partial" | "missing",
        detail: p.notes || p.bio,
        source: p.source,
      })),
    },
    {
      category: "Results & Deliverables",
      slug: "results-deliverables",
      verified: wc.v,
      partial: wc.p,
      missing: wc.m,
      updated: "2026-02-01",
      sources: ["Quarterly reports", "Working group recordings", "GitHub"],
      gaps: [
        "KPI tracking dashboard not public",
        "Quarterly milestone completion rates missing",
        "Working group deliverables not systematically tracked",
      ],
      subItems: workingGroups.map(g => ({
        name: g.name,
        status: g.transparency as "verified" | "partial" | "missing",
        detail: g.description,
        source: g.source,
      })),
    },
    {
      category: "Procurement & Contracts",
      slug: "procurement-contracts",
      verified: 0,
      partial: 1,
      missing: 3,
      updated: "—",
      sources: ["None publicly available"],
      gaps: [
        "Vendor selection process undocumented",
        "Contract values not disclosed",
        "RFP process not transparent",
        "No public list of contractors or service providers",
      ],
      subItems: [
        { name: "Vendor List", status: "missing" as const, detail: "No public vendor list exists" },
        { name: "Contract Values", status: "missing" as const, detail: "No contract amounts disclosed" },
        { name: "RFP Process", status: "missing" as const, detail: "No public RFP documentation" },
        { name: "Bug Bounty (TxPipe)", status: "partial" as const, detail: "OSC manages via TxPipe; details sparse" },
      ],
    },
    {
      category: "Organizational Relationships",
      slug: "relationships",
      verified: relationships.length,
      partial: 0,
      missing: 1,
      updated: "2026-02-17",
      sources: ["Public board listings", "CF blog", "EMURGO posts"],
      gaps: [
        "Founding entity influence not quantified (votes, veto power)",
        "Board member dual-role conflicts not formally addressed",
      ],
      subItems: relationships.map(r => ({
        name: `${r.from} → ${r.to}`,
        status: "verified" as const,
        detail: `${r.type}: ${r.details}`,
        source: r.source,
      })),
    },
  ];
}

/* ── Styles ─────────────────────────────────────── */

const statusBadge: Record<string, string> = {
  verified: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
  partial: "bg-amber-400/15 text-amber-300 border-amber-400/40",
  missing: "bg-rose-400/15 text-rose-300 border-rose-400/40",
};

/* ── Component ─────────────────────────────────── */

export default function TransparencyTable() {
  const categories = useMemo(() => buildCategories(), []);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggle = (idx: number) => setExpandedIdx(expandedIdx === idx ? null : idx);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-6">
      <div className="space-y-3">
        {categories.map((row, idx) => {
          const total = row.verified + row.partial + row.missing;
          const score = total ? Math.round(((row.verified + row.partial * 0.5) / total) * 100) : 0;
          const isOpen = expandedIdx === idx;
          const overallStatus = score >= 70 ? "verified" : score >= 40 ? "partial" : "missing";

          return (
            <div key={row.category} className="rounded-2xl border border-white/10 bg-black/20 transition-all">
              {/* Header row — clickable */}
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full flex-wrap items-center gap-4 px-4 py-4 text-left transition hover:bg-white/3 sm:flex-nowrap"
              >
                {/* Expand arrow */}
                <span className={`text-white/40 transition-transform ${isOpen ? "rotate-90" : ""}`}>&#9654;</span>

                {/* Category name + score */}
                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-semibold text-white">{row.category}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-white/10">
                      <div
                        className={`h-1.5 rounded-full ${score >= 70 ? "bg-emerald-400" : score >= 40 ? "bg-amber-400" : "bg-rose-400"}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-white/50">{score}%</span>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${statusBadge[overallStatus]}`}>
                  {overallStatus}
                </span>

                {/* Counts */}
                <div className="flex gap-3 text-[10px]">
                  <span className="text-emerald-300">{row.verified} ✓</span>
                  <span className="text-amber-300">{row.partial} ~</span>
                  <span className="text-rose-300">{row.missing} ✗</span>
                </div>

                {/* Updated */}
                <span className="text-[10px] text-white/40">{row.updated}</span>
              </button>

              {/* Expanded detail panel */}
              {isOpen && (
                <div className="border-t border-white/5 px-4 pb-5 pt-4">
                  {/* Budget callout */}
                  {row.budget && (
                    <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm text-emerald-200">
                      ₳ {row.budget}
                    </div>
                  )}

                  {/* Sources */}
                  <div className="mb-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Sources</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {row.sources.map((s, i) => (
                        <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sub-items */}
                  <div className="mb-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Data Points ({row.subItems.length})</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {row.subItems.map((item, i) => (
                        <div key={i} className={`rounded-xl border px-3 py-2.5 ${statusBadge[item.status].replace(/text-\S+/, "").trim()}`}>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-medium text-white/90">{item.name}</p>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusBadge[item.status]}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-white/50">{item.detail}</p>
                          {item.source && (
                            <p className="mt-1 text-[10px] text-white/30">
                              Source: {item.sourceUrl ? (
                                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-white/60">{item.source}</a>
                              ) : item.source}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps */}
                  {row.gaps.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-rose-300/70">Transparency Gaps ({row.gaps.length})</p>
                      <ul className="mt-2 space-y-1.5">
                        {row.gaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-rose-200/80">
                            <span className="mt-0.5 text-rose-400">&#9888;</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deep link */}
                  <Link
                    href={`/transparency/${row.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-white/50 transition hover:text-white/80"
                  >
                    View full {row.category} detail →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
