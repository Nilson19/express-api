export abstract class HttpError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly name: string = 'HttpError'
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
