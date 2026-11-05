const JogoNumeroSecreto = require('../../src/domain/JogoNumeroSecreto');
const STATUS_JOGO = require('../../src/domain/statusJogo');

// 0.1 * 5000 + 1 = 501
const setupGame = (opcoes = {}) => new JogoNumeroSecreto({ random: () => 0.1, ...opcoes });

test('sorteia o número secreto dentro do intervalo configurado', () => {
  expect(setupGame().numeroSecreto).toBe(501);
  expect(setupGame({ random: () => 0 }).numeroSecreto).toBe(1);
  expect(setupGame({ random: () => 0.99999 }).numeroSecreto).toBe(5000);
});

test('acerto na primeira tentativa registra VITORIA mantendo a pontuação intacta', () => {
  const jogo = setupGame();

  const resultado = jogo.chutar('501');

  expect(resultado).toEqual({ valido: true, mensagem: 'Você descobriu o número secreto 501 com 1 tentativa' });
  expect(jogo.status).toBe(STATUS_JOGO.VITORIA);
  expect(jogo.pontuacao).toBe(1000);
});

test('erro dá dica, desconta pontos proporcionalmente e consome tentativa', () => {
  const jogo = setupGame();

  expect(jogo.chutar(601).mensagem).toBe('O número secreto é menor que 601');
  expect(jogo.chutar(401).mensagem).toBe('O número secreto é maior que 401');
  expect(jogo.pontuacao).toBe(900);
  expect(jogo.tentativas).toBe(3);

  expect(jogo.chutar(501).mensagem).toBe('Você descobriu o número secreto 501 com 3 tentativas');
});

test('registra DERROTA após exceder o limite de tentativas', () => {
  const jogo = setupGame();

  let resultado;
  for (let i = 0; i < 10; i++) {
    resultado = jogo.chutar(100);
  }

  expect(jogo.status).toBe(STATUS_JOGO.DERROTA);
  expect(jogo.tentativas).toBe(11);
  expect(resultado.dica).toBe('O número secreto é maior que 100');
  expect(resultado.mensagem).toBe('Você perdeu! O número secreto era 501.');
});

test('palpites inválidos não consomem tentativa', () => {
  const jogo = setupGame();

  for (const valor of ['abc', '0', '5001', '', null, undefined, Infinity]) {
    expect(jogo.chutar(valor)).toEqual({ valido: false, mensagem: 'Digite um número válido entre 1 e 5000.' });
  }
  expect(jogo.tentativas).toBe(1);
});

test('jogo encerrado não aceita novos chutes nem muda de status ao cancelar', () => {
  const jogo = setupGame();
  jogo.chutar(501);

  expect(jogo.chutar(501)).toEqual({ valido: false, mensagem: 'O jogo já foi encerrado.' });
  expect(jogo.cancelar()).toBe(STATUS_JOGO.VITORIA);
});

test('estado só revela o número secreto quando o jogo termina', () => {
  const jogo = setupGame();

  expect(jogo.estado()).toEqual({
    status: STATUS_JOGO.EM_ANDAMENTO,
    tentativas: 1,
    tentativasRestantes: 10,
    maxTentativas: 10,
    numeroMaximo: 5000,
    pontuacao: 1000
  });

  jogo.cancelar();

  expect(jogo.estado()).toMatchObject({ status: STATUS_JOGO.CANCELADO, numeroSecreto: 501 });
});

test('aceita configuração customizada', () => {
  const jogo = setupGame({ numeroMaximo: 10, maxTentativas: 1, pontuacaoInicial: 50 });

  expect(jogo.numeroSecreto).toBe(2);
  jogo.chutar(10);
  expect(jogo.status).toBe(STATUS_JOGO.DERROTA);
  expect(jogo.pontuacao).toBe(46);
});

test('restaurar reconstitui o jogo a partir dos dados persistidos', () => {
  const jogo = JogoNumeroSecreto.restaurar({
    numeroSecreto: 501,
    numeroMaximo: 5000,
    maxTentativas: 10,
    tentativas: 3,
    pontuacao: 900,
    status: STATUS_JOGO.EM_ANDAMENTO
  });

  expect(jogo.numeroSecreto).toBe(501);
  expect(jogo.tentativas).toBe(3);
  expect(jogo.pontuacao).toBe(900);
  expect(jogo.emAndamento).toBe(true);
  expect(jogo.chutar(501).mensagem).toBe('Você descobriu o número secreto 501 com 3 tentativas');
});
