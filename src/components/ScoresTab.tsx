/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Match, MatchStatus, TopScorer, Venue } from "../types.js";
import { Search, Calendar, ChevronLeft, ChevronRight, Trophy, MapPin, Clock, Tv } from "lucide-react";
import {
  formatBroadcastTimeVN,
  groupMatchesByCalendarDate,
  calendarToInputValue,
  inputValueToCalendar,
  resolveDefaultCalendarDate,
  sortCalendarKeysAsc,
} from "../utils/matchTime.js";

interface ScoresTabProps {
  matches: Match[];
  stats: {
    avgGoals: number;
    yellowCards: number;
    avgAttendance: number;
    topScorers: TopScorer[];
  };
  venues: Venue[];
  onSelectMatch: (match: Match) => void;
}

export default function ScoresTab({
  matches,
  stats,
  venues,
  onSelectMatch,
}: ScoresTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const filteredMatches = matches.filter(
    (m) =>
      m.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dateGroups = groupMatchesByCalendarDate(filteredMatches);
  const sortedDateKeys = useMemo(
    () => sortCalendarKeysAsc(dateGroups.map((g) => g.key)),
    [dateGroups]
  );

  useEffect(() => {
    if (dateGroups.length === 0) {
      setSelectedDateKey(null);
      return;
    }
    setSelectedDateKey((current) => {
      if (current && dateGroups.some((g) => g.key === current)) return current;
      return resolveDefaultCalendarDate(sortedDateKeys);
    });
  }, [dateGroups, sortedDateKeys]);

  const selectedGroup = dateGroups.find((g) => g.key === selectedDateKey) ?? null;
  const selectedIndex = selectedDateKey ? sortedDateKeys.indexOf(selectedDateKey) : -1;
  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex >= 0 && selectedIndex < sortedDateKeys.length - 1;

  const goPrevDay = () => {
    if (canGoPrev) setSelectedDateKey(sortedDateKeys[selectedIndex - 1]);
  };

  const goNextDay = () => {
    if (canGoNext) setSelectedDateKey(sortedDateKeys[selectedIndex + 1]);
  };

  const handleDatePick = (value: string) => {
    if (!value) return;
    const calendar = inputValueToCalendar(value);
    if (sortedDateKeys.includes(calendar)) setSelectedDateKey(calendar);
  };

  const spotlightVenue = venues.find((v) => v.imageUrl);

  return (
    <div className="space-y-8" id="scores-view">
      <div className="bg-surface-container-low/70 backdrop-blur-md p-4 rounded-2xl border border-white/5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm đội bóng, sân vận động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-xl border border-white/10 focus:border-[#c3f400] focus:ring-0 text-on-surface text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {dateGroups.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border border-white/5 space-y-4">
              <p className="text-on-surface-variant font-body-lg">Không tìm thấy trận đấu nào phù hợp.</p>
              <button onClick={() => setSearchTerm("")} className="text-[#c3f400] font-bold text-sm hover:underline">
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Date navigation: prev / date picker / next */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Calendar className="text-[#c3f400] w-5 h-5 shrink-0" />
                  <h3 className="font-headline-lg-mobile md:font-headline-lg text-primary truncate">
                    {selectedGroup?.label ?? selectedDateKey}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={goPrevDay}
                    disabled={!canGoPrev}
                    aria-label="Ngày trước"
                    className="p-1.5 glass-card rounded-lg hover:bg-[#c3f400] hover:text-on-primary-fixed transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <input
                    type="date"
                    value={selectedDateKey ? calendarToInputValue(selectedDateKey) : ""}
                    min={sortedDateKeys.length ? calendarToInputValue(sortedDateKeys[0]) : undefined}
                    max={sortedDateKeys.length ? calendarToInputValue(sortedDateKeys[sortedDateKeys.length - 1]) : undefined}
                    onChange={(e) => handleDatePick(e.target.value)}
                    className="px-3 py-1.5 glass-card rounded-lg border border-white/10 bg-surface-container-high text-on-surface text-xs font-medium focus:border-[#c3f400] focus:ring-0 cursor-pointer [color-scheme:dark]"
                    aria-label="Chọn ngày xem lịch thi đấu"
                  />

                  <button
                    type="button"
                    onClick={goNextDay}
                    disabled={!canGoNext}
                    aria-label="Ngày sau"
                    className="p-1.5 glass-card rounded-lg hover:bg-[#c3f400] hover:text-on-primary-fixed transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedGroup && selectedGroup.matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedGroup.matches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => onSelectMatch(match)}
                      className={`glass-card p-5 rounded-2xl border-l-4 transition-all hover:translate-y-[-2px] active:scale-[0.98] cursor-pointer relative overflow-hidden group ${
                        match.status === MatchStatus.LIVE
                          ? "border-l-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)] ring-1 ring-[#c3f400]/20"
                          : "border-l-[#00dbe9]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        {match.time ? (
                          <span className="flex items-center gap-1 text-[10px] font-label-caps text-[#00eefc] shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {formatBroadcastTimeVN(match.time)}
                          </span>
                        ) : (
                          <span />
                        )}
                        {match.status === MatchStatus.LIVE ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="flex h-2 w-2 rounded-full bg-primary-fixed animate-pulse"></span>
                            <span className="text-[10px] font-label-caps text-[#c3f400]">TRỰC TIẾP - {match.minute || "72'"}</span>
                          </div>
                        ) : match.status === MatchStatus.FINISHED ? (
                          <span className="bg-white/10 text-on-surface-variant font-label-caps text-[9px] px-2 py-0.5 rounded-full shrink-0">KẾT THÚC (FT)</span>
                        ) : (
                          <span className="text-[11px] font-label-caps text-[#00dbe9] shrink-0">SẮP DIỄN RA</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              src={match.homeTeam.flagUrl}
                              alt={match.homeTeam.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <span className="font-body-lg font-bold text-on-surface">{match.homeTeam.name}</span>
                              {match.homeTeam.label && (
                                <span className="block text-[8px] font-label-caps text-[#c3f400]">{match.homeTeam.label}</span>
                              )}
                            </div>
                          </div>
                          <span className="font-display-lg text-[22px] text-primary tabular-nums min-w-[1.5rem] text-right">
                            {match.status !== MatchStatus.UPCOMING ? match.homeScore : "-"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              src={match.awayTeam.flagUrl}
                              alt={match.awayTeam.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <span className="font-body-lg font-bold text-on-surface">{match.awayTeam.name}</span>
                              {match.awayTeam.label && (
                                <span className="block text-[8px] font-label-caps text-on-surface-variant">{match.awayTeam.label}</span>
                              )}
                            </div>
                          </div>
                          <span className="font-display-lg text-[22px] text-primary tabular-nums min-w-[1.5rem] text-right">
                            {match.status !== MatchStatus.UPCOMING ? match.awayScore : "-"}
                          </span>
                        </div>
                      </div>

                      {match.broadcast && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] font-label-caps">
                          <span className="flex items-center gap-1 text-[#00eefc]">
                            <Tv className="w-3 h-3" />
                            {match.broadcast.channels.join(" • ")}
                          </span>
                          <a
                            href={match.broadcast.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#c3f400] hover:underline"
                          >
                            {match.broadcast.watchLabel}
                          </a>
                        </div>
                      )}

                      <div className="mt-5 flex justify-between items-center border-t border-white/5 pt-3 gap-2">
                        <span className="text-[10px] text-on-surface-variant font-label-caps truncate">
                          {match.group ? `${match.group} • ` : ""}{match.venue.split(",")[0]}
                        </span>
                        <span className="text-[#c3f400] text-[10px] font-bold flex items-center gap-0.5 group-hover:translate-x-1 duration-200">
                          CHI TIẾT <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center rounded-2xl border border-white/5">
                  <p className="text-on-surface-variant font-body-md">Không có trận đấu trong ngày này.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="xl:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl border-t-2 border-[#c3f400] relative overflow-hidden">
            <h4 className="font-label-caps text-label-caps text-[#c3f400] mb-5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#c3f400]" /> THỐNG KÊ GIẢI ĐẤU
            </h4>
            <div className="space-y-3">
              <div className="bg-surface-container/60 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-on-surface-variant text-xs">Bàn thắng / Trận</span>
                <span className="font-bold text-primary text-sm">{stats.avgGoals}</span>
              </div>
              <div className="bg-surface-container/60 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-on-surface-variant text-xs">Thẻ vàng</span>
                <span className="font-bold text-[#e9c400] text-sm">{stats.yellowCards}</span>
              </div>
              <div className="bg-surface-container/60 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <span className="text-on-surface-variant text-xs">Khán giả trung bình</span>
                <span className="font-bold text-[#00dbe9] text-sm">{stats.avgAttendance.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <h5 className="text-[10px] font-bold text-on-surface mb-3 uppercase tracking-wider">Vua phá lưới</h5>
              <div className="space-y-2.5">
                {stats.topScorers.slice(0, 2).map((scorer) => (
                  <div key={scorer.name} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center font-bold text-[10px] text-primary">
                      {scorer.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-on-surface">{scorer.name}</p>
                      <p className="text-[8px] text-on-surface-variant font-label-caps uppercase">{scorer.team}</p>
                    </div>
                    <span className="font-display-lg text-sm text-primary">{scorer.goals}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <h4 className="font-label-caps text-label-caps text-[#00eefc] mb-5 flex justify-between items-center">
              <span>SƠ ĐỒ VÒNG LOẠI</span>
              <Trophy className="w-3.5 h-3.5" />
            </h4>
            <div className="space-y-4">
              <div className="bg-surface-container/40 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface">Argentina</span>
                  <span className="text-xs text-[#c3f400]">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface-variant">Pháp</span>
                  <span className="text-xs text-on-surface-variant">0</span>
                </div>
              </div>

              <div className="bg-[#c3f400]/5 border border-[#c3f400]/20 p-4 rounded-xl text-center space-y-3">
                <p className="text-[9px] font-bold text-[#c3f400] tracking-widest uppercase">CHUNG KẾT TRONG MƠ</p>
                <div className="flex justify-around items-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full border border-dashed border-[#c3f400]/40 flex items-center justify-center bg-black/40 text-on-surface-variant">
                      ?
                    </div>
                    <p className="text-[9px] font-bold mt-1 text-on-surface-variant">TBD</p>
                  </div>
                  <span className="text-primary font-display-lg text-sm">VS</span>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-black/40 text-on-surface-variant">
                      ?
                    </div>
                    <p className="text-[9px] font-bold mt-1 text-on-surface-variant">TBD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {spotlightVenue && (
            <div className="rounded-2xl overflow-hidden glass-card relative h-48 group border border-white/5">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-60"
                style={{ backgroundImage: `url('${spotlightVenue.imageUrl}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[8px] font-label-caps bg-primary-container text-on-primary-container px-2 py-0.5 rounded">
                  THÀNH PHỐ CHỦ NHÀ
                </span>
                <h5 className="font-headline-lg-mobile text-primary mt-1">{spotlightVenue.city}</h5>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-body-md">
                  <MapPin className="w-3 h-3 text-[#c3f400]" /> {spotlightVenue.name}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
