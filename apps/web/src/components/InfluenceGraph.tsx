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
  type: "org" | "person";
  label: string;
  role?: string;
};

type Link = {
  source: string;
  target: string;
  type: string;
};

export default function InfluenceGraph() {
  const data = useMemo(() => graphData as { nodes: Node[]; links: Link[] }, []);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="h-[420px]">
        <ForceGraph2D
          graphData={data}
          nodeAutoColorBy="type"
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkColor={() => "rgba(255,255,255,0.25)"}
          nodeRelSize={6}
          nodeLabel={(node: unknown) => {
            const item = node as Node;
            return `${item.label}${item.role ? ` (${item.role})` : ""}`;
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
