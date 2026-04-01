"use client";

import { useState } from "react";
import hierarchyData from "@/data/hierarchy.json";

const data = hierarchyData.hierarchy;

const POWER_COLORS: Record<string, { border: string; bg: string; text: string; label: string }> = {
  governing: { border: "border-violet-400/50", bg: "bg-violet-500/10", text: "text-violet-300", label: "Binding Authority" },
  executive: { border: "border-amber-400/50", bg: "bg-amber-500/10", text: "text-amber-300", label: "Operational Control" },
  advisory: { border: "border-sky-400/50", bg: "bg-sky-500/10", text: "text-sky-300", label: "Advisory Only" },
  elected_voice: { border: "border-emerald-400/50", bg: "bg-emerald-500/10", text: "text-emerald-300", label: "Can Elect" },
};

const SELECTION_BADGE: Record<string, { bg: string; text: string }> = {
  "Community Elected": { bg: "bg-emerald-500/20", text: "text-emerald-300" },
  "Board Appointed": { bg: "bg-amber-500/20", text: "text-amber-300" },
  "Hired": { bg: "bg-white/10", text: "text-white/60" },
};

function SelectionBadge({ selection }: { selection: string }) {
  const isAppointed = selection.toLowerCase().includes("appointed");
  const isElected = selection.toLowerCase().includes("elected");
  const style = isElected
    ? SELECTION_BADGE["Community Elected"]
    : isAppointed
    ? SELECTION_BADGE["Board Appointed"]
    : SELECTION_BADGE["Hired"];
  const label = isElected ? "Elected" : isAppointed ? "Appointed" : "Hired";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wider ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
}

interface HierarchyNode {
  name: string;
  subtitle?: string;
  power_level?: string;
  details?: string;
  what_they_can_do?: string[];
  what_they_cannot_do?: string[];
  transparency_gaps?: string[];
  key_fact?: string;
  seats?: { total: number; member_elected: number; appointed: number; note: string };
  members?: Array<{ name: string; role?: string; selection?: string; election_detail?: string; term?: string; affiliations?: string[]; votes?: number; paid?: boolean }>;
  elected_members?: Array<{ name: string; role?: string; selection?: string; election_detail?: string; votes?: number; affiliations?: string[] }>;
  children?: HierarchyNode[];
  turnout_concern?: string;
  tiers?: Array<{ name: string; price: string; voting: boolean; count: number }>;
  chair?: string;
  staff?: string[];
  budget_ada?: number;
  source?: string;
}

