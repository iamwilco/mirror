// DEPRECATED: Replaced by TreasuryFlowDiagram.tsx. Kept for reference.
"use client";

import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import budgetData from "@/data/budget-2025.json";

type SankeyNode = { name: string };
type SankeyLink = { source: number; target: number; value: number };
type SankeyDataset = { nodes: SankeyNode[]; links: SankeyLink[] };

/* Build 2025 Sankey from real budget-2025.json data */
function build2025Sankey(): SankeyDataset {
  const buckets = budgetData.buckets;

  // Nodes: Treasury -> Buckets -> Committees
  const nodes: SankeyNode[] = [{ name: "Cardano Treasury (₳1.7B)" }];
  const links: SankeyLink[] = [];

  // Add bucket nodes
  const bucketStartIdx = 1;
  buckets.forEach((b) => nodes.push({ name: b.name }));

  // Add committee nodes (deduplicated)
  const committeeMap = new Map<string, number>();
  let nextIdx = bucketStartIdx + buckets.length;

  buckets.forEach((bucket, bi) => {
    const bucketIdx = bucketStartIdx + bi;
    // Treasury -> Bucket
    links.push({ source: 0, target: bucketIdx, value: Math.round(bucket.ada_amount / 1_000_000) });

    bucket.committees.forEach((c) => {
      let cIdx = committeeMap.get(c.committee);
      if (cIdx === undefined) {
        cIdx = nextIdx++;
        committeeMap.set(c.committee, cIdx);
        nodes.push({ name: c.committee });
      }
      // Bucket -> Committee
      links.push({ source: bucketIdx, target: cIdx, value: Math.round(c.ada_amount / 1_000_000) });
    });
  });

  return { nodes, links };
}

const SANKEY_2025 = build2025Sankey();

const SANKEY_2026: SankeyDataset = {
  nodes: [
    { name: "Treasury" },
    { name: "Planned Allocation" },
    { name: "Budget Process TBD" },
  ],
  links: [
    { source: 0, target: 1, value: 300 },
    { source: 1, target: 2, value: 300 },
  ],
};

type StatusRow = { category: string; amount: string; status: string; source: string };

const ROWS_2025: StatusRow[] = budgetData.buckets.map((b) => ({
  category: b.name,
  amount: `₳${(b.ada_amount / 1_000_000).toFixed(1)}M`,
  status: "Verified",
  source: "Budget Committee Docs",
}));

const ROWS_2026: StatusRow[] = [
  { category: "2026 Budget Framework", amount: "TBD", status: "Pending", source: "Info Action in voting (60.7% DRep support)" },
  { category: "NCL Proposal (300M ADA)", amount: "₳300M cap", status: "Expired", source: "Only 44.15% support — needed 50%" },
  { category: "Submission Window", amount: "Opens Apr 2026", status: "Pending", source: "Intersect budget process" },
];

interface BudgetSankeyProps {
  year: "2025" | "2026";
}

const statusStyles: Record<string, string> = {
  Verified: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40",
  Partial: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Missing: "bg-rose-400/15 text-rose-200 border-rose-400/40",
  Pending: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Expired: "bg-rose-400/15 text-rose-200 border-rose-400/40",
};

export default function BudgetSankey({ year }: BudgetSankeyProps) {
  const sankey = year === "2025" ? SANKEY_2025 : SANKEY_2026;
  const rows = year === "2025" ? ROWS_2025 : ROWS_2026;

  return (
    <div className="grid gap-8">
      {/* Sankey diagram */}
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className={year === "2025" ? "h-[380px]" : "h-48"}>
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankey}
              nodePadding={year === "2025" ? 14 : 24}
              nodeWidth={14}
              linkCurvature={0.5}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Tooltip
                formatter={(value) => [`₳${value ?? 0}M`, "ADA"]}
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#e5e7eb",
                  fontSize: "12px",
                }}
              />
            </Sankey>
          </ResponsiveContainer>
        </div>
        {year === "2025" && (
          <p className="mt-3 text-center text-[11px] text-white/40">
            Treasury → 6 Budget Buckets → 8 Committees · Total: ₳{(budgetData.total_proposed_ada / 1_000_000).toFixed(1)}M
          </p>
        )}
      </div>

      {/* IOG concentration callout (2025 only) */}
      {year === "2025" && (
        <div className="rounded-[28px] border border-amber-400/30 bg-amber-400/5 p-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex-1 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-amber-300/80">Vendor Concentration Alert</p>
              <p className="text-sm text-white/50">
                IOG/IOE receives <strong className="text-amber-200">₳130.1M (49.3%)</strong> of the total ₳264M budget across 5 confirmed proposals
                — nearly half of all approved treasury funds flow to a single entity family.
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-3xl font-semibold text-amber-200">49.3%</p>
              <p className="text-[11px] text-white/40">IOG share of budget</p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-400/60" style={{ width: "49.3%" }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/40">
            <span>IOG: ₳130.1M</span>
            <span>Others: ₳133.9M</span>
          </div>
        </div>
      )}

      {/* Budget breakdown table */}
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4">
          <div className="hidden grid-cols-[1.5fr_0.8fr_0.6fr_1fr] text-xs uppercase tracking-[0.2em] text-white/40 sm:grid">
            <span>Category</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Source</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.category}
              className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50 sm:grid-cols-[1.5fr_0.8fr_0.6fr_1fr] sm:items-center sm:gap-4"
            >
              <span className="text-white">{row.category}</span>
              <span>{row.amount}</span>
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${
                  statusStyles[row.status] ?? statusStyles.Partial
                }`}
              >
                {row.status}
              </span>
              <span className="text-white/40">{row.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
