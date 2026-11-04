const JogoNumeroSecreto = require('../domain/JogoNumeroSecreto');

const SQL_CRIAR_TABELA = `
  CREATE TABLE IF NOT EXISTS jogos (
    id UUID PRIMARY KEY,
    numero_secreto INTEGER NOT NULL,
    numero_maximo INTEGER NOT NULL,
    max_tentativas INTEGER NOT NULL,
    tentativas INTEGER NOT NULL,
    pontuacao DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const SQL_UPSERT = `
  INSERT INTO jogos (
    id, numero_secreto, numero_maximo, max_tentativas, tentativas, pontuacao, status, atualizado_em
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  ON CONFLICT (id) DO UPDATE SET
    numero_secreto = EXCLUDED.numero_secreto,
    numero_maximo = EXCLUDED.numero_maximo,
    max_tentativas = EXCLUDED.max_tentativas,
    tentativas = EXCLUDED.tentativas,
    pontuacao = EXCLUDED.pontuacao,
    status = EXCLUDED.status,
    atualizado_em = NOW()
`;

function linhaParaJogo(row) {
  return JogoNumeroSecreto.restaurar({
    numeroSecreto: row.numero_secreto,
    numeroMaximo: row.numero_maximo,
    maxTentativas: row.max_tentativas,
    tentativas: row.tentativas,
    pontuacao: row.pontuacao,
    status: row.status
  });
}

async function criarPostgresJogoRepository(pool) {
  await pool.query(SQL_CRIAR_TABELA);

  return {
    async salvar(id, jogo) {
      await pool.query(SQL_UPSERT, [
        id,
        jogo.numeroSecreto,
        jogo.numeroMaximo,
        jogo.maxTentativas,
        jogo.tentativas,
        jogo.pontuacao,
        jogo.status
      ]);
      return jogo;
    },

    async buscarPorId(id) {
      const resultado = await pool.query('SELECT * FROM jogos WHERE id = $1', [id]);
      if (resultado.rowCount === 0) {
        return null;
      }
      return linhaParaJogo(resultado.rows[0]);
    }
  };
}

module.exports = criarPostgresJogoRepository;
