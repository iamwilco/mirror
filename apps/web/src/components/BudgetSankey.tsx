"use client";

import { ResponsiveContainer, Sankey, Tooltip } from "recharts";

const sankeyData = {
  nodes: [
    { name: "Treasury" },
    { name: "CDH" },
    { name: "Committees" },
    { name: "Work Packages" },
    { name: "Ops Funding" },
  ],
  links: [
    { source: 0, target: 1, value: 263.6 },
    { source: 1, target: 2, value: 180 },
    { source: 1, target: 4, value: 20 },
    { source: 2, target: 3, value: 180 },
  ],
};

const rows = [
  {
    category: "Treasury",
    amount: "₳263.6M",
    status: "Verified",
    source: "Intersect budget proposal",
  },
  {
    category: "Ops Funding",
    amount: "₳20M",
    status: "Partial",
    source: "PRD reference",
  },
  {
    category: "Work Packages",
    amount: "₳180M",
    status: "Partial",
    source: "Committee breakdown estimate",
  },
];

const statusStyles: Record<string, string> = {
  Verified: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40",
  Partial: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Missing: "bg-rose-400/15 text-rose-200 border-rose-400/40",
};

export default function BudgetSankey() {
  return (
    <div className="grid gap-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              nodePadding={24}
              nodeWidth={16}
              linkCurvature={0.55}
            >
              <Tooltip formatter={(value) => [`₳${value ?? 0}M`, "ADA"]} />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_1fr] text-xs uppercase tracking-[0.2em] text-white/50">
            <span>Category</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Source</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-[1.2fr_0.8fr_0.6fr_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70"
            >
              <span className="text-white">{row.category}</span>
              <span>{row.amount}</span>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                  statusStyles[row.status]
                }`}
              >
                {row.status}
              </span>
              <span className="text-white/50">{row.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
