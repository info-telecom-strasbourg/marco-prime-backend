import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { healthRouter } from "./health.routes.js";
import { memberRouter } from "./member.routes.js";
import { orderRouter } from "./order.routes.js";
import { productRouter } from "./product.routes.js";
import { purchaseRouter } from "./purchase.routes.js";
import { rechargeRouter } from "./recharge.routes.js";

const v1Router = new Hono();

v1Router.use("*", authMiddleware);

v1Router.route("/health", healthRouter);
v1Router.route("/products", productRouter);
v1Router.route("/member", memberRouter);
v1Router.route("/orders", orderRouter);
v1Router.route("/purchase", purchaseRouter);
v1Router.route("/recharge", rechargeRouter);

export default v1Router;
