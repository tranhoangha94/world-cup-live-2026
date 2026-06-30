/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum MatchStatus {
  LIVE = "LIVE",
  UPCOMING = "UPCOMING",
  FINISHED = "FINISHED",
}

export enum EventType {
  GOAL = "GOAL",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  SUB = "SUB",
}

export interface MatchEvent {
  minute: string;
  type: EventType;
  player: string;
  playerOut?: string; // For substitutions
  detail?: string;
  team: string; // "home" or "away"
}

export interface PlayerRating {
  name: string;
  position: string;
  team: "home" | "away";
  rating: number;
  avatarUrl?: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  passAccuracy: { home: number; away: number };
}

export interface Match {
  id: string;
  homeTeam: {
    name: string;
    code: string;
    flagUrl: string;
    label?: string; // e.g. "HOST NATION" or "DEFENDING CHAMP"
  };
  awayTeam: {
    name: string;
    code: string;
    flagUrl: string;
    label?: string;
  };
  homeScore?: number;
  awayScore?: number;
  homePens?: number;
  awayPens?: number;
  status: MatchStatus;
  round: string; // e.g. "Vòng Bảng", "Vòng 1/8", "Tứ Kết", "Bán Kết", "Chung Kết"
  group?: string; // e.g. "Bảng A"
  date: string; // e.g. "Thứ Hai, 15 Tháng 6, 2026"
  time: string; // e.g. "07:00"
  minute?: string; // e.g. "72'"
  venue: string; // e.g. "SVĐ Azteca, Mexico City"
  events?: MatchEvent[];
  stats?: MatchStats;
  lineups?: PlayerRating[];
}

export interface StandingTeam {
  name: string;
  code: string;
  flagUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
}

export interface StandingGroup {
  groupName: string; // e.g. "Bảng A"
  teams: StandingTeam[];
}

export interface TopScorer {
  rank: number;
  name: string;
  team: string;
  teamCode: string;
  teamFlagUrl: string;
  goals: number;
}

export interface Venue {
  name: string;
  city: string;
  country: string;
  imageUrl: string;
  capacity: string;
  description: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  date: string;
  source: string;
  url: string;
}
