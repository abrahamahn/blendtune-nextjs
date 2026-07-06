// src/server/core/errors.ts
/**
 * Framework-agnostic domain errors carrying an HTTP status + stable code.
 *
 * Route adapters translate these into responses; business logic throws them without knowing
 * about Next.js or Fastify. Mirrors the error taxonomy of bslt's @bslt/server-system.
 */

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, 403, code);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found', code = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', code = 'CONFLICT') {
    super(message, 409, code);
  }
}
