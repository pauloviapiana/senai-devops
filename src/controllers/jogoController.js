function criarJogoController(jogoService) {
  return {
    async criar(req, res) {
      res.status(201).json(await jogoService.criar());
    },

    async buscar(req, res) {
      res.json(await jogoService.buscar(req.params.id));
    },

    async chutar(req, res) {
      res.json(await jogoService.chutar(req.params.id, req.body?.numero));
    },

    async cancelar(req, res) {
      res.json(await jogoService.cancelar(req.params.id));
    }
  };
}

module.exports = criarJogoController;
