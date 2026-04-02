import Link from "next/link";

/* ── Timeline data ───────────────────────────────────── */
interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  source: string;
  sourceUrl?: string;
  tag: "founding" | "growth" | "election" | "governance" | "incident" | "criticism";
}

const timeline: TimelineEvent[] = [
  {
    date: "July 13, 2023",
    title: "Intersect incorporated in Wyoming",
    description:
      "Intersect was incorporated as a Wyoming nonprofit corporation. It was created by IOG and EMURGO, who served as 'seed funders' and received appointed board seats. The Cardano Foundation was not a seed funder and joined Intersect as a member in September 2024 — over a year after incorporation.",
    source: "Intersect Bylaws, Wyoming Nonprofit Corporation Act",
    tag: "founding",
  },
  {
    date: "July 2023",
    title: "First grants launched",
    description:
      "Intersect launched its first governance tooling grants, offering up to 1.68 million ADA to support the development of governance infrastructure for the Cardano network. (Note: exact timing and amount sourced from IOG governance timeline; Intersect was newly incorporated at this time.)",
    source: "IOG governance timeline (unverified amount)",
    tag: "founding",
  },
  {
    date: "November 2023",
    title: "Early membership reaches ~630 members",
    description:
      "Four months after incorporation, Intersect had attracted approximately 630 members. Membership was open but awareness remained limited to governance-active community participants.",
    source: "EMURGO article on Intersect",
    tag: "growth",
  },
  {
    date: "July 12, 2024",
    title: "Official public launch",
    description:
      "Intersect formally opened to the broader Cardano community, marking its transition from a founding-entity initiative to a publicly accessible membership organization.",
    source: "intersectmbo.org",
    sourceUrl: "https://www.intersectmbo.org",
    tag: "growth",
  },
  {
    date: "September 2024",
    title: "Membership hits 3,133",
    description:
      "Membership grew to 3,133: 2,068 Associates (free tier), 830 Individual members ($10/year), and 31 Enterprise members ($1,000/year).",
    source: "Intersect Development Update",
    tag: "growth",
  },
  {
    date: "October 2024",
    title: "First full-scale elections",
    description:
      "Intersect held its first organization-wide elections. 140 candidates ran, 574 unique voters participated, and 7,244 votes were cast, with 37% voter participation. Kavinda Kariyapperuma and Adam Rusch became the first member-elected board members.",
    source: "intersectmbo.org",
    sourceUrl:
      "https://www.intersectmbo.org/news/celebrating-the-completion-of-intersects-first-ever-full-scale-elections",
    tag: "election",
  },
  {
    date: "December 2024",
    title: "Cardano Constitution ratified",
    description:
      "The Cardano Constitution was ratified at the Buenos Aires Constitutional Convention. This document defines the governance rules and principles for the Cardano blockchain.",
    source: "intersectmbo.org",
    sourceUrl: "https://www.intersectmbo.org/cardano-constitution",
    tag: "governance",
  },
  {
    date: "January 2025",
    title: "Plomin Hard Fork activates on-chain governance",
    description:
      "The Plomin Hard Fork went live, enabling full on-chain governance as described in CIP-1694. This means ADA holders can now vote directly on treasury withdrawals, protocol changes, and other governance actions through their delegated representatives (DReps).",
    source: "Cardano node release",
    tag: "governance",
  },
  {
    date: "February 2025",
    title: "Membership reaches 4,545",
    description:
      "Membership grew to 4,545: 2,712 Associates, 1,781 Individual members, and 49 Enterprise members. This represents 45% growth since September 2024.",
    source: "Intersect Development Update #50",
    tag: "growth",
  },
  {
    date: "April 2025",
    title: "First treasury withdrawal governance action approved",
    description:
      "The first treasury withdrawal governance action was approved through on-chain voting, marking the moment Cardano\u2019s governance system became fully operational.",
    source: "GovTool",
    tag: "governance",
  },
  {
    date: "July 2025",
    title: "2025 Budget approved (\u20B3263.6M)",
    description:
      "39 treasury withdrawal proposals were submitted to the chain. 37 passed and 2 expired without reaching the required thresholds. IOG received 49.3% (\u20B3130.1M) of the total approved budget, making it the largest single recipient.",
    source: "Sundae Treasury Portal, Intersect budget docs",
    tag: "governance",
  },
  {
    date: "Mid-2025",
    title: "Budget process criticized",
    description:
      "Community members and organizations criticized the budget process for its complexity and lack of transparency. Lido Nation described it as \"disorienting, frustrating, and fraught with missteps.\" Intersect later acknowledged these problems in a post titled \"Recalibrating Cardano\u2019s Budget Process: We\u2019ve Heard You.\"",
    source: "lidonation.com, intersectmbo.org",
    tag: "criticism",
  },
  {
    date: "September 2025",
    title: "Board elections expand to 7 seats",
    description:
      "For the first time, member-elected seats became the majority on the board (4 of 7). 20 candidates ran, but only 269 voters participated (22% turnout). Elected: Adam Rusch (187 votes), Kavinda Kariyapperuma (179), Mercy Fordwoo (143), and Rand McHenry (126).",
    source: "intersectmbo.org",
    sourceUrl:
      "https://www.intersectmbo.org/news/intersect-announces-results-of-2025-board-elections",
    tag: "election",
  },
  {
    date: "October 2025",
    title: "Committee elections",
    description:
      "293 voters participated (19.4% turnout), casting 5,182 ballots across 8 committees. 98 candidates ran for 36 available seats.",
    source: "intersectmbo.org",
    sourceUrl:
      "https://www.intersectmbo.org/news/intersect-committee-election-october-2025-results",
    tag: "election",
  },
  {
    date: "November 2025",
    title: "Chain split incident",
    description:
      "The Cardano network experienced a chain split lasting 14.5 hours due to a deserialization bug. The issue was patched with node versions 10.5.2 and 10.5.3.",
    source: "Intersect incident report",
    tag: "incident",
  },
  {
    date: "December 2025",
    title: "Critical Integrations Budget ratified (\u20B370M)",
    description:
      "A \u20B370M critical integrations budget was ratified in the fastest-ever governance vote. The coalition behind the proposal included IOG, EMURGO, the Cardano Foundation, Intersect, and the Midnight Foundation.",
    source: "intersectmbo.org",
    tag: "governance",
  },
  {
    date: "January 2026",
    title: "Jack Briggs permanently appointed as Executive Director",
    description:
      "The board unanimously appointed Jack Briggs as permanent Executive Director. The hiring process was publicly documented — open applications (Oct 2025), member polling, 6 finalists, stakeholder interviews — but the final appointment was the board's decision, not a member vote.",
    source: "Intersect Update #94",
    tag: "governance",
  },
  {
    date: "January 2026",
    title: "Constitution v2.4 ratified (79% support)",
    description:
      "An updated version of the Cardano Constitution was ratified with 79% support. Key changes included the removal of non-binding clauses and the elimination of the Budget Info Action mechanism.",
    source: "cardano.org",
    tag: "governance",
  },
  {
    date: "March 2026",
    title: "2026 committee elections announced",
    description:
      "Intersect announced elections for 37 committee seats. Applications open March 30 through April 17. Elected committee members receive a 500 ADA/month service reward.",
    source: "Intersect Update #101",
    tag: "election",
  },
];

