/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, StandingGroup, TopScorer, NewsArticle } from "../types.js";
import { TOURNAMENT_DATA_VERSION } from "../data/dataVersion.js";
import { isGroupDrawCacheValid } from "../data/validateGroupData.js";
import { computeStandingsFromMatches } from "../data/standingsFromMatches.js";

export const CLIENT_CACHE_VERSION = TOURNAMENT_DATA_VERSION;
const STORAGE_KEY = `wc2026-tournament-cache-v${CLIENT_CACHE_VERSION}`;

export interface ClientTournamentCache {
  dataVersion: number;
  matches: Match[];
  standings: StandingGroup[];
  news: NewsArticle[];
  topScorers: TopScorer[];
  lastUpdated: string | null;
}

export function standingsFromMatches(matches: Match[]): StandingGroup[] {
  return computeStandingsFromMatches(matches);
}

export function loadClientTournamentCache(): ClientTournamentCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as ClientTournamentCache;
    if (data.dataVersion !== CLIENT_CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!data.matches?.length || !isGroupDrawCacheValid(data.matches)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      ...data,
      standings: standingsFromMatches(data.matches),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveClientTournamentCache(data: Omit<ClientTournamentCache, "dataVersion" | "standings"> & { standings?: StandingGroup[] }): void {
  try {
    const payload: ClientTournamentCache = {
      dataVersion: CLIENT_CACHE_VERSION,
      matches: data.matches,
      standings: data.standings ?? standingsFromMatches(data.matches),
      news: data.news,
      topScorers: data.topScorers,
      lastUpdated: data.lastUpdated,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
  setters.setStandings(standingsFromMatches(cached.matches));
  if (cached.news?.length) setters.setNews(cached.news);
  if (cached.topScorers?.length) {
    setters.setStats((prev) => ({ ...prev, topScorers: cached.topScorers }));
  }
}
