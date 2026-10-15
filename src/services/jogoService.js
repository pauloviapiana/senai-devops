const { randomUUID } = require('crypto');
const JogoNumeroSecreto = require('../domain/JogoNumeroSecreto');
const criarJogoRepository = require('../repositories/jogoRepository');
const { NotFoundError, ConflictError, ValidationError } = require('../errors/AppError');

function criarJogoService({ repository = criarJogoRepository(), random, gerarId = randomUUID } = {}) {
  const visao = (id, jogo, extras = {}) => ({ id, ...extras, ...jogo.estado() });

  const obterJogo = (id) => {
    const jogo = repository.buscarPorId(id);
    if (!jogo) {
      throw new NotFoundError('Jogo não encontrado.');
    }
    return jogo;
  };

  return {
    criar() {
      const id = gerarId();
      const jogo = repository.salvar(id, new JogoNumeroSecreto({ random }));
      return visao(id, jogo, {
        mensagem: `Boas vindas ao jogo do número secreto! Escolha um número entre 1 e ${jogo.numeroMaximo}.`
      });
    },

    buscar(id) {
      return visao(id, obterJogo(id));
    },

    chutar(id, numero) {
      const jogo = obterJogo(id);

      if (!jogo.emAndamento) {
        throw new ConflictError('O jogo já foi encerrado.', visao(id, jogo));
      }

      const resultado = jogo.chutar(numero);

      if (!resultado.valido) {
        throw new ValidationError(resultado.mensagem, visao(id, jogo));
      }

      return visao(id, jogo, { mensagem: resultado.mensagem });
    },

    cancelar(id) {
      const jogo = obterJogo(id);
      jogo.cancelar();
      return visao(id, jogo, { mensagem: 'Jogo encerrado!' });
    }
  };
}

module.exports = criarJogoService;
