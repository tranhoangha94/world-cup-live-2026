/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Diễn biến loạt luân lưu — nguồn: báo cáo FIFA / đài truyền hình chính thức.
 */

import { Match, MatchStatus, PenaltyShootout } from "../types.js";

const PENALTY_SHOOTOUT_BY_MATCH_ID: Record<string, PenaltyShootout> = {
  r32_2: {
    homeGoalkeeper: "Bart Verbruggen",
    awayGoalkeeper: "Yassine Bounou",
    kicks: [
      { team: "home", player: "Teun Koopmeiners", outcome: "scored" },
      { team: "away", player: "Neil El Aynaoui", outcome: "missed", detail: "Đánh xà ngang" },
      { team: "home", player: "Justin Kluivert", outcome: "missed", detail: "Đánh cột dọc" },
      { team: "away", player: "Soufiane Rahimi", outcome: "scored" },
      { team: "home", player: "Wout Weghorst", outcome: "scored" },
      { team: "away", player: "Chemsdine Talbi", outcome: "scored" },
      { team: "home", player: "Quinten Timber", outcome: "missed", detail: "Sút trượt" },
      { team: "away", player: "Achraf Hakimi", outcome: "missed", detail: "Đánh cột dọc" },
      { team: "home", player: "Crysencio Summerville", outcome: "saved", savedBy: "Yassine Bounou" },
      {
        team: "away",
        player: "Ismael Saibari",
        outcome: "scored",
        isDecisive: true,
      },
    ],
  },
  r32_3: {
    homeGoalkeeper: "Manuel Neuer",
    awayGoalkeeper: "Orlando Gill",
    kicks: [
      { team: "home", player: "Kai Havertz", outcome: "saved", savedBy: "Orlando Gill" },
      { team: "away", player: "Mauricio", outcome: "scored" },
      { team: "home", player: "Joshua Kimmich", outcome: "scored" },
      { team: "away", player: "Gustavo Gómez", outcome: "scored" },
      { team: "home", player: "Jamal Musiala", outcome: "scored" },
      { team: "away", player: "Matías Galarza", outcome: "scored" },
      { team: "home", player: "Nick Woltemade", outcome: "saved", savedBy: "Orlando Gill" },
      { team: "away", player: "Antonio Sanabria", outcome: "missed", detail: "Sút trượt" },
      { team: "home", player: "Nadiem Amiri", outcome: "scored" },
      { team: "away", player: "Fabián Balbuena", outcome: "saved", savedBy: "Manuel Neuer" },
      { team: "home", player: "Jonathan Tah", outcome: "missed", detail: "Đá vọt xà ngang" },
      {
        team: "away",
        player: "José Canale",
        outcome: "scored",
        isDecisive: true,
      },
    ],
  },
  r32_15: {
    homeGoalkeeper: "Mathew Ryan",
    awayGoalkeeper: "Mostafa Shoubir",
    kicks: [
      { team: "home", player: "Harry Souttar", outcome: "missed", detail: "Sút vọt xà ngang" },
      { team: "away", player: "Mahmoud Saber", outcome: "scored" },
      { team: "home", player: "Jackson Irvine", outcome: "scored" },
      { team: "away", player: "Ramy Rabia", outcome: "scored" },
      { team: "home", player: "Awer Mabil", outcome: "scored" },
      { team: "away", player: "Mohamed Salah", outcome: "scored", detail: "Panenka giữa khung thành" },
      { team: "home", player: "Lucas Herrington", outcome: "missed", detail: "Đánh xà ngang" },
      {
        team: "away",
        player: "Hossam Abdelmaguid",
        outcome: "scored",
        isDecisive: true,
      },
    ],
  },
};

export function getPenaltyShootout(match: Pick<Match, "id" | "status" | "homePens" | "awayPens">): PenaltyShootout | null {
  if (match.status !== MatchStatus.FINISHED) return null;
  if (match.homePens === undefined || match.awayPens === undefined) return null;
  return PENALTY_SHOOTOUT_BY_MATCH_ID[match.id] ?? null;
}

export function withPenaltyShootoutDetail(match: Match): Match {
  const shootout = getPenaltyShootout(match);
  if (!shootout) {
    const { penaltyShootout: _removed, ...rest } = match;
    return rest as Match;
  }
  return { ...match, penaltyShootout: shootout };
}

export function applyPenaltyShootoutsToMatches(matches: Match[]): Match[] {
  return matches.map(withPenaltyShootoutDetail);
}
