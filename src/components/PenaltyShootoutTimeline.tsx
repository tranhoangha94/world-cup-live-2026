/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Match, PenaltyKick, PenaltyShootout } from "../types.js";
import { Target } from "lucide-react";

interface PenaltyShootoutTimelineProps {
  match: Match;
  shootout: PenaltyShootout;
}

function outcomeLabel(kick: PenaltyKick): string {
  if (kick.outcome === "scored") {
    return kick.isDecisive ? "Ghi bàn — quả thắng" : "Ghi bàn";
  }
  if (kick.outcome === "saved" && kick.savedBy) {
    return `Thủ môn ${kick.savedBy} cản`;
  }
  return kick.detail ?? "Trượt";
}

function outcomeIcon(kick: PenaltyKick): string {
  if (kick.outcome === "scored") return kick.isDecisive ? "🏆" : "✅";
  if (kick.outcome === "saved") return "🧤";
  return "❌";
}

export default function PenaltyShootoutTimeline({ match, shootout }: PenaltyShootoutTimelineProps) {
  let homeRuns = 0;
  let awayRuns = 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5">
      <h3 className="font-headline-lg-mobile text-primary mb-4 flex items-center gap-3">
        <Target className="w-5 h-5 text-[#c3f400]" />
        Diễn biến loạt luân lưu
      </h3>

      <div className="mb-5 grid grid-cols-2 gap-3 text-[10px] font-label-caps">
        <div className="rounded-xl border border-white/10 bg-surface-container/40 px-3 py-2">
          <p className="text-on-surface-variant mb-1">{match.homeTeam.name}</p>
          <p className="text-on-surface font-bold">🧤 {shootout.homeGoalkeeper}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container/40 px-3 py-2 text-right">
          <p className="text-on-surface-variant mb-1">{match.awayTeam.name}</p>
          <p className="text-on-surface font-bold">🧤 {shootout.awayGoalkeeper}</p>
        </div>
      </div>

      <div className="space-y-2">
        {shootout.kicks.map((kick, idx) => {
          if (kick.outcome === "scored") {
            if (kick.team === "home") homeRuns += 1;
            else awayRuns += 1;
          }

          const isHome = kick.team === "home";
          const flagUrl = isHome ? match.homeTeam.flagUrl : match.awayTeam.flagUrl;
          const teamName = isHome ? match.homeTeam.code : match.awayTeam.code;

          return (
            <div
              key={`${kick.player}-${idx}`}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                kick.isDecisive
                  ? "border-[#c3f400]/40 bg-[#c3f400]/10"
                  : "border-white/5 bg-surface-container/30"
              }`}
            >
              <span className="font-label-caps text-[10px] text-on-surface-variant w-6 shrink-0">
                {idx + 1}
              </span>
              <img
                src={flagUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-on-surface truncate">{kick.player}</p>
                <p className="font-label-caps text-[8px] text-on-surface-variant">{teamName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm leading-none mb-0.5">{outcomeIcon(kick)}</p>
                <p
                  className={`text-[9px] font-label-caps max-w-[120px] ${
                    kick.outcome === "scored" ? "text-[#c3f400]" : "text-on-surface-variant"
                  }`}
                >
                  {outcomeLabel(kick)}
                </p>
              </div>
              <span className="font-label-caps text-[10px] text-[#00eefc] tabular-nums shrink-0">
                {homeRuns}–{awayRuns}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
