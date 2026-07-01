/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match } from "../types.js";

export function hasPenaltyShootout(match: Pick<Match, "homePens" | "awayPens">): boolean {
  return match.homePens !== undefined && match.awayPens !== undefined;
}

export function penaltyShootoutSummary(homePens: number, awayPens: number): string {
  return `Luân lưu ${homePens}–${awayPens}`;
}
