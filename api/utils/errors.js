class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'resource not found') {
    super(404, message)
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'bad request') {
    super(400, message)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'unauthorized') {
    super(401, message)
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'forbidden') {
    super(403, message)
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
}
