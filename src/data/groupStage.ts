/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchStatus, EventType, StandingGroup } from "../types.js";

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

const MD_TIMES = ["04:00", "07:00", "10:00", "23:00", "02:00", "06:00"];

type Fixture = [T, T, number, number];

function gm(
  id: string,
  group: string,
  md: number,
  idx: number,
  home: T,
  away: T,
  homeScore: number,
  awayScore: number
): Match {
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
    date: MD_DATES[md][idx % 2],
    time: MD_TIMES[(md * 2 + idx) % MD_TIMES.length],
    venue: VENUES[(md * 3 + idx) % VENUES.length],
    events: events.length > 0 ? events : undefined,
    stats: {
      possession: { home: 48 + (idx % 12), away: 52 - (idx % 12) },
      shots: { home: 8 + (idx % 6), away: 7 + (idx % 5) },
      shotsOnTarget: { home: 3 + (idx % 4), away: 3 + (idx % 3) },
      passAccuracy: { home: 80 + (idx % 8), away: 78 + (idx % 7) },
    },
  };
}

function buildGroup(groupKey: string, groupName: string, fixtures: [Fixture, Fixture, Fixture, Fixture, Fixture, Fixture]): Match[] {
  return fixtures.map(([h, a, hs, as], i) =>
    gm(`g${groupKey}_${i + 1}`, groupName, Math.floor(i / 2), i, h, a, hs, as)
  );
}

const groupAMatches = buildGroup("a", "Bảng A", [
  [TEAMS.mex, TEAMS.rsa, 2, 0],
  [TEAMS.usa, TEAMS.can, 1, 1],
  [TEAMS.can, TEAMS.rsa, 2, 0],
  [TEAMS.usa, TEAMS.mex, 2, 0],
  [TEAMS.usa, TEAMS.rsa, 3, 0],
  [TEAMS.mex, TEAMS.can, 0, 2],
]);

const groupBMatches = buildGroup("b", "Bảng B", [
  [TEAMS.arg, TEAMS.cpv, 3, 0],
  [TEAMS.fra, TEAMS.nor, 3, 1],
  [TEAMS.nor, TEAMS.cpv, 2, 0],
  [TEAMS.arg, TEAMS.fra, 2, 1],
  [TEAMS.arg, TEAMS.nor, 2, 1],
  [TEAMS.fra, TEAMS.cpv, 2, 1],
]);

const groupCMatches = buildGroup("c", "Bảng C", [
  [TEAMS.bra, TEAMS.aut, 2, 0],
  [TEAMS.ger, TEAMS.jpn, 2, 1],
  [TEAMS.jpn, TEAMS.bra, 1, 1],
  [TEAMS.ger, TEAMS.aut, 2, 1],
  [TEAMS.jpn, TEAMS.ger, 2, 1],
  [TEAMS.bra, TEAMS.jpn, 3, 1],
]);

const groupDMatches = buildGroup("d", "Bảng D", [
  [TEAMS.ned, TEAMS.uru, 2, 0],
  [TEAMS.par, TEAMS.swe, 1, 1],
  [TEAMS.ned, TEAMS.par, 1, 0],
  [TEAMS.swe, TEAMS.uru, 3, 0],
  [TEAMS.ned, TEAMS.swe, 2, 1],
  [TEAMS.uru, TEAMS.par, 0, 2],
]);

const groupEMatches = buildGroup("e", "Bảng E", [
  [TEAMS.bel, TEAMS.cmr, 3, 0],
  [TEAMS.sen, TEAMS.nga, 2, 1],
  [TEAMS.bel, TEAMS.sen, 1, 1],
  [TEAMS.nga, TEAMS.cmr, 2, 0],
  [TEAMS.bel, TEAMS.nga, 2, 0],
  [TEAMS.cmr, TEAMS.sen, 0, 2],
]);

const groupFMatches = buildGroup("f", "Bảng F", [
  [TEAMS.eng, TEAMS.sco, 2, 0],
  [TEAMS.cod, TEAMS.bih, 1, 0],
  [TEAMS.eng, TEAMS.cod, 3, 1],
  [TEAMS.bih, TEAMS.sco, 2, 1],
  [TEAMS.eng, TEAMS.bih, 1, 0],
  [TEAMS.sco, TEAMS.cod, 0, 2],
]);

const groupGMatches = buildGroup("g", "Bảng G", [
  [TEAMS.esp, TEAMS.ksa, 3, 0],
  [TEAMS.sui, TEAMS.alg, 1, 1],
  [TEAMS.esp, TEAMS.sui, 2, 1],
  [TEAMS.alg, TEAMS.ksa, 2, 0],
  [TEAMS.esp, TEAMS.alg, 1, 0],
  [TEAMS.ksa, TEAMS.sui, 0, 1],
]);

