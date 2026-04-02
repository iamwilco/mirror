"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BudgetSankey from "@/components/BudgetSankey";
import budgetData from "@/data/budget-2025.json";
import treasuryData from "@/data/treasury-proposals.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Proposal = (typeof treasuryData.proposals)[number];
type Filter = "all" | "passed" | "expired" | "iog" | "amount_known";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function fmtFull(n: number): string {
  return n.toLocaleString();
}

const BUCKET_COLORS: Record<string, string> = {
  "Core Budget": "bg-blue-500",
  "Research Budget": "bg-violet-500",
  "Governance Support Budget": "bg-amber-500",
  "Growth & Marketing Budget": "bg-emerald-500",
  "Innovation Budget": "bg-cyan-500",
  "Funding Intersect (Administrator)": "bg-rose-500",
};

const BUCKET_TEXT_COLORS: Record<string, string> = {
  "Core Budget": "text-blue-400",
  "Research Budget": "text-violet-400",
  "Governance Support Budget": "text-amber-400",
  "Growth & Marketing Budget": "text-emerald-400",
  "Innovation Budget": "text-cyan-400",
  "Funding Intersect (Administrator)": "text-rose-400",
};

const BUCKET_BG_COLORS: Record<string, string> = {
  "Core Budget": "bg-blue-500/15",
  "Research Budget": "bg-violet-500/15",
  "Governance Support Budget": "bg-amber-500/15",
  "Growth & Marketing Budget": "bg-emerald-500/15",
  "Innovation Budget": "bg-cyan-500/15",
  "Funding Intersect (Administrator)": "bg-rose-500/15",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BudgetPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"name" | "ada_amount" | "vendor">(
    "ada_amount"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  /* derived data */
  const proposals = treasuryData.proposals as Proposal[];
  const meta = treasuryData.meta;
  const vendor = treasuryData.summary_by_vendor;
  const scf = treasuryData.smart_contract_framework;
  const voting = treasuryData.voting_data;
  const buckets = budgetData.buckets;
  const totalBudget = budgetData.total_proposed_ada;

  const passed = proposals.filter((p) => p.vote_result === "passed");
  const expired = proposals.filter((p) => p.vote_result === "expired");

  /* CF abstention proposals */
  const cfAbstentions = proposals.filter((p) => p.cf_drep_vote === "abstain");
  const cfAbstainedExpired = cfAbstentions.filter(
    (p) => p.vote_result === "expired"
  );
  const cfAbstainedPassed = cfAbstentions.filter(
    (p) => p.vote_result === "passed"
  );

  /* filtering */
  const filteredProposals = useMemo(() => {
    let list = [...proposals];
    switch (filter) {
      case "passed":
        list = list.filter((p) => p.vote_result === "passed");
        break;
      case "expired":
        list = list.filter((p) => p.vote_result === "expired");
        break;
      case "iog":
        list = list.filter((p) =>
          p.vendor.toLowerCase().includes("input output")
        );
        break;
      case "amount_known":
        list = list.filter((p) => p.ada_amount !== null);
        break;
    }
    /* sorting */
    list.sort((a, b) => {
      if (sortField === "ada_amount") {
        const av = a.ada_amount ?? 0;
        const bv = b.ada_amount ?? 0;
        return sortDir === "desc" ? bv - av : av - bv;
      }
      const av = (a as Record<string, unknown>)[sortField] as string;
      const bv = (b as Record<string, unknown>)[sortField] as string;
      return sortDir === "desc"
        ? (bv ?? "").localeCompare(av ?? "")
        : (av ?? "").localeCompare(bv ?? "");
    });
    return list;
  }, [filter, sortField, sortDir, proposals]);

  function toggleSort(field: "name" | "ada_amount" | "vendor") {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sortArrow = (field: string) =>
    sortField === field ? (sortDir === "desc" ? " \u2193" : " \u2191") : "";

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
      {/* ---- Breadcrumb ---- */}
      <nav className="mb-8 text-xs uppercase tracking-[0.3em] text-white/40">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/60">Budget Analysis</span>
      </nav>

      {/* ============================================================ */}
      {/*  SECTION 1 — Hero stats bar                                  */}
      {/* ============================================================ */}
      <section className="grid gap-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            2025 Cardano Treasury
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            Budget Analysis
          </h1>
          <p className="max-w-3xl text-base text-white/50">
            39 on-chain proposals. ₳263.6M approved.{" "}
            <span className="text-rose-400">
              49.3% to a single entity family.
            </span>{" "}
            Per-vendor granularity was limited during budget drafting but on-chain proposals required exact amounts. This page breaks down every
            allocation we can trace.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Total Budget",
              value: `₳${fmt(totalBudget)}`,
              sub: "Approved by DReps",
            },
            {
              label: "Proposals",
              value: "39",
              sub: `${passed.length} passed · ${expired.length} expired`,
            },
            {
              label: "IOG Share",
              value: `₳${fmt(vendor.IOG_family.total_ada)}`,
              sub: `${vendor.IOG_family.pct_of_budget}% of total`,
              highlight: true,
            },
            {
              label: "Treasury Balance",
              value: "~₳1.7B",
              sub: "Remaining in reserve",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border px-5 py-4 ${
                stat.highlight
                  ? "border-rose-500/30 bg-rose-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  stat.highlight ? "text-rose-300" : "text-white"
                }`}
              >
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 2 — Budget allocation by committee                  */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="allocation">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Allocation Breakdown
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            ₳263.6M across 6 buckets
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            How the total budget is distributed across committees and budget
            categories. Data from the Intersect Budget Committee proposal.
          </p>
        </div>

        {/* Stacked bar */}
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          {/* Visual bar */}
          <div className="flex h-10 w-full overflow-hidden rounded-full">
            {buckets.map((b) => {
              const pct = (b.ada_amount / totalBudget) * 100;
              return (
                <div
                  key={b.name}
                  className={`${BUCKET_COLORS[b.name] ?? "bg-gray-500"} relative transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${b.name}: ₳${fmt(b.ada_amount)} (${pct.toFixed(1)}%)`}
                >
                  {pct > 8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white/90">
                      {pct.toFixed(0)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend + detail cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buckets.map((b) => {
              const pct = ((b.ada_amount / totalBudget) * 100).toFixed(1);
              return (
                <div
                  key={b.name}
                  className={`rounded-2xl border border-white/10 ${BUCKET_BG_COLORS[b.name] ?? "bg-white/5"} p-4`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium ${BUCKET_TEXT_COLORS[b.name] ?? "text-white"}`}
                    >
                      {b.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-white/40">
                      {pct}%
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    ₳{fmt(b.ada_amount)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {b.description}
                  </p>
                  {/* Committee breakdown */}
                  <div className="mt-3 space-y-1.5">
                    {b.committees.map((c) => (
                      <div
                        key={c.committee}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="text-white/50">{c.committee}</span>
                        <span className="font-medium text-white/70">
                          ₳{fmt(c.ada_amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Treasury Flow Diagram                                       */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="flow">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Treasury Flow</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">How the money flows</h2>
          <p className="mt-2 text-sm text-white/50">
            Sankey diagram showing the flow from Cardano Treasury through budget buckets to committees.
          </p>
        </div>
        <BudgetSankey year="2025" />
      </section>

      {/* ============================================================ */}
      {/*  SECTION 3 — Vendor concentration                            */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="vendors">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Vendor Concentration
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Who gets the money?
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            Of ₳263.6M approved, on-chain proposals specify exact ADA amounts per CIP-1694.
            However, detailed cost breakdowns within large omnibus proposals (especially IOG's) remain limited.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          {/* Concentration bar */}
          <div className="flex h-12 w-full overflow-hidden rounded-full">
            <div
              className="flex items-center justify-center bg-rose-500"
              style={{ width: "49.3%" }}
            >
              <span className="text-[11px] font-semibold text-white">
                IOG 49.3%
              </span>
            </div>
            <div
              className="flex items-center justify-center bg-amber-500"
              style={{ width: "7.6%" }}
            />
            <div
              className="flex items-center justify-center bg-emerald-500"
              style={{ width: "2.2%" }}
            />
            <div
              className="flex items-center justify-center bg-white/20"
              style={{ width: "40.9%" }}
            >
              <span className="text-[11px] font-medium text-white/70">
                Other vendors (limited detail)
              </span>
            </div>
          </div>

          {/* Vendor cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* IOG */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rose-300/60">
                IOG Family
              </p>
              <p className="mt-1 text-2xl font-semibold text-rose-300">
                ₳{fmt(vendor.IOG_family.total_ada)}
              </p>
              <p className="mt-0.5 text-sm text-white/50">
                {vendor.IOG_family.pct_of_budget}% of total budget
              </p>
              <p className="mt-2 text-[11px] text-white/40">
                5 confirmed proposals: Core Dev, Catalyst, Research, Catalyst
                Tech Stack, Blockfrost
              </p>
              <div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2">
                <p className="text-[11px] font-medium text-rose-300">
                  Nearly half the treasury goes to one entity family
                </p>
              </div>
            </div>

            {/* Intersect MBO */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/60">
                Intersect MBO
              </p>
              <p className="mt-1 text-2xl font-semibold text-amber-300">
                ₳{fmt(vendor.Intersect_MBO.total_ada)}
              </p>
              <p className="mt-0.5 text-sm text-white/50">
                {vendor.Intersect_MBO.pct_of_budget}% of total budget
              </p>
              <p className="mt-2 text-[11px] text-white/40">
                Treasury administrator operational costs, staff, capabilities
              </p>
            </div>

            {/* OSC */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/60">
                Open Source Committee
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">
                ₳{fmt(vendor.OSC.total_ada)}
              </p>
              <p className="mt-0.5 text-sm text-white/50">
                {vendor.OSC.pct_of_budget}% of total budget
              </p>
              <p className="mt-2 text-[11px] text-white/40">
                Maintainer retainers, bounties, dev advocates, incident
                monitoring
              </p>
            </div>

            {/* Remaining */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                28 Other Vendors
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                ₳{fmt(vendor.remaining_vendors.total_ada)}
              </p>
              <p className="mt-0.5 text-sm text-white/50">
                {vendor.remaining_vendors.pct_of_budget}% of total budget
              </p>
              <p className="mt-2 text-[11px] text-white/40">
                Individual amounts for most non-IOG vendors not yet publicly
                disclosed
              </p>
              <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
                <p className="text-[11px] font-medium text-amber-300">
                  Amounts not disclosed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 4 — Treasury proposals table                        */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="proposals">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Treasury Proposals
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            All 39 on-chain proposals
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            Click column headers to sort. Click a row to expand transparency
            notes. Filter by status, vendor, or disclosure.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All (39)"],
              ["passed", `Passed (${passed.length})`],
              ["expired", `Expired (${expired.length})`],
              ["iog", "IOG"],
              ["amount_known", "Amount Known"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                filter === key
                  ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[28px] border border-white/10 bg-white/5">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-white/40">
                <th
                  className="cursor-pointer px-5 py-4 transition hover:text-white/70"
                  onClick={() => toggleSort("name")}
                >
                  Name{sortArrow("name")}
                </th>
                <th
                  className="cursor-pointer px-5 py-4 transition hover:text-white/70"
                  onClick={() => toggleSort("vendor")}
                >
                  Vendor{sortArrow("vendor")}
                </th>
                <th
                  className="cursor-pointer px-5 py-4 text-right transition hover:text-white/70"
                  onClick={() => toggleSort("ada_amount")}
                >
                  Amount (₳){sortArrow("ada_amount")}
                </th>
                <th className="px-5 py-4">Vote</th>
                <th className="px-5 py-4">CF DRep</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((p) => {
                const isExpired = p.vote_result === "expired";
                const isExpanded = expandedRow === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`cursor-pointer border-b border-white/5 transition ${
                      isExpired
                        ? "bg-rose-500/5 hover:bg-rose-500/10"
                        : "hover:bg-white/5"
                    }`}
                    onClick={() =>
                      setExpandedRow(isExpanded ? null : p.id)
                    }
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p
                          className={`text-sm ${isExpired ? "text-rose-300/80" : "text-white/80"}`}
                        >
                          {p.name}
                        </p>
                        {isExpanded && p.transparency_notes && (
                          <div className="mt-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/50">
                            {p.transparency_notes}
                          </div>
                        )}
                        {isExpanded && p.description && (
                          <p className="mt-1 text-[11px] text-white/30">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/50">
                      <span className="text-[11px]">{p.vendor}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-sm">
                      {p.ada_amount ? (
                        <span className="text-white">
                          ₳{fmtFull(p.ada_amount)}
                        </span>
                      ) : (
                        <span className="text-white/30">undisclosed</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          isExpired
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {p.vote_result}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-medium ${
                          p.cf_drep_vote === "yes"
                            ? "text-emerald-400"
                            : p.cf_drep_vote === "abstain"
                              ? "text-amber-400"
                              : "text-white/30"
                        }`}
                      >
                        {p.cf_drep_vote}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] ${
                          p.status === "contracted"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {p.status === "contracted"
                          ? "contracted"
                          : "not funded"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-white/30">
          Showing {filteredProposals.length} of {proposals.length} proposals.
          Click any row to see transparency notes and description.
        </p>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 5 — Smart contract framework                        */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="contracts">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Disbursement Framework
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Sundae Labs Treasury Contracts
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            Treasury withdrawals flow through a smart contract framework built by
            Sundae Labs with multi-sig oversight.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Treasury contract */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-blue-400">
                Treasury Contract
              </p>
              <p className="mt-2 text-sm text-white/50">
                {scf.treasury_contract.allowed_actions.length} allowed actions.
                Reserve accounts hold funds before vendor disbursement.
              </p>
              <div className="mt-3 space-y-1.5">
                {scf.treasury_contract.allowed_actions.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 text-[11px] text-white/50"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/40">
                <span className="font-medium text-white/60">Prohibited:</span>{" "}
                {scf.treasury_contract.prohibited.join(", ")}
              </div>
            </div>

            {/* Vendor contract */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-violet-400">
                Vendor Contract
              </p>
              <p className="mt-2 text-sm text-white/50">
                Escrow-based. Funds tied to milestones. Unclaimed balances time
                out back to Treasury.
              </p>
              <div className="mt-3 space-y-1.5">
                {scf.vendor_contract.allowed_actions.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 text-[11px] text-white/50"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-white/40">
                <span className="font-medium text-white/60">Fields:</span>{" "}
                {scf.vendor_contract.fields.join(", ")}
              </div>
            </div>
          </div>

          {/* Oversight committee */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400">
              Oversight Committee (5 members)
            </p>
            <p className="mt-2 text-sm text-white/50">
              {scf.oversight_committee.role}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {scf.oversight_committee.members.map((m) => {
                const isSundae = m === "Sundae Labs";
                return (
                  <span
                    key={m}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                      isSundae
                        ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {m}
                    {isSundae && " *"}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <p className="text-sm font-medium text-rose-300">
                Dual Role Conflict
              </p>
              <p className="mt-1 text-[11px] text-white/50">
                Sundae Labs built the treasury smart contracts AND sits on the
                Oversight Committee that verifies contract actions. No single
                entity can modify contracts unilaterally, but the dual role
                creates an inherent conflict of interest flagged by community
                DReps.
              </p>
            </div>
          </div>

          {/* Public dashboards */}
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Public Dashboards
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {scf.public_dashboards.map((d) => (
                <a
                  key={d.name}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/50 transition hover:border-white/30 hover:text-white"
                >
                  {d.name} &rarr;
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SECTION 6 — CF DRep voting pattern                          */}
      {/* ============================================================ */}
      <section className="mt-16 grid gap-6" id="cf-voting">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            CF DRep Voting Pattern
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Abstentions and expired proposals
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            The Cardano Foundation DRep abstained on {cfAbstentions.length}{" "}
            proposals. {cfAbstainedExpired.length} of those expired without
            reaching the 67% threshold.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <p className="text-2xl font-semibold text-amber-300">
                {cfAbstentions.length}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                CF Abstentions
              </p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
              <p className="text-2xl font-semibold text-rose-300">
                {cfAbstainedExpired.length}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                Abstained + Expired
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
              <p className="text-2xl font-semibold text-emerald-300">
                {cfAbstainedPassed.length}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                Abstained + Passed
              </p>
            </div>
          </div>

          {/* Abstention list */}
          <div className="mt-6 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Proposals where CF DRep abstained
            </p>
            {cfAbstentions.map((p) => {
              const isExpired = p.vote_result === "expired";
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    isExpired
                      ? "border-rose-500/20 bg-rose-500/5"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${isExpired ? "text-rose-300/80" : "text-white/70"}`}
                    >
                      {p.name}
                    </p>
                    <p className="text-[11px] text-white/40">{p.vendor}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        isExpired
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {p.vote_result}
                    </span>
                    <span className="text-[11px] font-medium text-amber-400">
                      abstain
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correlation note */}
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <p className="text-sm font-medium text-amber-300">
              Correlation: CF Abstention and Proposal Expiry
            </p>
            <p className="mt-1 text-[11px] text-white/50">
              Of the {expired.length} proposals that expired,{" "}
              {cfAbstainedExpired.length} had the CF DRep abstaining — citing
              procedural gaps, unmet evaluation criteria, or lack of strategic
              clarity. While abstention is not a &ldquo;no&rdquo; vote, the CF
              DRep carries significant delegated stake, and abstaining
              effectively withholds that weight from the 67% supermajority
              threshold.
            </p>
          </div>

          {/* All 6 expired proposals */}
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              All expired proposals
            </p>
            <div className="mt-2 space-y-2">
              {expired.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-rose-500/15 bg-rose-500/5 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-rose-300/80">{p.name}</p>
                    <p className="text-[11px] text-white/40">{p.vendor}</p>
                    {p.transparency_notes && (
                      <p className="mt-1 text-[11px] text-white/30">
                        {p.transparency_notes}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-amber-400">
                    CF: {p.cf_drep_vote}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-white/30">
            Voting threshold: {meta.voting_threshold}. Epoch deadline:{" "}
            {meta.epoch_deadline} ({meta.epoch_deadline_date}).
          </p>
        </div>
      </section>

      {/* ---- Back to home ---- */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/50 transition hover:border-white/30 hover:text-white"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
