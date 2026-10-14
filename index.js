const criarApp = require('./app');

const PORT = process.env.PORT || 3000;

criarApp().listen(PORT, () => {
  console.log(`API do Jogo do Número Secreto rodando na porta ${PORT}`);
});
