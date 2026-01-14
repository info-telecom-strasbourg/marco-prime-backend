import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { router } from "./config/router.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = new Hono();

app.onError(errorHandler);

app.route("/api/v1", router);

serve(
  {
    fetch: app.fetch,
    port: Number.parseInt(process.env.API_PORT || "3000"),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
