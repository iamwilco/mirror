"use client";

import React, { useState, useCallback } from "react";
import { Tooltip } from "react-tooltip";

/* ── Types ─────────────────────────────────────── */

interface Member {
  name: string;
  role?: string;
  elected?: string;
}

interface HierarchyNode {
  name: string;
  details?: string;
  decision_power?: string;
  how_work_done?: string;
  chairs_vice?: string;
  under?: string;
  transparency_note?: string;
  members?: Member[] | string;
  elected_members?: Member[];
  children?: HierarchyNode[];
}

/* ── Power → color mapping ─────────────────────── */

function powerColor(power?: string) {
  if (!power) return { border: "border-white/20", badge: "bg-white/10", badgeText: "text-white/50", glow: "", line: "bg-white/15" };
  const p = power.toLowerCase();
  if (p.includes("ultimate"))
    return { border: "border-violet-400/60", badge: "bg-violet-500/20", badgeText: "text-violet-300", glow: "shadow-violet-500/10 shadow-lg", line: "bg-violet-400/40" };
  if (p.includes("high"))
    return { border: "border-emerald-400/60", badge: "bg-emerald-500/20", badgeText: "text-emerald-300", glow: "shadow-emerald-500/10 shadow-lg", line: "bg-emerald-400/40" };
  if (p.includes("medium"))
    return { border: "border-amber-400/60", badge: "bg-amber-500/20", badgeText: "text-amber-300", glow: "shadow-amber-500/10 shadow-lg", line: "bg-amber-400/40" };
  return { border: "border-rose-400/60", badge: "bg-rose-500/20", badgeText: "text-rose-300", glow: "shadow-rose-500/10 shadow-lg", line: "bg-rose-400/40" };
}

/* ── Connector line (vertical) ─────────────────── */

function VLine({ className = "bg-white/15" }: { className?: string }) {
  return <div className={`mx-auto h-6 w-0.5 ${className}`} />;
}

/* ── Node card ─────────────────────────────────── */

function NodeCard({ node, full }: { node: HierarchyNode; full?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const colors = powerColor(node.decision_power);

  const allMembers: Member[] = [
    ...((Array.isArray(node.members) ? node.members : []) as Member[]),
    ...(node.elected_members ?? []),
  ];

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  }, []);

  return (
    <div
      data-tooltip-id="org-tip"
      data-tooltip-html={buildTooltip(node)}
      className={`relative cursor-default rounded-xl border ${colors.border} ${colors.glow} bg-gray-900/90 px-4 py-3 text-left backdrop-blur transition hover:scale-[1.02] hover:brightness-110 ${full ? "w-full" : ""}`}
    >
      {/* Power badge */}
      {node.decision_power && (
        <span className={`absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colors.badge} ${colors.badgeText}`}>
          {node.decision_power.split("—")[0].trim()}
        </span>
      )}

      {/* Name */}
      <p className="text-[13px] font-semibold leading-tight text-white">{node.name}</p>

      {/* Details snippet */}
      {node.details && (
        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-white/40">{node.details}</p>
      )}

      {/* Chair / Under */}
      {node.chairs_vice && (
        <p className="mt-1 text-[10px] text-white/50">Chair: {node.chairs_vice}</p>
      )}
      {node.under && (
        <p className="mt-1 text-[10px] text-white/50">Under: {node.under}</p>
      )}

      {/* Members preview */}
      {allMembers.length > 0 && (
        <div className="mt-2">
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 text-[10px] font-medium text-white/50 transition hover:text-white/80"
          >
            <span className={`inline-block transition-transform ${expanded ? "rotate-90" : ""}`}>&#9654;</span>
            {allMembers.length} member{allMembers.length !== 1 ? "s" : ""}
          </button>
          {expanded && (
            <ul className="mt-1.5 space-y-0.5">
              {allMembers.map((m, i) => (
                <li key={i} className="text-[10px] leading-snug text-white/60">
                  <span className="font-medium text-white/80">{m.name}</span>
                  {m.role && <span className="text-white/40"> — {m.role}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* String members (WGs) */}
      {typeof node.members === "string" && (
        <p className="mt-1.5 text-[10px] text-white/40">{node.members}</p>
      )}

      {/* Transparency note */}
      {node.transparency_note && (
        <p className="mt-2 rounded-md bg-rose-500/10 px-2 py-1 text-[10px] leading-snug text-rose-300/80">
          &#9888; {node.transparency_note}
        </p>
      )}
    </div>
  );
}

/* ── Tooltip builder ───────────────────────────── */

function buildTooltip(node: HierarchyNode): string {
  const lines: string[] = [];
  lines.push(`<strong class="text-white text-sm">${node.name}</strong>`);
  if (node.details) lines.push(`<p class="mt-1 text-xs text-white/70">${node.details}</p>`);
  if (node.decision_power) lines.push(`<p class="mt-1 text-xs"><span class="text-emerald-300 font-semibold">Power:</span> ${node.decision_power}</p>`);
  if (node.how_work_done) lines.push(`<p class="text-xs"><span class="text-amber-300 font-semibold">How:</span> ${node.how_work_done}</p>`);
  if (node.chairs_vice) lines.push(`<p class="text-xs"><span class="text-violet-300 font-semibold">Chair:</span> ${node.chairs_vice}</p>`);
  if (node.transparency_note) lines.push(`<p class="mt-1 text-xs text-rose-300">⚠ ${node.transparency_note}</p>`);
  return lines.join("");
}

/* ── Vertical tree section ─────────────────────── */

function TreeLevel({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) {
  const colors = powerColor(node.decision_power);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* This node */}
      <div className={depth === 0 ? "w-full max-w-md" : "w-full"}>
        <NodeCard node={node} full />
      </div>

      {/* Connector + children */}
      {hasChildren && (
        <>
          <VLine className={colors.line} />

          {/* Label arrow */}
          <div className={`h-2 w-2 rotate-45 border-b-2 border-r-2 ${colors.border} -mt-1.5 mb-1`} />

          {/* Children grid — responsive, wrapping */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {node.children!.map((child, i) => (
              <TreeLevel key={i} node={child} depth={depth + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main export ───────────────────────────────── */

export default function OrgChart({ data }: { data: HierarchyNode }) {
  return (
    <div className="pb-8">
      {/* Root node */}
      <div className="mx-auto max-w-md">
        <NodeCard node={data} full />
      </div>

      {/* Top-level sections flow vertically */}
      {data.children?.map((section, i) => {
        const colors = powerColor(section.decision_power);
        return (
          <div key={i} className="mt-2 flex flex-col items-center">
            <VLine className={colors.line} />
            <TreeLevel node={section} depth={0} />
          </div>
        );
      })}

      <Tooltip
        id="org-tip"
        place="top"
        className="z-50! max-w-xs! rounded-xl! border! border-white/10! bg-gray-950/95! px-4! py-3! backdrop-blur-lg!"
        opacity={1}
      />
    </div>
  );
}
