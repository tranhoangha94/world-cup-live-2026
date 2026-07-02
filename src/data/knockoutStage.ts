/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchStatus, EventType } from "../types.js";

export const knockoutMatches: Match[] = [
  // --- VÒNG 32 (ROUND OF 32) ---
  {
    id: "r32_1",
    homeTeam: { name: "Nam Phi", code: "RSA", flagUrl: "https://flagcdn.com/w160/za.png" },
    awayTeam: { name: "Canada", code: "CAN", flagUrl: "https://flagcdn.com/w160/ca.png", label: "ĐỒNG CHỦ NHÀ" },
    homeScore: 0,
    awayScore: 1,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "29/06/2026",
    time: "02:00",
    venue: "Sân vận động SoFi, Los Angeles",
    events: [
      { minute: "90+2'", type: EventType.GOAL, player: "Stephan Eustáquio", team: "away", detail: "Bàn thắng ở phút bù giờ đưa Canada vào vòng 16" },
    ],
    stats: {
      possession: { home: 42, away: 58 },
      shots: { home: 6, away: 14 },
      shotsOnTarget: { home: 2, away: 6 },
      passAccuracy: { home: 78, away: 86 }
    },
    lineups: [
      { name: "Stephen Eustáquio", position: "CM", team: "away", rating: 8.2 },
      { name: "Alphonso Davies", position: "LB", team: "away", rating: 7.8 },
      { name: "Jonathan David", position: "ST", team: "away", rating: 7.5 },
    ]
  },
  {
    id: "r32_2",
    homeTeam: { name: "Hà Lan", code: "NED", flagUrl: "https://flagcdn.com/w160/nl.png" },
    awayTeam: { name: "Maroc", code: "MAR", flagUrl: "https://flagcdn.com/w160/ma.png" },
    homeScore: 1,
    awayScore: 1,
    homePens: 2,
    awayPens: 3,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "30/06/2026",
    time: "08:00",
    venue: "Sân vận động Akron, Guadalajara",
    events: [
      { minute: "72'", type: EventType.GOAL, player: "Cody Gakpo", team: "home", detail: "Cân bằng tỷ số cho Hà Lan" },
      { minute: "90+1'", type: EventType.GOAL, player: "Issa Diop", team: "away", detail: "Phút bù giờ — Maroc cân bằng tỷ số" },
      { minute: "120'", type: EventType.SUB, player: "Yassine Bounou", playerOut: "Munir Mohamedi", team: "away", detail: "Chuyên gia bắt luân lưu" }
    ],
    stats: {
      possession: { home: 51, away: 49 },
      shots: { home: 11, away: 12 },
      shotsOnTarget: { home: 4, away: 5 },
      passAccuracy: { home: 83, away: 81 }
    },
    lineups: [
      { name: "Yassine Bounou", position: "GK", team: "away", rating: 8.5 },
      { name: "Cody Gakpo", position: "LW", team: "home", rating: 7.9 },
      { name: "Issa Diop", position: "CB", team: "away", rating: 7.6 },
    ]
  },
  {
    id: "r32_3",
    homeTeam: { name: "Đức", code: "GER", flagUrl: "https://flagcdn.com/w160/de.png" },
    awayTeam: { name: "Paraguay", code: "PAR", flagUrl: "https://flagcdn.com/w160/py.png" },
    homeScore: 1,
    awayScore: 1,
    homePens: 3,
    awayPens: 4,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "30/06/2026",
    time: "03:30",
    venue: "Sân vận động Gillette, Boston",
    events: [
      { minute: "42'", type: EventType.GOAL, player: "Julio Enciso", team: "away", detail: "Paraguay dẫn trước sau pha dứt điểm của Enciso" },
      { minute: "54'", type: EventType.GOAL, player: "Kai Havertz", team: "home", detail: "Havertz cân bằng tỷ số cho Đức" }
    ],
    stats: {
      possession: { home: 65, away: 35 },
      shots: { home: 18, away: 7 },
      shotsOnTarget: { home: 8, away: 3 },
      passAccuracy: { home: 89, away: 71 }
    },
    lineups: [
      { name: "Julio Enciso", position: "CAM", team: "away", rating: 8.1 },
      { name: "Kai Havertz", position: "ST", team: "home", rating: 8.4 },
      { name: "Florian Wirtz", position: "LW", team: "home", rating: 7.5 }
    ]
  },
  {
    id: "r32_4",
    homeTeam: { name: "Pháp", code: "FRA", flagUrl: "https://flagcdn.com/w160/fr.png" },
    awayTeam: { name: "Thụy Điển", code: "SWE", flagUrl: "https://flagcdn.com/w160/se.png" },
    homeScore: 3,
    awayScore: 0,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "04:00",
    venue: "Sân vận động MetLife, New York",
    events: [
      { minute: "45'", type: EventType.GOAL, player: "Kylian Mbappé", team: "home", detail: "Mbappé mở tỷ số trước giờ nghỉ" },
      { minute: "53'", type: EventType.GOAL, player: "Bradley Barcola", team: "home", detail: "Barcola nhân đôi cách biệt sau pha kiến tạo của Olise" },
      { minute: "74'", type: EventType.GOAL, player: "Kylian Mbappé", team: "home", detail: "Mbappé lập cú đúp — Pháp vào vòng 16" },
    ],
    stats: {
      possession: { home: 62, away: 38 },
      shots: { home: 25, away: 7 },
      shotsOnTarget: { home: 10, away: 3 },
      passAccuracy: { home: 88, away: 79 },
    },
    lineups: [
      { name: "Kylian Mbappé", position: "ST", team: "home", rating: 9.0 },
      { name: "Michael Olise", position: "RW", team: "home", rating: 8.7 },
      { name: "Bradley Barcola", position: "LW", team: "home", rating: 8.2 },
    ],
  },
  {
    id: "r32_5",
    homeTeam: { name: "Bỉ", code: "BEL", flagUrl: "https://flagcdn.com/w160/be.png" },
    awayTeam: { name: "Sénégal", code: "SEN", flagUrl: "https://flagcdn.com/w160/sn.png" },
    homeScore: 3,
    awayScore: 2,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "02/07/2026",
    time: "03:00",
    venue: "Sân vận động Lumen Field, Seattle",
    events: [
      { minute: "24'", type: EventType.GOAL, player: "Habib Diarra", team: "away", detail: "Senegal dẫn trước 1–0" },
      { minute: "51'", type: EventType.GOAL, player: "Ismaïla Sarr", team: "away", detail: "Senegal vượt lên 2–0" },
      { minute: "64'", type: EventType.YELLOW_CARD, player: "Brandon Mechele", team: "home" },
      { minute: "67'", type: EventType.YELLOW_CARD, player: "Lamine Camara", team: "away" },
      { minute: "86'", type: EventType.GOAL, player: "Romelu Lukaku", team: "home", detail: "Bàn gỡ muộn (kiến tạo: Thomas Meunier)" },
      { minute: "89'", type: EventType.GOAL, player: "Youri Tielemans", team: "home", detail: "Đánh đầu cân bằng 2–2 (kiến tạo: Leandro Trossard)" },
      { minute: "120+5'", type: EventType.GOAL, player: "Youri Tielemans", team: "home", detail: "Penalty sau VAR — bàn thắng ở phút bù giờ hiệp phụ" },
    ],
    stats: {
      possession: { home: 52, away: 48 },
      shots: { home: 19, away: 19 },
      shotsOnTarget: { home: 5, away: 5 },
      passAccuracy: { home: 86, away: 84 },
    },
    lineups: [
      { name: "Youri Tielemans", position: "CM", team: "home", rating: 8.5 },
      { name: "Ismaïla Sarr", position: "LW", team: "away", rating: 8.0 },
      { name: "Romelu Lukaku", position: "ST", team: "home", rating: 7.8 },
    ],
  },
  {
    id: "r32_6",
    homeTeam: { name: "Hoa Kỳ", code: "USA", flagUrl: "https://flagcdn.com/w160/us.png", label: "ĐỒNG CHỦ NHÀ" },
    awayTeam: { name: "Bosnia và Herzegovina", code: "BIH", flagUrl: "https://flagcdn.com/w160/ba.png" },
    homeScore: 2,
    awayScore: 0,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "02/07/2026",
    time: "07:00",
    venue: "Sân vận động Levi's, Santa Clara",
    events: [
      { minute: "45'", type: EventType.GOAL, player: "Folarin Balogun", team: "home", detail: "Mở tỷ số trước giờ nghỉ (kiến tạo: Weston McKennie)" },
      { minute: "64'", type: EventType.RED_CARD, player: "Folarin Balogun", team: "home", detail: "Thẻ đỏ sau VAR — Mỹ chơi thiếu người" },
      { minute: "82'", type: EventType.GOAL, player: "Malik Tillman", team: "home", detail: "Đá phạt đẹp chốt hạ 2–0" },
    ],
    stats: {
      possession: { home: 48, away: 52 },
      shots: { home: 8, away: 10 },
      shotsOnTarget: { home: 2, away: 3 },
      passAccuracy: { home: 84, away: 82 },
    },
    lineups: [
      { name: "Malik Tillman", position: "CM", team: "home", rating: 8.2 },
      { name: "Folarin Balogun", position: "ST", team: "home", rating: 7.5 },
      { name: "Matt Freese", position: "GK", team: "home", rating: 7.4 },
    ],
  },
  {
    id: "r32_7",
    homeTeam: { name: "Tây Ban Nha", code: "ESP", flagUrl: "https://flagcdn.com/w160/es.png" },
    awayTeam: { name: "Áo", code: "AUT", flagUrl: "https://flagcdn.com/w160/at.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "03/07/2026",
    time: "02:00",
    venue: "Sân vận động SoFi, Los Angeles"
  },
  {
    id: "r32_8",
    homeTeam: { name: "Bồ Đào Nha", code: "POR", flagUrl: "https://flagcdn.com/w160/pt.png" },
    awayTeam: { name: "Croatia", code: "CRO", flagUrl: "https://flagcdn.com/w160/hr.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "03/07/2026",
    time: "06:00",
    venue: "Sân vận động BMO Field, Toronto"
  },
  {
    id: "r32_9",
    homeTeam: { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/w160/br.png" },
    awayTeam: { name: "Nhật Bản", code: "JPN", flagUrl: "https://flagcdn.com/w160/jp.png" },
    homeScore: 2,
    awayScore: 1,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "30/06/2026",
    time: "00:00",
    venue: "Sân vận động NRG, Houston",
    events: [
      { minute: "29'", type: EventType.GOAL, player: "Kaishu Sano", team: "away", detail: "Sút xa đẹp mắt từ ngoài vòng cung — Nhật Bản dẫn trước" },
      { minute: "56'", type: EventType.GOAL, player: "Casemiro", team: "home", detail: "Đánh đầu cận thành cân bằng tỷ số" },
      { minute: "67'", type: EventType.YELLOW_CARD, player: "Wataru Endo", team: "away", detail: "Phạm lỗi chiến thuật" },
      { minute: "81'", type: EventType.YELLOW_CARD, player: "Casemiro", team: "home", detail: "Kéo áo cầu thủ đối phương" },
      { minute: "90+5'", type: EventType.GOAL, player: "Gabriel Martinelli", team: "home", detail: "Sút chéo góc từ đường chuyền của Bruno Guimarães — bàn thắng quyết định" },
    ],
    stats: {
      possession: { home: 60, away: 40 },
      shots: { home: 20, away: 5 },
      shotsOnTarget: { home: 7, away: 2 },
      passAccuracy: { home: 92, away: 86 }
    },
    lineups: [
      { name: "Gabriel Martinelli", position: "LW", team: "home", rating: 8.4 },
      { name: "Casemiro", position: "CDM", team: "home", rating: 8.1 },
      { name: "Kaishu Sano", position: "ST", team: "away", rating: 7.5 },
    ]
  },
  {
    id: "r32_10",
    homeTeam: { name: "Bờ Biển Ngà", code: "CIV", flagUrl: "https://flagcdn.com/w160/ci.png" },
    awayTeam: { name: "Na Uy", code: "NOR", flagUrl: "https://flagcdn.com/w160/no.png" },
    homeScore: 1,
    awayScore: 2,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "00:00",
    venue: "Sân vận động AT&T, Dallas",
    events: [
      { minute: "39'", type: EventType.GOAL, player: "Antonio Nusa", team: "away", detail: "Na Uy dẫn trước ở hiệp một" },
      { minute: "74'", type: EventType.GOAL, player: "Amad Diallo", team: "home", detail: "Bờ Biển Ngà gỡ hòa" },
      { minute: "86'", type: EventType.GOAL, player: "Erling Haaland", team: "away", detail: "Haaland chốt hạ — Na Uy vào vòng 16" },
    ],
    stats: {
      possession: { home: 52, away: 48 },
      shots: { home: 14, away: 9 },
      shotsOnTarget: { home: 5, away: 3 },
      passAccuracy: { home: 86, away: 89 },
    },
    lineups: [
      { name: "Erling Haaland", position: "ST", team: "away", rating: 8.6 },
      { name: "Antonio Nusa", position: "LW", team: "away", rating: 7.8 },
      { name: "Amad Diallo", position: "RW", team: "home", rating: 7.5 },
    ],
  },
  {
    id: "r32_11",
    homeTeam: { name: "Mexico", code: "MEX", flagUrl: "https://flagcdn.com/w160/mx.png", label: "ĐỒNG CHỦ NHÀ" },
    awayTeam: { name: "Ecuador", code: "ECU", flagUrl: "https://flagcdn.com/w160/ec.png" },
    homeScore: 2,
    awayScore: 0,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "08:00",
    venue: "Sân vận động Azteca, Mexico City",
    events: [
      { minute: "22'", type: EventType.GOAL, player: "Julián Quiñones", team: "home", detail: "Quiñones sút xa đưa Mexico dẫn trước" },
      { minute: "31'", type: EventType.GOAL, player: "Raúl Jiménez", team: "home", detail: "Jiménez găm thẳng góc chữ A — 2-0 sau hiệp một" },
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 14, away: 8 },
      shotsOnTarget: { home: 6, away: 2 },
      passAccuracy: { home: 84, away: 80 },
    },
    lineups: [
      { name: "Julián Quiñones", position: "ST", team: "home", rating: 8.5 },
      { name: "Raúl Jiménez", position: "ST", team: "home", rating: 8.1 },
      { name: "Roberto Alvarado", position: "RW", team: "home", rating: 7.6 },
    ],
  },
  {
    id: "r32_12",
    homeTeam: { name: "Anh", code: "ENG", flagUrl: "https://flagcdn.com/w160/gb-eng.png" },
    awayTeam: { name: "CHDC Congo", code: "COD", flagUrl: "https://flagcdn.com/w160/cd.png" },
    homeScore: 2,
    awayScore: 1,
    status: MatchStatus.FINISHED,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "23:00",
    venue: "Sân vận động Mercedes-Benz, Atlanta",
    events: [
      { minute: "7'", type: EventType.GOAL, player: "Brian Cipenga", team: "away", detail: "Sút chân trái sát cột — Congo dẫn trước sớm" },
      { minute: "19'", type: EventType.YELLOW_CARD, player: "Jude Bellingham", team: "home" },
      { minute: "27'", type: EventType.YELLOW_CARD, player: "Noah Sadiki", team: "away" },
      { minute: "75'", type: EventType.GOAL, player: "Harry Kane", team: "home", detail: "Đánh đầu cân bằng tỷ số (kiến tạo: Anthony Gordon)" },
      { minute: "86'", type: EventType.GOAL, player: "Harry Kane", team: "home", detail: "Cú đúp — Anh vào vòng 16" },
    ],
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 16, away: 7 },
      shotsOnTarget: { home: 8, away: 2 },
      passAccuracy: { home: 92, away: 84 },
    },
    lineups: [
      { name: "Harry Kane", position: "ST", team: "home", rating: 9.0 },
      { name: "Brian Cipenga", position: "LW", team: "away", rating: 7.6 },
      { name: "Anthony Gordon", position: "LW", team: "home", rating: 7.8 },
    ],
  },
  {
    id: "r32_13",
    homeTeam: { name: "Thụy Sĩ", code: "SUI", flagUrl: "https://flagcdn.com/w160/ch.png" },
    awayTeam: { name: "Algérie", code: "ALG", flagUrl: "https://flagcdn.com/w160/dz.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "03/07/2026",
    time: "10:00",
    venue: "Sân vận động BC Place, Vancouver"
  },
  {
    id: "r32_14",
    homeTeam: { name: "Colombia", code: "COL", flagUrl: "https://flagcdn.com/w160/co.png" },
    awayTeam: { name: "Ghana", code: "GHA", flagUrl: "https://flagcdn.com/w160/gh.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "04/07/2026",
    time: "08:30",
    venue: "Sân vận động Arrowhead, Kansas City"
  },
  {
    id: "r32_15",
    homeTeam: { name: "Úc", code: "AUS", flagUrl: "https://flagcdn.com/w160/au.png" },
    awayTeam: { name: "Ai Cập", code: "EGY", flagUrl: "https://flagcdn.com/w160/eg.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "04/07/2026",
    time: "01:00",
    venue: "Sân vận động AT&T, Dallas"
  },
  {
    id: "r32_16",
    homeTeam: { name: "Argentina", code: "ARG", flagUrl: "https://flagcdn.com/w160/ar.png", label: "ĐƯƠNG KIM VÔ ĐỊCH" },
    awayTeam: { name: "Cabo Verde", code: "CPV", flagUrl: "https://flagcdn.com/w160/cv.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "04/07/2026",
    time: "05:00",
    venue: "Sân vận động Hard Rock, Miami"
  },

  // --- VÒNG 16 ĐỘI (ROUND OF 16) ---
  {
    id: "r16_1",
    homeTeam: { name: "Canada", code: "CAN", flagUrl: "https://flagcdn.com/w160/ca.png" },
    awayTeam: { name: "Maroc", code: "MAR", flagUrl: "https://flagcdn.com/w160/ma.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Chủ Nhật, 05/07/2026",
    time: "00:00",
    venue: "Sân vận động MetLife, New York"
  },
  {
    id: "r16_2",
    homeTeam: { name: "Pháp", code: "FRA", flagUrl: "https://flagcdn.com/w160/fr.png" },
    awayTeam: { name: "Paraguay", code: "PAR", flagUrl: "https://flagcdn.com/w160/py.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Chủ Nhật, 05/07/2026",
    time: "04:00",
    venue: "Sân vận động SoFi, Los Angeles"
  },
  {
    id: "r16_3",
    homeTeam: { name: "Bỉ", code: "BEL", flagUrl: "https://flagcdn.com/w160/be.png" },
    awayTeam: { name: "Hoa Kỳ", code: "USA", flagUrl: "https://flagcdn.com/w160/us.png", label: "ĐỒNG CHỦ NHÀ" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Hai, 06/07/2026",
    time: "03:00",
    venue: "Sân vận động Lumen Field, Seattle"
  },
  {
    id: "r16_4",
    homeTeam: { name: "Tây Ban Nha / Áo", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Bồ Đào Nha / Croatia", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Hai, 06/07/2026",
    time: "07:00",
    venue: "Sân vận động Hard Rock, Miami"
  },
  {
    id: "r16_5",
    homeTeam: { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/w160/br.png" },
    awayTeam: { name: "Na Uy", code: "NOR", flagUrl: "https://flagcdn.com/w160/no.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Ba, 07/07/2026",
    time: "02:00",
    venue: "Sân vận động NRG, Houston"
  },
  {
    id: "r16_6",
    homeTeam: { name: "Mexico", code: "MEX", flagUrl: "https://flagcdn.com/w160/mx.png", label: "ĐỒNG CHỦ NHÀ" },
    awayTeam: { name: "Anh", code: "ENG", flagUrl: "https://flagcdn.com/w160/gb-eng.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Ba, 07/07/2026",
    time: "06:00",
    venue: "Sân vận động Azteca, Mexico City"
  },
  {
    id: "r16_7",
    homeTeam: { name: "Thụy Sĩ / Algérie", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Colombia / Ghana", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Tư, 08/07/2026",
    time: "03:00",
    venue: "Sân vận động BC Place, Vancouver"
  },
  {
    id: "r16_8",
    homeTeam: { name: "Úc / Ai Cập", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Argentina / Cabo Verde", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Tư, 08/07/2026",
    time: "07:00",
    venue: "Sân vận động SoFi, Los Angeles"
  },

  // --- TỨ KẾT (QUARTER-FINALS) ---
  {
    id: "qf_1",
    homeTeam: { name: "Winner R16-1", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner R16-2", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Tứ Kết",
    date: "Thứ Sáu, 10/07/2026",
    time: "07:00",
    venue: "Sân vận động Gillette, Boston"
  },
  {
    id: "qf_2",
    homeTeam: { name: "Winner R16-3", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner R16-4", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Tứ Kết",
    date: "Thứ Bảy, 11/07/2026",
    time: "07:00",
    venue: "Sân vận động Arrowhead, Kansas City"
  },
  {
    id: "qf_3",
    homeTeam: { name: "Winner R16-5", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner R16-6", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Tứ Kết",
    date: "Chủ Nhật, 12/07/2026",
    time: "07:00",
    venue: "Sân vận động Hard Rock, Miami"
  },
  {
    id: "qf_4",
    homeTeam: { name: "Winner R16-7", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner R16-8", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Tứ Kết",
    date: "Thứ Hai, 13/07/2026",
    time: "07:00",
    venue: "Sân vận động MetLife, New York"
  },

  // --- BÁN KẾT (SEMI-FINALS) ---
  {
    id: "sf_1",
    homeTeam: { name: "Winner QF1", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner QF2", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Bán Kết",
    date: "Thứ Tư, 15/07/2026",
    time: "07:00",
    venue: "Sân vận động Mercedes-Benz, Atlanta"
  },
  {
    id: "sf_2",
    homeTeam: { name: "Winner QF3", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner QF4", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Bán Kết",
    date: "Thứ Năm, 16/07/2026",
    time: "07:00",
    venue: "Sân vận động SoFi, Los Angeles"
  },

  // --- CHUNG KẾT (FINAL) ---
  {
    id: "final",
    homeTeam: { name: "Winner SF1", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Winner SF2", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Chung Kết",
    date: "Chủ Nhật, 19/07/2026",
    time: "07:00",
    venue: "Sân vận động Azteca, Mexico City"
  }
];