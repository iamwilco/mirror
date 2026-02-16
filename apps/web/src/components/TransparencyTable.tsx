"use client";

const rows = [
  {
    category: "Budget & Money Flow",
    status: "Partial",
    level: "Medium",
    updated: "2026-02-12",
    source: "Intersect budget docs",
    notes: "Work package detail incomplete",
  },
  {
    category: "Governance & Decision Process",
    status: "Partial",
    level: "Medium",
    updated: "2026-02-08",
    source: "Intersect GitBook",
    notes: "Committee voting logs missing",
  },
  {
    category: "People & Compensation",
    status: "Missing",
    level: "Low",
    updated: "—",
    source: "None",
    notes: "Salary disclosures not public",
  },
  {
    category: "Results & Deliverables",
    status: "Partial",
    level: "Medium",
    updated: "2026-01-30",
    source: "Quarterly report",
    notes: "KPI data lacks granularity",
  },
  {
    category: "Procurement & Contracts",
    status: "Missing",
    level: "Low",
    updated: "—",
    source: "None",
    notes: "Vendor list not published",
  },
  {
    category: "Organizational Relationships",
    status: "Verified",
    level: "High",
    updated: "2026-02-14",
    source: "Public board listings",
    notes: "Founding entity ties mapped",
  },
];

const statusStyles: Record<string, string> = {
  Verified: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40",
  Partial: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Missing: "bg-rose-400/15 text-rose-200 border-rose-400/40",
};

const levelStyles: Record<string, string> = {
  High: "text-emerald-200",
  Medium: "text-amber-200",
  Low: "text-rose-200",
};

export default function TransparencyTable() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="grid gap-3">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.6fr_0.7fr_1fr_1.3fr] text-xs uppercase tracking-[0.2em] text-white/50">
          <span>Category</span>
          <span>Status</span>
          <span>Level</span>
          <span>Updated</span>
          <span>Source</span>
          <span>Notes</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.category}
            className="grid grid-cols-[1.6fr_0.8fr_0.6fr_0.7fr_1fr_1.3fr] items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70"
          >
            <span className="text-white">{row.category}</span>
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                statusStyles[row.status]
              }`}
            >
              {row.status}
            </span>
            <span className={`text-xs uppercase tracking-[0.2em] ${levelStyles[row.level]}`}>
              {row.level}
            </span>
            <span className="text-xs text-white/50">{row.updated}</span>
            <span className="text-xs text-white/60">{row.source}</span>
            <span className="text-xs text-white/50">{row.notes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
