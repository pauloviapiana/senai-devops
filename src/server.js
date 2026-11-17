const criarApp = require('./app');
const config = require('./config');
const criarJogoService = require('./services/jogoService');
const criarJogoRepository = require('./repositories/jogoRepository');
const criarPostgresJogoRepository = require('./repositories/postgresJogoRepository');
const criarPool = require('./db/pool');

async function criarRepository() {
  if (!config.databaseUrl) {
    console.warn('DATABASE_URL ausente: usando repositório em memória.');
    return { repository: criarJogoRepository(), pool: null };
  }

  const pool = criarPool(config.databaseUrl);
  const repository = await criarPostgresJogoRepository(pool);
  console.log('Conectado ao PostgreSQL.');
  return { repository, pool };
}

async function iniciar() {
  const { repository, pool } = await criarRepository();
  const jogoService = criarJogoService({ repository });
  const app = criarApp({ jogoService });

  const server = app.listen(config.port, () => {
    console.log(`API do Jogo do Número Secreto rodando na porta ${config.port} (${config.nodeEnv})`);
  });

  function encerrar(sinal) {
    console.log(`${sinal} recebido, encerrando o servidor...`);
    server.close(async (err) => {
      if (pool) {
        await pool.end().catch((erroPool) => console.error(erroPool));
      }
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => encerrar('SIGTERM'));
  process.on('SIGINT', () => encerrar('SIGINT'));
}

iniciar().catch((err) => {
  console.error('Falha ao iniciar a API:', err);
  process.exit(1);
});
