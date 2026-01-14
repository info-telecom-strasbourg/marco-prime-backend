import { BadRequestError, ForbiddenError } from "./http.errors.js";

export class InsufficientBalanceError extends BadRequestError {
  constructor(
    public readonly required: string,
    public readonly available: string,
  ) {
    super("Insufficient balance");
  }

  toJSON() {
    return {
      error: this.message,
      required: this.required,
      available: this.available,
    };
  }
}

export class ProductUnavailableError extends BadRequestError {
  constructor(productId: number) {
    super(`Product with ID ${productId} is not available`);
  }
}

export class AdminAuthorizationError extends ForbiddenError {
  constructor(
    message: string = "Admin card number required for non-admin member recharge",
  ) {
    super(message);
  }
}
