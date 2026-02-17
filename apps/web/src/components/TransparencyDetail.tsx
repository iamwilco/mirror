"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface DetailItem {
  name: string;
  status: "verified" | "partial" | "missing";
  source: string;
  notes: string;
  verifiedBy?: string | null;
}

export interface TransparencyDetailProps {
  category: string;
  score: number;
  items: DetailItem[];
  gaps: string[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const STATUS_COLORS = {
  verified: "#22c55e",
  partial: "#eab308",
  missing: "#ef4444",
};

const STATUS_LABELS = {
  verified: "Verified",
  partial: "Partial",
  missing: "Missing",
};

export default function TransparencyDetail({
  category,
  score,
  items,
  gaps,
}: TransparencyDetailProps) {
  const statusCounts = useMemo(() => {
    const counts = { verified: 0, partial: 0, missing: 0 };
    items.forEach((item) => {
      counts[item.status]++;
    });
    return counts;
  }, [items]);

  const pieData = useMemo(
    () => [
      { name: "Verified", value: statusCounts.verified, fill: STATUS_COLORS.verified },
      { name: "Partial", value: statusCounts.partial, fill: STATUS_COLORS.partial },
      { name: "Missing", value: statusCounts.missing, fill: STATUS_COLORS.missing },
    ].filter((d) => d.value > 0),
    [statusCounts]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/#transparency"
            className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-white">{category}</h1>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            Verified by Community (pending)
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">Category Score</span>
          <span
            className="text-3xl font-bold"
            style={{
              color: score >= 70 ? STATUS_COLORS.verified : score >= 40 ? STATUS_COLORS.partial : STATUS_COLORS.missing,
            }}
          >
            {score}%
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Data Point Status
          </p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value ?? 0} items`]}
                  contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-white/70">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Evidence Table
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.15em] text-white/50">
                  <th className="pb-3 pr-4">Sub-Item</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Source</th>
                  <th className="pb-3 pr-4">Verified By</th>
                  <th className="pb-3">Notes</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-medium">
                      {category === "Governance & Decisions" ? (
                        <Link
                          href={`/committees/${slugify(item.name)}`}
                          className="transition hover:text-emerald-200"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[item.status]}20`,
                          color: STATUS_COLORS[item.status],
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[item.status] }}
                        />
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/60">{item.source || "—"}</td>
                    <td className="py-3 pr-4">
                      {item.verifiedBy ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                          {item.verifiedBy}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="py-3 text-white/60">{item.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {gaps.length > 0 && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-red-400">
            Transparency Gaps
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {gaps.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <p className="text-sm text-white/80">Have information about this category?</p>
          <p className="text-xs text-white/50">Help improve transparency by submitting verified data.</p>
        </div>
        <Link
          href="/#contribute"
          className="rounded-full bg-linear-to-r from-teal-500 to-emerald-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Contribute Data
        </Link>
      </div>
    </div>
  );
}
