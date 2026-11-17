const { Pool } = require('pg');

function criarPool(databaseUrl) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não configurada.');
  }

  return new Pool({ connectionString: databaseUrl });
}

module.exports = criarPool;
