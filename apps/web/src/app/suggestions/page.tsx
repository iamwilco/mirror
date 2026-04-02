import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggestions — Intersect Mirror",
  description:
    "Practical recommendations for making Intersect's committees and governance actually work.",
};

interface Suggestion {
  id: number;
  title: string;
  problem: string;
  recommendation: string;
  implementation: string;
  priority: "critical" | "high" | "medium";
  category: "accountability" | "process" | "transparency" | "quality" | "engagement";
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 1,
    title: "Require measurable deliverables for every committee",
    problem:
      "No committee had KPIs or measurable deliverables until 2026. Committee members can be elected, do nothing, and face no consequences.",
    recommendation:
      "Every committee must publish a quarterly roadmap with specific, measurable deliverables before the start of each quarter. These should be publicly visible and reviewed at the end of each quarter.",
    implementation:
      "Create a standardized template. Each committee chair submits deliverables within 30 days of election. Published on a single public page. Quarterly review with pass/fail assessment.",
    priority: "critical",
    category: "accountability",
  },
  {
    id: 2,
    title: "Introduce performance reviews and removal process",
    problem:
      "No documented case of a committee member being removed for non-performance. No attendance tracking (except TSC). No public record of who contributes and who doesn't.",
    recommendation:
      "Publish attendance records for all committee meetings. Establish a clear removal process: 3 consecutive unexcused absences = automatic removal. Zero deliverables in a quarter = review by ISC with potential removal.",
    implementation:
      "TSC already tracks attendance — extend this to all committees. Codify the removal process in committee terms of reference. Publish attendance data monthly.",
    priority: "critical",
    category: "accountability",
  },
  {
    id: 3,
    title: "Standardize committee operations",
    problem:
      "Each committee self-organizes with no shared standards. Some produce 87 sets of minutes; others produce zero. No common agenda format, decision-making process, or documentation standard.",
    recommendation:
      "Create a Committee Operations Handbook covering: meeting cadence (minimum biweekly), agenda template, minutes template, decision-logging format, and reporting requirements. All committees must follow it.",
    implementation:
      "Draft handbook based on TSC and Budget Committee best practices (they have the most consistent documentation). Train all committee chairs. Review compliance quarterly.",
    priority: "critical",
    category: "process",
  },
  {
    id: 4,
    title: "Mandate training for all elected members and secretaries",
    problem:
      "Committee members receive no onboarding on how to run meetings, write minutes, make decisions, or produce deliverables. Secretaries are not trained on documentation standards.",
    recommendation:
      "Create a mandatory onboarding program that every newly elected committee member and secretary must complete within 30 days. Cover: meeting facilitation, minutes-writing, decision frameworks, conflict resolution, and documentation standards.",
    implementation:
      "Develop a self-paced online module (2-3 hours). Include practical exercises. Completion is a prerequisite for receiving the 500 ADA/month stipend.",
    priority: "high",
    category: "quality",
  },
  {
    id: 5,
    title: "Publish all meeting minutes within 7 days",
    problem:
      "8 of 10 committees publish minutes, but quality varies widely. MCC and Oversight Committee have unclear or no public minutes. Parameter Committee minutes stopped at Oct 2024. 5 of 7 standing committees publish Google Drive recordings; Budget Committee and ISC do not.",
    recommendation:
      "All committees must publish meeting minutes within 7 calendar days of each meeting. Minutes must follow the standardized template. Failure to publish = flagged in public dashboard.",
    implementation:
      "Assign a dedicated secretary (paid) for each committee. Create a shared publishing platform (single GitBook, not 5+ scattered platforms). Automated reminders at day 5.",
    priority: "critical",
    category: "transparency",
  },
  {
    id: 6,
    title: "Consolidate documentation into one platform",
    problem:
      "Documentation is scattered across intersectmbo.org, docs.intersectmbo.org, committees.docs.intersectmbo.org, budgetcommittee.docs.intersectmbo.org, board.docs.intersectmbo.org, and various GitBooks. Much is outdated or archived without clear indicators.",
    recommendation:
      "Consolidate all committee documentation into a single platform with a consistent URL structure, clear date stamps, and prominent 'archived/outdated' warnings where applicable.",
    implementation:
      "Audit all existing documentation. Migrate to one platform. Redirect old URLs. Add 'last updated' timestamps to every page. Flag anything older than 6 months for review.",
    priority: "high",
    category: "transparency",
  },
  {
    id: 7,
    title: "Vet election candidates against their proposals",
    problem:
      "Candidates submit ambitious, sometimes AI-generated proposals during elections but face no accountability for delivering on their commitments after being elected.",
    recommendation:
      "Require candidates to submit a specific, measurable 'commitment statement' during elections (not a general vision). After 6 months, publish a public comparison of promises vs. actual delivery for each member.",
    implementation:
      "Standardize election proposal format: max 500 words, must include 3-5 specific deliverables with timelines. Create an automated 6-month review page comparing commitments to outcomes.",
    priority: "high",
    category: "quality",
  },
  {
    id: 8,
    title: "Publish board meeting minutes",
    problem:
      "Board meeting minutes are published at board.docs.intersectmbo.org (27 meetings since Dec 2023), but they vary in depth. Compensation decisions, vendor selection criteria, and strategic deliberations are not visible in the public record.",
    recommendation:
      "Ensure all board minutes include a minimum standard of detail: attendees, agenda items, decisions made with vote counts, and action items. Publish within 14 days.",
    implementation:
      "Follow the TSC model — they publish minutes and a decision log. The board should do the same. If confidential items exist, publish a redacted version with clear labels explaining what was withheld and why.",
    priority: "critical",
    category: "transparency",
  },
  {
    id: 9,
    title: "Disclose all compensation",
    problem:
      "No staff salary grid or compensation ranges have been disclosed for ED, staff, or board members. Committee stipends (500 ADA/month) and major funded programme budgets with FTE counts are public.",
    recommendation:
      "Publish salary bands (not individual salaries) for all role categories: executive, director, manager, staff. Disclose total annual compensation spend as a percentage of the operational budget.",
    implementation:
      "Start with aggregate data: total staff compensation as % of the ₳20M operational budget. Then publish salary bands per level. This is standard practice for nonprofits.",
    priority: "high",
    category: "transparency",
  },
  {
    id: 10,
    title: "Create a committee effectiveness dashboard",
    problem:
      "No centralized way to see which committees are active, what they've produced, and whether they're meeting their obligations. Members cannot assess committee health.",
    recommendation:
      "Build a public dashboard showing for each committee: meeting frequency, attendance rate, minutes published (yes/no), deliverables completed vs. planned, chair identified, and open positions.",
    implementation:
      "This data mostly already exists across scattered pages. Aggregate it into one view. Update monthly. Flag committees that fall below minimum standards in red.",
    priority: "medium",
    category: "accountability",
  },
  {
    id: 11,
    title: "Give committees actual decision-making power on specific topics",
    problem:
      "Committees are advisory only — they 'validate legitimacy, not recommend or reject.' This creates a structural paradox: members elect committees that cannot actually decide anything.",
    recommendation:
      "Define specific domains where committee decisions are binding (not just advisory). Example: TSC decisions on parameter changes should be binding within defined guardrails. Budget Committee should have veto power on proposals that fail technical review.",
    implementation:
      "Amend committee terms of reference to grant binding authority on defined topics. Require board to publicly justify any override of a committee decision. This requires bylaw changes — start the conversation.",
    priority: "medium",
    category: "process",
  },
  {
    id: 12,
    title: "Increase election turnout through structural changes",
    problem:
      "Election turnout dropped from 27% to 19.4% in 6 months. The people overseeing ₳263M were elected by ~300 voters out of 1,500+ eligible.",
    recommendation:
      "Make voting easier: extend voting windows, send multiple reminders, provide simple candidate comparison tools. Consider: should the ₳10 membership fee include a 'voted' discount or bonus? Should non-voters lose committee nomination eligibility?",
    implementation:
      "Study what worked in Oct 2024 (37% turnout) vs Oct 2025 (19.4%). Implement the most effective outreach methods. Set a minimum turnout threshold for election validity.",
    priority: "medium",
    category: "engagement",
  },
];

