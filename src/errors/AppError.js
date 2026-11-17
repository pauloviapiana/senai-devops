class AppError extends Error {
  constructor(mensagem, statusCode = 500, detalhes = {}) {
    super(mensagem);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

class ValidationError extends AppError {
  constructor(mensagem, detalhes) {
    super(mensagem, 400, detalhes);
  }
}

class NotFoundError extends AppError {
  constructor(mensagem, detalhes) {
    super(mensagem, 404, detalhes);
  }
}

class ConflictError extends AppError {
  constructor(mensagem, detalhes) {
    super(mensagem, 409, detalhes);
  }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError };
