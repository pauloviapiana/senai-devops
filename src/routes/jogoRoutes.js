const { Router } = require('express');
const criarJogoController = require('../controllers/jogoController');

function criarJogoRoutes(jogoService) {
  const router = Router();
  const controller = criarJogoController(jogoService);

  router.post('/', controller.criar);
  router.get('/:id', controller.buscar);
  router.post('/:id/chutes', controller.chutar);
  router.delete('/:id', controller.cancelar);

  return router;
}

module.exports = criarJogoRoutes;
