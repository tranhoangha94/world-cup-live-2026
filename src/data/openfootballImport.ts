/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Helpers to import data from openfootball/worldcup.json (2026).
 * Reference: https://github.com/openfootball/worldcup.json/tree/master/2026
 */

import { EventType, Match, MatchEvent, MatchStats, MatchStatus, PlayerRating } from "../types.js";
import { enrichFinishedMatch } from "./matchEnrichment.js";

/** Convert openfootball local kickoff (e.g. "12:00 UTC-5") to ICT calendar date + time. */
export function openfootballLocalTimeToICT(
  date: string,
  timeLocal: string
): { calendar: string; time: string; utcDate: string; utcTime: string } {
  const m = timeLocal.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]?\d+)$/);
  if (!m) throw new Error(`Invalid openfootball time: ${timeLocal}`);

  const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
  const localH = parseInt(m[1], 10);
  const localMin = parseInt(m[2], 10);
  const offsetHours = parseInt(m[3], 10);

  const utcMs = Date.UTC(year, month - 1, day, localH - offsetHours, localMin, 0, 0);
  const utc = new Date(utcMs);
  const utcDate = `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
  const utcTime = `${String(utc.getUTCHours()).padStart(2, "0")}:${String(utc.getUTCMinutes()).padStart(2, "0")}`;

  const ictMs = utcMs + 7 * 60 * 60 * 1000;
  const ict = new Date(ictMs);
  const calendar = `${String(ict.getUTCDate()).padStart(2, "0")}/${String(ict.getUTCMonth() + 1).padStart(2, "0")}/${ict.getUTCFullYear()}`;
  const time = `${String(ict.getUTCHours()).padStart(2, "0")}:${String(ict.getUTCMinutes()).padStart(2, "0")}`;

  return { calendar, time, utcDate, utcTime };
}

/** English ground names from openfootball → Vietnamese venue labels used in the app. */
export const OPENFOOTBALL_GROUND_VI: Record<string, string> = {
  "Los Angeles (Inglewood)": "Sân vận động SoFi, Los Angeles",
  "Boston (Foxborough)": "Sân vận động Gillette, Boston",
  "Monterrey (Guadalupe)": "Sân vận động Akron, Guadalajara",
  "Guadalajara (Zapopan)": "Sân vận động Akron, Guadalajara",
  Houston: "Sân vận động NRG, Houston",
  "New York/New Jersey (East Rutherford)": "Sân vận động MetLife, New York",
  "Dallas (Arlington)": "Sân vận động AT&T, Dallas",
  "Mexico City": "Sân vận động Azteca, Mexico City",
  Atlanta: "Sân vận động Mercedes-Benz, Atlanta",
  "San Francisco Bay Area (Santa Clara)": "Sân vận động Levi's, Santa Clara",
  Seattle: "Sân vận động Lumen Field, Seattle",
  Toronto: "Sân vận động BMO Field, Toronto",
  Vancouver: "Sân vận động BC Place, Vancouver",
  "Miami (Miami Gardens)": "Sân vận động Hard Rock, Miami",
  "Kansas City": "Sân vận động Arrowhead, Kansas City",
  Philadelphia: "Sân vận động Lincoln Financial, Philadelphia",
};

export function openfootballGroundToVenue(ground: string): string {
  return OPENFOOTBALL_GROUND_VI[ground] ?? ground;
}

export interface OpenfootballGoal {
  name: string;
  minute: string;
  owngoal?: boolean;
  penalty?: boolean;
}

export interface OpenfootballMatch {
  round?: string;
  num?: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score?: {
    ft?: [number, number];
    ht?: [number, number];
    et?: [number, number];
    p?: [number, number];
  };
  goals1?: OpenfootballGoal[];
  goals2?: OpenfootballGoal[];
  group?: string;
  ground?: string;
}

export interface OpenfootballWorldCup {
  name: string;
  matches: OpenfootballMatch[];
}

export interface OpenfootballTeamMeta {
  name: string;
  name_normalised?: string;
  fifa_code: string;
  group?: string;
}

const FIFA_TO_FLAG: Record<string, string> = {
  MEX: "mx",
  RSA: "za",
  KOR: "kr",
  CZE: "cz",
  CAN: "ca",
  BIH: "ba",
  QAT: "qa",
  SUI: "ch",
  BRA: "br",
  MAR: "ma",
  HAI: "ht",
  SCO: "gb-sct",
  USA: "us",
  PAR: "py",
  AUS: "au",
  TUR: "tr",
  GER: "de",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  NED: "nl",
  JPN: "jp",
  SWE: "se",
  TUN: "tn",
  BEL: "be",
  EGY: "eg",
  IRN: "ir",
  NZL: "nz",
  ESP: "es",
  CPV: "cv",
  KSA: "sa",
  URU: "uy",
  FRA: "fr",
  SEN: "sn",
  IRQ: "iq",
  NOR: "no",
  ARG: "ar",
  ALG: "dz",
  AUT: "at",
  JOR: "jo",
  POR: "pt",
  COD: "cd",
  UZB: "uz",
  COL: "co",
  ENG: "gb-eng",
  CRO: "hr",
  GHA: "gh",
  PAN: "pa",
};

const TEAM_VI: Record<string, string> = {
  Mexico: "Mexico",
  "South Africa": "Nam Phi",
  "South Korea": "Hàn Quốc",
  "Czech Republic": "Czechia",
  Czechia: "Czechia",
  Canada: "Canada",
  "Bosnia & Herzegovina": "Bosnia và Herzegovina",
  Qatar: "Qatar",
  Switzerland: "Thụy Sĩ",
  Brazil: "Brasil",
  Morocco: "Maroc",
  Haiti: "Haiti",
  Scotland: "Scotland",
  USA: "Hoa Kỳ",
  "United States": "Hoa Kỳ",
  Paraguay: "Paraguay",
  Australia: "Úc",
  Turkey: "Türkiye",
  Türkiye: "Türkiye",
  Germany: "Đức",
  Curaçao: "Curaçao",
  "Ivory Coast": "Bờ Biển Ngà",
  "Cote d'Ivoire": "Bờ Biển Ngà",
  Ecuador: "Ecuador",
  Netherlands: "Hà Lan",
  Japan: "Nhật Bản",
  Sweden: "Thụy Điển",
  Tunisia: "Tunisia",
  Belgium: "Bỉ",
  Egypt: "Ai Cập",
  Iran: "Iran",
  "IR Iran": "Iran",
  "New Zealand": "New Zealand",
  Spain: "Tây Ban Nha",
  "Cape Verde": "Cabo Verde",
  "Cabo Verde": "Cabo Verde",
  "Saudi Arabia": "Ả Rập Xê Út",
  Uruguay: "Uruguay",
  France: "Pháp",
  Senegal: "Sénégal",
  Iraq: "Iraq",
  Norway: "Na Uy",
  Argentina: "Argentina",
  Algeria: "Algérie",
  Austria: "Áo",
  Jordan: "Jordan",
  Portugal: "Bồ Đào Nha",
  "DR Congo": "CHDC Congo",
  "Congo DR": "CHDC Congo",
  Uzbekistan: "Uzbekistan",
  Colombia: "Colombia",
  England: "Anh",
  Croatia: "Croatia",
  Ghana: "Ghana",
  Panama: "Panama",
};

const HOST_CODES = new Set(["MEX", "USA", "CAN"]);
const DEFENDING_CHAMP = "ARG";

function flagUrl(fifaCode: string): string {
  const code = FIFA_TO_FLAG[fifaCode] ?? fifaCode.toLowerCase();
  return `https://flagcdn.com/w160/${code}.png`;
}

