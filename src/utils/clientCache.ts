/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, StandingGroup, TopScorer, NewsArticle } from "../types.js";

const STORAGE_KEY = "wc2026-tournament-cache-v2";

export interface ClientTournamentCache {
  matches: Match[];
  standings: StandingGroup[];
  news: NewsArticle[];
  topScorers: TopScorer[];
  lastUpdated: string | null;
}

export function loadClientTournamentCache(): ClientTournamentCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("wc2026-grounding-cache");
    if (!raw) return null;
    const data = JSON.parse(raw) as ClientTournamentCache & { lastGroundingSync?: string };
    return {
      ...data,
      lastUpdated: data.lastUpdated ?? data.lastGroundingSync ?? null,
    };
  } catch {
    return null;
  }
}

export function saveClientTournamentCache(data: ClientTournamentCache): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function applyClientCacheToState(
  cached: ClientTournamentCache,
  setters: {
    setMatches: (m: Match[]) => void;
    setStandings: (s: StandingGroup[]) => void;
    setNews: (n: NewsArticle[]) => void;
    setStats: (fn: (prev: { avgGoals: number; yellowCards: number; avgAttendance: number; topScorers: TopScorer[] }) => unknown) => void;
  }
): void {
  if (cached.matches?.length) setters.setMatches(cached.matches);
  if (cached.standings?.length) setters.setStandings(cached.standings);
  if (cached.news?.length) setters.setNews(cached.news);
  if (cached.topScorers?.length) {
    setters.setStats((prev) => ({ ...prev, topScorers: cached.topScorers }));
  }
}
