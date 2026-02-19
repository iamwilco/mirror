"use client";

import Link from "next/link";
import OrgChart from "@/components/OrgChart";
import hierarchyData from "@/data/hierarchy.json";

const data = hierarchyData.hierarchy;

/* ── Power legend items ────────────────────────── */
const LEGEND = [
  { label: "Ultimate", cls: "border-violet-400/60 bg-violet-500/20 text-violet-300" },
  { label: "High", cls: "border-emerald-400/60 bg-emerald-500/20 text-emerald-300" },
  { label: "Medium", cls: "border-amber-400/60 bg-amber-500/20 text-amber-300" },
  { label: "Low", cls: "border-rose-400/60 bg-rose-500/20 text-rose-300" },
];

export default function HierarchyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="text-center">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-white/40 transition hover:text-white/70">
          &larr; Dashboard
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Intersect Hierarchy
        </h1>
        <p className="mt-2 text-lg text-white/50">Who Decides What?</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/40">
          {data.description}
        </p>
        <p className="mt-2 text-[11px] text-white/30">
          Sources: {data.sources.join(" · ")}
        </p>
      </section>

      {/* ── Legend ─────────────────────────────────── */}
      <section className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-[10px] uppercase tracking-wider text-white/40">Decision Power:</span>
        {LEGEND.map((l) => (
          <span
            key={l.label}
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${l.cls}`}
          >
            {l.label}
          </span>
        ))}
      </section>

      {/* ── Org Chart ─────────────────────────────── */}
      <section className="mt-10">
        <OrgChart data={data as never} />
      </section>

      {/* ── Gaps ──────────────────────────────────── */}
      {data.gaps && data.gaps.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Known Transparency Gaps</h2>
          <p className="mt-1 text-sm text-white/40">Data we still need. Can you help?</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {data.gaps.map((gap, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-200"
              >
                <span className="mt-0.5 text-rose-400">&#9888;</span>
                {gap}
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <Link
              href="/#contribute"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Submit Evidence or Corrections &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ── How to Read ───────────────────────────── */}
      <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">How to Read This Chart</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/60">
          <li><strong className="text-white/80">Top-down flow:</strong> Members at top elect the Board and Committees. Committees form Working Groups.</li>
          <li><strong className="text-white/80">Colored borders:</strong> Indicate decision power level — purple (ultimate), green (high), amber (medium), rose (low).</li>
          <li><strong className="text-white/80">Hover any node</strong> for details on responsibilities, decision power, and how work gets done.</li>
          <li><strong className="text-white/80">Click the &#9654; arrow</strong> on nodes with members to expand the full member list.</li>
        </ul>
      </section>
    </main>
  );
}
