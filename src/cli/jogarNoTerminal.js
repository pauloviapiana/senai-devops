const JogoNumeroSecreto = require('../domain/JogoNumeroSecreto');

const COMANDO_SAIR = 'sair';

async function jogarNoTerminal({ ask, print = console.log, jogo = new JogoNumeroSecreto() }) {
  print(`Boas vindas ao jogo do número secreto! (Digite "${COMANDO_SAIR}" a qualquer momento para cancelar)`);

  while (jogo.emAndamento) {
    const chute = await ask(`Escolha um número entre 1 e ${jogo.numeroMaximo}: `);

    if (chute === null || (typeof chute === 'string' && chute.trim().toLowerCase() === COMANDO_SAIR)) {
      jogo.cancelar();
      print('Jogo encerrado!');
      break;
    }

    const resultado = jogo.chutar(chute);
    if (resultado.dica) {
      print(resultado.dica);
    }
    print(resultado.mensagem);
  }

  return jogo.status;
}

module.exports = jogarNoTerminal;
