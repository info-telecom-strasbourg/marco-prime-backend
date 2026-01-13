import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OrderController } from "../../controllers/order.controller.js";
import { paginationQuerySchema } from "../../validators/orders.validator.js";

const orderController = new OrderController();
const orderRouter = new Hono();

orderRouter.get(
  "/history",
  zValidator("query", paginationQuerySchema),
  (c) => orderController.getOrdersHistory(c),
);

export { orderRouter };
