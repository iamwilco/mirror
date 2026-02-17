"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useMemo } from "react";

import graphData from "@/data/network-nodes.json";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
}) as ComponentType<Record<string, unknown>>;

type Node = {
  id: string;
  type: "org" | "person" | "committee";
  label: string;
  role?: string;
  source?: string;
  decision_power?: "High" | "Medium" | "Low" | "Unknown";
};

type Link = {
  source: string;
  target: string;
  type: string;
};

export default function InfluenceGraph() {
  const data = useMemo(() => graphData as { nodes: Node[]; links: Link[] }, []);
  const nodeSize = (node: Node) => {
    const power = node.decision_power ?? "Unknown";
    if (power === "High") return 9;
    if (power === "Medium") return 7;
    if (power === "Low") return 5;
    return 4.5;
  };

  const nodeColor = (node: Node) => {
    if (node.type === "committee") return "#38bdf8";
    if (node.type === "org") return "#a78bfa";
    if (node.decision_power === "High") return "#f87171";
    if (node.decision_power === "Medium") return "#fbbf24";
    return "#94a3b8";
  };

  const linkColor = (link: Link) => {
    if (link.type === "reports_to") return "rgba(248,113,113,0.6)";
    return "rgba(255,255,255,0.25)";
  };

  return (
    <div className="max-w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="h-[420px] w-full overflow-hidden">
        <ForceGraph2D
          graphData={data}
          nodeColor={(node: unknown) => nodeColor(node as Node)}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkColor={(link: unknown) => linkColor(link as Link)}
          nodeRelSize={6}
          nodeVal={(node: unknown) => nodeSize(node as Node)}
          nodeLabel={(node: unknown) => {
            const item = node as Node;
            const role = item.role ? ` (${item.role})` : "";
            const source = item.source ? `\nSource: ${item.source}` : "";
            const gapPrompt = item.decision_power === "High" ? "\nGap: No salary disclosed—submit evidence?" : "";
            return `${item.label}${role}${source}${gapPrompt}`;
          }}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>
      <div className="mt-6 grid gap-3 text-xs text-white/60">
        <p className="uppercase tracking-[0.2em]">Neutrality Check</p>
        <p>
          Relationships shown here reflect publicly known ties. Overlaps are
          highlighted without speculation.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            High Power
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Committee
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
            Reports To
          </span>
          <Link
            href="/#contribute"
            className="rounded-full border border-emerald-400/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300"
          >
            Submit Evidence
          </Link>
        </div>
      </div>
    </div>
  );
}
