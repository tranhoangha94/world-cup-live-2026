/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Kênh phát sóng World Cup 2026 tại Việt Nam (VTV).
 */

import { Match, MatchStatus } from "../types.js";

export interface MatchBroadcast {
  channels: string[];
  watchUrl: string;
  watchLabel: string;
}

const VTV_GO_URL = "https://vtvgo.vn/";

/** Per-match overrides when known; otherwise default VTV sports bundle. */
const BROADCAST_BY_MATCH_ID: Record<string, MatchBroadcast> = {
  r32_12: {
    channels: ["VTV3", "VTV6", "VTV10"],
    watchUrl: VTV_GO_URL,
    watchLabel: "Xem trên VTV Go",
  },
};

const DEFAULT_BROADCAST: MatchBroadcast = {
  channels: ["VTV5", "VTV6", "VTV3"],
  watchUrl: VTV_GO_URL,
  watchLabel: "Xem trên VTV Go",
};

export function getMatchBroadcast(match: Pick<Match, "id" | "status">): MatchBroadcast | null {
  if (match.status !== MatchStatus.UPCOMING && match.status !== MatchStatus.LIVE) {
    return null;
  }
  return BROADCAST_BY_MATCH_ID[match.id] ?? DEFAULT_BROADCAST;
}

export function withBroadcastInfo(match: Match): Match {
  const broadcast = getMatchBroadcast(match);
  if (!broadcast) {
    const { broadcast: _removed, ...rest } = match;
    return rest as Match;
  }
  return { ...match, broadcast };
}

export function applyBroadcastToMatches(matches: Match[]): Match[] {
  return matches.map(withBroadcastInfo);
}
