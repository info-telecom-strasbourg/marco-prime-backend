import {
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
} from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import { errorHandlerMiddleware } from "@/middlewares/error-handler.middleware.ts";
import { notFoundMiddleware } from "@/middlewares/not-found.middleware.ts";
import { pinoMiddleware } from "@/middlewares/pino.middleware.ts";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};
export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export function createApp() {
  const app = createRouter();

  app.use(pinoMiddleware());
  app.notFound(notFoundMiddleware);
  app.onError(errorHandlerMiddleware);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R): R {
  const app = createApp();
  app.route("/", router);
  return app as R;
}
