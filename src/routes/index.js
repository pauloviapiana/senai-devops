const { Router } = require('express');
const criarJogoRoutes = require('./jogoRoutes');

function criarRoutes({ jogoService }) {
  const router = Router();

  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  router.use('/jogos', criarJogoRoutes(jogoService));

  return router;
}

module.exports = criarRoutes;
