function criarJogoController(jogoService) {
  return {
    criar(req, res) {
      res.status(201).json(jogoService.criar());
    },

    buscar(req, res) {
      res.json(jogoService.buscar(req.params.id));
    },

    chutar(req, res) {
      res.json(jogoService.chutar(req.params.id, req.body?.numero));
    },

    cancelar(req, res) {
      res.json(jogoService.cancelar(req.params.id));
    }
  };
}

module.exports = criarJogoController;
