import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { members } from "../db/schema.js";
import {
  AdminAuthorizationError,
  ForbiddenError,
  NotFoundError,
} from "../errors/index.js";
import type { RechargeReceiptDTO } from "../types/index.js";

export class RechargeService {
  async executeRecharge(
    cardNumber: number,
    amount: number,
    adminCardNumber?: number,
  ): Promise<RechargeReceiptDTO> {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.cardNumber, cardNumber))
      .limit(1);

    if (!member) {
      throw new NotFoundError("Member", cardNumber);
    }

    let adminMember = null;
    if (!member.admin) {
      if (!adminCardNumber) {
        throw new AdminAuthorizationError();
      }

      const [admin] = await db
        .select()
        .from(members)
        .where(eq(members.cardNumber, adminCardNumber))
        .limit(1);

      if (!admin) {
        throw new NotFoundError("Admin member", adminCardNumber);
      }

      if (!admin.admin) {
        throw new ForbiddenError("Provided card number is not an admin");
      }

      adminMember = admin;
    }

    const currentBalance = parseFloat(member.balance);
    const rechargeAmount = parseFloat(amount.toFixed(2));
    const newBalance = (currentBalance + rechargeAmount).toFixed(2);

    await db.transaction(async (tx) => {
      await tx
        .update(members)
        .set({ balance: newBalance })
        .where(eq(members.id, member.id));
    });

    return {
      success: true,
      transaction: {
        date: new Date(),
        member: {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          cardNumber: member.cardNumber!,
        },
        processedBy: adminMember
          ? {
              id: adminMember.id,
              firstName: adminMember.firstName,
              lastName: adminMember.lastName,
              cardNumber: adminMember.cardNumber!,
              isAdmin: adminMember.admin,
            }
          : undefined,
        amount: rechargeAmount.toFixed(2),
        previousBalance: member.balance,
        newBalance,
      },
    };
  }
}