const groupHMatches = buildGroup("h", "Bảng H", [
  [TEAMS.por, TEAMS.svk, 2, 0],
  [TEAMS.cro, TEAMS.cze, 1, 0],
  [TEAMS.por, TEAMS.cro, 1, 1],
  [TEAMS.cze, TEAMS.svk, 2, 1],
  [TEAMS.por, TEAMS.cze, 2, 0],
  [TEAMS.svk, TEAMS.cro, 0, 2],
]);

const groupIMatches = buildGroup("i", "Bảng I", [
  [TEAMS.col, TEAMS.crc, 2, 0],
  [TEAMS.gha, TEAMS.civ, 1, 1],
  [TEAMS.col, TEAMS.gha, 2, 1],
  [TEAMS.civ, TEAMS.crc, 2, 0],
  [TEAMS.col, TEAMS.civ, 1, 0],
  [TEAMS.crc, TEAMS.gha, 0, 2],
]);

const groupJMatches = buildGroup("j", "Bảng J", [
  [TEAMS.ecu, TEAMS.bol, 2, 0],
  [TEAMS.chi, TEAMS.ven, 1, 1],
  [TEAMS.ecu, TEAMS.chi, 1, 0],
  [TEAMS.ven, TEAMS.bol, 3, 1],
  [TEAMS.ecu, TEAMS.ven, 2, 1],
  [TEAMS.bol, TEAMS.chi, 0, 1],
]);

const groupKMatches = buildGroup("k", "Bảng K", [
  [TEAMS.mar, TEAMS.nzl, 3, 0],
  [TEAMS.den, TEAMS.pol, 1, 1],
  [TEAMS.mar, TEAMS.den, 2, 0],
  [TEAMS.pol, TEAMS.nzl, 4, 0],
  [TEAMS.mar, TEAMS.pol, 1, 0],
  [TEAMS.nzl, TEAMS.den, 0, 2],
]);

const groupLMatches = buildGroup("l", "Bảng L", [
  [TEAMS.aus, TEAMS.tun, 2, 0],
  [TEAMS.kor, TEAMS.egy, 1, 1],
  [TEAMS.aus, TEAMS.kor, 1, 0],
  [TEAMS.egy, TEAMS.tun, 2, 1],
  [TEAMS.aus, TEAMS.egy, 2, 1],
  [TEAMS.tun, TEAMS.kor, 0, 1],
]);

