"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import TransparencyDetail, { DetailItem } from "@/components/TransparencyDetail";

import inputData from "@/data/input.json";

interface Person {
  name: string;
  role: string;
  affiliations: string[];
  bio: string;
  transparency: string;
  source: string;
  notes: string;
}

interface Committee {
  name: string;
  description: string;
  elections: string;
  transparency: string;
  source: string;
  gaps?: string;
}

interface Relationship {
  from: string;
  to: string;
  type: string;
  details: string;
  source: string;
}

interface WorkingGroup {
  name: string;
  description: string;
  transparency: string;
  source: string;
}

const CATEGORY_MAP: Record<string, {
  displayName: string;
  score: number;
  dataKey: keyof typeof inputData | null;
  gaps: string[];
}> = {
  "budget-money-flow": {
    displayName: "Budget & Money Flow",
    score: 68,
    dataKey: null,
    gaps: [
      "₳263M vs ₳180M discrepancy not fully explained",
      "Individual work package spending not itemized",
      "Real-time treasury tracking not available",
    ],
  },
  "governance-decisions": {
    displayName: "Governance & Decisions",
    score: 55,
    dataKey: "committees",
    gaps: [
      "No full member list for all committees",
      "Vote tallies per member not published",
      "Decision rationale logs incomplete",
    ],
  },
  "people-compensation": {
    displayName: "People & Compensation",
    score: 50,
    dataKey: "people",
    gaps: inputData.transparency_gaps.filter((g: string) => 
      g.toLowerCase().includes("salary") || g.toLowerCase().includes("paid")
    ),
  },
  "results-deliverables": {
    displayName: "Results & Deliverables",
    score: 61,
    dataKey: "working_groups",
    gaps: [
      "KPI tracking dashboard not public",
      "Quarterly milestone completion rates missing",
    ],
  },
  "procurement-contracts": {
    displayName: "Procurement & Contracts",
    score: 42,
    dataKey: null,
    gaps: [
      "Vendor selection process undocumented",
      "Contract values not disclosed",
      "RFP process not transparent",
    ],
  },
  "relationships": {
    displayName: "Relationships",
    score: 35,
    dataKey: "relationships",
    gaps: [
      "Founding entity influence not quantified",
      "Board member affiliations partially documented",
    ],
  },
};

function mapPeopleToItems(people: Person[]): DetailItem[] {
  return people.map((p: Person) => ({
    name: `${p.name} — ${p.role}`,
    status: p.transparency as "verified" | "partial" | "missing",
    source: p.source,
    notes: p.notes,
    verifiedBy: "verifiedBy" in p ? (p as { verifiedBy?: string | null }).verifiedBy ?? null : null,
  }));
}

function mapCommitteesToItems(committees: Committee[]): DetailItem[] {
  return committees.map((c: Committee) => ({
    name: c.name,
    status: c.transparency as "verified" | "partial" | "missing",
    source: c.source,
    notes: c.gaps ?? c.elections,
    verifiedBy: "verifiedBy" in c ? (c as { verifiedBy?: string | null }).verifiedBy ?? null : null,
  }));
}

function mapRelationshipsToItems(relationships: Relationship[]): DetailItem[] {
  return relationships.map((r: Relationship) => ({
    name: `${r.from} → ${r.to}`,
    status: "verified" as const,
    source: r.source,
    notes: `${r.type}: ${r.details}`,
    verifiedBy: "verifiedBy" in r ? (r as { verifiedBy?: string | null }).verifiedBy ?? null : null,
  }));
}

function mapWorkingGroupsToItems(groups: WorkingGroup[]): DetailItem[] {
  return groups.map((g: WorkingGroup) => ({
    name: g.name,
    status: g.transparency as "verified" | "partial" | "missing",
    source: g.source,
    notes: g.description,
    verifiedBy: "verifiedBy" in g ? (g as { verifiedBy?: string | null }).verifiedBy ?? null : null,
  }));
}

export default function TransparencyCategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const categoryConfig = CATEGORY_MAP[categorySlug];

  const items = useMemo<DetailItem[]>(() => {
    if (!categoryConfig || !categoryConfig.dataKey) {
      return [
        { name: "Data collection in progress", status: "partial", source: "—", notes: "Check back soon" },
      ];
    }

    switch (categoryConfig.dataKey) {
      case "people":
        return mapPeopleToItems(inputData.people);
      case "committees":
        return mapCommitteesToItems(inputData.committees);
      case "relationships":
        return mapRelationshipsToItems(inputData.relationships);
      case "working_groups":
        return mapWorkingGroupsToItems(inputData.working_groups);
      default:
        return [];
    }
  }, [categoryConfig]);

  if (!categoryConfig) {
    return (
      <main className="min-h-screen bg-[#080c14] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold">Category Not Found</h1>
          <p className="mt-4 text-white/60">
            The category &quot;{categorySlug}&quot; does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080c14] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <TransparencyDetail
          category={categoryConfig.displayName}
          score={categoryConfig.score}
          items={items}
          gaps={categoryConfig.gaps}
        />
      </div>
    </main>
  );
}
