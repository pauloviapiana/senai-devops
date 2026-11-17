const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const jogarNoTerminal = require('./jogarNoTerminal');

async function iniciar() {
  const rl = readline.createInterface({ input, output });

  try {
    await jogarNoTerminal({ ask: (pergunta) => rl.question(pergunta) });
  } finally {
    rl.close();
  }
}

iniciar().catch((err) => {
  console.error('Erro ao executar o jogo:', err);
  process.exitCode = 1;
});
