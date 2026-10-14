const request = require('supertest');
const criarApp = require('../app');

// 0.1 * 5000 + 1 = 501
const setupApp = () => criarApp({ random: () => 0.1 });

const criarJogo = async (app) => {
  const res = await request(app).post('/jogos');
  return res.body.id;
};

test('GET /health responde ok', async () => {
  const res = await request(setupApp()).get('/health');

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: 'ok' });
});

test('POST /jogos cria um jogo em andamento sem revelar o número secreto', async () => {
  const res = await request(setupApp()).post('/jogos');

  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.status).toBe('EM_ANDAMENTO');
  expect(res.body.tentativas).toBe(1);
  expect(res.body.tentativasRestantes).toBe(10);
  expect(res.body.pontuacao).toBe(1000);
  expect(res.body.numeroSecreto).toBeUndefined();
});

test('GET /jogos/:id retorna o estado do jogo', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  const res = await request(app).get(`/jogos/${id}`);

  expect(res.status).toBe(200);
  expect(res.body.id).toBe(id);
  expect(res.body.status).toBe('EM_ANDAMENTO');
});

test('rotas retornam 404 para jogo inexistente', async () => {
  const app = setupApp();

  expect((await request(app).get('/jogos/nao-existe')).status).toBe(404);
  expect((await request(app).post('/jogos/nao-existe/chutes').send({ numero: 1 })).status).toBe(404);
  expect((await request(app).delete('/jogos/nao-existe')).status).toBe(404);
});

test('POST /jogos/:id/chutes dá dicas, desconta pontos e registra vitória', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  const erro = await request(app).post(`/jogos/${id}/chutes`).send({ numero: 601 });
  expect(erro.status).toBe(200);
  expect(erro.body.mensagem).toBe('O número secreto é menor que 601');
  expect(erro.body.pontuacao).toBe(950);
  expect(erro.body.tentativas).toBe(2);

  const acerto = await request(app).post(`/jogos/${id}/chutes`).send({ numero: 501 });
  expect(acerto.status).toBe(200);
  expect(acerto.body.status).toBe('VITORIA');
  expect(acerto.body.mensagem).toBe('Você descobriu o número secreto 501 com 2 tentativas');
  expect(acerto.body.numeroSecreto).toBe(501);
});

test('POST /jogos/:id/chutes rejeita palpites inválidos sem consumir tentativa', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  for (const numero of ['abc', 0, 5001, undefined]) {
    const res = await request(app).post(`/jogos/${id}/chutes`).send({ numero });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe('Digite um número válido entre 1 e 5000.');
    expect(res.body.tentativas).toBe(1);
  }
});

test('POST /jogos/:id/chutes registra derrota após 10 erros e bloqueia novos chutes', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  let res;
  for (let i = 0; i < 10; i++) {
    res = await request(app).post(`/jogos/${id}/chutes`).send({ numero: 100 });
  }

  expect(res.body.status).toBe('DERROTA');
  expect(res.body.mensagem).toBe('Você perdeu! O número secreto era 501.');
  expect(res.body.tentativasRestantes).toBe(0);

  const depois = await request(app).post(`/jogos/${id}/chutes`).send({ numero: 501 });
  expect(depois.status).toBe(409);
});

test('DELETE /jogos/:id cancela o jogo', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  const res = await request(app).delete(`/jogos/${id}`);
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('CANCELADO');
  expect(res.body.mensagem).toBe('Jogo encerrado!');

  const chute = await request(app).post(`/jogos/${id}/chutes`).send({ numero: 501 });
  expect(chute.status).toBe(409);
});

test('JSON inválido retorna 400', async () => {
  const app = setupApp();
  const id = await criarJogo(app);

  const res = await request(app)
    .post(`/jogos/${id}/chutes`)
    .set('Content-Type', 'application/json')
    .send('{invalido');

  expect(res.status).toBe(400);
  expect(res.body.erro).toBe('JSON inválido.');
});
