import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { MemberController } from "../../controllers/member.controller.js";
import { cardNumberParamSchema } from "../../validators/members.validator.js";

const memberController = new MemberController();
const memberRouter = new Hono();

memberRouter.get(
  "/:card_number",
  zValidator("param", cardNumberParamSchema),
  (c) => memberController.getMemberByCardNumber(c),
);

export { memberRouter };
