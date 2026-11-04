const { randomUUID } = require('crypto');
const JogoNumeroSecreto = require('../domain/JogoNumeroSecreto');
const criarJogoRepository = require('../repositories/jogoRepository');
const { NotFoundError, ConflictError, ValidationError } = require('../errors/AppError');

function criarJogoService({ repository = criarJogoRepository(), random, gerarId = randomUUID } = {}) {
  const visao = (id, jogo, extras = {}) => ({ id, ...extras, ...jogo.estado() });

  const obterJogo = async (id) => {
    const jogo = await repository.buscarPorId(id);
    if (!jogo) {
      throw new NotFoundError('Jogo não encontrado.');
    }
    return jogo;
  };

  return {
    async criar() {
      const id = gerarId();
      const jogo = await repository.salvar(id, new JogoNumeroSecreto({ random }));
      return visao(id, jogo, {
        mensagem: `Boas vindas ao jogo do número secreto! Escolha um número entre 1 e ${jogo.numeroMaximo}.`
      });
    },

    async buscar(id) {
      return visao(id, await obterJogo(id));
    },

    async chutar(id, numero) {
      const jogo = await obterJogo(id);

      if (!jogo.emAndamento) {
        throw new ConflictError('O jogo já foi encerrado.', visao(id, jogo));
      }

      const resultado = jogo.chutar(numero);

      if (!resultado.valido) {
        throw new ValidationError(resultado.mensagem, visao(id, jogo));
      }

      await repository.salvar(id, jogo);
      return visao(id, jogo, { mensagem: resultado.mensagem });
    },

    async cancelar(id) {
      const jogo = await obterJogo(id);
      jogo.cancelar();
      await repository.salvar(id, jogo);
      return visao(id, jogo, { mensagem: 'Jogo encerrado!' });
    }
  };
}

module.exports = criarJogoService;
