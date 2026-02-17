"use client";

import { useMemo, useState } from "react";

import peopleData from "@/data/people.json";

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
}

const DEFAULT_TRANSPARENCY = "partial";

const POWER_RANK: Record<MemberEntry["decisionPower"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
  Unknown: 0,
};

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [paidOnly, setPaidOnly] = useState(false);
  const [powerFilter, setPowerFilter] = useState("All");

  const members = useMemo<MemberEntry[]>(() => {
    const leadership = peopleData.leadership ?? [];
    const board = peopleData.board_members ?? [];
    const members = peopleData.members ?? [];

    return [...leadership, ...board, ...members].map((person) => ({
      name: person.name,
      role: person.role ?? "",
      affiliations: person.affiliations ?? [],
      responsibilities: person.responsibilities ?? "",
      paid: person.paid ?? "unknown",
      decisionPower: (person.decision_power as MemberEntry["decisionPower"]) ?? "Unknown",
      transparency: person.transparency ?? DEFAULT_TRANSPARENCY,
      source: person.source ?? "",
      notes: person.notes ?? "",
    }));
  }, []);

  const filters = useMemo(() => {
    const unique = new Set<string>();
    members.forEach((member) => {
      member.affiliations.forEach((affiliation) => unique.add(affiliation));
    });
    return ["All", ...Array.from(unique).sort()];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return members
      .filter((member) => {
      const matchesQuery =
        !normalized ||
        member.name.toLowerCase().includes(normalized) ||
        member.role.toLowerCase().includes(normalized) ||
        member.affiliations.some((affiliation) =>
          affiliation.toLowerCase().includes(normalized)
        );

      const matchesFilter =
        filter === "All" ||
        member.affiliations.some((affiliation) => affiliation === filter);

      const matchesPaid = !paidOnly || member.paid.toLowerCase().includes("verified");
      const matchesPower =
        powerFilter === "All" ||
        member.decisionPower.toLowerCase() === powerFilter.toLowerCase();

      return matchesQuery && matchesFilter && matchesPaid && matchesPower;
    })
      .sort((a, b) => POWER_RANK[b.decisionPower] - POWER_RANK[a.decisionPower]);
  }, [members, query, filter, paidOnly, powerFilter]);

  return (
    <main className="min-h-screen bg-[#080c14] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Member Directory
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Intersect Network Map</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Community-sourced roster of leadership, board members, and ecosystem partners. Flags indicate where salary
              transparency is missing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                  filter === option
                    ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, role, or affiliation"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setPaidOnly((prev) => !prev)}
            className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
              paidOnly
                ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
            }`}
          >
            Show Paid Only
          </button>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
            <span>Power</span>
            <select
              value={powerFilter}
              onChange={(event) => setPowerFilter(event.target.value)}
              className="bg-transparent text-[11px] uppercase tracking-[0.2em] text-white/70 focus:outline-none"
            >
              <option className="bg-[#080c14]" value="All">
                All
              </option>
              <option className="bg-[#080c14]" value="High">
                High
              </option>
              <option className="bg-[#080c14]" value="Medium">
                Medium
              </option>
              <option className="bg-[#080c14]" value="Low">
                Low
              </option>
            </select>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            {`${filteredMembers.length} results`}
          </span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.15em] text-white/50">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Affiliations</th>
                <th className="pb-3 pr-4">Responsibilities</th>
                <th className="pb-3 pr-4">Power</th>
                <th className="pb-3 pr-4">Transparency</th>
                <th className="pb-3">Paid</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {filteredMembers.map((member) => {
                const salaryMissing =
                  member.notes.toLowerCase().includes("salary") ||
                  member.notes.toLowerCase().includes("pay") ||
                  member.notes.toLowerCase().includes("comp") ||
                  member.notes.toLowerCase().includes("gap");
                const paidLabel = member.paid || "unknown";

                return (
                  <tr key={member.name} className="border-b border-white/5">
                    <td className="py-4 pr-4">
                      <div className="font-medium text-white">{member.name}</div>
                      <div className="text-xs text-white/50">{member.source}</div>
                    </td>
                    <td className="py-4 pr-4 text-white/70">{member.role}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {member.affiliations.map((affiliation) => (
                          <span
                            key={affiliation}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-white/60"
                          >
                            {affiliation}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-white/60">
                      {member.responsibilities || "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.2em] ${
                          member.decisionPower === "High"
                            ? "bg-rose-500/15 text-rose-200"
                            : member.decisionPower === "Medium"
                            ? "bg-amber-500/15 text-amber-200"
                            : member.decisionPower === "Low"
                            ? "bg-sky-500/15 text-sky-200"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {member.decisionPower}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.2em] ${
                          member.transparency === "verified"
                            ? "bg-emerald-500/15 text-emerald-200"
                            : member.transparency === "partial"
                            ? "bg-amber-500/15 text-amber-200"
                            : "bg-red-500/15 text-red-200"
                        }`}
                      >
                        {member.transparency}
                      </span>
                    </td>
                    <td className="py-4">
                      {salaryMissing ? (
                        <span className="inline-flex items-center rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-red-300">
                          Salary: Missing
                        </span>
                      ) : (
                        <span className="text-white/60">{paidLabel}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
