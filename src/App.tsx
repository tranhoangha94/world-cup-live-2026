/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Match, StandingGroup, TopScorer, Venue, NewsArticle } from "./types.js";
import ScoresTab from "./components/ScoresTab.js";
import BracketTab from "./components/BracketTab.js";
import MatchDetailTab from "./components/MatchDetailTab.js";
import StandingsTab from "./components/StandingsTab.js";
import NewsTab from "./components/NewsTab.js";
import { Trophy, Clock, Wifi } from "lucide-react";
import { saveClientTournamentCache, standingsFromMatches } from "./utils/clientCache.js";
import { applyScheduledMatchUpdates } from "./data/matchScheduler.js";
import { loadTournamentState, baseTournamentMatches } from "./data/tournamentData.js";
import { computeTopScorersFromMatches } from "./data/topScorersFromMatches.js";
import { applyBroadcastToMatches } from "./data/matchBroadcast.js";

type ActiveTab = "scores" | "bracket" | "standings" | "news" | "detail";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scores");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [previousTab, setPreviousTab] = useState<ActiveTab>("scores");

  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingGroup[]>([]);
  const [stats, setStats] = useState<{ avgGoals: number; yellowCards: number; avgAttendance: number; topScorers: TopScorer[] }>({
    avgGoals: 2.8,
    yellowCards: 14,
    avgAttendance: 64200,
    topScorers: [],
  });
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  const applyLiveState = useCallback((nextMatches: Match[]) => {
    const withBroadcast = applyBroadcastToMatches(nextMatches);
    setMatches(withBroadcast);
    setStandings(standingsFromMatches(withBroadcast));
    setStats((prev) => ({
      ...prev,
      topScorers: computeTopScorersFromMatches(withBroadcast),
    }));
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    const boot = loadTournamentState();
    applyLiveState(boot.matches);
    setNews(boot.news);
    setVenues(boot.venues);
    setStats((prev) => ({ ...prev, ...boot.stats, topScorers: boot.topScorers }));
    setLoading(false);

    saveClientTournamentCache({
      matches: boot.matches,
      news: boot.news,
      topScorers: boot.topScorers,
      lastUpdated: new Date().toISOString(),
    });
  }, [applyLiveState]);

  useEffect(() => {
    const tick = () => {
      setMatches((prev) => {
        const source = prev.length > 0 ? prev : baseTournamentMatches;
        const { matches: next, changed } = applyScheduledMatchUpdates(source);
        if (changed) {
          const withBroadcast = applyBroadcastToMatches(next);
          setStandings(standingsFromMatches(withBroadcast));
          setStats((s) => ({ ...s, topScorers: computeTopScorersFromMatches(withBroadcast) }));
          return withBroadcast;
        }
        return prev;
      });
    };
    const scheduleTimer = setInterval(tick, 60_000);
    return () => clearInterval(scheduleTimer);
  }, []);

  const handleSelectMatch = (match: Match) => {
    setPreviousTab(activeTab);
    setSelectedMatch(match);
    setActiveTab("detail");
  };

  const handleBackToTab = () => {
    setSelectedMatch(null);
    setActiveTab(previousTab);
  };

  const activeMatch = selectedMatch
    ? matches.find((m) => m.id === selectedMatch.id) ?? selectedMatch
    : null;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between">
      <div className="h-1 bg-gradient-to-r from-[#c3f400] via-[#00eefc] to-[#c3f400] w-full"></div>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("scores")}>
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(195,244,0,0.3)]">
              <Trophy className="text-[#0b0d11] w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-tight text-white flex items-center gap-1.5 uppercase">
                FIFA WORLD CUP <span className="text-[#c3f400] text-glow-green">2026</span>
              </h1>
              <p className="text-[10px] text-on-surface-variant font-label-caps tracking-widest uppercase">
                BẢNG CẬP NHẬT TRỰC TIẾP (LIVE)
              </p>
            </div>
          </div>

          {activeTab !== "detail" && (
            <nav className="flex bg-surface-container-low/80 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
              {[
                { id: "scores", label: "TỶ SỐ & LỊCH THI ĐẤU" },
                { id: "bracket", label: "SƠ ĐỒ VÒNG LOẠI" },
                { id: "standings", label: "BẢNG XẾP HẠNG" },
                { id: "news", label: "TIN TỨC & SÂN ĐẤU" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`px-4 py-2 text-[10px] sm:text-xs font-bold font-label-caps rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary-container text-[#111318] shadow-lg shadow-[#c3f400]/10 font-bold"
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5 text-[#c3f400]" />
              <span>{time || "00:00:00"} (ICT)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#00dbe9] bg-surface-container px-3 py-1.5 rounded-lg border border-white/5">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-label-caps text-[9px] font-bold">LIVE-FEED</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#c3f400] animate-spin"></div>
            </div>
            <p className="text-on-surface-variant text-sm font-body-md animate-pulse">
              Đang tải dữ liệu World Cup...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "scores" && (
              <ScoresTab
                matches={matches}
                stats={stats}
                venues={venues}
                onSelectMatch={handleSelectMatch}
              />
            )}

            {activeTab === "bracket" && (
              <BracketTab matches={matches} onSelectMatch={handleSelectMatch} />
            )}

            {activeTab === "standings" && (
              <StandingsTab standings={standings} topScorers={stats.topScorers} />
            )}

            {activeTab === "news" && <NewsTab news={news} venues={venues} />}

            {activeTab === "detail" && activeMatch && (
              <MatchDetailTab match={activeMatch} onBack={handleBackToTab} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 bg-surface/50 py-6 px-4 text-center text-xs text-on-surface-variant font-body-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 FIFA World Cup Live Scoreboard. Dữ liệu openfootball — cập nhật theo giờ VN (ICT).</p>
          <span className="font-label-caps text-[10px] font-bold">MÚI GIỜ: VIỆT NAM (ICT - GMT+7)</span>
        </div>
      </footer>
    </div>
  );
}
