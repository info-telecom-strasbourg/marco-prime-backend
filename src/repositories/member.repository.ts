import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members } from "../db/schema.js";

export class MemberRepository {
  async findByCardNumber(cardNumber: number) {
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

    return member;
  }

  async findFullByCardNumber(cardNumber: number) {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    return member;
  }

  async findById(id: number) {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    return member;
  }

  async updateBalance(memberId: number, newBalance: string) {
    await db
      .update(members)
      .set({ balance: newBalance })
      .where(eq(members.id, memberId));
  }

  async updateBalanceInTransaction(
    memberId: number,
    newBalance: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, memberId));
    });
  }
}
