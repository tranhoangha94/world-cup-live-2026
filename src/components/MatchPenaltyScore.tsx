/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Match, MatchStatus } from "../types.js";
import { hasPenaltyShootout, penaltyShootoutSummary } from "../utils/matchScore.js";

interface TeamScoreProps {
  score?: number;
  pens?: number;
  className?: string;
}

/** Tỷ số hiệp chính + (bàn luân lưu) theo từng đội. */
export function TeamMatchScore({ score, pens, className = "" }: TeamScoreProps) {
  if (score === undefined) {
    return <span className={className}>-</span>;
  }
  if (pens !== undefined) {
    return (
      <span className={`inline-flex items-baseline gap-0.5 ${className}`}>
        <span>{score}</span>
        <span className="text-[0.58em] font-bold text-[#c3f400] leading-none">({pens})</span>
      </span>
    );
  }
  return <span className={className}>{score}</span>;
}

interface PenaltyShootoutBadgeProps {
  homePens: number;
  awayPens: number;
  className?: string;
}

export function PenaltyShootoutBadge({ homePens, awayPens, className = "" }: PenaltyShootoutBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-label-caps text-[10px] text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/25 rounded-full px-2.5 py-1 ${className}`}
    >
      {penaltyShootoutSummary(homePens, awayPens)}
    </span>
  );
}

interface MatchHeroScoreProps {
  match: Match;
}

/** Tỷ số lớn ở trang chi tiết trận — kèm loạt luân lưu nếu có. */
export function MatchHeroScore({ match }: MatchHeroScoreProps) {
  const showScore = match.status !== MatchStatus.UPCOMING;
  const pens = hasPenaltyShootout(match);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4">
        <span className="font-display-lg text-[44px] md:text-[68px] text-primary">
          {showScore ? (
            <TeamMatchScore score={match.homeScore} pens={match.homePens} />
          ) : (
            "-"
          )}
        </span>
        <span className="font-display-lg text-[32px] md:text-[48px] opacity-30 text-primary">:</span>
        <span className="font-display-lg text-[44px] md:text-[68px] text-primary">
          {showScore ? (
            <TeamMatchScore score={match.awayScore} pens={match.awayPens} />
          ) : (
            "-"
          )}
        </span>
      </div>
      {pens && match.homePens !== undefined && match.awayPens !== undefined && (
        <div className="mt-3 flex flex-col items-center gap-1">
          <PenaltyShootoutBadge homePens={match.homePens} awayPens={match.awayPens} className="text-[11px]" />
          <span className="font-label-caps text-[9px] text-on-surface-variant">
            Tỷ số hiệp chính {match.homeScore}–{match.awayScore}
          </span>
        </div>
      )}
    </div>
  );
}
