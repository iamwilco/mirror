import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operational Audit — Intersect Mirror",
  description:
    "Documented structural and operational problems at Intersect MBO — sourced from their own publications, meeting minutes, and reports.",
};

/* ------------------------------------------------------------------ */
/*  Tiny helper components (server-only, no state)                     */
/* ------------------------------------------------------------------ */

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: "rose" | "amber" | "emerald" | "violet";
}) {
  const ring: Record<string, string> = {
    rose: "border-rose-500/30",
    amber: "border-amber-500/30",
    emerald: "border-emerald-500/30",
    violet: "border-violet-500/30",
  };
  const val: Record<string, string> = {
    rose: "text-rose-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
    violet: "text-violet-300",
  };
  return (
    <div
      className={`rounded-2xl border bg-white/5 p-5 ${ring[color]}`}
    >
      <p className={`text-2xl font-bold ${val[color]}`}>{value}</p>
      <p className="mt-1 text-sm text-white/50">{label}</p>
    </div>
  );
}

function SectionShell({
  id,
  number,
  title,
  color,
  children,
}: {
  id: string;
  number: number;
  title: string;
  color: "rose" | "amber" | "violet";
  children: React.ReactNode;
}) {
  const border: Record<string, string> = {
    rose: "border-rose-500/25",
    amber: "border-amber-500/25",
    violet: "border-violet-500/25",
  };
  const numColor: Record<string, string> = {
    rose: "text-rose-400/60",
    amber: "text-amber-400/60",
    violet: "text-violet-400/60",
  };
  return (
    <section
      id={id}
      className={`rounded-[28px] border bg-black/20 p-6 md:p-8 ${border[color]}`}
    >
      <p
        className={`text-xs uppercase tracking-[0.3em] ${numColor[color]}`}
      >
        Finding {number}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">
        {title}
      </h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-relaxed text-white/40">
      <span className="font-semibold uppercase tracking-wider text-white/50">
        Source:
      </span>{" "}
      {children}
    </p>
  );
}

function FindingCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-2 space-y-2 text-sm text-white/50">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Structural findings table row type                                 */
/* ------------------------------------------------------------------ */

interface Finding {
  problem: string;
  status: string;
  evidence: string;
}