/* ── Tag styling ──────────────────────────────────────── */
const tagConfig: Record<
  TimelineEvent["tag"],
  { label: string; className: string }
> = {
  founding: {
    label: "Founding",
    className: "border-violet-400/30 bg-violet-500/10 text-violet-300",
  },
  growth: {
    label: "Growth",
    className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  },
  election: {
    label: "Election",
    className: "border-sky-400/30 bg-sky-500/10 text-sky-300",
  },
  governance: {
    label: "Governance",
    className: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  },
  incident: {
    label: "Incident",
    className: "border-rose-400/30 bg-rose-500/10 text-rose-300",
  },
  criticism: {
    label: "Criticism",
    className: "border-rose-400/30 bg-rose-500/10 text-rose-300",
  },
};

/* ── Page ─────────────────────────────────────────────── */
export default function HistoryPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* ================================================================ */}
      {/* SECTION 1 — Hero                                                 */}
      {/* ================================================================ */}
      <section className="mt-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Intersect History
        </p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          How Intersect Came to Be
        </h1>
        <p className="max-w-3xl text-base text-white/50 md:text-lg">
          From founding entities to community governance &mdash; a factual
          timeline
        </p>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-sm leading-relaxed text-white/70">
            Intersect is a Wyoming nonprofit corporation created to coordinate
            Cardano&rsquo;s off-chain governance. It was created by{" "}
            <span className="text-white">IOG</span> and{" "}
            <span className="text-white">EMURGO</span> as seed funders,
            who received appointed board seats. The{" "}
            <span className="text-white">Cardano Foundation</span> joined
            as a member in September 2024 &mdash; over a year after incorporation.
            This page documents the key events in Intersect&rsquo;s transition
            toward community governance, with sources for every claim.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2 — Timeline                                             */}
      {/* ================================================================ */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Timeline
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Key Events
        </h2>

        <div className="relative mt-10">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 md:left-[9px]" />

          <div className="space-y-8">
            {timeline.map((event, i) => {
              const tag = tagConfig[event.tag];
              return (
                <div key={i} className="relative pl-8 md:pl-10">
                  {/* Dot */}
                  <div className="absolute left-0 top-[6px] h-[15px] w-[15px] rounded-full border-2 border-white/20 bg-black md:h-[19px] md:w-[19px]" />

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <time className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                        {event.date}
                      </time>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-[0.2em] ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {event.description}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/30">
                      Source:{" "}
                      {event.sourceUrl ? (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline transition hover:text-white/50"
                        >
                          {event.source}
                        </a>
                      ) : (
                        <span>{event.source}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3 — What This Means                                      */}
      {/* ================================================================ */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Analysis
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          What This Means
        </h2>
        <div className="mt-6 rounded-[28px] border border-amber-400/20 bg-amber-500/5 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
            Factual Summary
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-white/60">
            <li className="flex gap-3">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span>
                <span className="text-white">Founded by IOG and EMURGO.</span>{" "}
                Intersect was created by IOG and EMURGO, who held appointed
                board seats as &ldquo;seed funders&rdquo; from the start.
                The Cardano Foundation joined as a member in September 2024.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>
                <span className="text-white">
                  Members gained majority board control only in September 2025
                </span>{" "}
                &mdash; over two years after incorporation. Before that, seed
                funder-appointed seats held the balance of power.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>
                <span className="text-white">
                  Committee authority is ambiguous.
                </span>{" "}
                The bylaws (Article 5) grant committees delegated board authority
                with specific exceptions, but Intersect&rsquo;s communications
                consistently describe them as advisory.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span>
                <span className="text-white">
                  Election turnout has been consistently low.
                </span>{" "}
                Participation has hovered around 20% across board and committee
                elections (37% in October 2024, 22% in September 2025, 19.4% in
                October 2025).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span>
                <span className="text-white">
                  Key information has never been made public.
                </span>{" "}
                No staff salary grid or full staff roster has
                ever been published by Intersect. Committee stipends
                (500 ADA/month) and major programme ADA amounts are disclosed.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4 — Legal Structure                                      */}
      {/* ================================================================ */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Legal
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Legal Structure
        </h2>
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Entity Type
              </p>
              <p className="mt-1 text-sm text-white">
                Wyoming nonprofit corporation
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Incorporated
              </p>
              <p className="mt-1 text-sm text-white">July 13, 2023</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Headquarters
              </p>
              <p className="mt-1 text-sm text-white">
                2015 Ionosphere Street, Unit 201, Longmont, CO 80504
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Governing Law
              </p>
              <p className="mt-1 text-sm text-white">
                Wyoming Nonprofit Corporation Act (Title 17, Chapter 19)
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Ownership
              </p>
              <p className="mt-1 text-sm text-white/60">
                No individual or entity owns Intersect. The board of directors
                manages the organization, and members elect board
                representatives. Seed funders (IOG, EMURGO) hold designated
                board seats per the bylaws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sources note ──────────────────────────────── */}
      <div className="mt-12 rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/30">
          About this page
        </p>
        <p className="mt-2 text-sm text-white/40">
          Every claim on this page is sourced from official Intersect
          publications, on-chain data, or verifiable third-party reporting. If
          you believe any fact is incorrect or missing a source, please{" "}
          <Link
            href="/sources"
            className="underline transition hover:text-white/60"
          >
            visit our sources page
          </Link>{" "}
          or submit a correction.
        </p>
      </div>
    </main>
  );
}
