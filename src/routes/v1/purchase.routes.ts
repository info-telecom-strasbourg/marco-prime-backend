import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { PurchaseController } from "../../controllers/purchase.controller.js";
import { purchaseRequestSchema } from "../../validators/purchase.validator.js";

const purchaseController = new PurchaseController();
const purchaseRouter = new Hono();

purchaseRouter.post(
  "/",
  zValidator("json", purchaseRequestSchema),
  (c) => purchaseController.createPurchase(c),
);

export { purchaseRouter };
