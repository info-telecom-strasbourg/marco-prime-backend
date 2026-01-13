import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { healthRouter } from "./health.js";
import { membersRouter } from "./members.js";
import { ordersRouter } from "./orders.js";
import { productsRouter } from "./products.js";
import { purchaseRouter } from "./purchase.js";
import { rechargeRouter } from "./recharge.js";

const v1Router = new Hono();

v1Router.use("*", authMiddleware);

v1Router.route("/health", healthRouter);
v1Router.route("/products", productsRouter);
v1Router.route("/member", membersRouter);
v1Router.route("/orders", ordersRouter);
v1Router.route("/purchase", purchaseRouter);
v1Router.route("/recharge", rechargeRouter);

export default v1Router;
