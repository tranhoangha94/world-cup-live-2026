/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventType, MatchEvent, PlayerRating } from "../types.js";

interface SquadPlayer {
  name: string;
  position: string;
}

const SQUADS: Record<string, SquadPlayer[]> = {
  us: [
    { name: "Christian Pulisic", position: "LW" },
    { name: "Tyler Adams", position: "CDM" },
    { name: "Giovanni Reyna", position: "CAM" },
    { name: "Folarin Balogun", position: "ST" },
    { name: "Weston McKennie", position: "CM" },
  ],
  ca: [
    { name: "Jonathan David", position: "ST" },
    { name: "Alphonso Davies", position: "LB" },
    { name: "Cyle Larin", position: "ST" },
    { name: "Stephen Eustáquio", position: "CM" },
    { name: "Sam Adekugbe", position: "CB" },
  ],
  mx: [
    { name: "Raúl Jiménez", position: "ST" },
    { name: "Hirving Lozano", position: "RW" },
    { name: "Edson Álvarez", position: "CDM" },
    { name: "Alexis Vega", position: "LW" },
    { name: "Guillermo Ochoa", position: "GK" },
  ],
  za: [
    { name: "Percy Tau", position: "RW" },
    { name: "Teboho Mokoena", position: "CM" },
    { name: "Ronwen Williams", position: "GK" },
    { name: "Evidence Makgopa", position: "ST" },
    { name: "Sphephelo Sithole", position: "CM" },
  ],
  ar: [
    { name: "Lionel Messi", position: "RW" },
    { name: "Lautaro Martínez", position: "ST" },
    { name: "Ángel Di María", position: "LW" },
    { name: "Enzo Fernández", position: "CM" },
    { name: "Emiliano Martínez", position: "GK" },
  ],
  fr: [
    { name: "Kylian Mbappé", position: "ST" },
    { name: "Antoine Griezmann", position: "CAM" },
    { name: "Ousmane Dembélé", position: "RW" },
    { name: "Aurélien Tchouaméni", position: "CDM" },
    { name: "William Saliba", position: "CB" },
  ],
  no: [
    { name: "Erling Haaland", position: "ST" },
    { name: "Martin Ødegaard", position: "CAM" },
    { name: "Alexander Sørloth", position: "ST" },
    { name: "Sander Berge", position: "CDM" },
    { name: "Kristoffer Ajer", position: "CB" },
  ],
  cv: [
    { name: "Ryan Mendes", position: "LW" },
    { name: "Jovane Cabral", position: "RW" },
    { name: "Bébé", position: "ST" },
    { name: "Djaniny", position: "ST" },
    { name: "Stopira", position: "CB" },
  ],
  br: [
    { name: "Vinicius Jr", position: "LW" },
    { name: "Gabriel Martinelli", position: "LW" },
    { name: "Bruno Guimarães", position: "CM" },
    { name: "Rodrygo", position: "RW" },
    { name: "Endrick", position: "ST" },
    { name: "Casemiro", position: "CDM" },
    { name: "Raphinha", position: "RW" },
  ],
  de: [
    { name: "Jamal Musiala", position: "CAM" },
    { name: "Florian Wirtz", position: "LW" },
    { name: "Kai Havertz", position: "ST" },
    { name: "Joshua Kimmich", position: "CDM" },
    { name: "Niclas Füllkrug", position: "ST" },
  ],
  jp: [
    { name: "Kaoru Mitoma", position: "LW" },
    { name: "Kaishu Sano", position: "ST" },
    { name: "Takefusa Kubo", position: "RW" },
    { name: "Daizen Maeda", position: "ST" },
    { name: "Wataru Endo", position: "CDM" },
    { name: "Ritsu Doan", position: "RW" },
  ],
  at: [
    { name: "Marcel Sabitzer", position: "CM" },
    { name: "Marko Arnautović", position: "ST" },
    { name: "Konrad Laimer", position: "RB" },
    { name: "Christoph Baumgartner", position: "CAM" },
    { name: "David Alaba", position: "CB" },
  ],
  nl: [
    { name: "Cody Gakpo", position: "LW" },
    { name: "Memphis Depay", position: "ST" },
    { name: "Xavi Simons", position: "CAM" },
    { name: "Frenkie de Jong", position: "CM" },
    { name: "Virgil van Dijk", position: "CB" },
  ],
  py: [
    { name: "Julio Enciso", position: "CAM" },
    { name: "Miguel Almirón", position: "RW" },
    { name: "Antonio Sanabria", position: "ST" },
    { name: "Gustavo Gómez", position: "CB" },
    { name: "Diego Gómez", position: "CM" },
  ],
  se: [
    { name: "Alexander Isak", position: "ST" },
    { name: "Dejan Kulusevski", position: "RW" },
    { name: "Victor Gyökeres", position: "ST" },
    { name: "Emil Forsberg", position: "CAM" },
    { name: "Victor Lindelöf", position: "CB" },
  ],
  uy: [
    { name: "Darwin Núñez", position: "ST" },
    { name: "Federico Valverde", position: "CM" },
    { name: "Luis Suárez", position: "ST" },
    { name: "Rodrigo Bentancur", position: "CDM" },
    { name: "Ronald Araújo", position: "CB" },
  ],
  be: [
    { name: "Romelu Lukaku", position: "ST" },
    { name: "Kevin De Bruyne", position: "CAM" },
    { name: "Jeremy Doku", position: "LW" },
    { name: "Amadou Onana", position: "CDM" },
    { name: "Youri Tielemans", position: "CM" },
  ],
  sn: [
    { name: "Sadio Mané", position: "LW" },
    { name: "Ismaïla Sarr", position: "RW" },
    { name: "Nicolas Jackson", position: "ST" },
    { name: "Idrissa Gueye", position: "CDM" },
    { name: "Kalidou Koulibaly", position: "CB" },
  ],
  ng: [
    { name: "Victor Osimhen", position: "ST" },
    { name: "Ademola Lookman", position: "LW" },
    { name: "Alex Iwobi", position: "CAM" },
    { name: "Wilfred Ndidi", position: "CDM" },
    { name: "Samuel Chukwueze", position: "RW" },
  ],
  cm: [
    { name: "Vincent Aboubakar", position: "ST" },
    { name: "André-Frank Zambo Anguissa", position: "CM" },
    { name: "Bryan Mbeumo", position: "RW" },
    { name: "Jean-Charles Castelletto", position: "CB" },
    { name: "Karl Toko Ekambi", position: "ST" },
  ],
  "gb-eng": [
    { name: "Harry Kane", position: "ST" },
    { name: "Bukayo Saka", position: "RW" },
    { name: "Phil Foden", position: "CAM" },
    { name: "Declan Rice", position: "CDM" },
    { name: "Jude Bellingham", position: "CM" },
  ],
  cd: [
    { name: "Yoane Wissa", position: "ST" },
    { name: "Cédric Bakambu", position: "ST" },
    { name: "Théo Bongonda", position: "RW" },
    { name: "Chancel Mbemba", position: "CB" },
    { name: "Gaël Kakuta", position: "CAM" },
  ],
  ba: [
    { name: "Edin Džeko", position: "ST" },
    { name: "Miralem Pjanić", position: "CM" },
    { name: "Ermedin Demirović", position: "ST" },
    { name: "Sead Kolašinac", position: "LB" },
    { name: "Amar Dedić", position: "RB" },
  ],
  "gb-sct": [
    { name: "Scott McTominay", position: "CM" },
    { name: "Lyndon Dykes", position: "ST" },
    { name: "John McGinn", position: "CM" },
    { name: "Kieran Tierney", position: "LB" },
    { name: "Che Adams", position: "ST" },
  ],
  es: [
    { name: "Lamine Yamal", position: "RW" },
    { name: "Álvaro Morata", position: "ST" },
    { name: "Pedri", position: "CM" },
    { name: "Nico Williams", position: "LW" },
    { name: "Rodri", position: "CDM" },
  ],
  ch: [
    { name: "Granit Xhaka", position: "CM" },
    { name: "Breel Embolo", position: "ST" },
    { name: "Xherdan Shaqiri", position: "CAM" },
    { name: "Ruben Vargas", position: "LW" },
    { name: "Manuel Akanji", position: "CB" },
  ],
  dz: [
    { name: "Riyad Mahrez", position: "RW" },
    { name: "Ismaël Bennacer", position: "CM" },
    { name: "Youcef Atal", position: "RB" },
    { name: "Amine Gouiri", position: "ST" },
    { name: "Ramy Bensebaini", position: "CB" },
  ],
  sa: [
    { name: "Salem Al-Dawsari", position: "LW" },
    { name: "Firas Al-Buraikan", position: "ST" },
    { name: "Saud Abdulhamid", position: "RB" },
    { name: "Abdulellah Al-Malki", position: "CDM" },
    { name: "Saleh Al-Shehri", position: "ST" },
  ],
  pt: [
    { name: "Cristiano Ronaldo", position: "ST" },
    { name: "Bernardo Silva", position: "CAM" },
    { name: "Rafael Leão", position: "LW" },
    { name: "Bruno Fernandes", position: "CAM" },
    { name: "Rúben Dias", position: "CB" },
  ],
  hr: [
    { name: "Luka Modrić", position: "CM" },
    { name: "Marko Livaja", position: "ST" },
    { name: "Mateo Kovačić", position: "CM" },
    { name: "Ivan Perišić", position: "LW" },
    { name: "Joško Gvardiol", position: "CB" },
  ],
  cz: [
    { name: "Patrik Schick", position: "ST" },
    { name: "Tomáš Souček", position: "CDM" },
    { name: "Vladimír Coufal", position: "RB" },
    { name: "Antonín Barák", position: "CM" },
    { name: "Michal Sadílek", position: "CM" },
  ],
  sk: [
    { name: "Marek Hamšík", position: "CAM" },
    { name: "Róbert Boženík", position: "ST" },
    { name: "Ondrej Duda", position: "CM" },
    { name: "Peter Pekarík", position: "RB" },
    { name: "Stanislav Lobotka", position: "CDM" },
  ],
  co: [
    { name: "Luis Díaz", position: "LW" },
    { name: "James Rodríguez", position: "CAM" },
    { name: "Luis Sinisterra", position: "LW" },
    { name: "Jefferson Lerma", position: "CDM" },
    { name: "Yerry Mina", position: "CB" },
  ],
  gh: [
    { name: "Mohammed Kudus", position: "RW" },
    { name: "Inaki Williams", position: "ST" },
    { name: "Thomas Partey", position: "CDM" },
    { name: "Jordan Ayew", position: "RW" },
    { name: "André Ayew", position: "ST" },
  ],
  ci: [
    { name: "Sébastien Haller", position: "ST" },
    { name: "Franck Kessié", position: "CM" },
    { name: "Nicolas Pépé", position: "RW" },
    { name: "Wilfried Zaha", position: "LW" },
    { name: "Eric Bailly", position: "CB" },
  ],
  cr: [
    { name: "Joel Campbell", position: "ST" },
    { name: "Bryan Oviedo", position: "LB" },
    { name: "Keysher Fuller", position: "RB" },
    { name: "Johan Venegas", position: "ST" },
    { name: "Yeltsin Tejeda", position: "CM" },
  ],
  ec: [
    { name: "Enner Valencia", position: "ST" },
    { name: "Moisés Caicedo", position: "CDM" },
    { name: "Pervis Estupiñán", position: "LB" },
    { name: "Kendry Páez", position: "CAM" },
    { name: "Jeremy Sarmiento", position: "LW" },
  ],
  cl: [
    { name: "Alexis Sánchez", position: "ST" },
    { name: "Eduardo Vidal", position: "CM" },
    { name: "Ben Brereton", position: "ST" },
    { name: "Gary Medel", position: "CB" },
    { name: "Erick Pulgar", position: "CDM" },
  ],
  ve: [
    { name: "Salomón Rondón", position: "ST" },
    { name: "Jhon Murillo", position: "RW" },
    { name: "José Martínez", position: "CM" },
    { name: "Yangel Herrera", position: "CM" },
    { name: "Wilker Ángel", position: "CB" },
  ],
  bo: [
    { name: "Marcelo Martins", position: "ST" },
    { name: "Rodrigo Beckham", position: "RW" },
    { name: "Bruno Miranda", position: "ST" },
    { name: "Luis Haquin", position: "CB" },
    { name: "Erwin Sánchez", position: "CM" },
  ],
  ma: [
    { name: "Hakim Ziyech", position: "RW" },
    { name: "Youssef En-Nesyri", position: "ST" },
    { name: "Achraf Hakimi", position: "RB" },
    { name: "Sofyan Amrabat", position: "CDM" },
    { name: "Yassine Bounou", position: "GK" },
  ],
  ht: [
    { name: "Frantzdy Pierrot", position: "ST" },
    { name: "Derrick Etienne", position: "LW" },
    { name: "Johny Placide", position: "GK" },
    { name: "Zachary Herivaux", position: "CM" },
    { name: "Derrick Etienne Jr.", position: "RW" },
  ],
  dk: [
    { name: "Christian Eriksen", position: "CAM" },
    { name: "Rasmus Højlund", position: "ST" },
    { name: "Pierre-Emile Højbjerg", position: "CDM" },
    { name: "Joakim Mæhle", position: "LB" },
    { name: "Andreas Skov Olsen", position: "RW" },
  ],
  pl: [
    { name: "Robert Lewandowski", position: "ST" },
    { name: "Piotr Zieliński", position: "CM" },
    { name: "Krzysztof Piątek", position: "ST" },
    { name: "Sebastian Szymański", position: "CAM" },
    { name: "Jakub Kiwior", position: "CB" },
  ],
  nz: [
    { name: "Chris Wood", position: "ST" },
    { name: "Marco Rojas", position: "CAM" },
    { name: "Winston Reid", position: "CB" },
    { name: "Alex Rufer", position: "ST" },
    { name: "Michael Boxall", position: "CB" },
  ],
  au: [
    { name: "Mathew Ryan", position: "GK" },
    { name: "Mitchell Duke", position: "ST" },
    { name: "Craig Goodwin", position: "LW" },
    { name: "Riley McGree", position: "CM" },
    { name: "Harry Souttar", position: "CB" },
  ],
  eg: [
    { name: "Mohamed Salah", position: "RW" },
    { name: "Omar Marmoush", position: "ST" },
    { name: "Mohamed Elneny", position: "CDM" },
    { name: "Trézéguet", position: "LW" },
    { name: "Ahmed Hegazi", position: "CB" },
  ],
  kr: [
    { name: "Son Heung-min", position: "LW" },
    { name: "Lee Kang-in", position: "CAM" },
    { name: "Hwang Hee-chan", position: "ST" },
    { name: "Kim Min-jae", position: "CB" },
    { name: "Hwang Ui-jo", position: "ST" },
  ],
  tn: [
    { name: "Wahbi Khazri", position: "ST" },
    { name: "Youssef Msakni", position: "LW" },
    { name: "Ellyes Skhiri", position: "CDM" },
    { name: "Aïssa Laïdouni", position: "CM" },
    { name: "Dylan Bronn", position: "CB" },
  ],
};

