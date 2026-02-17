"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import graphData from "@/data/network-nodes.json";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
}) as ComponentType<Record<string, unknown>>;

type Node = {
  id: string;
  type: "org" | "person" | "committee" | "working_group";
  label: string;
  role?: string;
  source?: string;
  decision_power?: string;
  x?: number; y?: number; fx?: number; fy?: number;
};
type GLink = { source: string | Node; target: string | Node; type: string; source_detail?: string };

const CLR: Record<string, string> = { person: "#60a5fa", committee: "#f87171", working_group: "#94a3b8", org: "#c084fc" };
const LEGEND = [
  { color: "#60a5fa", label: "Person" },
  { color: "#f87171", label: "Committee" },
  { color: "#94a3b8", label: "Working Group" },
  { color: "#c084fc", label: "Organisation" },
  { color: "#fbbf24", glow: true, label: "High Power" },
];

function rid(ref: string | Node) { return typeof ref === "string" ? ref : ref.id; }
function nR(n: Node) {
  if (n.id === "intersect") return 22;
  if (n.type === "committee") return 13;
  if (n.type === "working_group") return 8;
  if (n.type === "org") return 11;
  const p = (n.decision_power ?? "").toLowerCase();
  return p.startsWith("high") ? 14 : p.startsWith("med") ? 10 : 7;
}
function nC(n: Node) { return n.id === "intersect" ? "#e2e8f0" : CLR[n.type] ?? "#64748b"; }
function ring(nodes: Node[], r: number, off = -Math.PI / 2) {
  const s = (2 * Math.PI) / Math.max(nodes.length, 1);
  nodes.forEach((n, i) => { const a = off + s * i; n.x = n.fx = Math.cos(a) * r; n.y = n.fy = Math.sin(a) * r; });
}
function radialLayout(raw: Node[], links: GLink[]): Node[] {
  const ns = raw.map(n => ({ ...n }));
  const m = new Map(ns.map(n => [n.id, n]));
  const hub = m.get("intersect");
  if (hub) { hub.x = hub.fx = 0; hub.y = hub.fy = 0; }
  const comms = ns.filter(n => n.type === "committee");
  const wgs = ns.filter(n => n.type === "working_group");
  const hi = ns.filter(n => n.type === "person" && (n.decision_power ?? "").toLowerCase().startsWith("high"));
  const lo = ns.filter(n => n.type === "person" && !(n.decision_power ?? "").toLowerCase().startsWith("high"));
  const orgs = ns.filter(n => n.type === "org" && n.id !== "intersect");
  ring(comms, 190);
  wgs.forEach((wg, i) => {
    const pl = links.find(l => rid(l.source) === wg.id && l.type === "reports_to");
    const p = pl ? m.get(rid(pl.target)) : null;
    if (p?.x != null && p?.y != null) {
      const a = Math.atan2(p.y, p.x) + (i % 2 === 0 ? 0.18 : -0.18);
      wg.x = wg.fx = Math.cos(a) * 135; wg.y = wg.fy = Math.sin(a) * 135;
    } else { const a = -1.57 + (6.28 * i) / Math.max(wgs.length, 1); wg.x = wg.fx = Math.cos(a) * 135; wg.y = wg.fy = Math.sin(a) * 135; }
  });
  ring(hi, 330, -Math.PI / 3);
  ring(lo, 350, Math.PI / 5);
  ring(orgs, 460, 0);
  return ns;
}

