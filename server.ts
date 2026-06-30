/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local dev server only — production on Vercel is a static SPA (no API).
 */

import express from "express";
import { loadTournamentState } from "./src/data/tournamentData.js";

const app = express();
const PORT = 3000;

async function startServer() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    const { matches } = loadTournamentState();
    console.log(`World Cup Live (dev) — ${matches.length} trận — http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default app;
