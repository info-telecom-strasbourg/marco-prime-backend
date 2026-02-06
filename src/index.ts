import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { env } from "./lib/config/env.config.ts";

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    // biome-ignore lint/suspicious/noConsole: Log to console when server starts
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