export const groupStageStandings: StandingGroup[] = [
  {
    groupName: "Bảng A",
    teams: [
      { name: "Hoa Kỳ", code: "USA", flagUrl: f("us"), played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalsDifference: 4, points: 7 },
      { name: "Canada", code: "CAN", flagUrl: f("ca"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalsDifference: 1, points: 6 },
      { name: "Mexico", code: "MEX", flagUrl: f("mx"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 4, goalsDifference: -1, points: 3 },
      { name: "Nam Phi", code: "RSA", flagUrl: f("za"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalsDifference: -5, points: 0 },
    ],
  },
  {
    groupName: "Bảng B",
    teams: [
      { name: "Argentina", code: "ARG", flagUrl: f("ar"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 7, goalsAgainst: 1, goalsDifference: 6, points: 9 },
      { name: "Pháp", code: "FRA", flagUrl: f("fr"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalsDifference: 2, points: 6 },
      { name: "Na Uy", code: "NOR", flagUrl: f("no"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalsDifference: -2, points: 3 },
      { name: "Cabo Verde", code: "CPV", flagUrl: f("cv"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalsDifference: -6, points: 0 },
    ],
  },
  {
    groupName: "Bảng C",
    teams: [
      { name: "Brasil", code: "BRA", flagUrl: f("br"), played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalsDifference: 4, points: 7 },
      { name: "Đức", code: "GER", flagUrl: f("de"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalsDifference: 2, points: 6 },
      { name: "Nhật Bản", code: "JPN", flagUrl: f("jp"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalsDifference: 0, points: 4 },
      { name: "Áo", code: "AUT", flagUrl: f("at"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalsDifference: -6, points: 0 },
    ],
  },
  {
    groupName: "Bảng D",
    teams: [
      { name: "Hà Lan", code: "NED", flagUrl: f("nl"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 2, goalsDifference: 3, points: 6 },
      { name: "Paraguay", code: "PAR", flagUrl: f("py"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalsDifference: 1, points: 6 },
      { name: "Thụy Điển", code: "SWE", flagUrl: f("se"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 5, goalsAgainst: 4, goalsDifference: 1, points: 4 },
      { name: "Uruguay", code: "URU", flagUrl: f("uy"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 5, goalsDifference: -5, points: 0 },
    ],
  },
  {
    groupName: "Bảng E",
    teams: [
      { name: "Bỉ", code: "BEL", flagUrl: f("be"), played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 1, goalsDifference: 5, points: 7 },
      { name: "Sénégal", code: "SEN", flagUrl: f("sn"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalsDifference: 2, points: 6 },
      { name: "Nigeria", code: "NGA", flagUrl: f("ng"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 4, goalsDifference: -1, points: 3 },
      { name: "Cameroon", code: "CMR", flagUrl: f("cm"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 6, goalsDifference: -6, points: 0 },
    ],
  },
  {
    groupName: "Bảng F",
    teams: [
      { name: "Anh", code: "ENG", flagUrl: f("gb-eng"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 1, goalsDifference: 5, points: 9 },
      { name: "CHDC Congo", code: "COD", flagUrl: f("cd"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 4, goalsDifference: 0, points: 6 },
      { name: "Bosnia và Herzegovina", code: "BIH", flagUrl: f("ba"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 3, goalsDifference: -1, points: 3 },
      { name: "Scotland", code: "SCO", flagUrl: f("gb-sct"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalsDifference: -4, points: 0 },
    ],
  },
  {
    groupName: "Bảng G",
    teams: [
      { name: "Tây Ban Nha", code: "ESP", flagUrl: f("es"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 1, goalsDifference: 5, points: 9 },
      { name: "Thụy Sĩ", code: "SUI", flagUrl: f("ch"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Algérie", code: "ALG", flagUrl: f("dz"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Ả Rập Xê Út", code: "KSA", flagUrl: f("sa"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 5, goalsDifference: -5, points: 0 },
    ],
  },
  {
    groupName: "Bảng H",
    teams: [
      { name: "Bồ Đào Nha", code: "POR", flagUrl: f("pt"), played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, goalsDifference: 4, points: 7 },
      { name: "Croatia", code: "CRO", flagUrl: f("hr"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 3, goalsAgainst: 2, goalsDifference: 1, points: 6 },
      { name: "Czechia", code: "CZE", flagUrl: f("cz"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 5, goalsDifference: -1, points: 3 },
      { name: "Slovakia", code: "SVK", flagUrl: f("sk"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalsDifference: -4, points: 0 },
    ],
  },
  {
    groupName: "Bảng I",
    teams: [
      { name: "Colombia", code: "COL", flagUrl: f("co"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 2, goalsDifference: 3, points: 6 },
      { name: "Ghana", code: "GHA", flagUrl: f("gh"), played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalsDifference: 2, points: 6 },
      { name: "Bờ Biển Ngà", code: "CIV", flagUrl: f("ci"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Costa Rica", code: "CRC", flagUrl: f("cr"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 5, goalsDifference: -5, points: 0 },
    ],
  },
  {
    groupName: "Bảng J",
    teams: [
      { name: "Ecuador", code: "ECU", flagUrl: f("ec"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 1, goalsDifference: 4, points: 9 },
      { name: "Chile", code: "CHI", flagUrl: f("cl"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Venezuela", code: "VEN", flagUrl: f("ve"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 5, goalsAgainst: 5, goalsDifference: 0, points: 3 },
      { name: "Bolivia", code: "BOL", flagUrl: f("bo"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 2, goalsAgainst: 6, goalsDifference: -4, points: 0 },
    ],
  },
  {
    groupName: "Bảng K",
    teams: [
      { name: "Maroc", code: "MAR", flagUrl: f("ma"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 0, goalsDifference: 6, points: 9 },
      { name: "Đan Mạch", code: "DEN", flagUrl: f("dk"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Ba Lan", code: "POL", flagUrl: f("pl"), played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 5, goalsAgainst: 4, goalsDifference: 1, points: 3 },
      { name: "New Zealand", code: "NZL", flagUrl: f("nz"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 7, goalsDifference: -7, points: 0 },
    ],
  },
  {
    groupName: "Bảng L",
    teams: [
      { name: "Úc", code: "AUS", flagUrl: f("au"), played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 1, goalsDifference: 4, points: 9 },
      { name: "Hàn Quốc", code: "KOR", flagUrl: f("kr"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalsDifference: 0, points: 4 },
      { name: "Ai Cập", code: "EGY", flagUrl: f("eg"), played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalsDifference: 0, points: 4 },
      { name: "Tunisia", code: "TUN", flagUrl: f("tn"), played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalsDifference: -4, points: 0 },
    ],
  },
];

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
