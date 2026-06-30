/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Match, MatchStatus } from "../types.js";
import { Award, Trophy, MapPin, Calendar, Clock, ChevronRight, LayoutGrid, Network } from "lucide-react";
import { formatBracketKickoff, formatBroadcastTimeVN } from "../utils/matchTime.js";

interface BracketTabProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

type StageType = "all" | "r32" | "r16" | "finals";

export default function BracketTab({ matches, onSelectMatch }: BracketTabProps) {
  const [activeStage, setActiveStage] = useState<StageType>("all");

  // Find matches of each stage
  const r32Matches = matches.filter((m) => m.id.startsWith("r32_"));
  const r16Matches = matches.filter((m) => m.id.startsWith("r16_"));
  const qfMatches = matches.filter((m) => m.id.startsWith("qf_"));
  const sfMatches = matches.filter((m) => m.id.startsWith("sf_"));
  const finalMatch = matches.find((m) => m.id === "final");

  // Helper to get score display
  const getScoreDisplay = (match: Match, side: "home" | "away") => {
    if (match.status === MatchStatus.UPCOMING) return "-";
    const score = side === "home" ? match.homeScore : match.awayScore;
    const pens = side === "home" ? match.homePens : match.awayPens;
    
    if (pens !== undefined) {
      return (
        <span className="flex items-center gap-1 font-bold">
          <span>{score}</span>
          <span className="text-[10px] text-primary bg-primary/10 px-1 rounded">({pens})</span>
        </span>
      );
    }
    return score !== undefined ? score : "-";
  };

  // Helper to render a bracket match card
  const renderBracketCard = (match: Match, compact = false) => {
    const isFinished = match.status === MatchStatus.FINISHED;
    const isLive = match.status === MatchStatus.LIVE;

    if (compact) {
      return (
        <div
          key={match.id}
          onClick={() => onSelectMatch(match)}
          className="bg-surface-container-low/60 hover:bg-surface-container/85 border border-white/5 p-2 rounded-xl transition-all duration-200 cursor-pointer text-left group hover:border-[#c3f400]/40 w-52 flex flex-col gap-1.5 shadow-md"
        >
          <div className="flex justify-between items-center text-[8px] font-label-caps text-on-surface-variant border-b border-white/5 pb-1 gap-1">
            <span className="truncate">{formatBracketKickoff(match)}</span>
            {isLive && <span className="text-[#c3f400] animate-pulse shrink-0">LIVE</span>}
            {isFinished && !isLive && <span className="text-on-surface-variant font-bold shrink-0">FT</span>}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <img src={match.homeTeam.flagUrl} alt="" className="w-4 h-4 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                <span className="text-[10px] font-semibold truncate max-w-[110px] text-on-surface">{match.homeTeam.name}</span>
              </div>
              <span className="text-[10px] font-bold text-primary">{getScoreDisplay(match, "home")}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <img src={match.awayTeam.flagUrl} alt="" className="w-4 h-4 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                <span className="text-[10px] font-semibold truncate max-w-[110px] text-on-surface-variant">{match.awayTeam.name}</span>
              </div>
              <span className="text-[10px] font-bold text-primary">{getScoreDisplay(match, "away")}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={match.id}
        onClick={() => onSelectMatch(match)}
        className="glass-card p-4 rounded-2xl relative group hover:border-[#c3f400]/50 hover:translate-y-[-2px] transition-all cursor-pointer border border-white/5 w-64 shadow-lg text-left"
      >
        <div className="flex items-start justify-between gap-2 mb-2.5">
          {match.time ? (
            <span className="flex items-center gap-1 text-[8px] font-label-caps text-[#00eefc] shrink-0">
              <Clock className="w-3 h-3" />
              {formatBroadcastTimeVN(match.time)}
            </span>
          ) : (
            <span />
          )}
          {isLive ? (
            <span className="bg-[#c3f400]/10 text-[#c3f400] font-label-caps text-[8px] px-2 py-0.5 rounded-full animate-pulse font-bold shrink-0">LIVE</span>
          ) : isFinished ? (
            <span className="bg-white/10 text-on-surface-variant font-label-caps text-[8px] px-2 py-0.5 rounded-full shrink-0">FT</span>
          ) : (
            <span className="text-[#00eefc] font-label-caps text-[8px] shrink-0">SẮP DIỄN RA</span>
          )}
        </div>
        <div className="text-[9px] text-on-surface-variant font-label-caps mb-2.5">
          {match.date} • {match.venue.split(",")[0]}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img src={match.homeTeam.flagUrl} alt="" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
              <span className="font-bold text-xs truncate max-w-[130px] text-on-surface">{match.homeTeam.name}</span>
            </div>
            <span className="text-[#c3f400] font-display-lg text-sm font-bold">{getScoreDisplay(match, "home")}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img src={match.awayTeam.flagUrl} alt="" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
              <span className="text-on-surface-variant text-xs truncate max-w-[130px]">{match.awayTeam.name}</span>
            </div>
            <span className="text-[#c3f400] font-display-lg text-sm font-bold">{getScoreDisplay(match, "away")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="bracket-view">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <h2 className="font-headline-lg-mobile md:font-display-lg text-primary uppercase tracking-tight text-glow">
            BẢNG ĐẤU LOẠI TRỰC TIẾP
          </h2>
          <p className="text-on-surface-variant text-xs md:text-sm font-body-md">
            Sơ đồ thi đấu World Cup 2026 chính thức (Múi giờ Việt Nam - GMT+7)
          </p>
        </div>

        {/* View mode toggle buttons */}
        <div className="flex flex-wrap gap-2 bg-surface-container-low/75 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveStage("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStage === "all" ? "bg-primary text-[#111318]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Toàn Cảnh Diagram
          </button>
          <button
            onClick={() => setActiveStage("r32")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStage === "r32" ? "bg-primary text-[#111318]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Vòng 32 Đội
          </button>
          <button
            onClick={() => setActiveStage("r16")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStage === "r16" ? "bg-primary text-[#111318]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Vòng 16 Đội
          </button>
          <button
            onClick={() => setActiveStage("finals")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeStage === "finals" ? "bg-primary text-[#111318]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Tứ Kết & Chung Kết
          </button>
        </div>
      </div>

      {/* STAGE: ALL DIAGRAM (Panoramic Horizontal Map) */}
      {activeStage === "all" && (
        <div className="overflow-x-auto pb-10 scrollbar-thin scrollbar-thumb-primary">
          <div className="relative flex gap-12 items-center min-w-[1400px] pt-8 px-4 justify-between h-[820px]">
            {/* Column 1: VÒNG 32 (8 matches Left Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-[#c3f400] pl-2 mb-2 font-bold uppercase tracking-wider">Vòng 32 (Nhánh 1)</h4>
              <div className="flex-1 flex flex-col justify-around py-4">
                {r32Matches.slice(0, 8).map((m) => renderBracketCard(m, true))}
              </div>
            </div>

            {/* Column 2: VÒNG 16 (4 matches Left Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-[#00eefc] pl-2 mb-2 font-bold uppercase tracking-wider">Vòng 16 (Nhánh 1)</h4>
              <div className="flex-1 flex flex-col justify-around py-12">
                {r16Matches.slice(0, 4).map((m) => renderBracketCard(m, true))}
              </div>
            </div>

            {/* Column 3: TỨ KẾT (2 matches Left Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-white pl-2 mb-2 font-bold uppercase tracking-wider">Tứ Kết</h4>
              <div className="flex-1 flex flex-col justify-around py-24">
                {qfMatches.slice(0, 2).map((m) => renderBracketCard(m, true))}
              </div>
            </div>

            {/* Column 4: BÁN KẾT & CHUNG KẾT (Centered Trophy & Finals) */}
            <div className="flex flex-col justify-center items-center h-full w-72 space-y-16">
              {/* Semifinal 1 */}
              {sfMatches[0] && renderBracketCard(sfMatches[0], true)}

              {/* Giant Trophy Final Card */}
              {finalMatch && (
                <div
                  onClick={() => onSelectMatch(finalMatch)}
                  className="glass-card p-5 rounded-3xl border border-[#c3f400]/30 shadow-[0_0_30px_rgba(195,244,0,0.15)] relative overflow-hidden bg-gradient-to-b from-[#c3f400]/5 to-transparent w-64 hover:scale-105 active:scale-95 duration-300 cursor-pointer"
                >
                  <div className="relative z-10 flex flex-col items-center gap-4 py-1 text-center">
                    <div className="w-12 h-14 rounded-full border-2 border-[#c3f400]/40 flex items-center justify-center bg-surface-container shadow-xl">
                      <Trophy className="text-[#c3f400] w-6 h-6 animate-pulse" />
                    </div>
                    <span className="font-label-caps text-[9px] text-[#c3f400] tracking-widest font-bold">CHUNG KẾT</span>

                    <div className="w-full border-y border-white/10 py-2.5 my-1 text-center">
                      <div className="flex items-center justify-around gap-2">
                        <span className="font-semibold text-xs truncate max-w-[80px]">{finalMatch.homeTeam.name}</span>
                        <span className="font-display-lg text-base text-[#c3f400]">VS</span>
                        <span className="font-semibold text-xs truncate max-w-[80px] text-on-surface-variant">{finalMatch.awayTeam.name}</span>
                      </div>
                    </div>

                    <div className="text-center space-y-0.5">
                      <div className="text-primary font-bold text-[10px] tracking-wide">{finalMatch.venue.split(",")[0].toUpperCase()}</div>
                      <div className="text-on-surface-variant text-[9px] font-label-caps flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3 text-[#c3f400]" />
                        {formatBracketKickoff(finalMatch)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Semifinal 2 */}
              {sfMatches[1] && renderBracketCard(sfMatches[1], true)}
            </div>

            {/* Column 5: TỨ KẾT (2 matches Right Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-white pl-2 mb-2 font-bold uppercase tracking-wider text-right pr-2">Tứ Kết</h4>
              <div className="flex-1 flex flex-col justify-around py-24">
                {qfMatches.slice(2, 4).map((m) => renderBracketCard(m, true))}
              </div>
            </div>

            {/* Column 6: VÒNG 16 (4 matches Right Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-[#00eefc] pl-2 mb-2 font-bold uppercase tracking-wider text-right pr-2">Vòng 16 (Nhánh 2)</h4>
              <div className="flex-1 flex flex-col justify-around py-12">
                {r16Matches.slice(4, 8).map((m) => renderBracketCard(m, true))}
              </div>
            </div>

            {/* Column 7: VÒNG 32 (8 matches Right Side) */}
            <div className="flex flex-col justify-around h-full w-52">
              <h4 className="font-label-caps text-[10px] text-on-surface-variant border-l-2 border-[#c3f400] pl-2 mb-2 font-bold uppercase tracking-wider text-right pr-2">Vòng 32 (Nhánh 2)</h4>
              <div className="flex-1 flex flex-col justify-around py-4">
                {r32Matches.slice(8, 16).map((m) => renderBracketCard(m, true))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE: R32 GRID (Scannable Cards list) */}
      {activeStage === "r32" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Award className="w-5 h-5 text-[#c3f400]" />
            <span>DANH SÁCH 16 CẶP ĐẤU VÒNG 32 (ROUND OF 32)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {r32Matches.map((m) => renderBracketCard(m))}
          </div>
        </div>
      )}

      {/* STAGE: R16 GRID */}
      {activeStage === "r16" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#00eefc] font-bold text-sm">
            <Trophy className="w-5 h-5" />
            <span>SƠ ĐỒ PHÂN CẶP VÒNG 16 ĐỘI (ROUND OF 16)</span>
          </div>
          {r16Matches.length === 0 ? (
            <p className="text-on-surface-variant text-sm">Chưa có trận đấu nào được ghi nhận cho vòng đấu này.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {r16Matches.map((m) => renderBracketCard(m))}
            </div>
          )}
        </div>
      )}

      {/* STAGE: FINALS (QF, SF, FINAL) */}
      {activeStage === "finals" && (
        <div className="space-y-12">
          {/* Tứ Kết Section */}
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-primary border-l-2 border-[#c3f400] pl-2 font-bold tracking-wider uppercase">Vòng Tứ Kết (Quarter-Finals)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {qfMatches.map((m) => renderBracketCard(m))}
            </div>
          </div>

          {/* Bán Kết Section */}
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-[#00eefc] border-l-2 border-[#00eefc] pl-2 font-bold tracking-wider uppercase">Vòng Bán Kết (Semi-Finals)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {sfMatches.map((m) => renderBracketCard(m))}
            </div>
          </div>

          {/* Chung Kết Section */}
          <div className="space-y-4">
            <h3 className="font-label-caps text-xs text-white border-l-2 border-white pl-2 font-bold tracking-wider uppercase">Trận Chung Kết Trong Mơ (Grand Final)</h3>
            {finalMatch && (
              <div className="max-w-md">
                {renderBracketCard(finalMatch)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
