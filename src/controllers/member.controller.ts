import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members } from "../db/schema.js";
import { NotFoundError } from "../errors/index.js";

export class MemberController {
  async getMemberByCardNumber(c: Context) {
    const params = c.req.valid("param" as never);
    const { card_number } = params as { card_number: number };

    const [member] = await db
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

    if (!member) {
      throw new NotFoundError("Member", card_number);
    }

    return c.json(member);
  }
}
