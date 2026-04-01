"use client";

import { useMemo } from "react";
import Link from "next/link";
import InfluenceGraph from "@/components/InfluenceGraph";
import govData from "@/data/governance-stats.json";

const data = govData as Record<string, unknown>;

const drep = data.drep_stats as {
  total_ada_delegated?: number;
  abstain_percent?: number;
  active_delegation_percent?: number;
  abstain_ada?: number;
  abstain_delegators?: number;
  no_confidence_delegators?: number;
  no_confidence_ada?: number;
  notes?: string;
} | undefined;

const cf = data.cardano_foundation_governance as {
  voting_record?: string;
  delegation_phase_1?: { date?: string; ada_delegated?: number; dreps_selected?: number; category?: string };
  delegation_phase_2?: { date?: string; ada_delegated?: number; dreps_selected?: number; category?: string };
  total_cf_delegation?: number;
  notes?: string;
} | undefined;

const treasury = data.treasury as {
  total_ada_in_treasury?: number;
  notes?: string;
} | undefined;

const intersectRole = data.intersect_role_in_governance as {
  description?: string;
  source?: string;
  functions?: string[];
  does_not?: string[];
} | undefined;

const budgetConcerns = data.budget_process_concerns as {
  description?: string;
  issues?: string[];
  intersect_response?: string;
  sources?: string[];
} | undefined;

const cc = data.constitutional_committee as {
  type?: string;
  members?: Array<{ name: string; source: string }>;
  notes?: string;
} | undefined;

const recentRatified = (data.recent_ratified ?? []) as Array<{
  name: string; type: string; ada_amount?: number;
  ratified?: string; ratified_epoch?: string;
  support_pct?: number; notes?: string; source: string;
}>;

const chainSplit = data.chain_split_incident as {
  date?: string; cause?: string; attacker?: string;
  recovery_hours?: number; patches?: string[];
  fbi_investigation?: boolean; impact?: string;
} | undefined;

const milestones = (data.governance_milestones ?? []) as Array<{
  date: string; event: string; source: string;
}>;

function StatCard({ label, value, sub, color = "text-white" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-white/40">{sub}</p>}
    </div>
  );
}

