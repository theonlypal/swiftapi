export class SwiftAPIError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'SwiftAPIError';
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends SwiftAPIError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends SwiftAPIError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends SwiftAPIError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends SwiftAPIError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = 'ValidationError';
  }
}
