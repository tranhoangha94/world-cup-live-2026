/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * All 72 group-stage matches imported from openfootball/worldcup.json (2026).
 * Group composition validated against worldcup.groups.json — no fabricated draw.
 */

import { Match } from "../types.js";
import { computeStandingsFromMatches } from "./standingsFromMatches.js";
import { buildGroupStageFromOpenfootball } from "./openfootballImport.js";
import { validateMatchesAgainstOfficialGroups } from "./validateGroupData.js";
import openfootballData from "./worldcup2026-openfootball.json";
import teamsData from "./worldcup2026-teams.json";
import groupsData from "./worldcup2026-groups.json";

export const groupStageMatches: Match[] = buildGroupStageFromOpenfootball(
  openfootballData as { name: string; matches: import("./openfootballImport.js").OpenfootballMatch[] },
  teamsData as import("./openfootballImport.js").OpenfootballTeamMeta[]
);

validateMatchesAgainstOfficialGroups(groupStageMatches, groupsData as import("./validateGroupData.js").OfficialGroupsFile);

export const groupStageStandings = computeStandingsFromMatches(groupStageMatches);
