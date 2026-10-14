const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const JogoNumeroSecreto = require('./JogoNumeroSecreto');

async function iniciar() {
  const rl = readline.createInterface({ input, output });

  const jogo = new JogoNumeroSecreto({
    print: (mensagem) => console.log(mensagem),
    ask: async (pergunta) => await rl.question(pergunta)
  });

  await jogo.jogar();

  rl.close();
}

iniciar();
