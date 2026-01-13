import { Hono } from "hono";

const healthRouter = new Hono();

healthRouter.get("/", (c) => {
  return c.json({
    status: "ok",
  });
});

export { healthRouter };
