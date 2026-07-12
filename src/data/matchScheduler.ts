/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchStatus } from "../types.js";

/** Parse kickoff from match date (VN) + time (ICT, UTC+7). */
export function parseKickoffICT(date: string, time: string): Date | null {
  const dateMatch = date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!dateMatch || !time) return null;
  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const year = parseInt(dateMatch[3], 10);
  const [hours, minutes] = time.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, 0, 0));
}

function liveMinute(kickoffMs: number, nowMs: number): string {
  const elapsed = Math.floor((nowMs - kickoffMs) / 60_000);
  if (elapsed <= 0) return "1'";
  // Rough match clock: subtract ~15' halftime after first half.
  const matchClock = elapsed > 45 ? elapsed - 15 : elapsed;
  if (matchClock > 120) return "120+'";
  if (matchClock > 90) return `${matchClock}'`;
  return `${matchClock}'`;
}

function scheduleStatus(match: Match, nowMs: number): Match | null {
  if (match.status === MatchStatus.FINISHED) return null;

  const kickoff = parseKickoffICT(match.date, match.time);
  if (!kickoff) return null;

  const kickoffMs = kickoff.getTime();

  if (nowMs >= kickoffMs) {
    if (match.status === MatchStatus.LIVE) return null;
    const minute = liveMinute(kickoffMs, nowMs);
    return { ...match, status: MatchStatus.LIVE, minute };
  }

  if (match.status !== MatchStatus.UPCOMING) {
    return { ...match, status: MatchStatus.UPCOMING, minute: undefined };
  }

  return null;
}

export function applyScheduledMatchUpdates(matches: Match[]): { matches: Match[]; changed: boolean } {
  const nowMs = Date.now();
  let changed = false;

  const updated = matches.map((match) => {
    const next = scheduleStatus(match, nowMs);
    if (next) {
      changed = true;
      return next;
    }
    return match;
  });

  return { matches: updated, changed };
}
