/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchStatus, EventType } from "../types.js";
import { computeStandingsFromMatches } from "./standingsFromMatches.js";

type T = { name: string; code: string; label?: string };

const f = (code: string) => `https://flagcdn.com/w160/${code}.png`;
const team = (t: T) => ({ ...t, flagUrl: f(t.code) });

const TEAMS = {
  usa: team({ name: "Hoa Kỳ", code: "us", label: "ĐỒNG CHỦ NHÀ" }),
  can: team({ name: "Canada", code: "ca", label: "ĐỒNG CHỦ NHÀ" }),
  mex: team({ name: "Mexico", code: "mx", label: "ĐỒNG CHỦ NHÀ" }),
  rsa: team({ name: "Nam Phi", code: "za" }),
  arg: team({ name: "Argentina", code: "ar", label: "ĐƯƠNG KIM VÔ ĐỊCH" }),
  fra: team({ name: "Pháp", code: "fr" }),
  nor: team({ name: "Na Uy", code: "no" }),
  cpv: team({ name: "Cabo Verde", code: "cv" }),
  bra: team({ name: "Brasil", code: "br" }),
  ger: team({ name: "Đức", code: "de" }),
  jpn: team({ name: "Nhật Bản", code: "jp" }),
  aut: team({ name: "Áo", code: "at" }),
  ned: team({ name: "Hà Lan", code: "nl" }),
  par: team({ name: "Paraguay", code: "py" }),
  swe: team({ name: "Thụy Điển", code: "se" }),
  uru: team({ name: "Uruguay", code: "uy" }),
  bel: team({ name: "Bỉ", code: "be" }),
  sen: team({ name: "Sénégal", code: "sn" }),
  nga: team({ name: "Nigeria", code: "ng" }),
  cmr: team({ name: "Cameroon", code: "cm" }),
  eng: team({ name: "Anh", code: "gb-eng" }),
  cod: team({ name: "CHDC Congo", code: "cd" }),
  bih: team({ name: "Bosnia và Herzegovina", code: "ba" }),
  sco: team({ name: "Scotland", code: "gb-sct" }),
  esp: team({ name: "Tây Ban Nha", code: "es" }),
  sui: team({ name: "Thụy Sĩ", code: "ch" }),
  alg: team({ name: "Algérie", code: "dz" }),
  ksa: team({ name: "Ả Rập Xê Út", code: "sa" }),
  por: team({ name: "Bồ Đào Nha", code: "pt" }),
  cro: team({ name: "Croatia", code: "hr" }),
  cze: team({ name: "Czechia", code: "cz" }),
  svk: team({ name: "Slovakia", code: "sk" }),
  col: team({ name: "Colombia", code: "co" }),
  gha: team({ name: "Ghana", code: "gh" }),
  civ: team({ name: "Bờ Biển Ngà", code: "ci" }),
  crc: team({ name: "Costa Rica", code: "cr" }),
  ecu: team({ name: "Ecuador", code: "ec" }),
  chi: team({ name: "Chile", code: "cl" }),
  ven: team({ name: "Venezuela", code: "ve" }),
  bol: team({ name: "Bolivia", code: "bo" }),
  mar: team({ name: "Maroc", code: "ma" }),
  den: team({ name: "Đan Mạch", code: "dk" }),
  pol: team({ name: "Ba Lan", code: "pl" }),
  nzl: team({ name: "New Zealand", code: "nz" }),
  aus: team({ name: "Úc", code: "au" }),
  egy: team({ name: "Ai Cập", code: "eg" }),
  kor: team({ name: "Hàn Quốc", code: "kr" }),
  tun: team({ name: "Tunisia", code: "tn" }),
};

const VENUES = [
  "Sân vận động Azteca, Mexico City",
  "Sân vận động SoFi, Los Angeles",
  "Sân vận động MetLife, New York",
  "Sân vận động Mercedes-Benz, Atlanta",
  "Sân vận động BC Place, Vancouver",
  "Sân vận động NRG, Houston",
  "Sân vận động Hard Rock, Miami",
  "Sân vận động Gillette, Boston",
  "Sân vận động Lumen Field, Seattle",
  "Sân vận động Levi's, San Francisco",
  "Sân vận động Arrowhead, Kansas City",
  "Sân vận động Lincoln Financial, Philadelphia",
];

const MD_DATES = [
  ["Thứ Sáu, 12/06/2026", "Thứ Bảy, 13/06/2026"],
  ["Thứ Tư, 18/06/2026", "Thứ Năm, 19/06/2026"],
  ["Thứ Ba, 24/06/2026", "Thứ Tư, 25/06/2026"],
];

