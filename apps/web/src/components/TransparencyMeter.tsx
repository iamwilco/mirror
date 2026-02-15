"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { supabase } from "@/lib/supabaseClient";

const fallbackScore = 62;

const fallbackBreakdown = [
  { name: "Budget & Money Flow", value: 68, weight: 30 },
  { name: "Governance & Decisions", value: 55, weight: 20 },
  { name: "People & Compensation", value: 50, weight: 20 },
  { name: "Results & Deliverables", value: 61, weight: 15 },
  { name: "Procurement & Contracts", value: 42, weight: 10 },
  { name: "Relationships", value: 35, weight: 5 },
];

export default function TransparencyMeter() {
  const [score, setScore] = useState(fallbackScore);
  const [displayScore, setDisplayScore] = useState(0);
  const [breakdown, setBreakdown] = useState(fallbackBreakdown);
  const [dataPoints, setDataPoints] = useState({ verified: 87, total: 142 });

  useEffect(() => {
    let isMounted = true;

    const loadScores = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("transparency_scores")
        .select("category, score, weight, data_points_verified, data_points_total")
        .order("weight", { ascending: false });

      if (error || !data || data.length === 0) return;

      const overall = data.reduce(
        (acc, item) => acc + (item.score || 0) * (item.weight || 0),
        0
      );
      const totalWeight = data.reduce((acc, item) => acc + (item.weight || 0), 0);
      const nextScore = totalWeight ? Math.round(overall / totalWeight) : fallbackScore;

      if (!isMounted) return;

      setScore(nextScore);
      setBreakdown(
        data.map((item) => ({
          name: item.category,
          value: Math.round(item.score || 0),
          weight: item.weight || 0,
        }))
      );

      const verified = data.reduce(
        (acc, item) => acc + (item.data_points_verified || 0),
        0
      );
      const total = data.reduce(
        (acc, item) => acc + (item.data_points_total || 0),
        0
      );
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
          <button className="rounded-full border border-white/30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition hover:border-white/60">
            Contribute Data
          </button>
        </div>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Category Breakdown
        </p>
        <div className="mt-6 space-y-4 text-sm text-white/70">
          {breakdown.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                <span>{item.name}</span>
                <span>{item.value}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#5eead4,#4fd1c5)]"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
