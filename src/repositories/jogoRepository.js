function criarJogoRepository() {
  const jogos = new Map();

  return {
    async salvar(id, jogo) {
      jogos.set(id, jogo);
      return jogo;
    },

    async buscarPorId(id) {
      return jogos.get(id) ?? null;
    }
  };
}

module.exports = criarJogoRepository;
