/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventType, Match, TopScorer } from "../types.js";

/** Top scorers derived from real goal events in finished matches (excludes own goals). */
export function computeTopScorersFromMatches(matches: Match[], limit = 10): TopScorer[] {
  const tallies = new Map<
    string,
    { name: string; team: string; teamCode: string; teamFlagUrl: string; goals: number }
  >();

  for (const match of matches) {
    if (!match.events?.length) continue;
    for (const event of match.events) {
      if (event.type !== EventType.GOAL) continue;
      if (event.detail === "Phản lưới nhà") continue;

      const side = event.team === "home" ? match.homeTeam : match.awayTeam;
      const key = `${side.code}:${event.player}`;
      const row = tallies.get(key) ?? {
        name: event.player,
        team: side.name,
        teamCode: side.code,
        teamFlagUrl: side.flagUrl,
        goals: 0,
      };
      row.goals++;
      tallies.set(key, row);
    }
  }

  return [...tallies.values()]
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, "vi"))
    .slice(0, limit)
    .map((row, index) => ({
      rank: index + 1,
      name: row.name,
      team: row.team,
      teamCode: row.teamCode,
      teamFlagUrl: row.teamFlagUrl,
      goals: row.goals,
    }));
}
