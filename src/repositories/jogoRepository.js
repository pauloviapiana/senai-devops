function criarJogoRepository() {
  const jogos = new Map();

  return {
    salvar(id, jogo) {
      jogos.set(id, jogo);
      return jogo;
    },

    buscarPorId(id) {
      return jogos.get(id) ?? null;
    }
  };
}

module.exports = criarJogoRepository;
