import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { RechargeController } from "../../controllers/recharge.controller.js";
import { rechargeRequestSchema } from "../../validators/recharge.validator.js";

const rechargeController = new RechargeController();
const rechargeRouter = new Hono();

rechargeRouter.post(
  "/",
  zValidator("json", rechargeRequestSchema),
  (c) => rechargeController.createRecharge(c),
);

export { rechargeRouter };
