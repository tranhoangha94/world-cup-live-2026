/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function parseYoutubeVideoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (YOUTUBE_ID_RE.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return YOUTUBE_ID_RE.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID_RE.test(fromQuery)) return fromQuery;
      const embedMatch = url.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
