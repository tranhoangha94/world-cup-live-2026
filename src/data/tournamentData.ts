/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, NewsArticle, Venue } from "../types.js";
import { groupStageMatches } from "./groupStage.js";
import { knockoutMatches } from "./knockoutStage.js";
import { applyScheduledMatchUpdates } from "./matchScheduler.js";
import { computeStandingsFromMatches } from "./standingsFromMatches.js";
import { computeTopScorersFromMatches } from "./topScorersFromMatches.js";

export const baseTournamentMatches: Match[] = [...groupStageMatches, ...knockoutMatches];

export const tournamentNews: NewsArticle[] = [
  {
    id: "n1",
    title: "Vòng 32 World Cup 2026: Maroc hạ gục Hà Lan trên chấm luân lưu cân não",
    summary:
      "Trận đấu kịch tính kéo dài 120 phút kết thúc với tỷ số 1-1, trước khi thủ thành Yassine Bounou tỏa sáng cản phá xuất sắc hai quả penalty, đưa Maroc thẳng tiến vào vòng sau.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCztUipXcYN2m4_by2gWMRU_9Q21BAEiCJUJh3_VQKCaXe3RR-Tb_N-LhjoLI4PlfK6tx1KmKhVs_9pqfKA6Vl46FsN5VM4MQy-m4VHu7siVAtoYOem8c2oln6FWNwpucBMGecq_fUGiX-EfYsuZhUf63HO8IAVO_0-hg117oLV_aYPs25BcdvWcYKheiA1vLytK6Bpz9_54R_OrtFWWeE8MzZWaySqJ5-ATDScDpmvenzXdITLz9gMaqk3-PjglG3MOwIvZvy5Ei4",
    date: "30 Tháng 6, 2026",
    source: "FIFA News",
    url: "#",
  },
  {
    id: "n2",
    title: "Jonathan David ghi bàn duy nhất giúp Canada tiễn Nam Phi về nước",
    summary:
      "Canada thi đấu lấn lướt và có được bàn thắng quý hơn vàng nhờ pha đệm bóng cận thành của David, khẳng định sức mạnh của nước chủ nhà.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtYf3lF6MJzXsz44ZVAZSpa2OlqMOdvHgBLolHQrQi15CAuGndbOelrX827zNOM2V7zOS_UibWzcusQt-m_yLP6BP2yVZ4mGM_yNNR6kFJD8xSwLnkFY1u7HwpJBE2AVcD3vZ5BS9osqjAWDHnWno-2y_SMYce4AeXvS2uyenAQ668m8Tt461-t01SJBI7cmvLwnPYfIEZ9lT5F97DSGy9IWGMg-3s4dI9XOkR9i962igM0uWVP_pKo6E7_18TtGAASw4d7TDJbZ8",
    date: "29 Tháng 6, 2026",
    source: "Sports Express",
    url: "#",
  },
];

export const tournamentVenues: Venue[] = [
  {
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCztUipXcYN2m4_by2gWMRU_9Q21BAEiCJUJh3_VQKCaXe3RR-Tb_N-LhjoLI4PlfK6tx1KmKhVs_9pqfKA6Vl46FsN5VM4MQy-m4VHu7siVAtoYOem8c2oln6FWNwpucBMGecq_fUGiX-EfYsuZhUf63HO8IAVO_0-hg117oLV_aYPs25BcdvWcYKheiA1vLytK6Bpz9_54R_OrtFWWeE8MzZWaySqJ5-ATDScDpmvenzXdITLz9gMaqk3-PjglG3MOwIvZvy5Ei4",
    capacity: "87,523 khán giả",
    description:
      "Sân vận động lịch sử, nơi từng tổ chức hai trận chung kết World Cup huyền thoại năm 1970 và 1986.",
  },
  {
    name: "Sân vận động SoFi",
    city: "Los Angeles",
    country: "Mỹ",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAq3YbnfLTEoesmqhYRCH98faDTttqS4zTEWsLpfGnVvfM963N-pvwDqrL7B9IK02QFR0qFe8lcJTJwqopUn0PjeS77GcSzvii8sk8vH-k_czI4nTs56T8hd6K7iueEB8X--h6_ufQueLCizPTXbQqRZm-AHf5KhFAWI8_OSJvJMof0C6ympW00dX9d3HZOiahEufSpr9UTTXNLcqFjMpCytZgmutsn03Nq7pL53VsQMpokZLOUoH_O0HT8IPEvV7Bc-okLytvumk",
    capacity: "70,240 khán giả",
    description:
      "Kỳ quan kiến trúc hiện đại bậc nhất thế giới, địa điểm tổ chức các trận đấu bảng đỉnh cao của đội tuyển Mỹ.",
  },
  {
    name: "Sân vận động Mercedes-Benz",
    city: "Atlanta",
    country: "Mỹ",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgc4fMfNHVU9Vn4wwvm1I5PygoN9EgVtu4jWMROTh1Ww9e-j_Bdgp7fjTD_gNQu1cCqnfN3nDUoqAKtrDLhRmRQ23VKl-cbT7NKPqPwZV6hHPYREY8FYZ1KcBqnaVa4c0mRDKxljqmymgLu1qNd3C7XTUkXYdupbKDsKu6gQC72z8R1wal92govmwqKwW_IWyvNkpHRFfPLTAdtm4jRB4Cg3Sg1vOXLVKr_arz32DT8QkVLLJMGlTNp1eEjsDIdb2p_xLcZbBb26M",
    capacity: "71,000 khán giả",
    description: "Sở hữu mái che di động độc đáo và màn hình hào quang khổng lồ 360 độ hiện đại.",
  },
];

import { applyBroadcastToMatches } from "./matchBroadcast.js";
import { applyHighlightsToMatches } from "./matchHighlights.js";
import { applyPenaltyShootoutsToMatches } from "./penaltyShootouts.js";

export function loadTournamentState() {
  const { matches } = applyScheduledMatchUpdates(baseTournamentMatches);
  const withBroadcast = applyBroadcastToMatches(matches);
  const withHighlights = applyHighlightsToMatches(withBroadcast);
  const withPenalties = applyPenaltyShootoutsToMatches(withHighlights);
  return {
    matches: withPenalties,
    standings: computeStandingsFromMatches(withPenalties),
    topScorers: computeTopScorersFromMatches(withPenalties),
    news: tournamentNews,
    venues: tournamentVenues,
    stats: {
      avgGoals: 2.8,
      yellowCards: 14,
      avgAttendance: 64200,
    },
  };
}
