const express = require('express');
const criarJogoService = require('./services/jogoService');
const criarRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

function criarApp({ jogoService, random } = {}) {
  const app = express();
  const service = jogoService ?? criarJogoService({ random });

  app.disable('x-powered-by');
  app.use(express.json());

  app.use(criarRoutes({ jogoService: service }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = criarApp;
