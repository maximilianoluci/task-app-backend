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
  USER_EXISTS = 1000,
  FAILED_USER_CREATION = 1010,
  PASSWORD_NOT_MATCH = 1020,
  MISSING_DATA = 1030,
  USER_NOT_FOUND = 1040,
  INTERNAL_ERROR = 1050,
  FAILED_USER_UPDATE = 1060,
  DATABASE_ERROR = 5000,
}
