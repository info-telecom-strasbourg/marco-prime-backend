import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { customLogger } from "./config/logger.js";
import { openApiSpec } from "./config/openapi.js";
import { router } from "./config/router.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { limiter } from "./middlewares/rate-limiter.middleware.js";

export const app = new Hono()
  .onError(errorHandler)
  .use("*", logger(customLogger))
  .use("*", limiter)
  .get("/", (c) => c.redirect("/ui"))
  .get("/health", (c) =>
    c.json({
      status: "ok",
    }),
  )
  .get("/doc", (c) => c.json(openApiSpec))
  .get("/ui", swaggerUI({ url: "/doc" }))
  .use("*", authMiddleware)
  .route("/api/v1", router);

if (process.env.NODE_ENV !== "test") {
  serve(
    {
      fetch: app.fetch,
      port: Number.parseInt(process.env.API_PORT || "3000"),
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
}
