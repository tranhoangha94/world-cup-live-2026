/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { Match, StandingGroup, TopScorer, NewsArticle } from "../types.js";

export interface TournamentCachePayload {
  dataVersion?: number;
  matches: Match[];
  standings: StandingGroup[];
  news: NewsArticle[];
  scorers: TopScorer[];
  updatedAt: string;
}

export const TOURNAMENT_DATA_VERSION = 12;

const CACHE_FILES = process.env.VERCEL
  ? [path.join("/tmp", "wc2026-tournament-cache.json")]
  : [
      path.join(process.cwd(), ".cache", "wc2026-tournament-cache.json"),
      path.join(process.cwd(), ".cache", "wc2026-grounding-cache.json"),
    ];

function cacheFileForWrite(): string {
  return CACHE_FILES[0];
}

export function loadTournamentCache(): TournamentCachePayload | null {
  for (const file of CACHE_FILES) {
    try {
      if (!fs.existsSync(file)) continue;
      const raw = fs.readFileSync(file, "utf8");
      const data = JSON.parse(raw) as TournamentCachePayload & { syncedAt?: string };
      const updatedAt = data.updatedAt ?? data.syncedAt;
      if (!updatedAt) continue;
      return { ...data, updatedAt };
    } catch {
      continue;
    }
  }
  return null;
}

export function saveTournamentCache(payload: TournamentCachePayload): void {
  try {
    const file = cacheFileForWrite();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save tournament cache:", err);
  }
}
