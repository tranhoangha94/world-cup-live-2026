/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, StandingGroup, TopScorer, NewsArticle } from "../types.js";

const STORAGE_KEY = "wc2026-grounding-cache";

export interface ClientGroundingCache {
  matches: Match[];
  standings: StandingGroup[];
  news: NewsArticle[];
  topScorers: TopScorer[];
  lastGroundingSync: string | null;
}

export function loadClientGroundingCache(): ClientGroundingCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClientGroundingCache;
  } catch {
    return null;
  }
}

export function saveClientGroundingCache(data: ClientGroundingCache): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function applyClientCacheToState(
  cached: ClientGroundingCache,
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