function teamLabel(fifaCode: string): string | undefined {
  if (HOST_CODES.has(fifaCode)) return "ĐỒNG CHỦ NHÀ";
  if (fifaCode === DEFENDING_CHAMP) return "ĐƯƠNG KIM VÔ ĐỊCH";
  return undefined;
}

function viName(englishName: string): string {
  return TEAM_VI[englishName] ?? englishName;
}

function minuteSortKey(minute: string): number {
  const clean = minute.replace(/'/g, "");
  const [base, extra] = clean.split("+");
  return parseInt(base, 10) * 100 + (extra ? parseInt(extra, 10) : 0);
}

function goalDetail(goal: OpenfootballGoal): string {
  if (goal.owngoal) return "Phản lưới nhà";
  if (goal.penalty) return "Ghi bàn từ penalty";
  return "Ghi bàn";
}

function goalsToEvents(
  goals1: OpenfootballGoal[] = [],
  goals2: OpenfootballGoal[] = []
): MatchEvent[] {
  const rows: Array<{ minute: string; type: EventType; player: string; team: "home" | "away"; detail: string; sort: number }> = [];

  for (const g of goals1) {
    rows.push({
      minute: `${g.minute}'`,
      type: EventType.GOAL,
      player: g.name,
      team: "home",
      detail: goalDetail(g),
      sort: minuteSortKey(g.minute),
    });
  }

  for (const g of goals2) {
    rows.push({
      minute: `${g.minute}'`,
      type: EventType.GOAL,
      player: g.name,
      team: "away",
      detail: goalDetail(g),
      sort: minuteSortKey(g.minute),
    });
  }

  rows.sort((a, b) => a.sort - b.sort);
  return rows.map(({ sort: _sort, ...event }) => event);
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function defaultStats(matchId: string, homeScore: number, awayScore: number): MatchStats {
  const h = hashSeed(matchId);
  const homePoss = Math.min(68, Math.max(32, 48 + (homeScore - awayScore) * 4 + (h % 9)));
  return {
    possession: { home: homePoss, away: 100 - homePoss },
    shots: { home: 8 + homeScore * 2 + (h % 5), away: 7 + awayScore * 2 + ((h >> 3) % 5) },
    shotsOnTarget: { home: 3 + homeScore + (h % 3), away: 3 + awayScore + ((h >> 5) % 3) },
    passAccuracy: { home: 78 + (h % 10), away: 76 + ((h >> 2) % 10) },
  };
}

function lineupsFromEvents(events: MatchEvent[], homeCode: string, awayCode: string, matchId: string): PlayerRating[] {
  const enriched = enrichFinishedMatch(matchId, homeCode, awayCode, 0, 0);
  const fromGoals: PlayerRating[] = [];
  const seen = new Set<string>();

  for (const e of events) {
    if (e.type !== EventType.GOAL || seen.has(e.player)) continue;
    seen.add(e.player);
    fromGoals.push({
      name: e.player,
      position: "ST",
      team: e.team as "home" | "away",
      rating: 7.4 + (fromGoals.length % 4) * 0.3,
    });
  }

  if (fromGoals.length >= 3) return fromGoals.slice(0, 6);
  return enriched.lineups ?? fromGoals;
}

function buildTeamLookup(teams: OpenfootballTeamMeta[]): Map<string, OpenfootballTeamMeta> {
  const map = new Map<string, OpenfootballTeamMeta>();
  for (const t of teams) {
    map.set(t.name, t);
    if (t.name_normalised) map.set(t.name_normalised, t);
  }
  return map;
}

function resolveTeam(name: string, lookup: Map<string, OpenfootballTeamMeta>): OpenfootballTeamMeta {
  const meta = lookup.get(name);
  if (!meta) throw new Error(`Unknown team in openfootball data: ${name}`);
  return meta;
}

function groupLetter(group: string): string {
  return group.replace(/^Group\s+/i, "").toLowerCase();
}

function groupViName(group: string): string {
  return `Bảng ${group.replace(/^Group\s+/i, "")}`;
}

/** Build all 72 group-stage matches from openfootball JSON. */
export function buildGroupStageFromOpenfootball(
  data: OpenfootballWorldCup,
  teams: OpenfootballTeamMeta[]
): Match[] {
  const lookup = buildTeamLookup(teams);
  const groupMatches = data.matches.filter((m) => m.group?.startsWith("Group "));

  if (groupMatches.length !== 72) {
    throw new Error(`Expected 72 group-stage matches, got ${groupMatches.length}`);
  }

  const byGroup = new Map<string, OpenfootballMatch[]>();
  for (const m of groupMatches) {
    const g = m.group!;
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g)!.push(m);
  }

  const groupOrder = [...byGroup.keys()].sort((a, b) => groupLetter(a).localeCompare(groupLetter(b)));
  const result: Match[] = [];

  for (const group of groupOrder) {
    const letter = groupLetter(group);
    const fixtures = [...byGroup.get(group)!].sort((a, b) => {
      const da = a.date.localeCompare(b.date);
      if (da !== 0) return da;
      return (a.num ?? 0) - (b.num ?? 0);
    });

    if (fixtures.length !== 6) {
      throw new Error(`${group} expected 6 matches, got ${fixtures.length}`);
    }

    fixtures.forEach((raw, index) => {
      const homeMeta = resolveTeam(raw.team1, lookup);
      const awayMeta = resolveTeam(raw.team2, lookup);
      const homeCode = FIFA_TO_FLAG[homeMeta.fifa_code] ?? homeMeta.fifa_code.toLowerCase();
      const awayCode = FIFA_TO_FLAG[awayMeta.fifa_code] ?? awayMeta.fifa_code.toLowerCase();
      const homeScore = raw.score?.ft?.[0] ?? 0;
      const awayScore = raw.score?.ft?.[1] ?? 0;
      const { calendar, time } = openfootballLocalTimeToICT(raw.date, raw.time);
      const id = `g${letter}_${index + 1}`;
      const events = goalsToEvents(raw.goals1, raw.goals2);

      result.push({
        id,
        homeTeam: {
          name: viName(raw.team1),
          code: homeMeta.fifa_code,
          flagUrl: flagUrl(homeMeta.fifa_code),
          label: teamLabel(homeMeta.fifa_code),
        },
        awayTeam: {
          name: viName(raw.team2),
          code: awayMeta.fifa_code,
          flagUrl: flagUrl(awayMeta.fifa_code),
          label: teamLabel(awayMeta.fifa_code),
        },
        homeScore,
        awayScore,
        status: MatchStatus.FINISHED,
        round: "Vòng Bảng",
        group: groupViName(group),
        date: calendar,
        time,
        venue: raw.ground ? openfootballGroundToVenue(raw.ground) : "—",
        events,
        lineups: lineupsFromEvents(events, homeCode, awayCode, id),
        stats: defaultStats(id, homeScore, awayScore),
      });
    });
  }

  return result;
}

/** Format calendar dd/mm/yyyy as a neutral Vietnamese date label for knockout fixtures. */
export function calendarToDateLabel(calendar: string): string {
  const [d, m, y] = calendar.split("/");
  return `${d}/${m}/${y}`;
}