export default function InfluenceGraph() {
  const tipRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const raw = useMemo(() => graphData as { nodes: Node[]; links: GLink[] }, []);
  const data = useMemo(() => ({ nodes: radialLayout(raw.nodes, raw.links), links: raw.links }), [raw]);

  const adj = useMemo(() => {
    const m = new Map<string, Set<string>>();
    raw.links.forEach((l) => {
      const s = rid(l.source), t = rid(l.target);
      if (!m.has(s)) m.set(s, new Set());
      if (!m.has(t)) m.set(t, new Set());
      m.get(s)!.add(t);
      m.get(t)!.add(s);
    });
    return m;
  }, [raw.links]);

  const isNear = useCallback(
    (id: string) => !hoveredId || id === hoveredId || (adj.get(hoveredId)?.has(id) ?? false),
    [hoveredId, adj],
  );

  const paintNode = useCallback(
    (node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as Node;
      const r = nR(n);
      const x = n.x ?? 0;
      const y = n.y ?? 0;
      const near = isNear(n.id);
      ctx.globalAlpha = hoveredId ? (near ? 1 : 0.07) : 1;

      const isHigh = (n.decision_power ?? "").toLowerCase().startsWith("high");
      if (isHigh && near) {
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(251,191,36,0.12)";
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = nC(n);
      ctx.fill();

      const showLabel = near && (globalScale > 1.0 || n.id === "intersect" || n.type === "committee" || isHigh);
      if (showLabel) {
        const fs = Math.min(Math.max(12 / globalScale, 3), 5.5);
        ctx.font = `600 ${fs}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.fillText(n.label, x, y + r + 3);
      }
      ctx.globalAlpha = 1;
    },
    [hoveredId, isNear],
  );

  const linkColorFn = useCallback(
    (link: unknown) => {
      const l = link as GLink;
      const s = rid(l.source), t = rid(l.target);
      const lit = hoveredId && (s === hoveredId || t === hoveredId);
      if (lit) {
        if (l.type === "reports_to") return "rgba(248,113,113,0.65)";
        if (l.type === "board") return "rgba(251,191,36,0.6)";
        if (l.type === "chair") return "rgba(52,211,153,0.6)";
        return "rgba(255,255,255,0.45)";
      }
      if (hoveredId) return "rgba(255,255,255,0.02)";
      if (l.type === "reports_to") return "rgba(248,113,113,0.12)";
      if (l.type === "board") return "rgba(251,191,36,0.10)";
      return "rgba(255,255,255,0.05)";
    },
    [hoveredId],
  );

  const linkWidthFn = useCallback(
    (link: unknown) => {
      const l = link as GLink;
      const s = rid(l.source), t = rid(l.target);
      const lit = hoveredId && (s === hoveredId || t === hoveredId);
      return lit ? 2 : 0.4;
    },
    [hoveredId],
  );

  const handleHover = useCallback((_node: unknown) => {
    if (!_node) { setHoveredId(null); setHoveredNode(null); return; }
    const n = _node as Node;
    setHoveredId(n.id);
    setHoveredNode(n);
  }, []);

  const handleClick = useCallback((node: unknown) => {
    const n = node as Node;
    if ((n.decision_power ?? "").toLowerCase().startsWith("high")) window.location.hash = "#contribute";
  }, []);

  return (
    <div
      className="relative max-w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8"
      onMouseMove={(e) => {
        if (tipRef.current) {
          tipRef.current.style.left = `${e.clientX + 16}px`;
          tipRef.current.style.top = `${e.clientY - 12}px`;
        }
      }}
    >
      <p className="mb-3 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Hover a node to reveal its connections
      </p>
      <div className="h-[600px] w-full overflow-hidden">
        <ForceGraph2D
          graphData={data}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(node: unknown, color: string, ctx: CanvasRenderingContext2D) => {
            const n = node as Node;
            ctx.beginPath();
            ctx.arc(n.x ?? 0, n.y ?? 0, nR(n) + 5, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkColor={linkColorFn}
          linkWidth={linkWidthFn}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={0.85}
          linkCurvature={0.18}
          linkDirectionalParticles={0}
          onNodeHover={handleHover}
          onNodeClick={handleClick}
          cooldownTicks={0}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          backgroundColor="rgba(0,0,0,0)"
          minZoom={0.3}
          maxZoom={8}
        />
      </div>

      {hoveredNode && (
        <div
          ref={tipRef}
          className="pointer-events-none fixed z-50 max-w-xs rounded-xl border border-white/10 bg-black/90 px-4 py-3 text-xs text-white/80 shadow-2xl backdrop-blur-sm"
        >
          <p className="mb-1 text-sm font-semibold text-white">{hoveredNode.label}</p>
          {hoveredNode.role && <p className="text-white/50">{hoveredNode.role}</p>}
          <p className="mt-1"><span className="text-white/30">Type:</span> {hoveredNode.type.replace("_", " ")}</p>
          {hoveredNode.decision_power && (
            <p>
              <span className="text-white/30">Power:</span>{" "}
              <span className={(hoveredNode.decision_power ?? "").toLowerCase().startsWith("high") ? "text-amber-300" : (hoveredNode.decision_power ?? "").toLowerCase().startsWith("med") ? "text-sky-300" : "text-white/50"}>
                {hoveredNode.decision_power}
              </span>
            </p>
          )}
          {hoveredNode.source && <p className="mt-1 text-[10px] text-white/25">Source: {hoveredNode.source}</p>}
          {(hoveredNode.decision_power ?? "").toLowerCase().startsWith("high") && (
            <p className="mt-1 text-[10px] text-rose-300">Gap: No salary disclosed — click to submit evidence</p>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-3 text-xs text-white/60">
        <p className="uppercase tracking-[0.2em]">Neutrality Check</p>
        <p>Relationships shown here reflect publicly known ties. Overlaps are highlighted without speculation.</p>
        <div className="flex flex-wrap items-center gap-2">
          {LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/60">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: item.glow ? `0 0 6px ${item.color}` : undefined }} />
              {item.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/60">
            <span className="h-[2px] w-3 rounded bg-rose-400/60" />
            Reports To
          </span>
          <Link href="/#contribute" className="rounded-full border border-emerald-400/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300">
            Submit Evidence
          </Link>
        </div>
      </div>
    </div>
  );
}