const PRIORITY_STYLE = {
  critical: { border: "border-rose-500/30", bg: "bg-rose-500/5", text: "text-rose-300", label: "Critical" },
  high: { border: "border-amber-500/30", bg: "bg-amber-500/5", text: "text-amber-300", label: "High" },
  medium: { border: "border-white/10", bg: "bg-white/5", text: "text-white/60", label: "Medium" },
};

const CATEGORY_STYLE: Record<string, { text: string; label: string }> = {
  accountability: { text: "text-rose-300", label: "Accountability" },
  process: { text: "text-violet-300", label: "Process" },
  transparency: { text: "text-emerald-300", label: "Transparency" },
  quality: { text: "text-amber-300", label: "Quality" },
  engagement: { text: "text-sky-300", label: "Engagement" },
};

export default function SuggestionsPage() {
  const critical = SUGGESTIONS.filter((s) => s.priority === "critical");
  const high = SUGGESTIONS.filter((s) => s.priority === "high");
  const medium = SUGGESTIONS.filter((s) => s.priority === "medium");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      {/* Hero */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Recommendations</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
          What Should Change
        </h1>
        <p className="mt-4 max-w-3xl text-base text-white/50">
          Practical recommendations based on the documented problems found in
          Intersect&apos;s operations. Each suggestion addresses a specific, verified issue
          and includes concrete implementation steps.
        </p>
        <p className="mt-2 text-sm text-white/40">
          These are suggestions from the community — not demands.
          See the <Link href="/operations" className="underline hover:text-white/60">operational audit</Link> for
          the underlying evidence.
        </p>
      </section>

      {/* Summary */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-rose-300">{critical.length}</p>
          <p className="mt-1 text-sm text-white/50">Critical</p>
          <p className="text-[11px] text-white/30">Must fix to be credible</p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-amber-300">{high.length}</p>
          <p className="mt-1 text-sm text-white/50">High Priority</p>
          <p className="text-[11px] text-white/30">Should fix within 6 months</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-3xl font-bold text-white">{medium.length}</p>
          <p className="mt-1 text-sm text-white/50">Medium Priority</p>
          <p className="text-[11px] text-white/30">Important for long-term health</p>
        </div>
      </section>

      {/* Critical */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-rose-300">Critical — Fix These First</h2>
        <p className="mt-1 text-sm text-white/40">Without these, the committee structure lacks basic credibility.</p>
        <div className="mt-6 space-y-4">
          {critical.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </section>

      {/* High */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-amber-300">High Priority</h2>
        <p className="mt-1 text-sm text-white/40">Should be addressed within the next 6 months.</p>
        <div className="mt-6 space-y-4">
          {high.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </section>

      {/* Medium */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">Medium Priority</h2>
        <p className="mt-1 text-sm text-white/40">Important for long-term governance health.</p>
        <div className="mt-6 space-y-4">
          {medium.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 text-center">
        <h3 className="text-lg font-semibold text-white">Agree? Disagree? Have better ideas?</h3>
        <p className="mt-2 text-sm text-white/50">
          These suggestions are a starting point, not a final answer.
          If you have evidence, corrections, or alternative proposals —
          we want to hear them.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/contribute"
            className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-sm text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Submit your input
          </Link>
          <Link
            href="/operations"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/50 transition hover:border-white/30 hover:text-white"
          >
            See the evidence
          </Link>
        </div>
      </section>
    </main>
  );
}

function SuggestionCard({ suggestion: s }: { suggestion: Suggestion }) {
  const p = PRIORITY_STYLE[s.priority];
  const c = CATEGORY_STYLE[s.category];

  return (
    <div className={`rounded-[28px] border ${p.border} ${p.bg} p-6`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border ${p.border} px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider ${p.text}`}>
          {p.label}
        </span>
        <span className={`text-[11px] uppercase tracking-wider ${c.text}`}>
          {c.label}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-rose-300/70">Problem</p>
          <p className="mt-2 text-sm text-white/50">{s.problem}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300/70">Recommendation</p>
          <p className="mt-2 text-sm text-white/50">{s.recommendation}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-sky-300/70">How to implement</p>
          <p className="mt-2 text-sm text-white/50">{s.implementation}</p>
        </div>
      </div>
    </div>
  );
}
