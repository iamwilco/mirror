"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import inputData from "@/data/input.json";

interface Committee {
  name: string;
  description: string;
  elections: string;
  transparency: string;
  source: string;
  gaps?: string;
  members?: string[];
  paid?: string;
  decision_power?: string;
}

interface WorkingGroup {
  name: string;
  description: string;
  members?: string[];
  paid?: string;
  decision_power?: string;
  transparency: string;
  source: string;
  notes?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const committees = inputData.committees as Committee[];
const workingGroups = inputData.working_groups as WorkingGroup[];

export default function CommitteeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const committee = useMemo(
    () => committees.find((item) => slugify(item.name) === slug) ?? null,
    [slug]
  );

  const relatedWorkingGroups = useMemo(() => {
    if (!committee) return [];
    return workingGroups.filter((group) =>
      group.description.toLowerCase().includes(committee.name.split(" (")[0].toLowerCase())
    );
  }, [committee]);

  if (!committee) {
    return (
      <main className="min-h-screen bg-[#080c14] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            href="/#transparency"
            className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white/80"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold">Committee Not Found</h1>
          <p className="text-sm text-white/60">
            We couldn&apos;t find a committee for &quot;{slug}&quot;.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080c14] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4">
          <Link
            href="/#transparency"
            className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white/80"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Committee</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{committee.name}</h1>
              <p className="mt-3 max-w-3xl text-sm text-white/60">{committee.description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/60">
              Transparency: {committee.transparency}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Decision Power</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {committee.decision_power ?? "Unknown"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Paid Status</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {committee.paid ?? "Unknown"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Elections</p>
            <p className="mt-2 text-sm text-white/70">{committee.elections}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Members & Roles</p>
            {committee.members && committee.members.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {committee.members.map((member) => (
                  <li key={member} className="rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                    {member}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-white/60">Member roster not yet published.</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Known Gaps</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {(committee.gaps ? [committee.gaps] : [])
                .filter(Boolean)
                .map((gap) => (
                  <li key={gap} className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-200">
                    {gap}
                  </li>
                ))}
            </ul>
            {!committee.gaps && (
              <p className="mt-4 text-sm text-white/60">No gaps recorded yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Sources</p>
          <div className="mt-3 text-sm text-white/70">{committee.source}</div>
        </div>

        {relatedWorkingGroups.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Related Working Groups</p>
            <div className="mt-4 space-y-3">
              {relatedWorkingGroups.map((group) => (
                <div key={group.name} className="rounded-xl border border-white/5 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{group.name}</p>
                      <p className="mt-2 text-sm text-white/60">{group.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                      {group.transparency}
                    </span>
                  </div>
                  {group.notes && <p className="mt-3 text-xs text-white/50">{group.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
