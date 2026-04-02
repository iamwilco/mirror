"use client";

import { useMemo, useState } from "react";
import peopleData from "@/data/people.json";

type Selection = "Elected" | "Appointed" | "Hired" | "External";

interface MemberEntry {
  name: string;
  role: string;
  affiliations: string[];
  responsibilities: string;
  paid: string;
  decisionPower: "High" | "Medium" | "Low" | "Unknown";
  transparency: string;
  source: string;
  notes: string;
  selection: Selection;
  category: string;
}

const POWER_RANK: Record<MemberEntry["decisionPower"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
  Unknown: 0,
};

const SELECTION_STYLE: Record<Selection, { bg: string; text: string }> = {
  Elected: { bg: "bg-emerald-500/20", text: "text-emerald-300" },
  Appointed: { bg: "bg-amber-500/20", text: "text-amber-300" },
  Hired: { bg: "bg-white/10", text: "text-white/60" },
  External: { bg: "bg-violet-500/20", text: "text-violet-300" },
};

function deriveSelection(person: Record<string, unknown>, category: string): Selection {
  const role = (person.role as string) ?? "";
  if (category === "board") {
    if (role.toLowerCase().includes("members-elected") || role.toLowerCase().includes("member-elected")) {
      return "Elected";
    }
    return "Appointed";
  }
  if (category === "leadership") return "Hired";
  return "External";
}

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectionFilter, setSelectionFilter] = useState("All");
  const [powerFilter, setPowerFilter] = useState("All");

  const members = useMemo<MemberEntry[]>(() => {
    const leadership = (peopleData.leadership ?? []).map((p) => ({
      ...mapPerson(p),
      selection: deriveSelection(p as Record<string, unknown>, "leadership"),
      category: "Staff",
    }));
    const board = (peopleData.board_members ?? []).map((p) => ({
      ...mapPerson(p),
      selection: deriveSelection(p as Record<string, unknown>, "board"),
      category: "Board",
    }));
    const community = (peopleData.members ?? []).map((p) => ({
      ...mapPerson(p),
      selection: "External" as Selection,
      category: "Community",
    }));
    return [...board, ...leadership, ...community];
  }, []);

  const affiliationFilters = useMemo(() => {
    const unique = new Set<string>();
    members.forEach((m) => m.affiliations.forEach((a) => unique.add(a)));
    return ["All", ...Array.from(unique).sort()];
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => {
        const matchQuery = !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.affiliations.some((a) => a.toLowerCase().includes(q));
        const matchFilter = filter === "All" || m.affiliations.includes(filter);
        const matchSelection = selectionFilter === "All" || m.selection === selectionFilter;
        const matchPower = powerFilter === "All" || m.decisionPower === powerFilter;
        return matchQuery && matchFilter && matchSelection && matchPower;
      })
      .sort((a, b) => POWER_RANK[b.decisionPower] - POWER_RANK[a.decisionPower]);
  }, [members, query, filter, selectionFilter, powerFilter]);

  const electedCount = members.filter((m) => m.selection === "Elected").length;
  const appointedCount = members.filter((m) => m.selection === "Appointed").length;
  const hiredCount = members.filter((m) => m.selection === "Hired").length;

  return (
    <main className="min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">People Directory</p>
          <h1 className="mt-3 text-3xl font-semibold">Who Works at Intersect</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/50">
            Everyone we can identify at Intersect, tagged by how they got their role.
            No staff salary data has been disclosed. Committee stipends (500 ADA/month) are public.
          </p>
        </div>

        {/* Selection summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-300">{electedCount}</p>
            <p className="text-[11px] uppercase tracking-wider text-emerald-300/70">Community Elected</p>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-amber-300">{appointedCount}</p>
            <p className="text-[11px] uppercase tracking-wider text-amber-300/70">Appointed</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-bold text-white">{hiredCount}</p>
            <p className="text-[11px] uppercase tracking-wider text-white/50">Hired by Board/ED</p>
          </div>
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-rose-300">~19</p>
            <p className="text-[11px] uppercase tracking-wider text-rose-300/70">Unnamed Staff</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or affiliation"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            aria-label="Search people"
          />
          <select
            value={selectionFilter}
            onChange={(e) => setSelectionFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] uppercase tracking-wider text-white/60 focus:outline-none"
            aria-label="Filter by selection type"
          >
            <option className="bg-[#080c14]" value="All">All Types</option>
            <option className="bg-[#080c14]" value="Elected">Elected</option>
            <option className="bg-[#080c14]" value="Appointed">Appointed</option>
            <option className="bg-[#080c14]" value="Hired">Hired</option>
            <option className="bg-[#080c14]" value="External">External</option>
          </select>
          <select
            value={powerFilter}
            onChange={(e) => setPowerFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] uppercase tracking-wider text-white/60 focus:outline-none"
            aria-label="Filter by decision power"
          >
            <option className="bg-[#080c14]" value="All">All Power</option>
            <option className="bg-[#080c14]" value="High">High</option>
            <option className="bg-[#080c14]" value="Medium">Medium</option>
            <option className="bg-[#080c14]" value="Low">Low</option>
          </select>
          <span className="text-xs text-white/40">{filtered.length} results</span>
        </div>

        {/* People cards (responsive — not a table) */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((m) => {
            const salaryMissing = m.notes.toLowerCase().includes("salary") || m.notes.toLowerCase().includes("gap");
            const style = SELECTION_STYLE[m.selection];

            return (
              <div key={m.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{m.name}</p>
                    <p className="mt-0.5 text-sm text-white/50">{m.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${style.bg} ${style.text}`}>
                      {m.selection}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${
                      m.decisionPower === "High" ? "bg-violet-500/20 text-violet-300"
                      : m.decisionPower === "Medium" ? "bg-amber-500/20 text-amber-300"
                      : "bg-white/10 text-white/40"
                    }`}>
                      {m.decisionPower} Power
                    </span>
                  </div>
                </div>
                {m.responsibilities && (
                  <p className="mt-2 text-sm text-white/40">{m.responsibilities}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {m.affiliations.map((a) => (
                    <span key={a} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/40">{a}</span>
                  ))}
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/40">{m.category}</span>
                </div>
                {salaryMissing && (
                  <p className="mt-2 text-[11px] text-rose-300/70">No salary disclosed</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function mapPerson(person: Record<string, unknown>) {
  return {
    name: (person.name as string) ?? "",
    role: (person.role as string) ?? "",
    affiliations: (person.affiliations as string[]) ?? [],
    responsibilities: (person.responsibilities as string) ?? "",
    paid: (person.paid as string) ?? "unknown",
    decisionPower: ((person.decision_power as string) ?? "Unknown") as MemberEntry["decisionPower"],
    transparency: (person.transparency as string) ?? "partial",
    source: (person.source as string) ?? "",
    notes: (person.notes as string) ?? "",
  };
}
