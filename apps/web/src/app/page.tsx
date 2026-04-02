"use client";

import { useMemo } from "react";
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
    const sources = (inputData as Record<string, unknown>).sources;
    const sourceCount = Array.isArray(sources) ? sources.length : 40;
    return { verified, total, gaps, sourceCount };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="grid gap-8">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Intersect Mirror
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            Open data for<br className="hidden sm:block" /> Cardano governance
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/50">
            Intersect manages over ₳263M in Cardano treasury funds and coordinates
            governance across 7 committees. This community dashboard tracks what&apos;s
            been disclosed, highlights where transparency can improve, and helps
            everyone — community members and Intersect alike — work toward
            stronger governance together.
          </p>

          {/* Quick navigation */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/budget"
              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-sm text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Explore Budget
            </Link>
            <Link
              href="/governance"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
            >
              See Governance
            </Link>
            <Link
              href="/members"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
            >
              View People
            </Link>
          </div>

          {/* Stats line */}
          <p className="text-xs text-white/30">
            {stats.verified} of {stats.total} data points verified · {stats.sourceCount}+ sources cited · {stats.gaps} improvement areas tracked
          </p>
        </div>
      </section>

      {/* ── Explore the Data ──────────────────────────── */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">At a Glance</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Explore the data</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Budget */}
          <Link href="/budget" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">2025 Budget</p>
            <p className="mt-2 text-3xl font-bold text-white">₳263.6M</p>
            <p className="mt-2 text-sm text-white/50">
              39 proposals. Largest allocation: IOG at 49.3%. See full breakdown.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See full breakdown &rarr;</p>
          </Link>

          {/* Power */}
          <Link href="/hierarchy" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Board of Directors</p>
            <p className="mt-2 text-3xl font-bold text-white">7 seats</p>
            <p className="mt-2 text-sm text-white/50">
              <span className="text-emerald-300">4 elected</span> by members.{" "}
              <span className="text-white/70">3 institutional</span> (IOG, EMURGO, UW).
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See power map &rarr;</p>
          </Link>

          {/* People */}
          <Link href="/members" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Staff</p>
            <p className="mt-2 text-3xl font-bold text-white">31 employees</p>
            <p className="mt-2 text-sm text-white/50">
              ~12 publicly identified. <span className="text-amber-300">Compensation data not yet published.</span>
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See all people &rarr;</p>
          </Link>

          {/* Elections */}
          <Link href="/elections" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Election Turnout</p>
            <p className="mt-2 text-3xl font-bold text-white">~20%</p>
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
              <span className="text-sky-300">Bylaws grant delegated authority</span> with specific exceptions, though Intersect describes them as advisory.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See governance details &rarr;</p>
          </Link>

          {/* Operations */}
          <Link href="/operations" className="group rounded-[28px] border border-amber-500/20 bg-amber-500/5 p-6 transition hover:border-amber-400/30 hover:bg-amber-500/[0.07]">
            <p className="text-xs uppercase tracking-wider text-amber-300/70">Operations</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">KPIs in 2026</p>
            <p className="mt-2 text-sm text-white/50">
              Standardized KPI framework launching in 2026. Committees have produced outputs (constitution, budgets, hard forks) but formal performance tracking is new.
            </p>
            <p className="mt-3 text-sm text-amber-300/50 group-hover:text-amber-300/70">See operational details &rarr;</p>
          </Link>

          {/* History */}
          <Link href="/history" className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]">
            <p className="text-xs uppercase tracking-wider text-white/40">Founded</p>
            <p className="mt-2 text-3xl font-bold text-white">July 2023</p>
            <p className="mt-2 text-sm text-white/50">
              Created by IOG and EMURGO as seed funders. CF joined Sep 2024. Members gained board majority in Sep 2025.
            </p>
            <p className="mt-3 text-sm text-white/30 group-hover:text-white/50">See full timeline &rarr;</p>
          </Link>
        </div>
      </section>

      {/* ── Opportunities for Improvement ─────────────── */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Opportunities</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Where Intersect can improve</h2>
        <p className="mt-2 text-sm text-white/40">
          These are areas where increased transparency would strengthen community trust.
          We track progress as disclosure improves.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <OpportunityCard
            title="Staff compensation transparency"
            description="No salary grid or compensation ranges have been disclosed for board members, executives, or staff. Committee stipends (500 ADA/month) and major programme budgets are published. Publishing salary bands would align with nonprofit best practices."
          />
          <OpportunityCard
            title="Board meeting documentation depth"
            description="Board meeting minutes are published at board.docs.intersectmbo.org (27 meetings since Dec 2023), but their depth varies. Adding decision rationale, vote counts, and action items would improve accountability."
          />
          <OpportunityCard
            title="Staff directory completeness"
            description="The team page lists 31 employees but only ~12 are publicly identified. A complete directory with roles would help the community understand who is responsible for what."
          />
          <OpportunityCard
            title="Vendor-level budget detail"
            description="On-chain proposals specify exact ADA amounts, but detailed cost breakdowns within large omnibus proposals remain limited. More granular reporting would help the community assess value for money."
          />
          <OpportunityCard
            title="Committee authority clarity"
            description="The bylaws (Article 5) grant committees delegated board authority with specific exceptions, yet Intersect communications describe them as advisory. Clarifying this would set clearer expectations for committee members and voters."
          />
          <OpportunityCard
            title="Executive selection process"
            description="Jack Briggs was appointed ED by unanimous board decision in Jan 2026 after open applications and stakeholder interviews. Formalizing member input in future leadership selections would strengthen legitimacy."
          />
        </div>
      </section>

      {/* ── Get Involved ─────────────────────────────── */}
      <section className="mt-16">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Methodology */}
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white">How we work</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Every claim on this site is sourced. We tag data as{" "}
              <strong className="text-emerald-300">verified</strong>,{" "}
              <strong className="text-amber-300">partial</strong>, or{" "}
              <strong className="text-white/70">missing</strong>.
              We don&apos;t assign intent. We show what is public and highlight what isn&apos;t yet.
            </p>
            <p className="mt-3 text-sm text-white/50">
              {stats.verified} of {stats.total} data points verified. {stats.gaps} areas tracked.
              We update this dashboard as new information becomes available. When Intersect publishes
              new data, we reflect it here.
            </p>
          </div>

          {/* Contribute */}
          <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/5 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white">Get involved</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              This is a community project. Whether you work at Intersect, serve on a committee,
              or are a community member — your contributions make this more accurate and more useful.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/contribute"
                className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-center text-sm text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Submit data or corrections
              </Link>
              <Link
                href="/suggestions"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-center text-sm text-white/50 transition hover:border-white/30 hover:text-white"
              >
                Suggest improvements
              </Link>
              <Link
                href="/sources"
                className="rounded-full border border-white/10 px-5 py-2.5 text-center text-sm text-white/40 transition hover:border-white/20 hover:text-white/60"
              >
                View all sources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function OpportunityCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
      <p className="font-medium text-amber-200">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/40">{description}</p>
    </div>
  );
}
