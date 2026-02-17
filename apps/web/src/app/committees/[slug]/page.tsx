"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import inputData from "@/data/input.json";
import peopleData from "@/data/people.json";

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
const boardMembers = (peopleData.board_members ?? []).map((member) => ({
  name: member.name,
  role: member.role,
}));

const parseMember = (raw: string) => {
  const match = raw.match(/^(.*?)(?:\s*\((.*?)\))?$/);
  if (!match) return { name: raw, role: "Member" };
  const name = match[1]?.trim() || raw;
  const role = match[2]?.trim() || "Member";
  return { name, role };
};

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

  const committeeHierarchy = useMemo(() => {
    if (!committee?.members) return [] as { role: string; members: string[] }[];
    const grouped = new Map<string, string[]>();
    committee.members.map(parseMember).forEach(({ name, role }) => {
      const key = role.toLowerCase();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(name);
    });
    const order = ["chair", "vice chair", "lead", "member"]; // fallback order
    return Array.from(grouped.entries())
      .sort((a, b) => {
        const indexA = order.findIndex((item) => a[0].includes(item));
        const indexB = order.findIndex((item) => b[0].includes(item));
        if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
      .map(([role, members]) => ({
        role: role.replace(/\b\w/g, (char) => char.toUpperCase()),
        members,
      }));
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
            {committeeHierarchy.length > 0 ? (
              <div className="mt-4 space-y-4 text-sm text-white/70">
                {committeeHierarchy.map((group) => (
                  <div key={group.role} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">{group.role}</p>
                    <ul className="mt-3 space-y-2">
                      {group.members.map((member) => (
                        <li key={member} className="rounded-xl border border-white/5 bg-black/40 px-3 py-2">
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Org Map</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Board</p>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                {boardMembers.length > 0 ? (
                  boardMembers.map((member) => (
                    <div key={member.name} className="rounded-xl border border-white/5 bg-black/40 px-3 py-2">
                      <p className="text-sm text-white">{member.name}</p>
                      <p className="text-xs text-white/50">{member.role}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">Board roster pending.</p>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Committee</p>
              <p className="mt-2 text-sm text-white">{committee.name}</p>
              <p className="mt-2 text-xs text-white/60">{committee.description}</p>
              <div className="mt-3 space-y-2 text-xs text-white/70">
                {committeeHierarchy.length > 0 ? (
                  committeeHierarchy.map((group) => (
                    <div key={group.role} className="rounded-lg border border-emerald-400/20 bg-black/20 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/70">{group.role}</p>
                      <p className="mt-2 text-xs text-white/70">{group.members.join(", ")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/60">Member roster not yet published.</p>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Working Groups</p>
              {relatedWorkingGroups.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  {relatedWorkingGroups.map((group) => (
                    <li key={group.name} className="rounded-xl border border-white/5 bg-black/40 px-3 py-2">
                      <p className="text-sm text-white">{group.name}</p>
                      <p className="text-xs text-white/50">
                        {(group.members ?? []).length > 0
                          ? group.members?.join(", ")
                          : "Roster pending"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-white/60">No working groups mapped yet.</p>
              )}
            </div>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Flow: Board sets strategic direction → committees coordinate → working groups execute.
          </p>
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
