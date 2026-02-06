import { productHandlers } from "./handlers/products.handler.ts";
import { createApp, createRouter } from "./lib/config/app.config.ts";
import { setupOpenAPI } from "./lib/config/open-api.config.ts";
import { productRoutes } from "./routes/products.route.ts";

const app = createApp();
setupOpenAPI(app);

const routes = [
  createRouter().openapi(productRoutes.list, productHandlers.list),
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export { app };
