/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { Match, StandingGroup, TopScorer, NewsArticle } from "../types.js";

export interface GroundingCachePayload {
  matches: Match[];
  standings: StandingGroup[];
  news: NewsArticle[];
  scorers: TopScorer[];
  syncedAt: string;
}

function cacheFilePath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "wc2026-grounding-cache.json");
  }
  return path.join(process.cwd(), ".cache", "wc2026-grounding-cache.json");
}

export function loadGroundingCache(): GroundingCachePayload | null {
  try {
    const file = cacheFilePath();
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw) as GroundingCachePayload;
    if (!data.syncedAt) return null;
    return data;
  } catch (err) {
    console.warn("Could not load grounding cache:", err);
    return null;
  }
}

export function saveGroundingCache(payload: GroundingCachePayload): void {
  try {
    const file = cacheFilePath();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save grounding cache:", err);
  }
}

export function mergeMatches(base: Match[], updates: Match[]): Match[] {
  if (!updates.length) return base;
  return [...updates, ...base.filter((m) => !updates.some((u) => u.id === m.id))];
}
