/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchStatus, StandingGroup, StandingTeam } from "../types.js";

interface TeamAccum {
  name: string;
  code: string;
  flagUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

function teamKey(team: { name: string; code: string; flagUrl: string }): string {
  return team.code;
}

function sortTeams(a: TeamAccum, b: TeamAccum): number {
  const ptsA = a.won * 3 + a.drawn;
  const ptsB = b.won * 3 + b.drawn;
  if (ptsB !== ptsA) return ptsB - ptsA;
  const gdA = a.goalsFor - a.goalsAgainst;
  const gdB = b.goalsFor - b.goalsAgainst;
  if (gdB !== gdA) return gdB - gdA;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.name.localeCompare(b.name, "vi");
}

function toStandingTeam(t: TeamAccum): StandingTeam {
  return {
    name: t.name,
    code: t.code.toUpperCase(),
    flagUrl: t.flagUrl,
    played: t.played,
    won: t.won,
    drawn: t.drawn,
    lost: t.lost,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    goalsDifference: t.goalsFor - t.goalsAgainst,
    points: t.won * 3 + t.drawn,
  };
}

export function computeStandingsFromMatches(matches: Match[]): StandingGroup[] {
  const byGroup = new Map<string, Map<string, TeamAccum>>();

  for (const match of matches) {
    if (match.round !== "Vòng Bảng" || !match.group) continue;
    if (match.status !== MatchStatus.FINISHED) continue;
    if (match.homeScore === undefined || match.awayScore === undefined) continue;

    if (!byGroup.has(match.group)) byGroup.set(match.group, new Map());
    const table = byGroup.get(match.group)!;

    for (const side of ["home", "away"] as const) {
      const team = side === "home" ? match.homeTeam : match.awayTeam;
      const key = teamKey(team);
      if (!table.has(key)) {
        table.set(key, {
          name: team.name,
          code: team.code,
          flagUrl: team.flagUrl,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        });
      }
    }

    const home = table.get(teamKey(match.homeTeam))!;
    const away = table.get(teamKey(match.awayTeam))!;
    const hs = match.homeScore;
    const as = match.awayScore;

    home.played++;
    away.played++;
    home.goalsFor += hs;
    home.goalsAgainst += as;
    away.goalsFor += as;
    away.goalsAgainst += hs;

    if (hs > as) {
      home.won++;
      away.lost++;
    } else if (hs < as) {
      away.won++;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
    }
  }

  return [...byGroup.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "vi"))
    .map(([groupName, table]) => ({
      groupName,
      teams: [...table.values()].sort(sortTeams).map(toStandingTeam),
    }));
}
