/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match } from "../types.js";

/** All match `time` values in this app are kickoff / broadcast time in Vietnam (ICT, UTC+7). */
export const VN_TIMEZONE_LABEL = "ICT";

/** Extract dd/mm/yyyy from any Vietnamese date label. */
export function extractCalendarDate(dateStr: string): string | null {
  const m = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return `${m[1].padStart(2, "0")}/${m[2].padStart(2, "0")}/${m[3]}`;
}

/** Convert UTC kickoff (from external feeds) to ICT date + time for this app. */
export function utcKickoffToICT(utcDate: string, utcTime: string): { calendar: string; time: string } {
  const [year, month, day] = utcDate.split("-").map((n) => parseInt(n, 10));
  const [hours, minutes] = utcTime.split(":").map((n) => parseInt(n, 10));
  const utcMs = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
  const ict = new Date(utcMs + 7 * 60 * 60 * 1000);
  const calendar = `${String(ict.getUTCDate()).padStart(2, "0")}/${String(ict.getUTCMonth() + 1).padStart(2, "0")}/${ict.getUTCFullYear()}`;
  const time = `${String(ict.getUTCHours()).padStart(2, "0")}:${String(ict.getUTCMinutes()).padStart(2, "0")}`;
  return { calendar, time };
}

function kickoffSortKey(time?: string): number {
  if (!time) return 0;
  const m = time.match(/^(\d+)(?:\+(\d+))?/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 100 + (m[2] ? parseInt(m[2], 10) : 0);
}

function calendarSortKey(calendar: string): number {
  const [d, m, y] = calendar.split("/").map((n) => parseInt(n, 10));
  return y * 10000 + m * 100 + d;
}

/** Group matches by ICT calendar day (not raw label text). */
export function groupMatchesByCalendarDate(
  matches: Match[]
): { key: string; label: string; matches: Match[] }[] {
  const groups = new Map<string, { labels: string[]; matches: Match[] }>();

  for (const match of matches) {
    const key = extractCalendarDate(match.date) ?? match.date;
    if (!groups.has(key)) groups.set(key, { labels: [], matches: [] });
    const group = groups.get(key)!;
    group.labels.push(match.date);
    group.matches.push(match);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => calendarSortKey(a) - calendarSortKey(b))
    .map(([key, { labels, matches: groupMatches }]) => ({
      key,
      label:
        labels.find((l) => l.includes("Hôm nay")) ??
        labels.find((l) => l.includes("Hôm qua")) ??
        labels.find((l) => l.includes("Ngày mai")) ??
        labels[0],
      matches: [...groupMatches].sort((a, b) => kickoffSortKey(a.time) - kickoffSortKey(b.time)),
    }));
}

export function formatBroadcastTimeVN(time?: string): string {
  if (!time) return "";
  return `${time} (${VN_TIMEZONE_LABEL})`;
}

export function formatBroadcastShort(time?: string): string {
  if (!time) return "";
  return `${time} • Giờ VN`;
}

export function formatMatchKickoff(match: Pick<Match, "date" | "time">): string {
  const datePart = match.date.includes(",")
    ? match.date.split(",").slice(1).join(",").trim() || match.date
    : match.date;
  if (!match.time) return datePart;
  return `${datePart} • ${formatBroadcastTimeVN(match.time)}`;
}

export function formatBracketKickoff(match: Pick<Match, "date" | "time">): string {
  const shortDate = match.date.split(",").pop()?.trim() || match.date;
  if (!match.time) return shortDate;
  return `${shortDate} • ${match.time} ICT`;
}
