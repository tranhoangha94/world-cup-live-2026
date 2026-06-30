/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match } from "../types.js";

export interface OfficialGroupsFile {
  name: string;
  groups: Array<{ name: string; teams: string[] }>;
}

const ENGLISH_TO_FIFA: Record<string, string> = {
  Mexico: "MEX",
  "South Africa": "RSA",
  "South Korea": "KOR",
  "Czech Republic": "CZE",
  Canada: "CAN",
  "Bosnia & Herzegovina": "BIH",
  Qatar: "QAT",
  Switzerland: "SUI",
  Brazil: "BRA",
  Morocco: "MAR",
  Haiti: "HAI",
  Scotland: "SCO",
  USA: "USA",
  Paraguay: "PAR",
  Australia: "AUS",
  Turkey: "TUR",
  Germany: "GER",
  Curaçao: "CUW",
  "Ivory Coast": "CIV",
  Ecuador: "ECU",
  Netherlands: "NED",
  Japan: "JPN",
  Sweden: "SWE",
  Tunisia: "TUN",
  Belgium: "BEL",
  Egypt: "EGY",
  Iran: "IRN",
  "New Zealand": "NZL",
  Spain: "ESP",
  "Cape Verde": "CPV",
  "Saudi Arabia": "KSA",
  Uruguay: "URU",
  France: "FRA",
  Senegal: "SEN",
  Iraq: "IRQ",
  Norway: "NOR",
  Argentina: "ARG",
  Algeria: "ALG",
  Austria: "AUT",
  Jordan: "JOR",
  Portugal: "POR",
  "DR Congo": "COD",
  Uzbekistan: "UZB",
  Colombia: "COL",
  England: "ENG",
  Croatia: "CRO",
  Ghana: "GHA",
  Panama: "PAN",
};

function groupViName(group: string): string {
  return `Bảng ${group.replace(/^Group\s+/i, "")}`;
}

/** Ensure every group table matches the official FIFA draw (openfootball groups.json). */
export function validateMatchesAgainstOfficialGroups(
  matches: Match[],
  official: OfficialGroupsFile
): void {
  for (const group of official.groups) {
    const label = groupViName(group.name);
    const groupMatches = matches.filter((m) => m.round === "Vòng Bảng" && m.group === label);
    const codesInMatches = new Set<string>();
    for (const m of groupMatches) {
      codesInMatches.add(m.homeTeam.code);
      codesInMatches.add(m.awayTeam.code);
    }

    const expected = new Set(group.teams.map((t) => ENGLISH_TO_FIFA[t] ?? t));
    const missing = [...expected].filter((c) => !codesInMatches.has(c));
    const extra = [...codesInMatches].filter((c) => !expected.has(c));

    if (missing.length || extra.length) {
      throw new Error(
        `${label} sai đội so với bốc thăm chính thức. Thiếu: ${missing.join(", ") || "—"}. Thừa: ${extra.join(", ") || "—"}.`
      );
    }
  }
}

/** Quick sanity check used to reject stale browser/server caches. */
export function isGroupDrawCacheValid(matches: Match[]): boolean {
  try {
    const groupC = matches.filter((m) => m.group === "Bảng C" && m.round === "Vòng Bảng");
    if (groupC.length !== 6) return false;
    const codes = new Set(groupC.flatMap((m) => [m.homeTeam.code, m.awayTeam.code]));
    return codes.has("BRA") && codes.has("MAR") && codes.has("SCO") && codes.has("HAI") && !codes.has("JPN") && !codes.has("GER");
  } catch {
    return false;
  }
}
