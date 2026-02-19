import Link from "next/link";
import sourcesData from "@/data/sources.json";

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-500/20", text: "text-emerald-300", label: "Active" },
  not_yet_used: { bg: "bg-amber-500/20", text: "text-amber-300", label: "Not Yet Used" },
  gap: { bg: "bg-rose-500/20", text: "text-rose-300", label: "Gap" },
  verified: { bg: "bg-emerald-500/20", text: "text-emerald-300", label: "Verified" },
  partial: { bg: "bg-amber-500/20", text: "text-amber-300", label: "Partial" },
};

const CATEGORY_ICON: Record<string, string> = {
  organisation: "🏛",
  documentation: "📄",
  social: "📢",
  code: "💻",
  community: "👥",
  "on-chain": "⛓",
  individual: "👤",
  event: "🎤",
  governance: "⚖️",
};

const PRIORITY_CLR: Record<string, string> = {
  high: "border-rose-400/40 text-rose-300",
  medium: "border-amber-400/40 text-amber-300",
  low: "border-white/10 text-white/50",
};

function Badge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? STATUS_BADGE.gap;
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function SourcesPage() {
  const { sources, facts, enrichment_opportunities, data_coverage_summary } = sourcesData;

  const primarySources = sources.filter((s) => s.type === "primary");
  const secondarySources = sources.filter((s) => s.type === "secondary");
  const verifiedFacts = facts.filter((f) => f.status === "verified");
  const gapFacts = facts.filter((f) => f.status === "gap");
  const partialFacts = facts.filter((f) => f.status === "partial");

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-14">
      <header className="space-y-4">
        <Link href="/" className="text-xs uppercase tracking-[0.4em] text-white/40 transition hover:text-white/70">
          ← Back to Dashboard
        </Link>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Knowledge Base</p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">Sources & Facts</h1>
        <p className="max-w-3xl text-base text-white/70 md:text-lg">
          Every claim in Intersect Mirror is backed by a source. This page catalogues all known sources,
          verified facts, identified gaps, and enrichment opportunities.
        </p>
      </header>

      {/* ── Data Coverage Summary ──────────────────── */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Data Coverage</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.people.total}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">People Tracked</p>
            <div className="mt-3 flex gap-2">
              <Badge status="verified" />
              <span className="text-xs text-white/50">{data_coverage_summary.people.verified} verified</span>
              <Badge status="partial" />
              <span className="text-xs text-white/50">{data_coverage_summary.people.partial} partial</span>
            </div>
            <p className="mt-2 text-[11px] text-rose-300/70">Missing: {data_coverage_summary.people.missing_fields.join(", ")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.committees.total}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Committees</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs text-emerald-300">{data_coverage_summary.committees.with_known_members} with members</span>
              <span className="text-xs text-amber-300">{data_coverage_summary.committees.with_TBD_members} TBD</span>
            </div>
            <p className="mt-2 text-[11px] text-rose-300/70">Missing: {data_coverage_summary.committees.missing_fields.join(", ")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.relationships.total_graph_edges}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Graph Edges</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs text-emerald-300">{data_coverage_summary.relationships.verified_edges} verified</span>
              <span className="text-xs text-amber-300">{data_coverage_summary.relationships.inferred_edges} inferred</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.working_groups.total}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Working Groups</p>
            <p className="mt-2 text-[11px] text-rose-300/70">Missing: {data_coverage_summary.working_groups.missing_fields.join(", ")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.budget.entries}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Budget Allocations</p>
            <p className="mt-2 text-xs text-emerald-300">₳{(data_coverage_summary.budget.total_ada / 1e6).toFixed(1)}M total</p>
            <p className="mt-1 text-[11px] text-white/40">{data_coverage_summary.budget.status}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">{data_coverage_summary.elections.total_elected}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">Elected Members</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs text-white/50">{data_coverage_summary.elections.total_voters} voters</span>
              <span className="text-xs text-amber-300">{data_coverage_summary.elections.turnout} turnout</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-white">₳{(data_coverage_summary.governance.drep_ada_delegated / 1e9).toFixed(1)}B</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">DRep Delegated</p>
            <p className="mt-2 text-xs text-emerald-300">Constitution: {data_coverage_summary.governance.constitution}</p>
            <p className="mt-1 text-[11px] text-white/40">Treasury: ₳{(data_coverage_summary.governance.treasury_ada / 1e9).toFixed(1)}B</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-bold text-amber-300">⛓</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/50">On-Chain Data</p>
            <p className="mt-2 text-[11px] text-emerald-300">{data_coverage_summary.on_chain.status}</p>
            <p className="mt-1 text-[11px] text-white/40">Integrated: {data_coverage_summary.on_chain.integrated.join(", ")}</p>
            <p className="mt-1 text-[11px] text-rose-300/70">Pending: {data_coverage_summary.on_chain.pending.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* ── Primary Sources ────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Primary Sources ({primarySources.length})</h2>
        <p className="mt-1 text-sm text-white/50">Official, first-party data.</p>
        <div className="mt-6 grid gap-4">
          {primarySources.map((src) => (
            <div key={src.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CATEGORY_ICON[src.category] ?? "📎"}</span>
                  <div>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white underline decoration-white/20 transition hover:decoration-white/60">
                      {src.name}
                    </a>
                    <p className="text-[11px] text-white/30">{src.url}</p>
                  </div>
                </div>
                <Badge status={src.status} />
              </div>
              <p className="mt-3 text-sm text-white/60">{src.description}</p>
              {src.notes && <p className="mt-2 text-xs text-rose-300/70">{src.notes}</p>}
              {src.data_points_sourced.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {src.data_points_sourced.map((dp) => (
                    <span key={dp} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                      {dp.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-[10px] text-white/20">Last checked: {src.last_checked}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Secondary Sources ──────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Secondary Sources ({secondarySources.length})</h2>
        <p className="mt-1 text-sm text-white/50">Third-party, community, and individual sources.</p>
        <div className="mt-6 grid gap-3">
          {secondarySources.map((src) => (
            <div key={src.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <span className="mt-0.5 text-lg">{CATEGORY_ICON[src.category] ?? "📎"}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white underline decoration-white/20 transition hover:decoration-white/60">
                    {src.name}
                  </a>
                  <Badge status={src.status} />
                </div>
                <p className="mt-1 text-xs text-white/50">{src.description}</p>
                {src.notes && <p className="mt-1 text-[11px] text-rose-300/70">{src.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Verified Facts ─────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Verified Facts ({verifiedFacts.length})</h2>
        <div className="mt-6 grid gap-2">
          {verifiedFacts.map((f) => (
            <div key={f.id} className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              <div>
                <p className="text-sm text-white/80">{f.claim}</p>
                <p className="mt-1 text-[10px] text-white/30">
                  {f.date} · Sources: {f.sources.map((sid) => sources.find((s) => s.id === sid)?.name ?? sid).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Partial / Unverified ────────────────────── */}
      {partialFacts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-white">Partially Verified ({partialFacts.length})</h2>
          <div className="mt-6 grid gap-2">
            {partialFacts.map((f) => (
              <div key={f.id} className="flex items-start gap-3 rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <div>
                  <p className="text-sm text-white/80">{f.claim}</p>
                  <p className="mt-1 text-[10px] text-white/30">
                    {f.date} · Sources: {f.sources.map((sid) => sources.find((s) => s.id === sid)?.name ?? sid).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Known Gaps ─────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Known Gaps ({gapFacts.length})</h2>
        <p className="mt-1 text-sm text-white/50">Data we know is missing.</p>
        <div className="mt-6 grid gap-2">
          {gapFacts.map((f) => (
            <div key={f.id} className="flex items-start gap-3 rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
              <p className="text-sm text-white/80">{f.claim}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enrichment Opportunities ───────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Enrichment Opportunities</h2>
        <p className="mt-1 text-sm text-white/50">Data we could add to strengthen the dashboard.</p>
        <div className="mt-6 grid gap-3">
          {enrichment_opportunities.map((opp, i) => (
            <div key={i} className={`rounded-xl border px-5 py-4 ${(opp as Record<string, unknown>).status === "completed" ? "border-emerald-500/30 text-emerald-300" : PRIORITY_CLR[opp.priority]}`}>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${(opp as Record<string, unknown>).status === "completed" ? "bg-emerald-500/20" : "bg-white/5"}`}>
                  {(opp as Record<string, unknown>).status === "completed" ? "✓ done" : (opp as Record<string, unknown>).status === "partial" ? "partial" : opp.priority}
                </span>
                <span className="text-sm font-semibold">{opp.area}</span>
              </div>
              <p className="mt-2 text-xs text-white/60">{opp.action}</p>
              {typeof (opp as Record<string, unknown>).result === "string" && (
                <p className="mt-1 text-xs text-emerald-300/70">{String((opp as Record<string, unknown>).result)}</p>
              )}
              <p className="mt-1 text-[10px] text-white/30">
                Sources: {opp.sources.map((sid) => sources.find((s) => s.id === sid)?.name ?? sid).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DB Sync Status ─────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Database Sync Status</h2>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-white/60">Storage</span>
              <span className="text-white">Local JSON (primary) + Supabase (optional)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-white/60">Supabase Tables</span>
              <span className="text-white">people, committees, relationships, budgets, transparency_scores</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-white/60">Seed Script</span>
              <span className="text-amber-300">Partial — missing decision_power, paid, responsibilities, notes columns</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-white/60">Score Calculation</span>
              <span className="text-emerald-300">Local (from input.json verified/partial/missing counts)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Gap Votes</span>
              <span className="text-amber-300">localStorage + optional Supabase (gap_votes table)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link
          href="/#contribute"
          className="inline-block rounded-full border border-emerald-400/40 px-6 py-2.5 text-sm uppercase tracking-[0.15em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
        >
          Submit Data or Corrections
        </Link>
      </div>
    </div>
  );
}
