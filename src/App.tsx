/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Match, MatchStatus, StandingGroup, TopScorer, Venue, NewsArticle } from "./types.js";
import ScoresTab from "./components/ScoresTab.js";
import BracketTab from "./components/BracketTab.js";
import MatchDetailTab from "./components/MatchDetailTab.js";
import StandingsTab from "./components/StandingsTab.js";
import NewsTab from "./components/NewsTab.js";
import { Trophy, Clock, Wifi, Calendar, Globe, AlertTriangle } from "lucide-react";

type ActiveTab = "scores" | "bracket" | "standings" | "news" | "detail";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scores");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [previousTab, setPreviousTab] = useState<ActiveTab>("scores");

  // State caches
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingGroup[]>([]);
  const [stats, setStats] = useState<{ avgGoals: number; yellowCards: number; avgAttendance: number; topScorers: TopScorer[] }>({
    avgGoals: 2.8,
    yellowCards: 14,
    avgAttendance: 64200,
    topScorers: []
  });
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [time, setTime] = useState("");

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial tournament data
  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesRes, standingsRes, statsRes, newsRes, venuesRes] = await Promise.all([
        fetch("/api/worldcup/matches").then((r) => r.json()),
        fetch("/api/worldcup/standings").then((r) => r.json()),
        fetch("/api/worldcup/stats").then((r) => r.json()),
        fetch("/api/worldcup/news").then((r) => r.json()),
        fetch("/api/worldcup/venues").then((r) => r.json()),
      ]);

      setMatches(matchesRes.matches || []);
      setStandings(standingsRes.standings || []);
      setStats(statsRes || { avgGoals: 2.8, yellowCards: 14, avgAttendance: 64200, topScorers: [] });
      setNews(newsRes.news || []);
      setVenues(venuesRes.venues || []);
    } catch (error) {
      console.error("Failed to load World Cup data from server API, utilizing local fallback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync World Cup live stats with Google Search grounding via server
  const handleAISync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/worldcup/sync", { method: "POST" });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to sync data with AI");
      }
      // Reload updated states
      if (result.data) {
        setMatches(result.data.matches || matches);
        setNews(result.data.news || news);
        setStats((prev) => ({
          ...prev,
          topScorers: result.data.scorers || prev.topScorers
        }));
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectMatch = (match: Match) => {
    setPreviousTab(activeTab);
    setSelectedMatch(match);
    setActiveTab("detail");
  };

  const handleBackToTab = () => {
    setSelectedMatch(null);
    setActiveTab(previousTab);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between">
      {/* Upper Glowing Cyber-Line Border */}
      <div className="h-1 bg-gradient-to-r from-[#c3f400] via-[#00eefc] to-[#c3f400] w-full"></div>

      {/* Main Header & Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Logo Brand Brand */}
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

          {/* Tab Navigation links */}
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

          {/* Time & Connectivity */}
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

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#c3f400] animate-spin"></div>
            </div>
            <p className="text-on-surface-variant text-sm font-body-md animate-pulse">
              Đang kết xuất dữ liệu World Cup chính xác...
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
                onSyncWithAI={handleAISync}
                isSyncing={syncing}
              />
            )}

            {activeTab === "bracket" && (
              <BracketTab matches={matches} onSelectMatch={handleSelectMatch} />
            )}

            {activeTab === "standings" && (
              <StandingsTab standings={standings} topScorers={stats.topScorers} />
            )}

            {activeTab === "news" && <NewsTab news={news} venues={venues} />}

            {activeTab === "detail" && selectedMatch && (
              <MatchDetailTab match={selectedMatch} onBack={handleBackToTab} />
            )}
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-white/5 bg-surface/50 py-6 px-4 text-center text-xs text-on-surface-variant font-body-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 FIFA World Cup Live Scoreboard. Powered by Gemini AI with Google Search Grounding.</p>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-[#c3f400]" />
            <span className="font-label-caps text-[10px] font-bold">MÚI GIỜ: VIỆT NAM (ICT - GMT+7)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

