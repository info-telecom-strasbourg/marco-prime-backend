import type { Context } from "hono";
import type { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members } from "../db/schema.js";
import { NotFoundError } from "../errors/index.js";
import { cardNumberParamSchema } from "../validators/members.validator.js";

type MemberParamRequest = z.infer<typeof cardNumberParamSchema>;

export class MemberController {
  async getMemberByCardNumber(c: Context) {
    const { card_number } = this.getValidatedParams<MemberParamRequest>(c);

    const member = await this.findMemberByCardNumber(card_number);

    return c.json(member);
  }

  private getValidatedParams<T>(c: Context): T {
    return c.req.valid("param" as never) as T;
  }

  private async findMemberByCardNumber(cardNumber: number) {
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
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    if (!member) {
      throw new NotFoundError("Member", cardNumber);
    }

    return member;
  }
}
