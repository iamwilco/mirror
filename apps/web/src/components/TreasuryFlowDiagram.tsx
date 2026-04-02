"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import budgetData from "@/data/budget-2025.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FlowNode {
  id: string;
  label: string;
  value: number;       // ADA in millions
  color: string;       // tailwind-compatible hex
}

interface FlowLink {
  sourceId: string;
  targetId: string;
  value: number;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Color palette (matching budget page bucket colors)                 */
/* ------------------------------------------------------------------ */

const BUCKET_HEX: Record<string, string> = {
  "Core Budget": "#3b82f6",
  "Research Budget": "#8b5cf6",
  "Governance Support Budget": "#f59e0b",
  "Growth & Marketing Budget": "#10b981",
  "Innovation Budget": "#06b6d4",
  "Funding Intersect (Administrator)": "#f43f5e",
};

/* ------------------------------------------------------------------ */
/*  Build flow data from budget JSON                                   */
/* ------------------------------------------------------------------ */

function buildFlowData() {
  const buckets = budgetData.buckets;
  const totalBudget = budgetData.total_proposed_ada;

  // Source node
  const sourceNode: FlowNode = {
    id: "treasury",
    label: "Cardano Treasury",
    value: Math.round(totalBudget / 1_000_000),
    color: "#5eead4",
  };

  // Bucket nodes
  const bucketNodes: FlowNode[] = buckets.map((b) => ({
    id: `bucket-${b.name}`,
    label: b.name.replace(" Budget", "").replace("Funding Intersect (Administrator)", "Intersect Admin"),
    value: Math.round(b.ada_amount / 1_000_000),
    color: BUCKET_HEX[b.name] ?? "#6b7280",
  }));

  // Committee nodes (deduplicated, summed)
  const committeeMap = new Map<string, { value: number; colors: string[] }>();
  buckets.forEach((bucket) => {
    bucket.committees.forEach((c) => {
      const existing = committeeMap.get(c.committee);
      const hex = BUCKET_HEX[bucket.name] ?? "#6b7280";
      if (existing) {
        existing.value += Math.round(c.ada_amount / 1_000_000);
        if (!existing.colors.includes(hex)) existing.colors.push(hex);
      } else {
        committeeMap.set(c.committee, {
          value: Math.round(c.ada_amount / 1_000_000),
          colors: [hex],
        });
      }
    });
  });

  const committeeNodes: FlowNode[] = Array.from(committeeMap.entries()).map(
    ([name, data]) => ({
      id: `committee-${name}`,
      label: name.replace(" Committee", "").replace("Technical Steering Committee (TSC)", "TSC").replace("(", "").replace(")", ""),
      value: data.value,
      color: data.colors[0],
    })
  );

  // Links: Treasury -> Buckets
  const links1: FlowLink[] = bucketNodes.map((bn) => ({
    sourceId: "treasury",
    targetId: bn.id,
    value: bn.value,
    color: bn.color,
  }));

  // Links: Buckets -> Committees
  const links2: FlowLink[] = [];
  buckets.forEach((bucket) => {
    const hex = BUCKET_HEX[bucket.name] ?? "#6b7280";
    bucket.committees.forEach((c) => {
      links2.push({
        sourceId: `bucket-${bucket.name}`,
        targetId: `committee-${c.committee}`,
        value: Math.round(c.ada_amount / 1_000_000),
        color: hex,
      });
    });
  });

  return {
    source: sourceNode,
    buckets: bucketNodes,
    committees: committeeNodes,
    links: [...links1, ...links2],
    totalBudget: Math.round(totalBudget / 1_000_000),
  };
}

const FLOW = buildFlowData();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}B`;
  return `${n.toFixed(1)}M`;
}

function shortLabel(label: string): string {
  return label
    .replace("Technical Steering Committee (TSC)", "TSC")
    .replace("Open Source Committee (OSC)", "OSC")
    .replace("Civics & Constitution Committee (CCC)", "CCC")
    .replace("Budget Committee (CBC)", "CBC")
    .replace("Growth & Marketing Committee (GMC)", "GMC")
    .replace("Membership & Community Committee (MCC)", "MCC")
    .replace("Product Committee (CPC)", "CPC");
}

/* ------------------------------------------------------------------ */
/*  SVG path helper                                                    */
/* ------------------------------------------------------------------ */

function bezierPath(
  x1: number, y1: number,
  x2: number, y2: number,
): string {
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface NodePosition {
  id: string;
  top: number;
  bottom: number;
  centerY: number;
  left: number;
  right: number;
}

export default function TreasuryFlowDiagram({ year }: { year: "2025" | "2026" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const nodes = container.querySelectorAll("[data-flow-id]");
    const newPositions: NodePosition[] = [];

    nodes.forEach((node) => {
      const id = node.getAttribute("data-flow-id")!;
      const nodeRect = node.getBoundingClientRect();
      newPositions.push({
        id,
        top: nodeRect.top - rect.top,
        bottom: nodeRect.bottom - rect.top,
        centerY: nodeRect.top - rect.top + nodeRect.height / 2,
        left: nodeRect.left - rect.left,
        right: nodeRect.right - rect.left,
      });
    });

    setPositions(newPositions);
    setIsMobile(rect.width < 768);
  }, []);

  useEffect(() => {
    // Measure after initial render
    const timer = setTimeout(measure, 50);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [measure]);

  if (year === "2026") {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold text-white">2026 Budget</p>
          <p className="text-sm text-white/50">
            The 2026 budget framework is still being developed. A Net Change Limit proposal
            (₳300M cap) expired with 44.15% support. The submission window opens April 2026.
          </p>
          <div className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-300">
            Pending
          </div>
        </div>
      </div>
    );
  }

  const getPos = (id: string) => positions.find((p) => p.id === id);

  // Build SVG links from measured positions
  const svgLinks: {
    key: string;
    path: string;
    strokeWidth: number;
    color: string;
    sourceId: string;
    targetId: string;
    value: number;
  }[] = [];

  if (positions.length > 0 && !isMobile) {
    // Track cumulative offsets for each node to stack connector endpoints
    const sourceOffsets = new Map<string, number>();
    const targetOffsets = new Map<string, number>();

    FLOW.links.forEach((link) => {
      const sourcePos = getPos(link.sourceId);
      const targetPos = getPos(link.targetId);
      if (!sourcePos || !targetPos) return;

      const sourceHeight = sourcePos.bottom - sourcePos.top;
      const targetHeight = targetPos.bottom - targetPos.top;

      // Proportional stroke width (min 2, max 30)
      const strokeWidth = Math.max(2, Math.min(30, (link.value / FLOW.totalBudget) * 120));

      // Stack offsets
      const srcOff = sourceOffsets.get(link.sourceId) ?? 0;
      const tgtOff = targetOffsets.get(link.targetId) ?? 0;

      const y1 = sourcePos.top + srcOff + strokeWidth / 2;
      const y2 = targetPos.top + tgtOff + strokeWidth / 2;

      sourceOffsets.set(link.sourceId, srcOff + strokeWidth + 1);
      targetOffsets.set(link.targetId, tgtOff + strokeWidth + 1);

      // Clamp Y within node bounds
      const clampedY1 = Math.min(y1, sourcePos.bottom - strokeWidth / 2);
      const clampedY2 = Math.min(y2, targetPos.bottom - strokeWidth / 2);

      const x1 = sourcePos.right;
      const x2 = targetPos.left;

      svgLinks.push({
        key: `${link.sourceId}-${link.targetId}`,
        path: bezierPath(x1, clampedY1, x2, clampedY2),
        strokeWidth,
        color: link.color,
        sourceId: link.sourceId,
        targetId: link.targetId,
        value: link.value,
      });
    });
  }

  return (
    <div className="grid gap-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-8">
        {/* Desktop: Three-column flow */}
        <div
          ref={containerRef}
          className="relative hidden md:grid"
          style={{ gridTemplateColumns: "140px 1fr 1fr", gap: "60px" }}
        >
          {/* SVG overlay for connectors */}
          {positions.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              {svgLinks.map((link) => {
                const isHovered =
                  hoveredLink === link.key ||
                  hoveredLink?.startsWith(link.sourceId) ||
                  hoveredLink?.endsWith(link.targetId);
                const hasHover = hoveredLink !== null;

                return (
                  <path
                    key={link.key}
                    d={link.path}
                    fill="none"
                    stroke={link.color}
                    strokeWidth={link.strokeWidth}
                    opacity={hasHover ? (isHovered ? 0.5 : 0.08) : 0.25}
                    className="transition-opacity duration-200"
                    style={{ pointerEvents: "stroke" }}
                    onMouseEnter={() => setHoveredLink(link.key)}
                    onMouseLeave={() => setHoveredLink(null)}
                  />
                );
              })}
            </svg>
          )}

          {/* Column 1: Treasury source */}
          <div className="flex items-start pt-4">
            <div
              data-flow-id="treasury"
              className="w-full rounded-2xl border border-teal-400/30 bg-teal-400/10 px-4 py-6"
              style={{ minHeight: "200px" }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-teal-300/70">Source</p>
              <p className="mt-2 text-sm font-semibold text-teal-200">Cardano Treasury</p>
              <p className="mt-1 text-xl font-bold text-white">~₳1.7B</p>
              <p className="mt-2 text-[11px] text-white/40">Total reserve</p>
              <div className="mt-4 h-px bg-teal-400/20" />
              <p className="mt-2 text-[11px] text-white/40">
                ₳{FLOW.totalBudget}M allocated in 2025
              </p>
            </div>
          </div>

          {/* Column 2: Budget Buckets */}
          <div className="space-y-2">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Budget Buckets</p>
            {FLOW.buckets.map((bucket) => (
              <div
                key={bucket.id}
                data-flow-id={bucket.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
                style={{ borderLeftColor: bucket.color, borderLeftWidth: "3px" }}
                onMouseEnter={() => setHoveredLink(bucket.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-white/90">{bucket.label}</p>
                  <p className="shrink-0 text-sm font-semibold text-white">
                    ₳{bucket.value}M
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {((bucket.value / FLOW.totalBudget) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>

          {/* Column 3: Committees */}
          <div className="space-y-2">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/40">Committees</p>
            {FLOW.committees.map((committee) => (
              <div
                key={committee.id}
                data-flow-id={committee.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
                style={{ borderLeftColor: committee.color, borderLeftWidth: "3px" }}
                onMouseEnter={() => setHoveredLink(committee.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-white/90">
                    {shortLabel(committee.label)}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-white">
                    ₳{committee.value}M
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {((committee.value / FLOW.totalBudget) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked cards with nested committees */}
        <div className="space-y-4 md:hidden">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Cardano Treasury → ₳{FLOW.totalBudget}M allocated
          </p>
          {FLOW.buckets.map((bucket) => {
            const bucketCommittees = FLOW.links
              .filter((l) => l.sourceId === bucket.id)
              .map((l) => {
                const committee = FLOW.committees.find((c) => c.id === l.targetId);
                return committee ? { ...committee, linkValue: l.value } : null;
              })
              .filter(Boolean) as (FlowNode & { linkValue: number })[];

            return (
              <div
                key={bucket.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                style={{ borderLeftColor: bucket.color, borderLeftWidth: "3px" }}
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-white">{bucket.label}</p>
                  <p className="text-sm font-semibold text-white">₳{bucket.value}M</p>
                </div>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {((bucket.value / FLOW.totalBudget) * 100).toFixed(1)}% of total budget
                </p>
                {bucketCommittees.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                    {bucketCommittees.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-[11px]">
                        <span className="text-white/60">{shortLabel(c.label)}</span>
                        <span className="font-medium text-white/80">₳{c.linkValue}M</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[11px] text-white/30">
          Treasury → 6 Budget Buckets → 8 Committees · Total: ₳{FLOW.totalBudget}M
        </p>
      </div>
    </div>
  );
}
