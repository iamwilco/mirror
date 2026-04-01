"use client";

import { useMemo } from "react";
import TransparencyMeter from "@/components/TransparencyMeter";
import Link from "next/link";
import inputData from "@/data/input.json";

export default function Home() {
  const stats = useMemo(() => {
    const people = inputData.people ?? [];
    const committees = inputData.committees ?? [];
    const workingGroups = inputData.working_groups ?? [];
    const relationships = inputData.relationships ?? [];
    const all = [
      ...people.map((p) => p.transparency),
      ...committees.map((c) => c.transparency),
      ...workingGroups.map((g) => g.transparency),
      ...relationships.map(() => "verified"),
    ];
    const verified = all.filter((t) => t === "verified").length;
    const total = all.length;
    const gaps = inputData.transparency_gaps?.length ?? 0;
    return { verified, total, gaps };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="grid gap-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Intersect MBO Transparency Index
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            How transparent<br className="hidden sm:block" /> is Intersect?
          </h1>
          <p className="max-w-2xl text-base text-white/50">
            Intersect is a Wyoming nonprofit that manages ₳263M+ in Cardano treasury funds,
            employs 31 people, and coordinates governance across 7 committees.
            This site tracks what they disclose and what they don&apos;t.
          </p>
        </div>
        <TransparencyMeter />
      </section>

      {/* ── At a Glance ───────────────────────────────── */}
      <section className="mt-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">At a Glance</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          The key numbers
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Budget */}
          <Link href="/budget" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">2025 Budget</p>
            <p className="mt-2 text-3xl font-bold text-white">₳263.6M</p>
            <p className="mt-2 text-sm text-white/50">
              39 proposals. <span className="text-amber-300">49.3% goes to IOG.</span> 28 vendors have undisclosed amounts.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See full breakdown &rarr;</p>
          </Link>

          {/* Power */}
          <Link href="/hierarchy" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Board of Directors</p>
            <p className="mt-2 text-3xl font-bold text-white">7 seats</p>
            <p className="mt-2 text-sm text-white/50">
              <span className="text-emerald-300">4 elected</span> by members.{" "}
              <span className="text-amber-300">3 appointed</span> by IOG, EMURGO, and UW.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See power map &rarr;</p>
          </Link>

          {/* People */}
          <Link href="/members" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Staff</p>
            <p className="mt-2 text-3xl font-bold text-white">31 employees</p>
            <p className="mt-2 text-sm text-white/50">
              Only ~12 named publicly. <span className="text-rose-300">Zero salaries disclosed.</span>
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See all people &rarr;</p>
          </Link>

          {/* Elections */}
          <Link href="/elections" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Election Turnout</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">~20%</p>
            <p className="mt-2 text-sm text-white/50">
              293 of 1,510 eligible members voted in the last committee election. 36 seats filled.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See election results &rarr;</p>
          </Link>

          {/* Committees */}
          <Link href="/governance" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Committees</p>
            <p className="mt-2 text-3xl font-bold text-white">7 standing</p>
            <p className="mt-2 text-sm text-white/50">
              All are <span className="text-sky-300">advisory only</span> — they cannot make binding decisions per the bylaws.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See governance details &rarr;</p>
          </Link>

          {/* History */}
          <Link href="/history" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Founded</p>
            <p className="mt-2 text-3xl font-bold text-white">July 2023</p>
            <p className="mt-2 text-sm text-white/50">
              Created by IOG, EMURGO, and Cardano Foundation. Founding entities held board majority for 2 years.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See full timeline &rarr;</p>
          </Link>
        </div>
      </section>

      {/* ── What's Missing ────────────────────────────── */}
      <section className="mt-14">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Transparency Gaps</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">What Intersect has not disclosed</h2>
        <p className="mt-2 text-sm text-white/40">
          These are facts, not speculation. These items have been requested by the community and remain undisclosed.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <GapCard
            title="No salary data — for anyone"
            description="Not a single salary, stipend, or compensation range has been disclosed for any board member, executive, staff member, or committee participant."
          />
          <GapCard
            title="No board meeting minutes — ever"
            description="The board of directors manages all corporate affairs but has never published meeting minutes, agendas, or vote records."
          />
          <GapCard
            title="19 of 31 staff unnamed"
            description="The team page lists 31 employees but only ~12 are publicly identified. The roles and responsibilities of the other 19 are unknown."
          />
          <GapCard
            title="28 vendor amounts undisclosed"
            description="Of 39 treasury proposals, only 4 have confirmed ADA amounts. The remaining 28 vendors' individual contract values are not public."
          />
          <GapCard
            title="Committee decisions are not binding"
            description="Despite being marketed as 'community-led,' committees can only recommend. The board can override or ignore any committee recommendation."
          />
          <GapCard
            title="ED hired without member input"
            description="Jack Briggs was appointed Executive Director by the board in Jan 2026. There was no member vote, and the hiring process was not disclosed."
          />
        </div>
      </section>

      {/* ── Methodology + CTA ─────────────────────────── */}
      <section className="mt-14">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-lg font-semibold text-white">How we work</h3>
              <p className="mt-2 text-sm text-white/50">
                Every claim on this site is sourced. We tag data as{" "}
                <strong className="text-emerald-300">verified</strong>,{" "}
                <strong className="text-amber-300">partial</strong>, or{" "}
                <strong className="text-rose-300">missing</strong>.
                We don&apos;t speculate or assign intent. We show what is public and flag what isn&apos;t.
              </p>
              <p className="mt-2 text-sm text-white/50">
                {stats.verified} of {stats.total} data points verified. {stats.gaps} gaps tracked.
                All data and code is open source.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/sources"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-center text-sm text-white/50 transition hover:border-white/30 hover:text-white"
              >
                View all sources
              </Link>
              <Link
                href="/contribute"
                className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-center text-sm text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Submit data or corrections
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function GapCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-5">
      <p className="font-medium text-rose-200">{title}</p>
      <p className="mt-2 text-sm text-white/40">{description}</p>
    </div>
  );
}
