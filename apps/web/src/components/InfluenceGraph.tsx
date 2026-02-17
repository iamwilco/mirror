"use client";

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

  return (
    <div className="max-w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="h-[420px] w-full overflow-hidden">
        <ForceGraph2D
          graphData={data}
          nodeColor={(node: unknown) => nodeColor(node as Node)}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkColor={() => "rgba(255,255,255,0.25)"}
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
      <div className="mt-6 grid gap-2 text-xs text-white/60">
        <p className="uppercase tracking-[0.2em]">Neutrality Check</p>
        <p>
          Relationships shown here reflect publicly known ties. Overlaps are
          highlighted without speculation.
        </p>
      </div>
    </div>
  );
}
