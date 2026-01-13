import { AppError } from "./base.error.js";

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(resource: string, identifier?: string | number) {
    super(
      identifier
        ? `${resource} with identifier '${identifier}' not found`
        : `${resource} not found`,
    );
  }
}

export class BadRequestError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly isOperational = true;

  constructor(message: string = "Access forbidden") {
    super(message);
  }
}
