const { NotFoundError } = require('../errors/AppError');

function notFound(req, res, next) {
  next(new NotFoundError('Rota não encontrada.'));
}

module.exports = notFound;