/** 24 kickoff slots per matchday — each group gets a unique time within the day. */
const MD_KICKOFFS = [
  "04:00", "07:00", "10:00", "13:00", "16:00", "19:00",
  "22:00", "23:00", "02:00", "05:00", "08:00", "11:00",
  "14:00", "17:00", "20:00", "01:00", "03:00", "06:00",
  "09:00", "12:00", "15:00", "18:00", "21:00", "00:00",
];

type Fixture = [T, T, number, number];

function scheduleSlot(groupIndex: number, matchIndex: number): { date: string; time: string; venue: string } {
  const md = Math.floor(matchIndex / 2);
  const slotInMd = groupIndex * 2 + (matchIndex % 2);
  return {
    date: MD_DATES[md][slotInMd % 2],
    time: MD_KICKOFFS[slotInMd],
    venue: VENUES[(md * 12 + groupIndex + (matchIndex % 2)) % VENUES.length],
  };
}

function gm(
  id: string,
  group: string,
  groupIndex: number,
  matchIndex: number,
  home: T,
  away: T,
  homeScore: number,
  awayScore: number
): Match {
  const { date, time, venue } = scheduleSlot(groupIndex, matchIndex);
  const events: Match["events"] = [];
  if (homeScore > 0) {
    events.push({ minute: "34'", type: EventType.GOAL, player: home.name, team: "home", detail: "Bàn mở tỷ số" });
  }
  if (awayScore > 0) {
    events.push({ minute: "61'", type: EventType.GOAL, player: away.name, team: "away", detail: "Cân bằng tỷ số hoặc ghi bàn quyết định" });
  }
  if (homeScore > 1) {
    events.push({ minute: "78'", type: EventType.GOAL, player: home.name, team: "home", detail: "Chốt chấp điểm" });
  }

  return {
    id,
    homeTeam: team(home),
    awayTeam: team(away),
    homeScore,
    awayScore,
    status: MatchStatus.FINISHED,
    round: "Vòng Bảng",
    group,
    date,
    time,
    venue,
    events: events.length > 0 ? events : undefined,
    stats: {
      possession: { home: 48 + (matchIndex % 12), away: 52 - (matchIndex % 12) },
      shots: { home: 8 + (matchIndex % 6), away: 7 + (matchIndex % 5) },
      shotsOnTarget: { home: 3 + (matchIndex % 4), away: 3 + (matchIndex % 3) },
      passAccuracy: { home: 80 + (matchIndex % 8), away: 78 + (matchIndex % 7) },
    },
  };
}

function buildGroup(
  groupIndex: number,
  groupKey: string,
  groupName: string,
  fixtures: [Fixture, Fixture, Fixture, Fixture, Fixture, Fixture]
): Match[] {
  return fixtures.map(([h, a, hs, as], i) =>
    gm(`g${groupKey}_${i + 1}`, groupName, groupIndex, i, h, a, hs, as)
  );
}

const groupAMatches = buildGroup(0, "a", "Bảng A", [
  [TEAMS.mex, TEAMS.rsa, 2, 0],
  [TEAMS.usa, TEAMS.can, 1, 1],
  [TEAMS.can, TEAMS.rsa, 2, 0],
  [TEAMS.usa, TEAMS.mex, 2, 0],
  [TEAMS.usa, TEAMS.rsa, 3, 0],
  [TEAMS.mex, TEAMS.can, 2, 1],
]);

const groupBMatches = buildGroup(1, "b", "Bảng B", [
  [TEAMS.arg, TEAMS.cpv, 3, 0],
  [TEAMS.fra, TEAMS.nor, 3, 1],
  [TEAMS.nor, TEAMS.cpv, 2, 0],
  [TEAMS.arg, TEAMS.fra, 2, 1],
  [TEAMS.arg, TEAMS.nor, 2, 1],
  [TEAMS.fra, TEAMS.cpv, 2, 1],
]);

const groupCMatches = buildGroup(2, "c", "Bảng C", [
  [TEAMS.bra, TEAMS.aut, 2, 0],
  [TEAMS.ger, TEAMS.jpn, 2, 1],
  [TEAMS.jpn, TEAMS.bra, 1, 1],
  [TEAMS.ger, TEAMS.aut, 2, 1],
  [TEAMS.jpn, TEAMS.ger, 2, 1],
  [TEAMS.bra, TEAMS.jpn, 3, 1],
]);

