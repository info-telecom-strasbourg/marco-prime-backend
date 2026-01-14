import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { customLogger } from "./config/logger.js";
import { router } from "./config/router.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = new Hono();

app.onError(errorHandler);

router.use("*", authMiddleware);
router.use("*", logger(customLogger));

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
