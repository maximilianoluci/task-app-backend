export class AppError extends Error {
  code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export enum ErrorCode {
  ALREADY_EXISTS = 1000,
  CREATION_FAILED = 1010,
  PASSWORD_NOT_MATCH = 1020,
  MISSING_DATA = 1030,
  NOT_FOUND = 1040,
  INTERNAL_ERROR = 1050,
  UPDATE_FAILED = 1060,
  INVALID_PASSWORD = 1070,
  DATABASE_ERROR = 5000,
}
