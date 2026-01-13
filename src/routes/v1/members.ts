import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../db/index.js";
import { members } from "../../db/schema.js";
import {
  cardNumberParamSchema,
  memberSchema,
} from "../../validators/members.validator.js";

const router = new Hono();

const membersResponseSchema = memberSchema.pick({
  id: true,
  lastName: true,
  firstName: true,
  cardNumber: true,
  balance: true,
  admin: true,
});

router.get(
  "/:card_number",
  zValidator("param", cardNumberParamSchema),
  async (c) => {
    const { card_number } = c.req.valid("param");

    const member = await db
      .select({
        id: members.id,
        lastName: members.lastName,
        firstName: members.firstName,
        cardNumber: members.cardNumber,
        balance: members.balance,
        admin: members.admin,
      })
      .from(members)
      .where(eq(members.cardNumber, card_number))
      .limit(1);

    if (member.length === 0) {
      return c.json({ error: "Member not found" }, 404);
    }

    const validatedMember = membersResponseSchema.parse(member[0]);

    return c.json(validatedMember);
  },
);

export default router;