function PowerCard({ node, defaultOpen = false }: { node: HierarchyNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const power = POWER_COLORS[node.power_level ?? "advisory"] ?? POWER_COLORS.advisory;

  return (
    <div className={`rounded-[28px] border ${power.border} ${power.bg} p-6 md:p-8`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-white md:text-2xl">{node.name}</h2>
            <span className={`rounded-full border ${power.border} px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${power.text}`}>
              {power.label}
            </span>
          </div>
          {node.subtitle && (
            <p className="mt-1 text-sm text-white/50">{node.subtitle}</p>
          )}
        </div>
        {node.seats && (
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-300">{node.seats.member_elected}</span>
              <span className="text-white/40">/</span>
              <span className="text-2xl font-bold text-white">{node.seats.total}</span>
            </div>
            <p className="text-[11px] text-white/40">elected seats</p>
          </div>
        )}
      </div>

      {/* Description */}
      {node.details && (
        <p className="mt-4 text-sm leading-relaxed text-white/50">{node.details}</p>
      )}

      {/* Seats note */}
      {node.seats?.note && (
        <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/80">
          {node.seats.note}
        </div>
      )}

      {/* Key fact */}
      {node.key_fact && (
        <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-200/80">
          {node.key_fact}
        </div>
      )}

      {/* Turnout concern */}
      {node.turnout_concern && (
        <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/80">
          {node.turnout_concern}
        </div>
      )}

      {/* Can / Cannot do */}
      {(node.what_they_can_do || node.what_they_cannot_do) && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {node.what_they_can_do && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/70">What they can do</p>
              <ul className="mt-3 space-y-2">
                {node.what_they_can_do.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="mt-1 text-emerald-400">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {node.what_they_cannot_do && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-rose-300/70">What they cannot do</p>
              <ul className="mt-3 space-y-2">
                {node.what_they_cannot_do.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="mt-1 text-rose-400">&minus;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Members list */}
      {node.members && node.members.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 transition hover:text-white/70"
          >
            <span>{open ? "▼" : "▶"}</span>
            {node.members.length} {node.members.length === 1 ? "person" : "people"}
          </button>
          {open && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {node.members.map((m) => (
                <div key={m.name} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">{m.name}</span>
                    {m.selection && <SelectionBadge selection={m.selection} />}
                  </div>
                  {m.role && <p className="mt-1 text-sm text-white/50">{m.role}</p>}
                  {m.election_detail && <p className="mt-1 text-[11px] text-white/40">{m.election_detail}</p>}
                  {m.term && <p className="text-[11px] text-white/40">Term: {m.term}</p>}
                  {m.affiliations && m.affiliations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.affiliations.map((a) => (
                        <span key={a} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/40">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Member tiers */}
      {node.tiers && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {node.tiers.map((t) => (
            <div key={t.name} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{t.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${t.voting ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/40"}`}>
                  {t.voting ? "Can Vote" : "No Vote"}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/50">{t.price} · {t.count.toLocaleString()} members</p>
            </div>
          ))}
        </div>
      )}

      {/* Transparency gaps */}
      {node.transparency_gaps && node.transparency_gaps.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-rose-300/70">Transparency Gaps</p>
          <ul className="mt-3 space-y-2">
            {node.transparency_gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-200/70">
                <span className="mt-0.5 text-rose-400">!</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Committee children */}
      {node.children && node.children.length > 0 && (
        <div className="mt-6 grid gap-4">
          {node.children.map((child) => (
            <CommitteeCard key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommitteeCard({ node }: { node: HierarchyNode }) {
  const [open, setOpen] = useState(false);
  const members = node.elected_members ?? [];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{node.name}</h3>
          <p className="mt-1 text-sm text-white/50">{node.details}</p>
        </div>
        {node.budget_ada && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
            ₳{(node.budget_ada / 1_000_000).toFixed(1)}M budget
          </span>
        )}
      </div>
      {node.chair && (
        <p className="mt-2 text-[11px] text-white/40">Chair: {node.chair}</p>
      )}
      {members.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/40 transition hover:text-white/70"
          >
            <span>{open ? "▼" : "▶"}</span>
            {members.length} elected members
          </button>
          {open && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <div key={m.name} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2">
                  <div>
                    <span className="text-sm text-white">{m.name}</span>
                    {m.affiliations && m.affiliations.length > 0 && (
                      <span className="ml-2 text-[11px] text-white/30">({m.affiliations.join(", ")})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {m.votes && (
                      <span className="text-[11px] text-emerald-300/70">{m.votes} votes</span>
                    )}
                    <SelectionBadge selection={m.selection ?? "Community Elected"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {node.staff && node.staff.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] text-white/40">Staff (hired, not elected): {node.staff.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default function HierarchyPage() {
  const children = (data.children ?? []) as HierarchyNode[];
  const keyFacts = (data as { key_facts?: string[] }).key_facts ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Who Holds Power at Intersect
        </h1>
        <p className="mt-3 text-lg text-white/50">
          A factual map of authority, not marketing language
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-white/40">
          {data.description}
        </p>
      </section>

      {/* Legend */}
      <section className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-[11px] uppercase tracking-wider text-white/40">Power Level:</span>
        {Object.entries(POWER_COLORS).map(([key, val]) => (
          <span
            key={key}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${val.border} ${val.text}`}
          >
            {val.label}
          </span>
        ))}
      </section>

      {/* Selection legend */}
      <section className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span className="text-[11px] uppercase tracking-wider text-white/40">Selection:</span>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] uppercase tracking-wider text-emerald-300">Elected</span>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] uppercase tracking-wider text-amber-300">Appointed</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-white/60">Hired</span>
      </section>

      {/* Power cards */}
      <section className="mt-10 space-y-6">
        {children.map((node) => (
          <PowerCard key={node.name} node={node} defaultOpen={node.power_level === "governing"} />
        ))}
      </section>

      {/* Key facts */}
      {keyFacts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Key Facts</h2>
          <p className="mt-1 text-sm text-white/40">Documented, not assumed.</p>
          <ul className="mt-4 space-y-3">
            {keyFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                <span className="mt-0.5 font-mono text-white/30">{i + 1}.</span>
                {fact}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sources */}
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Sources</h3>
        <ul className="mt-3 space-y-1 text-sm text-white/40">
          {data.sources.map((src, i) => (
            <li key={i}>{src}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