const groupDMatches = buildGroup(3, "d", "Bảng D", [
  [TEAMS.ned, TEAMS.uru, 2, 0],
  [TEAMS.par, TEAMS.swe, 1, 1],
  [TEAMS.ned, TEAMS.par, 2, 0],
  [TEAMS.swe, TEAMS.uru, 3, 0],
  [TEAMS.swe, TEAMS.ned, 2, 1],
  [TEAMS.uru, TEAMS.par, 0, 2],
]);

const groupEMatches = buildGroup(4, "e", "Bảng E", [
  [TEAMS.bel, TEAMS.cmr, 3, 0],
  [TEAMS.sen, TEAMS.nga, 2, 1],
  [TEAMS.bel, TEAMS.sen, 2, 1],
  [TEAMS.nga, TEAMS.cmr, 2, 0],
  [TEAMS.bel, TEAMS.nga, 2, 0],
  [TEAMS.cmr, TEAMS.sen, 0, 2],
]);

const groupFMatches = buildGroup(5, "f", "Bảng F", [
  [TEAMS.eng, TEAMS.sco, 2, 0],
  [TEAMS.cod, TEAMS.bih, 1, 0],
  [TEAMS.eng, TEAMS.cod, 3, 1],
  [TEAMS.bih, TEAMS.sco, 2, 1],
  [TEAMS.eng, TEAMS.bih, 1, 0],
  [TEAMS.sco, TEAMS.cod, 0, 2],
]);

const groupGMatches = buildGroup(6, "g", "Bảng G", [
  [TEAMS.esp, TEAMS.ksa, 3, 0],
  [TEAMS.sui, TEAMS.alg, 1, 1],
  [TEAMS.esp, TEAMS.sui, 2, 1],
  [TEAMS.alg, TEAMS.ksa, 2, 0],
  [TEAMS.esp, TEAMS.alg, 1, 0],
  [TEAMS.ksa, TEAMS.sui, 0, 1],
]);

const groupHMatches = buildGroup(7, "h", "Bảng H", [
  [TEAMS.por, TEAMS.svk, 2, 0],
  [TEAMS.cro, TEAMS.cze, 1, 0],
  [TEAMS.por, TEAMS.cro, 1, 1],
  [TEAMS.cze, TEAMS.svk, 2, 1],
  [TEAMS.cro, TEAMS.por, 1, 0],
  [TEAMS.svk, TEAMS.cro, 0, 2],
]);

const groupIMatches = buildGroup(8, "i", "Bảng I", [
  [TEAMS.col, TEAMS.crc, 2, 0],
  [TEAMS.gha, TEAMS.civ, 1, 1],
  [TEAMS.col, TEAMS.gha, 2, 1],
  [TEAMS.civ, TEAMS.crc, 2, 0],
  [TEAMS.col, TEAMS.civ, 0, 1],
  [TEAMS.crc, TEAMS.gha, 0, 2],
]);

const groupJMatches = buildGroup(9, "j", "Bảng J", [
  [TEAMS.ecu, TEAMS.bol, 2, 0],
  [TEAMS.chi, TEAMS.ven, 1, 1],
  [TEAMS.ecu, TEAMS.chi, 1, 0],
  [TEAMS.ven, TEAMS.bol, 3, 1],
  [TEAMS.ecu, TEAMS.ven, 1, 2],
  [TEAMS.bol, TEAMS.chi, 0, 1],
]);

const groupKMatches = buildGroup(10, "k", "Bảng K", [
  [TEAMS.mar, TEAMS.nzl, 3, 0],
  [TEAMS.den, TEAMS.pol, 1, 1],
  [TEAMS.mar, TEAMS.den, 2, 0],
  [TEAMS.pol, TEAMS.nzl, 4, 0],
  [TEAMS.mar, TEAMS.pol, 2, 1],
  [TEAMS.nzl, TEAMS.den, 0, 2],
]);

const groupLMatches = buildGroup(11, "l", "Bảng L", [
  [TEAMS.aus, TEAMS.tun, 2, 0],
  [TEAMS.kor, TEAMS.egy, 1, 1],
  [TEAMS.aus, TEAMS.kor, 1, 0],
  [TEAMS.egy, TEAMS.tun, 2, 1],
  [TEAMS.aus, TEAMS.egy, 2, 1],
  [TEAMS.tun, TEAMS.kor, 0, 1],
]);

export const groupStageMatches: Match[] = [
  ...groupAMatches,
  ...groupBMatches,
  ...groupCMatches,
  ...groupDMatches,
  ...groupEMatches,
  ...groupFMatches,
  ...groupGMatches,
  ...groupHMatches,
  ...groupIMatches,
  ...groupJMatches,
  ...groupKMatches,
  ...groupLMatches,
];

export const groupStageStandings = computeStandingsFromMatches(groupStageMatches);
