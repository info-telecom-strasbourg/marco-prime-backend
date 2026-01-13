import type { Context } from "hono";
import { PurchaseService } from "../services/purchase.service.js";

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  async createPurchase(c: Context) {
    const body = c.req.valid("json" as never);
    const { productId, cardNumber, amount } = body as {
      productId: number;
      cardNumber: number;
      amount: number;
    };
    const receipt = await this.purchaseService.executePurchase(
      productId,
      cardNumber,
      amount,
    );
    return c.json(receipt, 201);
  }
}
