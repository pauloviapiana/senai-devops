const criarApp = require('./app');
const config = require('./config');

const server = criarApp().listen(config.port, () => {
  console.log(`API do Jogo do Número Secreto rodando na porta ${config.port} (${config.nodeEnv})`);
});

function encerrar(sinal) {
  console.log(`${sinal} recebido, encerrando o servidor...`);
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => encerrar('SIGTERM'));
process.on('SIGINT', () => encerrar('SIGINT'));