const GOAL_MINUTES = [
  "7'", "12'", "18'", "23'", "29'", "34'", "38'", "41'", "45+1'",
  "52'", "56'", "61'", "67'", "73'", "78'", "82'", "86'", "90+2'", "90+4'",
];

const GOAL_DETAILS = [
  "Sút bổ sung cận thành sau pha phối hợp tấn công nhanh",
  "Đánh đầu chính xác từ quả phạt góc",
  "Sút xa đưa bóng găm thẳng góc chữ A",
  "Dứt điểm chân trái trong vòng cấm",
  "Sút phạt hàng rào đẳng cấp",
  "Phản công nhanh, chốt chấp từ cự ly gần",
  "Đánh bại thủ môn bằng cú lốp bóng tinh tế",
  "Sút chéo góc sau đường chuyền quyết định",
];

const CARD_DETAILS = [
  "Phạm lỗi chiến thuật",
  "Kéo áo cầu thủ đối phương",
  "Phản ứng quá đà với trọng tài",
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function squadFor(code: string): SquadPlayer[] {
  return SQUADS[code] ?? [
    { name: "Cầu thủ chủ chốt", position: "ST" },
    { name: "Tiền vệ tấn công", position: "CAM" },
    { name: "Hậu vệ trụ", position: "CB" },
    { name: "Tiền đạo cánh", position: "LW" },
    { name: "Thủ môn", position: "GK" },
  ];
}

const ATTACK_POSITIONS = new Set(["ST", "LW", "RW", "CAM"]);

function pickScorer(code: string, seed: string, used: Set<string> = new Set()): SquadPlayer {
  const squad = squadFor(code);
  const attackers = squad.filter((p) => ATTACK_POSITIONS.has(p.position) && !used.has(p.name));
  const pool = attackers.length > 0 ? attackers : squad.filter((p) => !used.has(p.name));
  if (pool.length === 0) return squad[0];
  return pool[hashSeed(seed) % pool.length];
}

function pickPlayer(code: string, seed: string, avoid: Set<string> = new Set()): SquadPlayer {
  const squad = squadFor(code);
  const start = hashSeed(seed) % squad.length;
  for (let i = 0; i < squad.length; i++) {
    const p = squad[(start + i) % squad.length];
    if (!avoid.has(p.name)) return p;
  }
  return squad[0];
}

function goalDetail(runningHome: number, runningAway: number, side: "home" | "away", seed: string): string {
  const hs = side === "home" ? runningHome + 1 : runningHome;
  const as = side === "away" ? runningAway + 1 : runningAway;
  if (hs === 1 && as === 0) return "Bàn mở tỷ số";
  if (hs === as) return "Cân bằng tỷ số";
  if (hs - as === 1 || as - hs === 1) return "Bàn thắng nâng tỷ số";
  return GOAL_DETAILS[hashSeed(seed) % GOAL_DETAILS.length];
}

function buildGoalSequence(homeScore: number, awayScore: number, seed: string): Array<"home" | "away"> {
  const seq: Array<"home" | "away"> = [];
  let h = homeScore;
  let a = awayScore;
  let flip = hashSeed(seed) % 2 === 0;

  while (h > 0 || a > 0) {
    if (h === 0) {
      seq.push("away");
      a--;
      continue;
    }
    if (a === 0) {
      seq.push("home");
      h--;
      continue;
    }
    if (flip) {
      seq.push("home");
      h--;
    } else {
      seq.push("away");
      a--;
    }
    flip = !flip;
  }
  return seq;
}

function buildAssister(code: string, scorer: string, seed: string): string | null {
  const squad = squadFor(code).filter((p) => p.name !== scorer);
  if (squad.length === 0) return null;
  const assister = squad[hashSeed(seed) % squad.length];
  return assister.name;
}

export function enrichFinishedMatch(
  matchId: string,
  homeCode: string,
  awayCode: string,
  homeScore: number,
  awayScore: number
): { events: MatchEvent[]; lineups: PlayerRating[] } {
  const events: MatchEvent[] = [];
  const scorers: Array<{ side: "home" | "away"; name: string; position: string }> = [];
  const sequence = buildGoalSequence(homeScore, awayScore, matchId);
  const minuteStart = hashSeed(matchId) % 4;

  let runningHome = 0;
  let runningAway = 0;

  sequence.forEach((side, idx) => {
    const code = side === "home" ? homeCode : awayCode;
    const player = pickScorer(code, `${matchId}-g${idx}`);
    const minute = GOAL_MINUTES[Math.min(minuteStart + idx * 2, GOAL_MINUTES.length - 1)];
    const detailBase = goalDetail(runningHome, runningAway, side, `${matchId}-d${idx}`);
    const assister = buildAssister(code, player.name, `${matchId}-a${idx}`);
    const detail = assister ? `${detailBase} — kiến tạo: ${assister}` : detailBase;

    events.push({
      minute,
      type: EventType.GOAL,
      player: player.name,
      team: side,
      detail,
    });

    scorers.push({ side, name: player.name, position: player.position });
    if (side === "home") runningHome++;
    else runningAway++;
  });

  const totalGoals = homeScore + awayScore;
  if (totalGoals >= 2 && hashSeed(`${matchId}-yc`) % 3 !== 0) {
    const side = hashSeed(`${matchId}-ycs`) % 2 === 0 ? "home" : "away";
    const code = side === "home" ? homeCode : awayCode;
    const player = pickPlayer(code, `${matchId}-yc`);
    events.push({
      minute: `${28 + (hashSeed(matchId) % 40)}'`,
      type: EventType.YELLOW_CARD,
      player: player.name,
      team: side,
      detail: CARD_DETAILS[hashSeed(`${matchId}-ycd`) % CARD_DETAILS.length],
    });
  }

  if (totalGoals >= 1) {
    const side = hashSeed(`${matchId}-sub`) % 2 === 0 ? "home" : "away";
    const code = side === "home" ? homeCode : awayCode;
    const squad = squadFor(code);
    const inPlayer = squad[hashSeed(`${matchId}-in`) % squad.length];
    const outPlayer = squad[(hashSeed(`${matchId}-out`) + 1) % squad.length];
    if (inPlayer.name !== outPlayer.name) {
      events.push({
        minute: `${70 + (hashSeed(matchId) % 15)}'`,
        type: EventType.SUB,
        player: inPlayer.name,
        playerOut: outPlayer.name,
        team: side,
        detail: "Thay người chiến thuật",
      });
    }
  }

  events.sort((a, b) => {
    const parseMin = (m: string) => parseInt(m.replace(/[^\d]/g, ""), 10) || 0;
    return parseMin(a.minute) - parseMin(b.minute);
  });

  const lineups: PlayerRating[] = [];
  const addLineup = (side: "home" | "away", code: string) => {
    const sideScorers = scorers.filter((s) => s.side === side);
    const used = new Set<string>();
    for (const s of sideScorers) {
      used.add(s.name);
      lineups.push({
        name: s.name,
        position: s.position,
        team: side,
        rating: 7.6 + (hashSeed(`${matchId}-${s.name}`) % 10) / 10,
      });
    }
    const extra = pickPlayer(code, `${matchId}-lu-${side}`, used);
    lineups.push({
      name: extra.name,
      position: extra.position,
      team: side,
      rating: 6.8 + (hashSeed(`${matchId}-lu2-${side}`) % 8) / 10,
    });
  };

  addLineup("home", homeCode);
  addLineup("away", awayCode);

  return { events, lineups };
}
