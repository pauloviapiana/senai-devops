const express = require('express');
const { randomUUID } = require('crypto');
const JogoNumeroSecreto = require('./JogoNumeroSecreto');

function criarApp(deps = {}) {
  const app = express();
  const jogos = new Map();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/jogos', (req, res) => {
    const id = randomUUID();
    const jogo = new JogoNumeroSecreto({ random: deps.random });
    jogos.set(id, jogo);

    res.status(201).json({
      id,
      mensagem: `Boas vindas ao jogo do número secreto! Escolha um número entre 1 e ${jogo.numeroMaximo}.`,
      ...jogo.estado()
    });
  });

  const buscarJogo = (req, res, next) => {
    const jogo = jogos.get(req.params.id);
    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }
    req.jogo = jogo;
    next();
  };

  app.get('/jogos/:id', buscarJogo, (req, res) => {
    res.json({ id: req.params.id, ...req.jogo.estado() });
  });

  app.post('/jogos/:id/chutes', buscarJogo, (req, res) => {
    const { jogo } = req;

    if (jogo.status !== 'EM_ANDAMENTO') {
      return res.status(409).json({ erro: 'O jogo já foi encerrado.', id: req.params.id, ...jogo.estado() });
    }

    const resultado = jogo.chutar(req.body?.numero);

    if (!resultado.valido) {
      return res.status(400).json({ erro: resultado.mensagem, id: req.params.id, ...jogo.estado() });
    }

    res.json({ id: req.params.id, mensagem: resultado.mensagem, ...jogo.estado() });
  });

  app.delete('/jogos/:id', buscarJogo, (req, res) => {
    req.jogo.cancelar();
    res.json({ id: req.params.id, mensagem: 'Jogo encerrado!', ...req.jogo.estado() });
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ erro: 'JSON inválido.' });
    }
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  });

  return app;
}

module.exports = criarApp;
