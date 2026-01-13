import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { router } from "./routes.js";

const v1Router = new Hono();

v1Router.use("*", authMiddleware);

v1Router.get("/health", (c) =>
  c.json({
    status: "ok",
  }),
);

v1Router.route("/", router);

export default v1Router;
