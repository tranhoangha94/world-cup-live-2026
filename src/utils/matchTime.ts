/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match } from "../types.js";

/** All match `time` values in this app are kickoff / broadcast time in Vietnam (ICT, UTC+7). */
export const VN_TIMEZONE_LABEL = "ICT";

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
