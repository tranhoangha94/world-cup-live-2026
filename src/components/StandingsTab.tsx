/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { StandingGroup, TopScorer } from "../types.js";
import { ShieldAlert, Trophy, Award, Star } from "lucide-react";

interface StandingsTabProps {
  standings: StandingGroup[];
  topScorers: TopScorer[];
}

export default function StandingsTab({ standings, topScorers }: StandingsTabProps) {
  return (
    <div className="space-y-12" id="standings-view">
      <div className="text-center md:text-left space-y-2">
        <h2 className="font-headline-lg-mobile md:font-display-lg text-primary uppercase tracking-tight">
          BẢNG XẾP HẠNG WORLD CUP 2026
        </h2>
        <p className="text-on-surface-variant text-sm font-body-md">
          Bảng xếp hạng vòng bảng cập nhật theo múi giờ Việt Nam (GMT+7)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Groups Standings (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {standings.map((group) => (
            <div key={group.groupName} className="glass-card rounded-2xl p-5 md:p-6 border border-white/5 space-y-4">
              <h3 className="font-headline-lg-mobile text-primary border-l-4 border-l-[#c3f400] pl-3 uppercase">
                {group.groupName}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-on-surface-variant uppercase font-label-caps text-[10px] tracking-wider pb-3">
                      <th className="py-3 pl-2">Vị trí / Đội</th>
                      <th className="py-3 text-center">Trận</th>
                      <th className="py-3 text-center">T</th>
                      <th className="py-3 text-center">H</th>
                      <th className="py-3 text-center">B</th>
                      <th className="py-3 text-center">Hiệu số</th>
                      <th className="py-3 text-right pr-2">Điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team, idx) => (
                      <tr
                        key={team.code}
                        className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                          idx < 2 ? "bg-[#c3f400]/5" : ""
                        }`}
                      >
                        <td className="py-4 pl-2 flex items-center gap-3">
                          <span className={`font-bold ${idx < 2 ? "text-[#c3f400]" : "text-on-surface-variant"}`}>
                            {idx + 1}
                          </span>
                          <img
                            src={team.flagUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-white/10"
                          />
                          <span className="font-bold text-on-surface">{team.name}</span>
                        </td>
                        <td className="py-4 text-center font-semibold text-on-surface">{team.played}</td>
                        <td className="py-4 text-center text-on-surface-variant">{team.won}</td>
                        <td className="py-4 text-center text-on-surface-variant">{team.drawn}</td>
                        <td className="py-4 text-center text-on-surface-variant">{team.lost}</td>
                        <td className="py-4 text-center text-on-surface-variant font-mono">
                          {team.goalsDifference > 0 ? `+${team.goalsDifference}` : team.goalsDifference}
                        </td>
                        <td className="py-4 text-right pr-3 font-bold text-primary font-display-lg text-sm">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Golden Boot / Top Scorers (4 Columns) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 border-t-2 border-l-2 border-l-[#00eefc] border-t-[#00eefc]">
            <h3 className="font-label-caps text-label-caps text-[#00eefc] mb-6 flex items-center gap-2 uppercase">
              <Award className="w-5 h-5 text-[#00eefc]" /> ĐUA SONG HÙNG VUA PHÁ LƯỚI
            </h3>

            <div className="space-y-4">
              {topScorers.map((scorer) => (
                <div
                  key={scorer.name}
                  className="flex items-center gap-3 p-3 bg-surface-container/40 hover:bg-white/5 rounded-xl border border-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-container text-[#111318] font-bold flex items-center justify-center text-xs">
                    {scorer.rank}
                  </div>
                  <img
                    src={scorer.teamFlagUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">{scorer.name}</p>
                    <p className="text-[9px] text-[#00dbe9] font-label-caps uppercase">{scorer.team}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display-lg text-[#c3f400] text-lg font-bold block">{scorer.goals}</span>
                    <span className="text-[8px] text-on-surface-variant font-label-caps">BÀN THẮNG</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
