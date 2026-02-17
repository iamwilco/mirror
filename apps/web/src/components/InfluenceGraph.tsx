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
  decision_power?: "High" | "Medium" | "Low" | "Unknown";
  x?: number;
  y?: number;
};

type GraphLink = {
  source: string | Node;
  target: string | Node;
  type: string;
  source_detail?: string;
};

/* ── colour palette ─────────────────────────────── */
const TYPE_COLORS: Record<string, string> = {
  person: "#60a5fa",
  committee: "#f87171",
  working_group: "#94a3b8",
  org: "#a78bfa",
};

const POWER_GLOW: Record<string, string> = {
  High: "#fbbf24",
  Medium: "#38bdf8",
};

const LEGEND = [
  { color: "#60a5fa", label: "Person" },
  { color: "#f87171", label: "Committee" },
  { color: "#94a3b8", label: "Working Group" },
  { color: "#a78bfa", label: "Organisation" },
  { color: "#fbbf24", border: true, label: "High Power" },
];

/* ── helpers ─────────────────────────────────────── */
function nodeRadius(node: Node) {
  const p = node.decision_power ?? "Unknown";
  if (p === "High") return 14;
  if (p === "Medium") return 10;
  if (p === "Low") return 7;
  return 6;
}

function fillColor(node: Node) {
  return TYPE_COLORS[node.type] ?? "#64748b";
}

export default function InfluenceGraph() {
  const fgRef = useRef<{ d3Force: (name: string, force?: unknown) => unknown }>(null);
  const [hovered, setHovered] = useState<Node | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const data = useMemo(
    () => graphData as { nodes: Node[]; links: GraphLink[] },
    [],
  );

  /* ── custom canvas draw ────────────────────────── */
  const paintNode = useCallback(
    (node: unknown, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as Node;
      const r = nodeRadius(n);
      const x = n.x ?? 0;
      const y = n.y ?? 0;
      const glow = POWER_GLOW[n.decision_power ?? ""];

      if (glow) {
        ctx.beginPath();
        ctx.arc(x, y, r + 3, 0, 2 * Math.PI);
        ctx.fillStyle = glow + "30";
        ctx.fill();
        ctx.strokeStyle = glow;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor(n);
      ctx.fill();

      const fontSize = Math.max(10 / globalScale, 2.5);
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(n.label, x, y + r + 2);
    },
    [],
  );

  /* ── link styling ──────────────────────────────── */
  const linkColor = useCallback((link: unknown) => {
    const l = link as GraphLink;
    if (l.type === "reports_to") return "rgba(248,113,113,0.45)";
    if (l.type === "board") return "rgba(251,191,36,0.4)";
    if (l.type === "chair") return "rgba(52,211,153,0.5)";
    return "rgba(255,255,255,0.12)";
  }, []);

  const linkWidth = useCallback((link: unknown) => {
    const l = link as GraphLink;
    if (l.type === "reports_to") return 1.6;
    if (l.type === "board" || l.type === "chair") return 1.2;
    return 0.6;
  }, []);

  /* ── interactions ──────────────────────────────── */
  const handleHover = useCallback(
    (node: unknown, prevNode: unknown, event?: { clientX: number; clientY: number }) => {
      void prevNode;
      if (!node) {
        setHovered(null);
        return;
      }
      setHovered(node as Node);
      if (event) setTooltipPos({ x: event.clientX, y: event.clientY });
    },
    [],
  );

  const handleClick = useCallback((node: unknown) => {
    const n = node as Node;
    if (n.decision_power === "High") {
      window.location.hash = "#contribute";
    }
  }, []);

  /* ── set custom d3 forces after mount ──────────── */
  const handleEngineStop = useCallback(() => {}, []);
  const handleEngineTick = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    try {
      const d3 = fg.d3Force as (name: string, force?: unknown) => unknown;
      const charge = d3("charge") as { strength?: (v: number) => void } | undefined;
      if (charge?.strength) charge.strength(-180);
      const link = d3("link") as { distance?: (v: number) => void } | undefined;
      if (link?.distance) link.distance(70);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="relative max-w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="h-[520px] w-full overflow-hidden">
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={(node: unknown, color: string, ctx: CanvasRenderingContext2D) => {
            const n = node as Node;
            ctx.beginPath();
            ctx.arc(n.x ?? 0, n.y ?? 0, nodeRadius(n) + 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkColor={linkColor}
          linkWidth={linkWidth}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={1.2}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={0.85}
          linkCurvature={0.15}
          onNodeHover={handleHover}
          onNodeClick={handleClick}
          cooldownTicks={120}
          onEngineStop={handleEngineStop}
          onEngineTick={handleEngineTick}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          backgroundColor="rgba(0,0,0,0)"
          minZoom={0.5}
          maxZoom={6}
        />
      </div>

      {/* ── hover tooltip ──────────────────────────── */}
      {hovered && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-xl border border-white/10 bg-black/90 px-4 py-3 text-xs text-white/80 shadow-2xl backdrop-blur-sm"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 10 }}
        >
          <p className="mb-1 text-sm font-semibold text-white">{hovered.label}</p>
          {hovered.role && (
            <p className="text-white/60">{hovered.role}</p>
          )}
          <p className="mt-1">
            <span className="text-white/40">Type:</span>{" "}
            {hovered.type.replace("_", " ")}
          </p>
          {hovered.decision_power && (
            <p>
              <span className="text-white/40">Power:</span>{" "}
              <span
                className={
                  hovered.decision_power === "High"
                    ? "text-amber-300"
                    : hovered.decision_power === "Medium"
                      ? "text-sky-300"
                      : "text-white/60"
                }
              >
                {hovered.decision_power}
              </span>
            </p>
          )}
          {hovered.source && (
            <p className="mt-1 text-[10px] text-white/30">
              Source: {hovered.source}
            </p>
          )}
          {hovered.decision_power === "High" && (
            <p className="mt-1 text-[10px] text-rose-300">
              Gap: No salary disclosed — click to submit evidence
            </p>
          )}
        </div>
      )}

      {/* ── legend + footer ────────────────────────── */}
      <div className="mt-6 grid gap-3 text-xs text-white/60">
        <p className="uppercase tracking-[0.2em]">Neutrality Check</p>
        <p>
          Relationships shown here reflect publicly known ties. Overlaps are
          highlighted without speculation.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {LEGEND.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/60"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.color,
                  boxShadow: item.border
                    ? `0 0 4px ${item.color}`
                    : undefined,
                }}
              />
              {item.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/60">
            <span className="h-[2px] w-3 rounded bg-rose-400/60" />
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
