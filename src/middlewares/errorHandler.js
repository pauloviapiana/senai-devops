const { AppError } = require('../errors/AppError');

// O Express só reconhece um middleware de erro se ele declarar 4 parâmetros.
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message, ...err.detalhes });
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = errorHandler;
