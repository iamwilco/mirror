"use client";

import { useMemo } from "react";
import Link from "next/link";
import electionData from "@/data/elections-2025.json";

/* ── Types ──────────────────────────────────────────── */
interface Candidate {
  name: string;
  votes: number;
  elected: boolean;
  bio: string;
}

interface CommitteeResult {
  committee: string;
  seats_elected: number;
  candidates: Candidate[];
}

/* ── Constants ──────────────────────────────────────── */
const meta = electionData.meta;
const election = electionData.election;
const results: CommitteeResult[] = electionData.results;

/* ── Helpers ────────────────────────────────────────── */
function shortCommittee(name: string) {
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : name;
}

export default function ElectionsPage() {
  /* ── Cross-committee analysis ──────────────────── */
  const multiSeatMembers = useMemo(() => {
    const seatMap = new Map<string, string[]>();
    for (const r of results) {
      for (const c of r.candidates) {
        if (!c.elected) continue;
        const key = c.name.replace(/\s*\(.*?\)\s*/, "").trim();
        const existing = seatMap.get(key) ?? [];
        existing.push(shortCommittee(r.committee));
        seatMap.set(key, existing);
      }
    }
    return Array.from(seatMap.entries())
      .filter(([, committees]) => committees.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
  }, []);

  const topVoteGetters = useMemo(() => {
    const all: { name: string; votes: number; committee: string }[] = [];
    for (const r of results) {
      for (const c of r.candidates) {
        if (!c.elected) continue;
        all.push({
          name: c.name,
          votes: c.votes,
          committee: shortCommittee(r.committee),
        });
      }
    }
    return all.sort((a, b) => b.votes - a.votes).slice(0, 5);
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
      {/* ── Back link ────────────────────────────────── */}
      <Link
        href="/"
        className="text-xs uppercase tracking-[0.3em] text-white/40 transition hover:text-white/70"
      >
        &larr; Dashboard
      </Link>

      {/* ================================================================ */}
      {/* SECTION 1 — Election Overview Hero                               */}
      {/* ================================================================ */}
      <section className="mt-8 grid gap-8" id="overview">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            2025 Committee Elections
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            Who governs Intersect?
          </h1>
          <p className="max-w-3xl text-base text-white/50 md:text-lg">
            {election.period}. Voting closed{" "}
            {new Date(election.voting_closed).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            , results announced{" "}
            {new Date(election.results_announced).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . {election.total_ballots_cast.toLocaleString()} ballots cast
            across 8 committees.
          </p>
        </div>

        {/* Hero stat cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Turnout — amber because 19.4% is dangerously low */}
          <div className="rounded-[28px] border border-amber-400/30 bg-amber-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
              Turnout
            </p>
            <p className="mt-2 text-4xl font-bold text-amber-200">
              {election.turnout_percent}%
            </p>
            <p className="mt-1 text-[11px] text-amber-300/50">
              {election.total_voters} of {election.eligible_voters.toLocaleString()} eligible
            </p>
          </div>

          {/* Voters */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Voters
            </p>
            <p className="mt-2 text-4xl font-bold text-white">
              {election.total_voters}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              / {election.eligible_voters.toLocaleString()} eligible members
            </p>
          </div>

          {/* Seats */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Seats Filled
            </p>
            <p className="mt-2 text-4xl font-bold text-white">
              {election.total_seats}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              across 8 committees
            </p>
          </div>

          {/* Candidates */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Candidates
            </p>
            <p className="mt-2 text-4xl font-bold text-white">
              {election.total_candidates}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              competed for {election.total_seats} seats
            </p>
          </div>
        </div>

        {/* Legitimacy concern banner */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-amber-300">&#9888;</span>
            <div>
              <p className="text-sm font-medium text-amber-200">
                Low turnout is a governance legitimacy concern
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-300/60">
                Only {election.turnout_percent}% of eligible members voted.
                These {election.total_voters} voters selected all{" "}
                {election.total_seats} committee members who now oversee
                budgets, technical direction, and organizational policy for
                the entire Cardano ecosystem. The remaining{" "}
                {(
                  election.eligible_voters - election.total_voters
                ).toLocaleString()}{" "}
                eligible members had no voice in these outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Audit note */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
            Independently Audited
          </p>
          <p className="mt-2 text-sm text-white/50">
            {meta.audit}.{" "}
            <a
              href={meta.audit_results_url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-300/70 underline transition hover:text-emerald-200"
            >
              View audit results
            </a>{" "}
            &middot;{" "}
            <a
              href={meta.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-white/40 underline transition hover:text-white/70"
            >
              Official results
            </a>
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2 — Results by Committee                                 */}
      {/* ================================================================ */}
      <section className="mt-20 grid gap-8" id="results">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Results by Committee
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Who Won, and By How Much
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            Bar lengths are proportional to the highest vote count within each
            committee. All elected candidates shown.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {results.map((committee) => {
            const maxVotes = Math.max(
              ...committee.candidates
                .filter((c) => c.elected)
                .map((c) => c.votes)
            );

            return (
              <div
                key={committee.committee}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                {/* Committee header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {committee.committee}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {committee.seats_elected} seat
                      {committee.seats_elected !== 1 ? "s" : ""} elected
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-300">
                    {committee.seats_elected} / {committee.seats_elected}
                  </span>
                </div>

                {/* Candidate bars */}
                <div className="mt-5 space-y-4">
                  {committee.candidates
                    .filter((c) => c.elected)
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate) => {
                      const pct = (candidate.votes / maxVotes) * 100;
                      return (
                        <div key={candidate.name}>
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-medium text-white">
                              {candidate.name}
                            </p>
                            <p className="shrink-0 text-sm font-semibold tabular-nums text-emerald-300">
                              {candidate.votes}
                            </p>
                          </div>
                          {/* Bar */}
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-emerald-500/70 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {/* Bio */}
                          <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                            {candidate.bio}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3 — Cross-Committee Insights                             */}
      {/* ================================================================ */}
      <section className="mt-20 grid gap-8" id="insights">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Cross-Committee Insights
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Overlap & Concentration
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-white/50">
            Some individuals serve on multiple committees, concentrating
            influence. This is not inherently wrong, but it should be visible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Multi-committee members */}
          <div className="rounded-[28px] border border-violet-400/20 bg-violet-500/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
              Multi-Committee Members
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              Individuals elected to 2 or more committees simultaneously
            </p>

            <div className="mt-5 space-y-4">
              {multiSeatMembers.map(([name, committees]) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
                >
                  <p className="text-sm font-medium text-white">{name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {committees.map((abbr) => (
                      <span
                        key={abbr}
                        className="rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-violet-300"
                      >
                        {abbr}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {multiSeatMembers.length === 0 && (
              <p className="mt-4 text-sm text-white/40">
                No members serve on multiple committees.
              </p>
            )}

            <p className="mt-5 text-[11px] leading-relaxed text-white/30">
              {multiSeatMembers.length} member
              {multiSeatMembers.length !== 1 ? "s" : ""} hold seats on more
              than one committee, occupying{" "}
              {multiSeatMembers.reduce(
                (sum, [, comms]) => sum + comms.length,
                0
              )}{" "}
              of {election.total_seats} total seats.
            </p>
          </div>

          {/* Top vote-getters */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Highest Vote Counts
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              Top 5 individual results across all committees
            </p>

            <div className="mt-5 space-y-3">
              {topVoteGetters.map((entry, i) => {
                const globalMax = topVoteGetters[0].votes;
                const pct = (entry.votes / globalMax) * 100;
                return (
                  <div key={`${entry.name}-${entry.committee}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold tabular-nums text-white/30">
                          #{i + 1}
                        </span>
                        <p className="text-sm font-medium text-white">
                          {entry.name}
                        </p>
                        <span className="text-[11px] uppercase tracking-[0.15em] text-white/30">
                          {entry.committee}
                        </span>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-emerald-300">
                        {entry.votes}
                      </p>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-emerald-500/50 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] leading-relaxed text-white/40">
                <span className="font-medium text-white/60">
                  Context:
                </span>{" "}
                Vote counts vary significantly by committee. The CBC
                attracted the highest single-candidate count (Nicolas Cerny,
                176 votes) while the OSC saw winning candidates with as few
                as 38 votes. This reflects different levels of member
                engagement per committee, not candidate quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4 — Upcoming 2026 Elections                              */}
      {/* ================================================================ */}
      <section className="mt-20" id="upcoming">
        <div className="rounded-[28px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Happening Now
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                  2026 Committee Elections
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                37 Seats Available
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/50">
                The 2026 Intersect committee elections are underway.
                Applications are open for all standing committees. For the
                first time, elected committee members will receive a service
                reward.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-6 py-5 text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Seats
              </p>
              <p className="mt-1 text-4xl font-bold text-emerald-300">37</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Applications Open
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                Mar 30, 2026
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Applications Close
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                Apr 17, 2026
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300/70">
                New: Service Reward
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-200">
                500 ADA / month
              </p>
              <p className="mt-1 text-[11px] text-emerald-300/40">
                Per committee member
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Source
              </p>
              <p className="mt-2 text-sm font-medium text-white/70">
                Intersect Update #101
              </p>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-white/30">
            Compiled {meta.compiled}. Source:{" "}
            <a
              href={meta.source_url}
              target="_blank"
              rel="noreferrer"
              className="underline transition hover:text-white/50"
            >
              {meta.source}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
