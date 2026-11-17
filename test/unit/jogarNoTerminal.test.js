const jogarNoTerminal = require('../../src/cli/jogarNoTerminal');
const JogoNumeroSecreto = require('../../src/domain/JogoNumeroSecreto');

// 0.1 * 5000 + 1 = 501
const setup = (askMock) => {
  const print = jest.fn();
  const jogo = new JogoNumeroSecreto({ random: () => 0.1 });
  return { print, jogo, jogar: () => jogarNoTerminal({ ask: askMock, print, jogo }) };
};

test('retorna VITORIA ao acertar', async () => {
  const { print, jogar } = setup(jest.fn().mockResolvedValueOnce('501'));

  expect(await jogar()).toBe('VITORIA');
  expect(print).toHaveBeenCalledWith('Você descobriu o número secreto 501 com 1 tentativa');
});

test('retorna DERROTA e exibe dica e mensagem final', async () => {
  const { print, jogar } = setup(jest.fn().mockResolvedValue('100'));

  expect(await jogar()).toBe('DERROTA');
  expect(print).toHaveBeenCalledWith('O número secreto é maior que 100');
  expect(print).toHaveBeenCalledWith('Você perdeu! O número secreto era 501.');
});

test.each(['sair', ' SAIR ', null])('cancela o jogo com a entrada %p', async (entrada) => {
  const { print, jogo, jogar } = setup(jest.fn().mockResolvedValueOnce(entrada));

  expect(await jogar()).toBe('CANCELADO');
  expect(print).toHaveBeenCalledWith('Jogo encerrado!');
  expect(jogo.tentativas).toBe(1);
});

test('notifica entradas inválidas e continua o jogo', async () => {
  const ask = jest.fn()
    .mockResolvedValueOnce('abc')
    .mockResolvedValueOnce('0')
    .mockResolvedValueOnce('5001')
    .mockResolvedValueOnce('501');
  const { print, jogar } = setup(ask);

  expect(await jogar()).toBe('VITORIA');
  expect(print).toHaveBeenCalledWith('Digite um número válido entre 1 e 5000.');
  expect(print).toHaveBeenCalledTimes(5); // 1 boas vindas + 3 erros + 1 vitória
});