export default function GovernancePage() {
  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* Hero */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Intersect Governance</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
          How Intersect Makes Decisions
        </h1>
        <p className="mt-4 max-w-3xl text-base text-white/50">
          Intersect coordinates Cardano&apos;s off-chain governance. It administrates the budget process
          and manages vendor contracts — but final spending authority rests with on-chain DRep votes, not Intersect.
        </p>
      </section>

      {/* Key stats */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Treasury"
          value={`₳${((treasury?.total_ada_in_treasury ?? 0) / 1e9).toFixed(1)}B`}
          sub="Cardano treasury balance"
        />
        <StatCard
          label="DRep Participation"
          value={`${drep?.active_delegation_percent ?? 0}% active`}
          sub={`${drep?.abstain_percent ?? 0}% delegated to Abstain`}
          color="text-amber-300"
        />
        <StatCard
          label="CF Delegation"
          value={`₳${((cf?.total_cf_delegation ?? 0) / 1e6).toFixed(0)}M`}
          sub="Delegated to 18 community DReps"
          color="text-violet-300"
        />
        <StatCard
          label="2025 Budget"
          value="₳263.6M"
          sub="39 proposals, 33 passed"
        />
      </section>

      {/* Intersect's Role */}
      {intersectRole && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">What Intersect Actually Does</h2>
          <p className="mt-2 text-sm text-white/50">{intersectRole.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {intersectRole.functions && (
              <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/5 p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/70">What Intersect does</p>
                <ul className="mt-4 space-y-3">
                  {intersectRole.functions.map((fn, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="mt-0.5 text-emerald-400">+</span>
                      {fn}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {intersectRole.does_not && (
              <div className="rounded-[28px] border border-rose-400/20 bg-rose-500/5 p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-rose-300/70">What Intersect does NOT do</p>
                <ul className="mt-4 space-y-3">
                  {intersectRole.does_not.map((fn, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="mt-0.5 text-rose-400">&minus;</span>
                      {fn}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Budget Process Concerns */}
      {budgetConcerns && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">2025 Budget Process</h2>
          <p className="mt-2 text-sm text-white/50">{budgetConcerns.description}</p>

          <div className="mt-6 rounded-[28px] border border-amber-400/20 bg-amber-500/5 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-300/70">Community-Reported Issues</p>
            <ul className="mt-4 space-y-3">
              {budgetConcerns.issues?.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <span className="mt-0.5 text-amber-400">!</span>
                  {issue}
                </li>
              ))}
            </ul>
            {budgetConcerns.intersect_response && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">Intersect&apos;s Response</p>
                <p className="mt-2 text-sm text-white/50">{budgetConcerns.intersect_response}</p>
              </div>
            )}
            {budgetConcerns.sources && (
              <p className="mt-3 text-[11px] text-white/30">
                Sources: {budgetConcerns.sources.join(", ")}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Link
              href="/budget"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:border-white/30 hover:text-white"
            >
              See full budget breakdown &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* DRep Delegation Problem */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">The Participation Problem</h2>
        <p className="mt-2 text-sm text-white/50">
          On-chain governance requires DRep (Delegated Representative) participation. But most delegated ADA
          is parked in Abstain — meaning most voting power does nothing.
        </p>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6">
          {/* Visual bar */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-300">Active DReps</span>
                <span className="text-white/50">{drep?.active_delegation_percent ?? 0}%</span>
              </div>
              <div className="mt-1 h-4 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${drep?.active_delegation_percent ?? 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-300">Abstain</span>
                <span className="text-white/50">{drep?.abstain_percent ?? 0}%</span>
              </div>
              <div className="mt-1 h-4 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-amber-500/60" style={{ width: `${drep?.abstain_percent ?? 0}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-white/40">
                {(drep?.abstain_delegators ?? 0).toLocaleString()} individuals · ₳{((drep?.abstain_ada ?? 0) / 1e9).toFixed(1)}B
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-200/80">
            This means only ~{drep?.active_delegation_percent ?? 0}% of delegated voting power actively
            participates in governance decisions. The remaining {drep?.abstain_percent ?? 0}% effectively opts
            out, concentrating real decision-making among a small number of active DReps.
          </div>
        </div>
      </section>

      {/* CF Delegation Power */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Cardano Foundation Delegation</h2>
        <p className="mt-2 text-sm text-white/50">
          The Cardano Foundation delegated ₳{((cf?.total_cf_delegation ?? 0) / 1e6).toFixed(0)}M ADA
          to 18 community DReps — giving these DReps significant voting power. This is relevant
          to Intersect because CF is a founding entity with an appointed board seat.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cf?.delegation_phase_1 && (
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5">
              <p className="text-xs uppercase tracking-wider text-violet-300/70">Phase 1 ({cf.delegation_phase_1.date})</p>
              <p className="mt-2 text-xl font-bold text-white">₳{((cf.delegation_phase_1.ada_delegated ?? 0) / 1e6).toFixed(0)}M</p>
              <p className="mt-1 text-sm text-white/50">to {cf.delegation_phase_1.dreps_selected} {cf.delegation_phase_1.category}</p>
            </div>
          )}
          {cf?.delegation_phase_2 && (
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5">
              <p className="text-xs uppercase tracking-wider text-violet-300/70">Phase 2 ({cf.delegation_phase_2.date})</p>
              <p className="mt-2 text-xl font-bold text-white">₳{((cf.delegation_phase_2.ada_delegated ?? 0) / 1e6).toFixed(0)}M</p>
              <p className="mt-1 text-sm text-white/50">to {cf.delegation_phase_2.dreps_selected} {cf.delegation_phase_2.category}</p>
            </div>
          )}
        </div>
      </section>

      {/* Constitutional Committee */}
      {cc?.members && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Constitutional Committee</h2>
          <p className="mt-2 text-sm text-white/50">
            The CC checks whether governance actions comply with the Cardano Constitution.
            {cc.type === "community-elected" && " All current members are community-elected, replacing the original interim committee."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cc.members.map((member) => (
              <div key={member.name} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="mt-1 text-[11px] text-emerald-300/70">Community Elected</p>
                <p className="text-[11px] text-white/30">{member.source}</p>
              </div>
            ))}
          </div>
          {cc.notes && <p className="mt-3 text-sm text-white/40">{cc.notes}</p>}
        </section>
      )}

      {/* Recently Ratified (Intersect-related only) */}
      {recentRatified.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Recent Governance Outcomes</h2>
          <p className="mt-2 text-sm text-white/50">Actions that affect Intersect or were administered by Intersect.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {recentRatified.map((action) => (
              <div key={action.name} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5">
                <p className="font-medium text-white">{action.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] uppercase tracking-wider text-emerald-300">
                    Ratified
                  </span>
                  <span className="text-[11px] text-white/40">{action.type}</span>
                </div>
                {action.ada_amount && (
                  <p className="mt-2 text-lg font-bold text-emerald-300">₳{(action.ada_amount / 1e6).toFixed(1)}M</p>
                )}
                {action.support_pct && (
                  <p className="mt-1 text-sm text-white/50">{action.support_pct}% support</p>
                )}
                {action.notes && <p className="mt-2 text-sm text-white/40">{action.notes}</p>}
                <p className="mt-2 text-[11px] text-white/30">Source: {action.source}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chain Split Incident */}
      {chainSplit && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Chain Split Incident</h2>
          <p className="mt-2 text-sm text-white/50">
            Intersect coordinated the response to this incident through the TSC (Technical Steering Committee).
          </p>
          <div className="mt-6 rounded-[28px] border border-rose-400/20 bg-rose-500/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-rose-300/70">Date</p>
                <p className="mt-1 text-sm text-white">{chainSplit.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-rose-300/70">Recovery</p>
                <p className="mt-1 text-sm text-white">{chainSplit.recovery_hours} hours</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-rose-300/70">Patches</p>
                <p className="mt-1 text-sm text-white">{chainSplit.patches?.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-rose-300/70">Investigation</p>
                <p className="mt-1 text-sm text-white">{chainSplit.fbi_investigation ? "FBI investigation confirmed" : "Unknown"}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/50">
              <strong className="text-white/70">Cause:</strong> {chainSplit.cause}
            </p>
            <p className="mt-2 text-sm text-white/50">
              <strong className="text-white/70">Impact:</strong> {chainSplit.impact}
            </p>
          </div>
        </section>
      )}

      {/* Influence Network */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">Intersect Relationship Network</h2>
        <p className="mt-2 text-sm text-white/50">
          Force-directed graph showing how Intersect&apos;s leadership, committees, and founding
          entities connect. Hover to highlight relationships.
        </p>
        <div className="mt-6">
          <InfluenceGraph />
        </div>
      </section>

      {/* Governance Timeline */}
      {sortedMilestones.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Governance Timeline</h2>
          <div className="mt-6 space-y-0">
            {sortedMilestones.map((m, i) => (
              <div key={i} className="flex gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-white/30 bg-white/10" />
                  {i < sortedMilestones.length - 1 && <div className="w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-2">
                  <p className="text-[11px] font-medium text-white/40">{m.date}</p>
                  <p className="mt-1 text-sm text-white/60">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
