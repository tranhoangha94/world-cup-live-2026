/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * All 72 group-stage matches imported from openfootball/worldcup.json (2026).
 */

import { Match } from "../types.js";
import { computeStandingsFromMatches } from "./standingsFromMatches.js";
import { buildGroupStageFromOpenfootball } from "./openfootballImport.js";
import openfootballData from "./worldcup2026-openfootball.json";
import teamsData from "./worldcup2026-teams.json";

export const groupStageMatches: Match[] = buildGroupStageFromOpenfootball(
  openfootballData as { name: string; matches: import("./openfootballImport.js").OpenfootballMatch[] },
  teamsData as import("./openfootballImport.js").OpenfootballTeamMeta[]
);

export const groupStageStandings = computeStandingsFromMatches(groupStageMatches);
