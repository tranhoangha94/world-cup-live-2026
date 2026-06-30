/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Helpers to cross-check and import data from openfootball/worldcup.json (2026).
 * Reference: https://github.com/openfootball/worldcup.json/tree/master/2026
 */

/** Convert openfootball local kickoff (e.g. "12:00 UTC-5") to ICT calendar date + time. */
export function openfootballLocalTimeToICT(
  date: string,
  timeLocal: string
): { calendar: string; time: string; utcDate: string; utcTime: string } {
  const m = timeLocal.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]?\d+)$/);
  if (!m) throw new Error(`Invalid openfootball time: ${timeLocal}`);

  const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
  const localH = parseInt(m[1], 10);
  const localMin = parseInt(m[2], 10);
  const offsetHours = parseInt(m[3], 10);

  const utcMs = Date.UTC(year, month - 1, day, localH - offsetHours, localMin, 0, 0);
  const utc = new Date(utcMs);
  const utcDate = `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
  const utcTime = `${String(utc.getUTCHours()).padStart(2, "0")}:${String(utc.getUTCMinutes()).padStart(2, "0")}`;

  const ictMs = utcMs + 7 * 60 * 60 * 1000;
  const ict = new Date(ictMs);
  const calendar = `${String(ict.getUTCDate()).padStart(2, "0")}/${String(ict.getUTCMonth() + 1).padStart(2, "0")}/${ict.getUTCFullYear()}`;
  const time = `${String(ict.getUTCHours()).padStart(2, "0")}:${String(ict.getUTCMinutes()).padStart(2, "0")}`;

  return { calendar, time, utcDate, utcTime };
}

/** English ground names from openfootball → Vietnamese venue labels used in the app. */
export const OPENFOOTBALL_GROUND_VI: Record<string, string> = {
  "Los Angeles (Inglewood)": "Sân vận động SoFi, Los Angeles",
  "Boston (Foxborough)": "Sân vận động Gillette, Boston",
  "Monterrey (Guadalupe)": "Sân vận động Akron, Guadalajara",
  Houston: "Sân vận động NRG, Houston",
  "New York/New Jersey (East Rutherford)": "Sân vận động MetLife, New York",
  "Dallas (Arlington)": "Sân vận động AT&T, Dallas",
  "Mexico City": "Sân vận động Azteca, Mexico City",
  Atlanta: "Sân vận động Mercedes-Benz, Atlanta",
  "San Francisco Bay Area (Santa Clara)": "Sân vận động Levi's, Santa Clara",
  Seattle: "Sân vận động Lumen Field, Seattle",
  Toronto: "Sân vận động BMO Field, Toronto",
  Vancouver: "Sân vận động BC Place, Vancouver",
  "Miami (Miami Gardens)": "Sân vận động Hard Rock, Miami",
  "Kansas City": "Sân vận động Arrowhead, Kansas City",
  Philadelphia: "Sân vận động Lincoln Financial, Philadelphia",
};

export function openfootballGroundToVenue(ground: string): string {
  return OPENFOOTBALL_GROUND_VI[ground] ?? ground;
}

export interface OpenfootballGoal {
  name: string;
  minute: string;
}

export interface OpenfootballMatch {
  round?: string;
  num?: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score?: {
    ft?: [number, number];
    ht?: [number, number];
    et?: [number, number];
    p?: [number, number];
  };
  goals1?: OpenfootballGoal[];
  goals2?: OpenfootballGoal[];
  group?: string;
  ground?: string;
}

export interface OpenfootballWorldCup {
  name: string;
  matches: OpenfootballMatch[];
}

/** Format calendar dd/mm/yyyy as a neutral Vietnamese date label for knockout fixtures. */
export function calendarToDateLabel(calendar: string): string {
  const [d, m, y] = calendar.split("/");
  return `${d}/${m}/${y}`;
}
