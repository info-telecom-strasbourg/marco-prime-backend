import { createApp } from "./core/config/app.config.ts";
import { setupOpenAPI } from "./core/config/open-api.config.ts";

const app = createApp();
setupOpenAPI(app);

const routes = [] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export { app };
