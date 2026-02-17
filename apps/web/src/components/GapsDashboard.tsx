"use client";

import { useMemo } from "react";
import inputData from "@/data/input.json";

const classifyGap = (gap: string) => {
  const normalized = gap.toLowerCase();
  if (normalized.includes("salary") || normalized.includes("pay") || normalized.includes("votes")) {
    return "high" as const;
  }
  if (normalized.includes("committee") || normalized.includes("member")) {
    return "medium" as const;
  }
  return "low" as const;
};

export default function GapsDashboard() {
  const enriched = useMemo(() => {
    const gaps = inputData.transparency_gaps ?? [];
    return gaps.map((gap, idx) => {
      const severity = classifyGap(gap);
      return {
        id: idx,
        label: gap,
        severity,
        votes: severity === "high" ? 42 : severity === "medium" ? 24 : 12,
      };
    });
  }, []);

  const total = enriched.length;
  const resolved = Math.max(2, Math.floor(total * 0.2));
  const debtPercent = total ? Math.round(((total - resolved) / total) * 100) : 0;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Transparency Debt</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Gaps that need community action</h3>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Track the highest-impact gaps. Vote to prioritize investigations, then submit evidence to resolve them.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Debt Meter</p>
          <p className="mt-2 text-3xl font-semibold text-white">{debtPercent}%</p>
          <p className="text-xs text-white/50">{total - resolved} unresolved gaps</p>
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,#f87171,#facc15)]"
          style={{ width: `${debtPercent}%` }}
        />
      </div>

      <div className="mt-6 grid gap-4">
        {enriched.map((gap) => (
          <div
            key={gap.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 h-3 w-3 rounded-full ${
                  gap.severity === "high"
                    ? "bg-rose-500"
                    : gap.severity === "medium"
                    ? "bg-amber-400"
                    : "bg-sky-400"
                }`}
              />
              <div>
                <p className="text-sm text-white/80">{gap.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{gap.severity} priority</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                {gap.votes} votes
              </span>
              <a
                className="rounded-full border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/80 transition hover:border-white/50"
                href="#contribute"
              >
                Submit Evidence
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
