"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import inputData from "@/data/input.json";

const CATEGORY_SLUGS: Record<string, string> = {
  "Budget & Money Flow": "budget-money-flow",
  "Governance & Decisions": "governance-decisions",
  "People & Compensation": "people-compensation",
  "Results & Deliverables": "results-deliverables",
  "Procurement & Contracts": "procurement-contracts",
  "Relationships": "relationships",
};

const fallbackScore = 66;

const CATEGORY_WEIGHTS = [
  { name: "Budget & Money Flow", weight: 30 },
  { name: "Governance & Decisions", weight: 20 },
  { name: "People & Compensation", weight: 20 },
  { name: "Results & Deliverables", weight: 15 },
  { name: "Procurement & Contracts", weight: 10 },
  { name: "Relationships", weight: 5 },
];

const scoreFromCounts = (verified: number, partial: number, missing: number) => {
  const total = verified + partial + missing;
  if (!total) return 0;
  return Math.round(((verified * 1 + partial * 0.5) / total) * 100);
};

export default function TransparencyMeter() {
  const [score, setScore] = useState(fallbackScore);
  const [displayScore, setDisplayScore] = useState(0);
  const [breakdown, setBreakdown] = useState(
    CATEGORY_WEIGHTS.map((item) => ({ ...item, value: fallbackScore }))
  );
  const [dataPoints, setDataPoints] = useState({ verified: 87, total: 142 });

  useEffect(() => {
    let isMounted = true;

    const loadScores = async () => {
      const people = inputData.people ?? [];
      const committees = inputData.committees ?? [];
      const workingGroups = inputData.working_groups ?? [];
      const relationships = inputData.relationships ?? [];

      const peopleCounts = people.reduce(
        (acc, item) => {
          acc[item.transparency as "verified" | "partial" | "missing"] += 1;
          return acc;
        },
        { verified: 0, partial: 0, missing: 0 }
      );

      const committeeCounts = committees.reduce(
        (acc, item) => {
          acc[item.transparency as "verified" | "partial" | "missing"] += 1;
          return acc;
        },
        { verified: 0, partial: 0, missing: 0 }
      );

      const workingCounts = workingGroups.reduce(
        (acc, item) => {
          acc[item.transparency as "verified" | "partial" | "missing"] += 1;
          return acc;
        },
        { verified: 0, partial: 0, missing: 0 }
      );

      const relationshipCounts = {
        verified: relationships.length,
        partial: 0,
        missing: 0,
      };

      const nextBreakdown = CATEGORY_WEIGHTS.map((category) => {
        switch (category.name) {
          case "People & Compensation":
            return {
              ...category,
              value: scoreFromCounts(
                peopleCounts.verified,
                peopleCounts.partial,
                peopleCounts.missing
              ),
            };
          case "Governance & Decisions":
            return {
              ...category,
              value: scoreFromCounts(
                committeeCounts.verified,
                committeeCounts.partial,
                committeeCounts.missing
              ),
            };
          case "Results & Deliverables":
            return {
              ...category,
              value: scoreFromCounts(
                workingCounts.verified,
                workingCounts.partial,
                workingCounts.missing
              ),
            };
          case "Relationships":
            return {
              ...category,
              value: scoreFromCounts(
                relationshipCounts.verified,
                relationshipCounts.partial,
                relationshipCounts.missing
              ),
            };
          default:
            return { ...category, value: fallbackScore };
        }
      });

      const overall = nextBreakdown.reduce(
        (acc, item) => acc + item.value * item.weight,
        0
      );
      const totalWeight = nextBreakdown.reduce((acc, item) => acc + item.weight, 0);
      const nextScore = totalWeight ? Math.round(overall / totalWeight) : fallbackScore;

      const verified =
        peopleCounts.verified + committeeCounts.verified + workingCounts.verified + relationshipCounts.verified;
      const total =
        people.length + committees.length + workingGroups.length + relationships.length;

      if (!isMounted) return;

      setScore(nextScore);
      setBreakdown(nextBreakdown);
      if (verified && total) {
        setDataPoints({ verified, total });
      }
    };

    loadScores();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayScore(score);
    }, 150);
    return () => clearTimeout(timeout);
  }, [score]);

  const radialData = useMemo(
    () => [{ name: "Transparency", value: displayScore, fill: "#5eead4" }],
    [displayScore]
  );

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,rgba(79,209,197,0.18),rgba(8,12,20,0.95))] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Transparency Score
        </p>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={radialData}
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={16} />
              <Tooltip
                formatter={(value) => [`${value ?? 0}%`, "Score"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            Overall Score
          </p>
          <p className="text-3xl font-semibold text-white">{displayScore}%</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/60">
          <span>
            Data Points {dataPoints.verified} / {dataPoints.total}
          </span>
          <Link
            href="/#contribute"
            className="rounded-full border border-white/30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition hover:border-white/60"
          >
            Contribute Data
          </Link>
        </div>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Category Breakdown
        </p>
        <div className="mt-6 space-y-4 text-sm text-white/70">
          {breakdown.map((item) => {
            const slug = CATEGORY_SLUGS[item.name];
            return (
              <Link
                key={item.name}
                href={slug ? `/transparency/${slug}` : "#"}
                className="block rounded-lg p-2 -mx-2 transition hover:bg-white/5"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="flex items-center gap-2">
                    {item.name}
                    <span className="text-[10px] text-white/30">→</span>
                  </span>
                  <span>{item.value}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#5eead4,#4fd1c5)]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
