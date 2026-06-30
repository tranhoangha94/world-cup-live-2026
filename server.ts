/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Match, MatchStatus, EventType, StandingGroup, TopScorer, Venue, NewsArticle } from "./src/types.js";
import { groupStageMatches, groupStageStandings } from "./src/data/groupStage.js";
import { applyScheduledMatchUpdates } from "./src/data/matchScheduler.js";
import { loadTournamentCache, saveTournamentCache, TOURNAMENT_DATA_VERSION } from "./src/data/tournamentCache.js";
import { computeStandingsFromMatches } from "./src/data/standingsFromMatches.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// ----------------------------------------------------
// Base High-Fidelity FIFA World Cup 2026 Data Cache
// ----------------------------------------------------
const knockoutMatches: Match[] = [
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
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "04:00",
    venue: "Sân vận động MetLife, New York"
  },
  {
    id: "r32_5",
    homeTeam: { name: "Bỉ", code: "BEL", flagUrl: "https://flagcdn.com/w160/be.png" },
    awayTeam: { name: "Sénégal", code: "SEN", flagUrl: "https://flagcdn.com/w160/sn.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "02/07/2026",
    time: "03:00",
    venue: "Sân vận động Lumen Field, Seattle"
  },
  {
    id: "r32_6",
    homeTeam: { name: "Hoa Kỳ", code: "USA", flagUrl: "https://flagcdn.com/w160/us.png", label: "ĐỒNG CHỦ NHÀ" },
    awayTeam: { name: "Bosnia và Herzegovina", code: "BIH", flagUrl: "https://flagcdn.com/w160/ba.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "02/07/2026",
    time: "07:00",
    venue: "Sân vận động Levi's, Santa Clara"
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
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "00:00",
    venue: "Sân vận động AT&T, Dallas"
  },
  {
    id: "r32_11",
    homeTeam: { name: "Mexico", code: "MEX", flagUrl: "https://flagcdn.com/w160/mx.png", label: "ĐỒNG CHỦ NHÀ" },
    awayTeam: { name: "Ecuador", code: "ECU", flagUrl: "https://flagcdn.com/w160/ec.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "08:00",
    venue: "Sân vận động Azteca, Mexico City"
  },
  {
    id: "r32_12",
    homeTeam: { name: "Anh", code: "ENG", flagUrl: "https://flagcdn.com/w160/gb-eng.png" },
    awayTeam: { name: "CHDC Congo", code: "COD", flagUrl: "https://flagcdn.com/w160/cd.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 32",
    date: "01/07/2026",
    time: "23:00",
    venue: "Sân vận động Mercedes-Benz, Atlanta"
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
    homeTeam: { name: "Paraguay", code: "PAR", flagUrl: "https://flagcdn.com/w160/py.png" },
    awayTeam: { name: "Pháp / Thụy Điển", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Chủ Nhật, 05/07/2026",
    time: "04:00",
    venue: "Sân vận động SoFi, Los Angeles"
  },
  {
    id: "r16_3",
    homeTeam: { name: "Bỉ / Sénégal", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Mỹ / Bosnia", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
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
    awayTeam: { name: "Bờ Biển Ngà / Na Uy", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    status: MatchStatus.UPCOMING,
    round: "Vòng 16",
    date: "Thứ Ba, 07/07/2026",
    time: "02:00",
    venue: "Sân vận động NRG, Houston"
  },
  {
    id: "r16_6",
    homeTeam: { name: "Mexico / Ecuador", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
    awayTeam: { name: "Anh / CHDC Congo", code: "TBD", flagUrl: "https://flagcdn.com/w160/un.png" },
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

let cacheMatches: Match[] = [...groupStageMatches, ...knockoutMatches];

let cacheStandings: StandingGroup[] = groupStageStandings;

let cacheScorers: TopScorer[] = [
  { rank: 1, name: "Jonathan David", team: "Canada", teamCode: "CAN", teamFlagUrl: "https://flagcdn.com/w160/ca.png", goals: 4 },
  { rank: 2, name: "Lionel Messi", team: "Argentina", teamCode: "ARG", teamFlagUrl: "https://flagcdn.com/w160/ar.png", goals: 4 },
  { rank: 3, name: "Kylian Mbappé", team: "Pháp", teamCode: "FRA", teamFlagUrl: "https://flagcdn.com/w160/fr.png", goals: 3 },
  { rank: 4, name: "Vinicius Jr", team: "Brasil", teamCode: "BRA", teamFlagUrl: "https://flagcdn.com/w160/br.png", goals: 3 },
  { rank: 5, name: "Jamal Musiala", team: "Đức", teamCode: "GER", teamFlagUrl: "https://flagcdn.com/w160/de.png", goals: 3 }
];

let cacheNews: NewsArticle[] = [
  {
    id: "n1",
    title: "Vòng 32 World Cup 2026: Maroc hạ gục Hà Lan trên chấm luân lưu cân não",
    summary: "Trận đấu kịch tính kéo dài 120 phút kết thúc với tỷ số 1-1, trước khi thủ thành Yassine Bounou tỏa sáng cản phá xuất sắc hai quả penalty, đưa Maroc thẳng tiến vào vòng sau.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCztUipXcYN2m4_by2gWMRU_9Q21BAEiCJUJh3_VQKCaXe3RR-Tb_N-LhjoLI4PlfK6tx1KmKhVs_9pqfKA6Vl46FsN5VM4MQy-m4VHu7siVAtoYOem8c2oln6FWNwpucBMGecq_fUGiX-EfYsuZhUf63HO8IAVO_0-hg117oLV_aYPs25BcdvWcYKheiA1vLytK6Bpz9_54R_OrtFWWeE8MzZWaySqJ5-ATDScDpmvenzXdITLz9gMaqk3-PjglG3MOwIvZvy5Ei4",
    date: "30 Tháng 6, 2026",
    source: "FIFA News",
    url: "#"
  },
  {
    id: "n2",
    title: "Jonathan David ghi bàn duy nhất giúp Canada tiễn Nam Phi về nước",
    summary: "Canada thi đấu lấn lướt và có được bàn thắng quý hơn vàng nhờ pha đệm bóng cận thành của David, khẳng định sức mạnh của nước chủ nhà.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtYf3lF6MJzXsz44ZVAZSpa2OlqMOdvHgBLolHQrQi15CAuGndbOelrX827zNOM2V7zOS_UibWzcusQt-m_yLP6BP2yVZ4mGM_yNNR6kFJD8xSwLnkFY1u7HwpJBE2AVcD3vZ5BS9osqjAWDHnWno-2y_SMYce4AeXvS2uyenAQ668m8Tt461-t01SJBI7cmvLwnPYfIEZ9lT5F97DSGy9IWGMg-3s4dI9XOkR9i962igM0uWVP_pKo6E7_18TtGAASw4d7TDJbZ8",
    date: "29 Tháng 6, 2026",
    source: "Sports Express",
    url: "#"
  }
];

const cacheVenues: Venue[] = [
  {
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCztUipXcYN2m4_by2gWMRU_9Q21BAEiCJUJh3_VQKCaXe3RR-Tb_N-LhjoLI4PlfK6tx1KmKhVs_9pqfKA6Vl46FsN5VM4MQy-m4VHu7siVAtoYOem8c2oln6FWNwpucBMGecq_fUGiX-EfYsuZhUf63HO8IAVO_0-hg117oLV_aYPs25BcdvWcYKheiA1vLytK6Bpz9_54R_OrtFWWeE8MzZWaySqJ5-ATDScDpmvenzXdITLz9gMaqk3-PjglG3MOwIvZvy5Ei4",
    capacity: "87,523 khán giả",
    description: "Sân vận động lịch sử, nơi từng tổ chức hai trận chung kết World Cup huyền thoại năm 1970 và 1986."
  },
  {
    name: "Sân vận động SoFi",
    city: "Los Angeles",
    country: "Mỹ",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAq3YbnfLTEoesmqhYRCH98faDTttqS4zTEWsLpfGnVvfM963N-pvwDqrL7B9IK02QFR0qFe8lcJTJwqopUn0PjeS77GcSzvii8sk8vH-k_czI4nTs56T8hd6K7iueEB8X--h6_ufQueLCizPTXbQqRZm-AHf5KhFAWI8_OSJvJMof0C6ympW00dX9d3HZOiahEufSpr9UTTXNLcqFjMpCytZgmutsn03Nq7pL53VsQMpokZLOUoH_O0HT8IPEvV7Bc-okLytvumk",
    capacity: "70,240 khán giả",
    description: "Kỳ quan kiến trúc hiện đại bậc nhất thế giới, địa điểm tổ chức các trận đấu bảng đỉnh cao của đội tuyển Mỹ."
  },
  {
    name: "Sân vận động Mercedes-Benz",
    city: "Atlanta",
    country: "Mỹ",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgc4fMfNHVU9Vn4wwvm1I5PygoN9EgVtu4jWMROTh1Ww9e-j_Bdgp7fjTD_gNQu1cCqnfN3nDUoqAKtrDLhRmRQ23VKl-cbT7NKPqPwZV6hHPYREY8FYZ1KcBqnaVa4c0mRDKxljqmymgLu1qNd3C7XTUkXYdupbKDsKu6gQC72z8R1wal92govmwqKwW_IWyvNkpHRFfPLTAdtm4jRB4Cg3Sg1vOXLVKr_arz32DT8QkVLLJMGlTNp1eEjsDIdb2p_xLcZbBb26M",
    capacity: "71,000 khán giả",
    description: "Sở hữu mái che di động độc đáo và màn hình hào quang khổng lồ 360 độ hiện đại."
  }
];

let lastCacheUpdatedAt: string | null = null;

function persistTournamentCache(): void {
  cacheStandings = computeStandingsFromMatches(cacheMatches);
  saveTournamentCache({
    dataVersion: TOURNAMENT_DATA_VERSION,
    matches: cacheMatches,
    standings: cacheStandings,
    news: cacheNews,
    scorers: cacheScorers,
    updatedAt: lastCacheUpdatedAt ?? new Date().toISOString(),
  });
}

function applyPersistedTournamentCache(): void {
  const persisted = loadTournamentCache();
  if (!persisted) return;
  if (persisted.dataVersion !== TOURNAMENT_DATA_VERSION) return;
  cacheMatches = persisted.matches;
  cacheStandings = persisted.standings;
  cacheNews = persisted.news;
  cacheScorers = persisted.scorers;
  lastCacheUpdatedAt = persisted.updatedAt;
}

function refreshScheduleAndPersist(): void {
  const { matches, changed } = applyScheduledMatchUpdates(cacheMatches);
  cacheStandings = computeStandingsFromMatches(matches);
  if (changed) {
    cacheMatches = matches;
    lastCacheUpdatedAt = new Date().toISOString();
    persistTournamentCache();
  }
}

applyPersistedTournamentCache();
refreshScheduleAndPersist();

// Re-check schedule every 5 minutes on long-running servers
if (!process.env.VERCEL) {
  setInterval(refreshScheduleAndPersist, 5 * 60 * 1000);
}

// ----------------------------------------------------
// API Route Implementation
// ----------------------------------------------------

// Get matches and schedule
app.get("/api/worldcup/matches", (req, res) => {
  refreshScheduleAndPersist();
  res.json({ matches: cacheMatches, lastUpdated: lastCacheUpdatedAt });
});

// Get standigs
app.get("/api/worldcup/standings", (req, res) => {
  res.json({ standings: cacheStandings });
});

// Get league statistics & top scorers
app.get("/api/worldcup/stats", (req, res) => {
  res.json({
    avgGoals: 2.8,
    yellowCards: 14,
    avgAttendance: 64200,
    topScorers: cacheScorers,
    lastUpdated: lastCacheUpdatedAt,
  });
});

// Get news articles
app.get("/api/worldcup/news", (req, res) => {
  res.json({ news: cacheNews });
});

// Get tournament venues
app.get("/api/worldcup/venues", (req, res) => {
  res.json({ venues: cacheVenues });
});

// ----------------------------------------------------
// Production / Dev Server Configuration with Vite
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`World Cup Live App running on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
