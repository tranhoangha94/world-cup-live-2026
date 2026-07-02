/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Match, MatchStatus, EventType } from "../types.js";
import { ArrowLeft, Bell, History, PlayCircle, Image, Star, Clock, MapPin, Tv, ExternalLink } from "lucide-react";
import { formatBroadcastTimeVN, formatMatchKickoff } from "../utils/matchTime.js";
import { parseYoutubeVideoId, youtubeEmbedUrl } from "../utils/youtubeEmbed.js";
import { MatchHeroScore } from "./MatchPenaltyScore.js";
import { hasPenaltyShootout } from "../utils/matchScore.js";
import PenaltyShootoutTimeline from "./PenaltyShootoutTimeline.js";

interface MatchDetailTabProps {
  match: Match;
  onBack: () => void;
}

export default function MatchDetailTab({ match, onBack }: MatchDetailTabProps) {
  const highlightVideoId = match.highlightVideoUrl ? parseYoutubeVideoId(match.highlightVideoUrl) : null;
  const hasHighlight = Boolean(highlightVideoId);
  const hasGallery = Boolean(match.galleryImages?.length);

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="match-detail-view">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-[#c3f400] transition-colors cursor-pointer font-semibold font-label-caps text-xs"
        >
          <ArrowLeft className="w-5 h-5" /> QUAY LẠI
        </button>
        <span className="font-label-caps text-xs text-on-surface-variant tracking-wider uppercase">
          CHI TIẾT TRẬN ĐẤU
        </span>
        <button className="text-on-surface-variant hover:text-[#c3f400] transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Main Big Scoreboard Hero Section */}
      <section className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(195,244,0,0.05)] bg-gradient-to-r from-surface-container/40 to-surface-container-low/40">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c3f400] via-[#00dbe9] to-[#c3f400] opacity-40"></div>

        <div className="text-center mb-6">
          {match.status === MatchStatus.LIVE ? (
            <span className="bg-primary-container text-on-primary-container font-bold font-label-caps text-xs px-3 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(195,244,0,0.4)]">
              LIVE - {match.minute || "74'"}
            </span>
          ) : match.status === MatchStatus.FINISHED ? (
            <span className="bg-white/10 text-on-surface-variant font-label-caps text-xs px-3 py-1 rounded-full border border-white/5">
              FT{hasPenaltyShootout(match) ? " • PEN" : ""} - KẾT THÚC
            </span>
          ) : (
            <span className="bg-[#00eefc]/10 text-[#00eefc] font-bold font-label-caps text-xs px-3 py-1 rounded-full border border-[#00eefc]/20">
              SẮP DIỄN RA
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 text-center space-y-3">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-primary-fixed p-1 bg-surface-container shadow-lg flex items-center justify-center overflow-hidden">
              <img
                src={match.homeTeam.flagUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-headline-lg-mobile md:font-headline-lg uppercase text-on-surface">{match.homeTeam.code}</h3>
              <p className="text-xs text-on-surface-variant truncate max-w-[120px]">{match.homeTeam.name}</p>
            </div>
          </div>

          {/* Scores & Period */}
          <div className="flex flex-col items-center justify-center">
            <MatchHeroScore match={match} />
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider mt-1 block">
              {match.round} {match.group ? `• ${match.group}` : ""}
            </span>
            {match.time && (
              <div className="mt-2 flex flex-col items-center gap-1 text-[10px] text-on-surface-variant">
                <span className="flex items-center gap-1.5 font-label-caps text-[#00eefc]">
                  <Clock className="w-3.5 h-3.5" />
                  Phát sóng trực tiếp: {formatBroadcastTimeVN(match.time)}
                </span>
                <span className="flex items-center gap-1.5 font-label-caps text-[9px]">
                  <MapPin className="w-3 h-3 text-[#c3f400]" />
                  {formatMatchKickoff(match)}
                </span>
              </div>
            )}
            {match.broadcast && (
              <div className="mt-3 w-full max-w-sm rounded-xl border border-[#00eefc]/20 bg-[#00eefc]/5 px-4 py-3 text-center">
                <p className="flex items-center justify-center gap-1.5 font-label-caps text-[10px] text-[#00eefc] mb-2">
                  <Tv className="w-3.5 h-3.5" />
                  Kênh phát sóng (VN)
                </p>
                <p className="font-bold text-sm text-on-surface mb-2">{match.broadcast.channels.join(" • ")}</p>
                <a
                  href={match.broadcast.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-label-caps text-[#c3f400] hover:underline"
                >
                  {match.broadcast.watchLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 text-center space-y-3">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-white/10 p-1 bg-surface-container shadow-lg flex items-center justify-center overflow-hidden">
              <img
                src={match.awayTeam.flagUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-headline-lg-mobile md:font-headline-lg uppercase text-on-surface">{match.awayTeam.code}</h3>
              <p className="text-xs text-on-surface-variant truncate max-w-[120px]">{match.awayTeam.name}</p>
            </div>
          </div>
        </div>

        {/* Small stats summary inside header */}
        {match.stats && (
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-around text-center gap-2">
            <div className="text-on-surface-variant font-label-caps text-[9px] md:text-[11px]">
              KIỂM SOÁT: {match.stats.possession.home}%
            </div>
            <div className="text-on-surface-variant font-label-caps text-[9px] md:text-[11px]">
              SÚT: {match.stats.shots.home} ({match.stats.shotsOnTarget.home})
            </div>
            <div className="text-on-surface-variant font-label-caps text-[9px] md:text-[11px]">
              KIỂM SOÁT: {match.stats.possession.away}%
            </div>
          </div>
        )}
      </section>

      {/* Two columns grid for Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Col: Timeline (8 cols) */}
        <div className="md:col-span-8 space-y-8">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline-lg-mobile text-primary mb-6 flex items-center gap-3">
              <History className="w-5 h-5 text-[#c3f400]" /> Diễn biến chính
            </h3>

            {match.events && match.events.length > 0 ? (
              <div className="relative pl-8 border-l border-white/10 ml-3 space-y-6 pb-2">
                {match.events.map((event, idx) => (
                  <div key={idx} className="relative group">
                    {/* Minute Circle Badge */}
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-white/10 z-10 font-label-caps text-[10px] text-[#c3f400]">
                      {event.minute}
                    </div>

                    {/* Event Detail Card */}
                    <div className="glass-card rounded-xl p-4 flex items-center justify-between border-l-4 border-l-[#00dbe9]">
                      <div className="flex items-center gap-3">
                        {event.type === EventType.GOAL ? (
                          <img
                            src={event.team === "home" ? match.homeTeam.flagUrl : match.awayTeam.flagUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : event.type === EventType.YELLOW_CARD ? (
                          <span className="text-yellow-400 text-base">🟨</span>
                        ) : event.type === EventType.RED_CARD ? (
                          <span className="text-red-500 text-base">🟥</span>
                        ) : (
                          <span className="text-[#00eefc] text-base">🔄</span>
                        )}

                        <div>
                          <p className="font-bold text-xs text-on-surface">
                            {event.type === EventType.SUB
                              ? `Vào: ${event.player} (Ra: ${event.playerOut})`
                              : event.player}
                          </p>
                          <p className="font-label-caps text-[8px] text-on-surface-variant uppercase">
                            {event.team === "home" ? match.homeTeam.name : match.awayTeam.name}
                          </p>
                        </div>
                      </div>

                      {event.detail && (
                        <span className="text-[10px] text-on-surface-variant font-body-md max-w-[180px] text-right italic">
                          {event.detail}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant font-body-md text-center py-6">Trận đấu chưa diễn ra hoặc chưa có diễn biến.</p>
            )}
          </div>

          {match.penaltyShootout && (
            <PenaltyShootoutTimeline match={match} shootout={match.penaltyShootout} />
          )}

          {(hasHighlight || hasGallery) && (
            <div className="space-y-4">
              {hasHighlight && highlightVideoId && (
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="text-[#c3f400] w-5 h-5 shrink-0" />
                      <span className="font-label-caps text-xs text-primary font-bold">Highlight trận đấu</span>
                    </div>
                    {(match.highlightSource || match.highlightDurationLabel) && (
                      <span className="font-label-caps text-[10px] text-on-surface-variant">
                        {[match.highlightSource, match.highlightDurationLabel].filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      title={`Highlight ${match.homeTeam.code} vs ${match.awayTeam.code}`}
                      src={youtubeEmbedUrl(highlightVideoId)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  <div className="px-4 py-2 text-right">
                    <a
                      href={match.highlightVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-label-caps text-[#c3f400] hover:underline"
                    >
                      Mở trên YouTube
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {hasGallery && (
                <div className={`grid gap-4 ${hasHighlight ? "grid-cols-1" : "grid-cols-1"}`}>
                  <div className="glass-card rounded-2xl overflow-hidden group border border-white/5 relative h-48">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                      style={{ backgroundImage: `url('${match.galleryImages![0]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Image className="text-[#00eefc] w-6 h-6" />
                      <span className="font-label-caps text-xs text-primary font-bold">
                        Bộ sưu tập ảnh trận đấu
                        {match.galleryImages!.length > 1 && ` (${match.galleryImages!.length})`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Stats & Ratings (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* Detailed Stat Bars */}
          {match.stats && (
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-5">
              <h4 className="font-label-caps text-[11px] text-[#c3f400] tracking-wider text-center border-b border-white/5 pb-2">
                THỐNG KÊ CHI TIẾT
              </h4>

              {/* Stat 1: Possession */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-label-caps text-on-surface-variant">
                  <span>{match.stats.possession.home}%</span>
                  <span>Kiểm soát bóng</span>
                  <span>{match.stats.possession.away}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
                  <div className="h-full bg-[#c3f400]" style={{ width: `${match.stats.possession.home}%` }}></div>
                  <div className="h-full bg-[#00dbe9]" style={{ width: `${match.stats.possession.away}%` }}></div>
                </div>
              </div>

              {/* Stat 2: Shots */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-label-caps text-on-surface-variant">
                  <span>{match.stats.shots.home}</span>
                  <span>Tổng số cú sút</span>
                  <span>{match.stats.shots.away}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
                  <div className="h-full bg-[#c3f400]" style={{ width: `${(match.stats.shots.home / (match.stats.shots.home + match.stats.shots.away)) * 100}%` }}></div>
                  <div className="h-full bg-[#00dbe9]" style={{ width: `${(match.stats.shots.away / (match.stats.shots.home + match.stats.shots.away)) * 100}%` }}></div>
                </div>
              </div>

              {/* Stat 3: On Target */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-label-caps text-on-surface-variant">
                  <span>{match.stats.shotsOnTarget.home}</span>
                  <span>Sút trúng đích</span>
                  <span>{match.stats.shotsOnTarget.away}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
                  <div className="h-full bg-[#c3f400]" style={{ width: `${(match.stats.shotsOnTarget.home / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away)) * 100}%` }}></div>
                  <div className="h-full bg-[#00dbe9]" style={{ width: `${(match.stats.shotsOnTarget.away / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away)) * 100}%` }}></div>
                </div>
              </div>

              {/* Stat 4: Pass Acc */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-label-caps text-on-surface-variant">
                  <span>{match.stats.passAccuracy.home}%</span>
                  <span>Chuyền chính xác</span>
                  <span>{match.stats.passAccuracy.away}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
                  <div className="h-full bg-[#c3f400]" style={{ width: `${match.stats.passAccuracy.home}%` }}></div>
                  <div className="h-full bg-[#00dbe9]" style={{ width: `${match.stats.passAccuracy.away}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Top-rated players from the match */}
          {match.lineups && match.lineups.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
              <h4 className="font-label-caps text-[11px] text-[#00eefc] tracking-wider text-center border-b border-white/5 pb-2">
                CẦU THỦ TIÊU BIỂU
              </h4>

              <div className="space-y-2">
                {match.lineups.map((player) => (
                  <div
                    key={player.name}
                    className="flex items-center gap-3 p-2 bg-surface-container/30 hover:bg-white/5 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-xs text-primary-fixed border border-white/10">
                      <Star className="w-4 h-4 text-[#c3f400]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{player.name}</p>
                      <p className="text-[8px] text-on-surface-variant font-label-caps">
                        {player.position} - {player.team === "home" ? match.homeTeam.code : match.awayTeam.code}
                      </p>
                    </div>
                    <span className="text-[#c3f400] font-bold font-display-lg text-xs">{player.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
