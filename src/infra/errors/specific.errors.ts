import { AppError } from './app.error.js';

export class BadRequestError extends AppError {
  constructor(message: string, details: any = null) {
    super('BAD_REQUEST_STRUCTURE', message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details: any = null) {
    super('UNAUTHORIZED_ACCESS', message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details: any = null) {
    super('FORBIDDEN_RESOURCE', message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details: any = null) {
    super('ARTICLE_NOT_FOUND', message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details: any = null) {
    super('RESOURCE_ALREADY_EXISTS', message, 409, details);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, details: any = null) {
    super('INSUFFICIENT_STOCK_ERROR', message, 422, details);
  }
}