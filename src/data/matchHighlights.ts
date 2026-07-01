/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Clip highlight ngắn (~2–4 phút), không phải full trận / extended recap dài.
 * Ưu tiên kênh FIFA chính thức (@FIFA).
 */

import { Match, MatchStatus } from "../types.js";
import { youtubeThumbnailUrl, youtubeWatchUrl } from "../utils/youtubeEmbed.js";

export interface MatchHighlightRef {
  youtubeId: string;
  source: string;
  /** Nhãn thời lượng gần đúng, hiển thị trên UI */
  durationLabel: string;
}

/**
 * Vòng 32 — tuần 29–30/6/2026. Chỉ thêm ID đã xác nhận là highlight ngắn.
 * Không dùng FOX "30 Minute Recaps" / extended 10–20 phút.
 */
const HIGHLIGHT_BY_MATCH_ID: Record<string, MatchHighlightRef> = {
  r32_1: { youtubeId: "uv-FSqzHXAo", source: "FIFA", durationLabel: "~2 phút" },
  r32_2: { youtubeId: "vdnhUnGHwco", source: "FIFA", durationLabel: "~2 phút" },
  r32_3: { youtubeId: "Gw6vNwAvkTs", source: "FIFA", durationLabel: "~2 phút" },
  r32_9: { youtubeId: "Fd_KYjbmws4", source: "FIFA", durationLabel: "~2 phút" },
};

export function getMatchHighlight(match: Pick<Match, "id" | "status">): MatchHighlightRef | null {
  if (match.status !== MatchStatus.FINISHED) return null;
  return HIGHLIGHT_BY_MATCH_ID[match.id] ?? null;
}

export function withHighlightInfo(match: Match): Match {
  const highlight = getMatchHighlight(match);
  if (!highlight) {
    const { highlightVideoUrl: _v, highlightThumbnailUrl: _t, highlightSource: _s, ...rest } = match;
    return rest as Match;
  }
  return {
    ...match,
    highlightVideoUrl: youtubeWatchUrl(highlight.youtubeId),
    highlightThumbnailUrl: youtubeThumbnailUrl(highlight.youtubeId),
    highlightSource: highlight.source,
    highlightDurationLabel: highlight.durationLabel,
  };
}

export function applyHighlightsToMatches(matches: Match[]): Match[] {
  return matches.map(withHighlightInfo);
}