const KEY_FINDINGS: Finding[] = [
  {
    problem: "No committee KPIs until 2026",
    status: "Confirmed by Intersect",
    evidence: "Fact",
  },
  {
    problem: "5/10 committees have no public meeting records",
    status: "Confirmed by audit",
    evidence: "Fact",
  },
  {
    problem: "Election turnout declining (27% \u2192 19.4%)",
    status: "Official data",
    evidence: "Fact",
  },
  {
    problem: "Budget process pivoted 3 times in 2025",
    status: "ISC member account + Intersect admission",
    evidence: "Fact",
  },
  {
    problem: "No public org chart or full staff roster",
    status: "Verified on team page",
    evidence: "Fact",
  },
  {
    problem: 'Committee role limited to "validate, not recommend"',
    status: "Meeting minutes",
    evidence: "Fact",
  },
  {
    problem: "75.5M ADA community hubs with no published metrics",
    status: "Budget docs",
    evidence: "Fact",
  },
  {
    problem: "Staff design processes; committees operate within them",
    status: "Board/committee minutes",
    evidence: "Fact",
  },
  {
    problem:
      'IOG argued TSC "has no constitutional authority" for budgets',
    status: "IOG published position",
    evidence: "Fact",
  },
  {
    problem: "CC resignation caused governance shutdown",
    status: "Widely reported",
    evidence: "Fact",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OperationsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Intersect MBO
        </p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          Operational Audit
        </h1>
        <p className="max-w-3xl text-lg text-white/50">
          Documented structural and operational problems — from
          Intersect&apos;s own publications
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-white/40">
          This page catalogues specific operational failures, structural
          gaps, and governance weaknesses found in Intersect&apos;s own
          meeting minutes, reports, and documentation. Every finding is
          sourced. No assumptions.
        </p>
      </header>

      {/* ── Summary Stats ────────────────────────────────── */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          value="0 committee KPIs"
          label="No measurable deliverables existed until 2026"
          color="rose"
        />
        <StatCard
          value="5 of 10"
          label="Committees have no public meeting archives"
          color="rose"
        />
        <StatCard
          value="19.4%"
          label="Election turnout — down from 27% six months earlier"
          color="amber"
        />
        <StatCard
          value="&#x20B3;75.5M"
          label="Community hub budget with no published effectiveness metrics"
          color="rose"
        />
      </section>

      {/* ── Sections ─────────────────────────────────────── */}
      <div className="mt-14 space-y-10">
        {/* ── 1. Committees Have Responsibility Without Authority ── */}
        <SectionShell
          id="authority"
          number={1}
          title="Committees Have Responsibility Without Authority"
          color="rose"
        >
          <blockquote className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-6 py-5">
            <p className="text-lg font-medium leading-relaxed text-rose-200 md:text-xl">
              &ldquo;Committees can only validate legitimacy, not recommend
              or reject.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-rose-300/60">
              — Lawrence Clark, Budget Committee Minutes, Mar 3, 2025
            </footer>
          </blockquote>

          <p className="text-sm leading-relaxed text-white/50">
            Committees are given massive budgets to &ldquo;oversee&rdquo;
            but per Intersect&apos;s own documentation, they &ldquo;provide
            specialized guidance and advice&rdquo; — they do not govern.
            They cannot approve spending, hire/fire, or veto board
            decisions. They are a review layer with no enforcement power.
          </p>

          <Source>
            Budget Committee Minutes, Mar 3, 2025;{" "}
            <span className="text-white/50">
              Committee Guiding Principles
            </span>{" "}
            (committees.docs.intersectmbo.org)
          </Source>
        </SectionShell>

        {/* ── 2. No KPIs, No Accountability, No Consequences ── */}
        <SectionShell
          id="kpis"
          number={2}
          title="No KPIs, No Accountability, No Consequences"
          color="amber"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FindingCard title="No committee KPIs until 2026">
              <p>
                &ldquo;Increased transparency through public roadmaps and
                quarterly KPIs&rdquo; announced for 2026, implicitly
                admitting these didn&apos;t exist before.
              </p>
              <Source>
                intersectmbo.org/news/welcome-to-2026-intersect-and-the-path-ahead
              </Source>
            </FindingCard>

            <FindingCard title="No documented case of removal for non-performance">
              <p>
                The bylaws allow the board to dissolve committees, but no
                evidence this power has been used.
              </p>
              <Source>Intersect Bylaws</Source>
            </FindingCard>

            <FindingCard title="No standardized meeting cadence">
              <p>
                Each committee self-organizes. Budget Committee met weekly.
                Others&apos; schedules are unknown publicly.
              </p>
              <Source>Committee docs audit</Source>
            </FindingCard>

            <FindingCard title="One-year terms too short">
              <p>
                Intersect admitted members couldn&apos;t &ldquo;fully
                onboard, meaningfully contribute, and see strategic
                initiatives through to completion.&rdquo; Caused
                &ldquo;reduced participation, increased confusion, and
                added operational complexity.&rdquo;
              </p>
              <Source>
                intersectmbo.org/news/intersect-committee-term-evolution
              </Source>
            </FindingCard>
          </div>
        </SectionShell>

        {/* ── 3. Staff Run the Show, Committees React ── */}
        <SectionShell
          id="staff-power"
          number={3}
          title="Staff Run the Show, Committees React"
          color="violet"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FindingCard title="Staff designed the decision-making framework">
              <p>
                Presented to committees, not designed by them. Staff set
                agendas and prepare materials.
              </p>
              <Source>ISC/Board Meeting Notes, June 2024</Source>
            </FindingCard>

            <FindingCard title="Committee members lost tool access">
              <p>
                Budget Committee members lost access to ClickUp (project
                management tool) and had to ask staff to restore
                &ldquo;guest&rdquo; permissions.
              </p>
              <Source>Budget Committee Minutes, Apr 18, 2025</Source>
            </FindingCard>

            <FindingCard title="Civics Committee Chair and Secretary were IOG employees">
              <p>
                Raising questions about committee independence from founding
                entities.
              </p>
              <Source>Board Meeting Notes, June 2024</Source>
            </FindingCard>

            <FindingCard title='Intersect "not qualified for technical audits"'>
              <p>
                The committee overseeing &#x20B3;99M in technical spending
                cannot verify the work was done correctly.
              </p>
              <Source>Budget Committee Minutes, Mar 3, 2025</Source>
            </FindingCard>
          </div>
        </SectionShell>

        {/* ── 4. 2025 Budget Process — Documented Failures ── */}
        <SectionShell
          id="budget-failures"
          number={4}
          title="2025 Budget Process — Documented Failures"
          color="rose"
        >
          {/* Self-admitted failures */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Failures Intersect Admitted
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              From &ldquo;Building a 2026 Ecosystem Budget&rdquo; (March
              2026)
            </p>
            <ol className="mt-4 space-y-2 text-sm text-white/50">
              {[
                "No clearly defined process at the outset",
                "Proposals submitted in inconsistent formats",
                "Difficulty comparing initiatives objectively",
                'Heavy review workload causing "DRep fatigue"',
                "Limited linkage between funding and strategy",
                "Misalignment between off-chain review and on-chain thresholds",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[11px] font-bold text-rose-300">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <Source>
                intersectmbo.org/news/building-a-2026-ecosystem-budget-for-cardano
              </Source>
            </div>
          </div>

          {/* Internal tensions */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Internal Tensions From Meeting Minutes
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>
                  <strong className="text-white/70">6-3 vote split</strong>{" "}
                  on the DRep-centric process (Mar 3, 2025)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>
                  Members reported{" "}
                  <strong className="text-white/70">
                    &ldquo;feeling on the outside,&rdquo;
                  </strong>{" "}
                  learning decisions after the fact
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>
                  Japanese DReps were{" "}
                  <strong className="text-white/70">
                    &ldquo;largely unaware&rdquo;
                  </strong>{" "}
                  of the process
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>
                  Lido Nation (ISC member Stephanie King) documented{" "}
                  <strong className="text-white/70">
                    3 process pivots
                  </strong>{" "}
                  and described it as &ldquo;disorienting, frustrating, and
                  fraught with missteps&rdquo;
                </span>
              </li>
            </ul>
            <div className="mt-4">
              <Source>
                Budget Committee meeting minutes; lidonation.com
              </Source>
            </div>
          </div>
        </SectionShell>

        {/* ── 5. Massive Budgets, Zero Metrics ── */}
        <SectionShell
          id="budget-metrics"
          number={5}
          title="Massive Budgets, Zero Metrics"
          color="rose"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-lg font-semibold text-rose-200">
                Community Hubs — &#x20B3;75.5M with no metrics
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                The MCC oversees &#x20B3;75.5M for community hubs — the
                single largest line item after IOG core development. No
                published effectiveness metrics, no member growth data per
                hub, no ROI analysis. Intersect moved to &ldquo;abolish
                uniform fixed rewards&rdquo; — implying the old model was
                ineffective.
              </p>
              <div className="mt-4">
                <Source>
                  committees.docs.intersectmbo.org (Innovation Budget)
                </Source>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-lg font-semibold text-rose-200">
                Growth &amp; Marketing — &#x20B3;20.4M invisible
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                The GMC has no public meeting recordings or minutes. Their
                decision-making is invisible to members. The AMM report
                admitted they&apos;re pivoting to &ldquo;a more structured
                approach&rdquo; — acknowledging the prior one was
                unstructured.
              </p>
              <div className="mt-4">
                <Source>Intersect AMM 2025 Report</Source>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ── 6. Declining Engagement ── */}
        <SectionShell
          id="engagement"
          number={6}
          title="Declining Engagement"
          color="amber"
        >
          {/* Turnout table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-white/40">
                  <th className="pb-3 pr-4 font-medium">Election</th>
                  <th className="pb-3 pr-4 font-medium">Eligible</th>
                  <th className="pb-3 pr-4 font-medium">Voted</th>
                  <th className="pb-3 font-medium">Turnout</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white/70">April 2025</td>
                  <td className="py-3 pr-4">~1,930</td>
                  <td className="py-3 pr-4">522</td>
                  <td className="py-3 font-semibold text-amber-300">27%</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-white/70">October 2025</td>
                  <td className="py-3 pr-4">1,510</td>
                  <td className="py-3 pr-4">293</td>
                  <td className="py-3 font-semibold text-rose-300">
                    19.4%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm leading-relaxed text-white/50">
            Turnout dropped 7.6 points in 6 months. Committee stipends are
            500 ADA/month (~$200 USD) for effectively part-time governance
            roles. Regional communities faced &ldquo;inconsistent
            messaging, limited resources, fragmented efforts, and
            duplication of work&rdquo; per Intersect&apos;s own AMM report.
          </p>

          <Source>
            Official election results; Intersect AMM 2025 Report
          </Source>
        </SectionShell>

        {/* ── 7. Constitutional Crisis Already Happened ── */}
        <SectionShell
          id="constitutional-crisis"
          number={7}
          title="Constitutional Crisis Already Happened"
          color="rose"
        >
          <div className="space-y-4">
            {[
              {
                date: "Nov 25, 2025",
                text: "Cardano Atlantic Council resigns from Constitutional Committee over compensation",
              },
              {
                date: "Nov 2025",
                text: "CC drops below 7-member minimum — first governance shutdown in Cardano history",
              },
              {
                date: "Dec 15, 2025",
                text: "Snap election — Cardano Curia elected to restore quorum",
              },
              {
                date: "March 2026",
                text: "Eastern Cardano Council determines there is no active Net Change Limit — constitutional ambiguity about whether treasury withdrawals are valid",
              },
            ].map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[11px] font-bold text-rose-300">
                    {i + 1}
                  </span>
                  {i < 3 && (
                    <span className="mt-1 h-full w-px bg-rose-500/20" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-300/60">
                    {event.date}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{event.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Source>
            intersectmbo.org; forum.cardano.org
          </Source>
        </SectionShell>

        {/* ── 8. Key Structural Findings — Summary Table ── */}
        <section
          id="summary"
          className="rounded-[28px] border border-white/10 bg-black/20 p-6 md:p-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Summary
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">
            Key Structural Findings
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-white/40">
                  <th className="pb-3 pr-4 font-medium">Problem</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {KEY_FINDINGS.map((f, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-3 pr-4 text-white/70">
                      {f.problem}
                    </td>
                    <td className="py-3 pr-4 text-white/50">{f.status}</td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-300">
                        {f.evidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Footer Note ────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
          <p className="text-sm leading-relaxed text-white/50">
            All findings on this page are sourced from Intersect&apos;s own
            publications, meeting minutes, bylaws, and official reports.
            Community analysis (Lido Nation, CExplorer, Eastern Cardano
            Council) is clearly attributed. This page will be updated as
            new information becomes available.
          </p>
        </div>
      </div>

      {/* ── Back link ────────────────────────────────────── */}
      <div className="mt-12">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white"
        >
          &larr; Back to dashboard
        </Link>
      </div>
    </main>
  );
}
