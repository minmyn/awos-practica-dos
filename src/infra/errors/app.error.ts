export abstract class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details: any = null
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

